const express = require("express"); // <--- ADD THIS LINE
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword } = require("../Controllers/userController");
// const { protect } = require("../middleware/authMiddleware"); // Optional JWT helper

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router; 