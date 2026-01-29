const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/auth");
const { isAdmin } = require("../Middleware/adminMiddleware");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../Controllers/productControllers");

// Customer Routes
router.get("/", getAllProducts);

// Admin Routes
router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;