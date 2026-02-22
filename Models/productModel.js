const mongoose = require("mongoose");

/* =========================
   VARIANT SCHEMA
========================= */
const variantSchema = new mongoose.Schema({
  label: String,          // Size, Color, Volume etc
  value: String,          // M, Red, 50ml etc
  stock: { type: Number, default: 0 },
  sku: String
}, { _id: false });

/* =========================
   INVENTORY LOG SCHEMA
========================= */
const inventoryLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["RESTOCK", "ORDER", "MANUAL_UPDATE"],
  },
  quantity: Number,
  note: String,
  date: { type: Date, default: Date.now }
}, { _id: false });

/* =========================
   PRODUCT SCHEMA
========================= */
const productSchema = new mongoose.Schema({

  // BASIC INFO
  name: { type: String, required: true, trim: true },
  description: String,

  // PRICING
  price: { type: Number, required: true },
  discountPrice: Number,

  // CATEGORY
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    index: true
  },

  // MEDIA
  images: [String],

  // BASE STOCK (used if no variants)
  stock: { type: Number, default: 0 },

  // VARIANT STOCK (used if variants exist)
  variants: [variantSchema],

  // INVENTORY SETTINGS
  trackInventory: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 5 },

  // EXTRA META
  brand: String,
  rating: { type: Number, default: 0 },

  // STATUS
  isActive: { type: Boolean, default: true },

  // INVENTORY HISTORY
  inventoryLogs: [inventoryLogSchema]

}, { timestamps: true });

/* =========================
   HELPER METHODS
========================= */

// Does product use variants?
productSchema.methods.hasVariants = function () {
  return this.variants && this.variants.length > 0;
};

// Calculate total stock automatically
productSchema.methods.totalStock = function () {
  if (!this.hasVariants()) return this.stock;
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
};

// Check low stock
productSchema.methods.isLowStock = function () {
  return this.totalStock() <= this.lowStockThreshold;
};

module.exports = mongoose.model("Product", productSchema);