const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");
const createS3Upload = require("../Middleware/s3upload");

// --- Admin Logic ---
const createProduct = async (req, res) => {
  try {
    console.log("AWS S3 Upload Only Mode");

    // Create S3 upload middleware on demand
    const upload = createS3Upload();
    console.log("UPLOAD:", upload);
    // Handle file upload with S3 only
    upload.array('images', 5)(req, res, async (err) => {
      if (err) {
        console.log("ERROR:", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      // Extract S3 URLs from uploaded files
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => file.location);
        console.log("S3 URLs:", imageUrls);
      }

      // Store category name directly
      let categoryName = req.body.category;
      console.log("CATEGORY NAME:", categoryName);
      console.log("REQ.BODY:", req.body);

      // Default to "General" if no category provided
      if (!categoryName) {
        console.log("WARNING: No category provided, defaulting to 'General'");
        categoryName = "General";
      }

      try {
        // Check if category exists, create if it doesn't
        let category = await Category.findOne({ name: categoryName });

        if (!category) {
          console.log(`Category "${categoryName}" not found, creating it...`);
          category = await Category.create({ name: categoryName });
          console.log(`Created new category: ${category.name} with ID: ${category._id}`);
        } else {
          console.log(`Found existing category: ${category.name} (ID: ${category._id})`);
        }
      } catch (categoryError) {
        console.error("Category error:", categoryError);
        return res.status(500).json({
          success: false,
          message: "Failed to process category",
          error: categoryError.message
        });
      }

      const productData = {
        ...req.body,
        category: categoryName,
        images: imageUrls
      };

      console.log("PRODUCT DATA BEFORE CREATE:", productData);
      const product = await Product.create(productData);
      console.log("Product created with S3 images:", product);

      // Ensure the response returns category name
      const responseProduct = product.toObject();
      responseProduct.category = categoryName;

      console.log("RESPONSE PRODUCT:", responseProduct);
      res.status(201).json({ success: true, data: responseProduct });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    console.log("EDIT PRODUCT API HIT - WITH MULTIPART SUPPORT");

    const upload = createS3Upload();

    upload.array('images', 5)(req, res, async (err) => {
      if (err) {
        console.log("UPLOAD ERROR:", err);
        return res.status(400).json({ success: false, message: err.message });
      }

      console.log("EDIT BODY:", req.body);
      console.log("EDIT FILES:", req.files);

      // 1. Convert Category Name to ID if needed
      let categoryId = req.body.category;
      if (categoryId) {
        const category = await Category.findOne({ name: categoryId });
        if (category) {
          categoryId = category._id;
          console.log(`Converted category "${req.body.category}" to ID: ${categoryId}`);
        }
      }

      // 2. Prepare update data
      const updateData = { ...req.body };
      if (categoryId) updateData.category = categoryId;

      // 3. Handle new images if any were uploaded
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map(file => file.location);

        // Option A: Replace images completely
        // updateData.images = newImageUrls;

        // Option B: Append to existing images (Better for "adding" photos)
        const existingProduct = await Product.findById(req.params.id);
        if (existingProduct) {
          updateData.images = [...(existingProduct.images || []), ...newImageUrls];
        } else {
          updateData.images = newImageUrls;
        }
      }

      const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      console.log("Product updated successfully");
      res.status(200).json({ success: true, data: product });
    });
  } catch (error) {
    console.error("❌ Edit Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- Public Logic ---
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Get the product based on the category
const getProductsByCategory = async (req, res) => {
  try {
    // Clean the category parameter to remove whitespace and newlines
    const categoryParam = req.params.category.trim();
    console.log('Cleaned category:', categoryParam);

    // Find products by category name or ObjectId
    let products;

    // If it's a category name, find by name
    products = await Product.find({ category: categoryParam });


    // Convert ObjectId categories to names for existing products
    const productsWithCategoryNames = await Promise.all(
      products.map(async (product) => {
        // If category is ObjectId (string format), convert to name
        if (product.category && typeof product.category === 'string' && product.category.match(/^[0-9a-fA-F]{24}$/)) {
          const category = await Category.findById(product.category);
          if (category) {
            product.category = category.name;
          }
        }
        return product;
      })
    );

    res.status(200).json({ success: true, data: productsWithCategoryNames });
  } catch (error) {
    console.error('Category fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export all at the end
module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory
};