const mongoose = require('mongoose');
const Category = require('../Models/categoryModel');
require('dotenv').config();

async function addBedsheetsCategory() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Check if BEDSHEETS category already exists
    const existingCategory = await Category.findOne({ name: 'BEDSHEETS' });
    
    if (existingCategory) {
      console.log('Category "BEDSHEETS" already exists');
    } else {
      // Create BEDSHEETS category
      const newCategory = await Category.create({ name: 'BEDSHEETS' });
      console.log(`Created new category: ${newCategory.name} (ID: ${newCategory._id})`);
    }

    // Show all categories
    const allCategories = await Category.find({});
    console.log('\nAll categories in database:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addBedsheetsCategory();
