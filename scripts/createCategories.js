const mongoose = require('mongoose');
const Category = require('../Models/categoryModel');
require('dotenv').config();

const categories = [
  "Garments",
  "Men", 
  "Jewellery",
  "Women",
  "Bags",
  "Health",
  "Beauty",
  "Sports",
  "Automotive",
  "Industrial",
  "Kids",
  "Electronics"
];

async function createCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Create each category
    for (const categoryName of categories) {
      try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ name: categoryName });
        
        if (existingCategory) {
          console.log(`Category "${categoryName}" already exists`);
        } else {
          // Create new category
          const newCategory = await Category.create({ name: categoryName });
          console.log(`Created category: ${newCategory.name} (ID: ${newCategory._id})`);
        }
      } catch (error) {
        console.error(`Error creating category "${categoryName}":`, error.message);
      }
    }

    console.log('Category creation completed!');
    
    // Show all categories
    const allCategories = await Category.find({});
    console.log('\nAll categories in database:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createCategories();
