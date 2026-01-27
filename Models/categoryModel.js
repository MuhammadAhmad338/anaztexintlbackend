const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String,
  image: String
});

module.exports = mongoose.model("Category", categorySchema);