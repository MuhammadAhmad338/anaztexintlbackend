const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/auth");
const { isAdmin } = require("../Middleware/adminMiddleware");
// const uploadMiddleware = require("../Middleware/s3upload"); // This is now a promise
const { getAllProducts, createProduct, editProduct, deleteProduct } = require("../Controllers/productControllers");

// Customer Routes
router.get("/", getAllProducts);

// Admin Routes - we'll handle upload middleware in the controller
router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, editProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;