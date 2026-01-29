const express = require("express"); // <--- ADD THIS LINE
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../Controllers/userController");
// const { protect } = require("../middleware/authMiddleware"); // Optional JWT helper

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);

module.exports = router;