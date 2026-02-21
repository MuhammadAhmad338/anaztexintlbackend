const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/auth");
const { isAdmin } = require("../Middleware/adminMiddleware");
const { getAllCategories, createCategory } = require("../Controllers/categoryController");

// Public routes
router.get("/", getAllCategories);

// Admin routes
router.post("/", verifyToken, isAdmin, createCategory);

module.exports = router;
