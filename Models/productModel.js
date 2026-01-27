const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  images: [String],
  stock: { type: Number, default: 0 },
  // For garments (size, color) and cosmetics (shade, type)
  variants: [
    {
      label: String,      // e.g. "Size M", "Red Shade", "50ml"
      value: String,      // e.g. "M", "Red", "50ml"
      stock: Number
    }
  ],
  brand: String,
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);