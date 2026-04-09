const express = require("express");
const router = express.Router();
const { addReview, getProductReviews, deleteReview, getAllReviews } = require("../Controllers/reviewControllers");
const { verifyToken } = require("../Middleware/auth");

router.post("/add", verifyToken, addReview);
router.get("/product/:productId", getProductReviews);
router.delete("/delete/:id", verifyToken, deleteReview);
router.get("/all", verifyToken, getAllReviews);

module.exports = router;
