const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  address: {
    street: String,
    city: String,
    country: String,
    phone: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);