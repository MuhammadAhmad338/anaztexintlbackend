const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTER USER
const registerUser = async (req, res) => {
    console.log('🔴 REGISTER API HIT - New user registration attempt:', { email: req.body.email, name: req.body.name });
    try {
        const { name, email, password, address, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('❌ REGISTER FAILED - User already exists:', { email });
        return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            address
        });

        console.log('✅ REGISTER SUCCESS - User registered successfully:', { userId: user._id, email: user.email });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.log('❌ REGISTER ERROR - Registration failed:', { error: error.message, email: req.body.email });
        res.status(500).json({ message: error.message });
    }
};

// 2. LOGIN USER
const loginUser = async (req, res) => {
    console.log('🟢 LOGIN API HIT - User login attempt:', { email: req.body.email });
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ LOGIN FAILED - User not found:', { email });
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ LOGIN FAILED - Invalid password:', { email });
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, // Move this to .env later
            { expiresIn: "30d" }
        );

        console.log('✅ LOGIN SUCCESS - User logged in successfully:', { userId: user._id, email: user.email });
        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.log('❌ LOGIN ERROR - Login failed:', { error: error.message, email: req.body.email });
        res.status(500).json({ message: error.message });
    }
};

// 3. GET USER PROFILE (Private)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EXPORTS AT THE END
module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};