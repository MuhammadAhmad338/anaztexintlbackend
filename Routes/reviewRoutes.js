const express = require("express");
const router = express.Router();
const { addReview, getProductReviews, deleteReview, getTopThreeReviews } = require("../Controllers/reviewControllers");
const { verifyToken } = require("../Middleware/auth");

router.post("/add", verifyToken, addReview);
router.get("/product/:productId", getProductReviews);
router.delete("/delete/:id", verifyToken, deleteReview);
router.get("/all", verifyToken, getTopThreeReviews);

module.exports = router;
