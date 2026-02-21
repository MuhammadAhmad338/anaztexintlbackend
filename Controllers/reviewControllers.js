const Review = require("../Models/reviewModel");
const Product = require("../Models/productModel");

// --- Review Logic ---
const addReview = async (req, res) => {
    try {
        const { product: productId, rating, comment } = req.body;
        const user = req.user.id;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ user, product: productId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product. Please update or delete your existing review."
            });
        }

        const review = await Review.create({
            user,
            product: productId,
            rating,
            comment
        });

        // Calculate average rating
        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, { rating: avgRating });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check if the user is the owner of the review
        if (review.user.toString() !== req.user.id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized to delete this review" });
        }

        const productId = review.product;
        await Review.findByIdAndDelete(req.params.id);

        // Recalculate average rating
        const reviews = await Review.find({ product: productId });
        let avgRating = 0;
        if (reviews.length > 0) {
            avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        }

        await Product.findByIdAndUpdate(productId, { rating: avgRating });

        res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addReview,
    getProductReviews,
    deleteReview
};
