const express = require("express");
const router = express.Router();
const { addReview, getProductReviews, deleteReview } = require("../Controllers/reviewControllers");
const { verifyToken } = require("../Middleware/auth");

router.post("/add", verifyToken, addReview);
router.get("/product/:productId", getProductReviews);
router.delete("/delete/:id", verifyToken, deleteReview);

module.exports = router;
