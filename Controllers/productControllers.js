const Product = require("../Models/productModel");
const Category = require("../Models/categoryModel");
const createS3Upload = require("../Middleware/s3upload");

// --- Admin Logic ---
const createProduct = async (req, res) => {
  try {
    console.log("AWS S3 Upload Only Mode");

    // Create S3 upload middleware on demand
    const upload = createS3Upload();

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

      // Convert category name to ID
      let categoryId = req.body.category;
      // If category is not a valid ObjectId, treat it as a name
      const category = await Category.findOne({ name: categoryId });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: `Category "${categoryId}" not found. Please create it first or use a valid category name.`
        });
      }
      categoryId = category._id;
      console.log(`Converted category "${req.body.category}" to ID: ${categoryId}`);


      const productData = {
        ...req.body,
        category: categoryId,
        images: imageUrls
      };

      const product = await Product.create(productData);
      console.log("Product created with S3 images");
      res.status(201).json({ success: true, data: product });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
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
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export all at the end
module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getAllProducts
};