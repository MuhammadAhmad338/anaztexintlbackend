const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/sendEmail");

// 1. REGISTER USER
const registerUser = async (req, res) => {
    console.log('REGISTER API HIT - New user registration attempt:', { email: req.body.email, name: req.body.name });
    try {
        const { name, email, password, address, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('REGISTER FAILED - User already exists:', { email });
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

        console.log('REGISTER SUCCESS - User registered successfully:', { userId: user._id, email: user.email });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.log('REGISTER ERROR - Registration failed:', { error: error.message, email: req.body.email });
        res.status(500).json({ message: error.message });
    }
};

// 2. LOGIN USER
const loginUser = async (req, res) => {
    console.log('LOGIN API HIT - User login attempt:', { email: req.body.email });
    try {
         if (!req.body || !req.body.email) {
        return res.status(400).json({ message: "Email and password are required" });
    }
        const { email, password } = req.body;
        

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('LOGIN FAILED - User not found:', { email });
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        console.log('CHECKING PASSWORD for user:', email);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('PASSWORD MATCH RESULT:', isMatch, 'for user:', email);
        
        if (!isMatch) {
            console.log('LOGIN FAILED - Invalid password:', { email });
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        console.log('LOGIN SUCCESS - User logged in successfully:', { userId: user._id, email: user.email });
        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        console.log('LOGIN ERROR - Login failed:', { error: error.message, email: req.body.email });
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    console.log('FORGOT PASSWORD API HIT - Email:', req.body.email);
    try {
        const { email } = req.body;
        console.log(`Email ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('FORGOT PASSWORD - User not found:', { email });
            return res.status(404).json({ message: "User not found" });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Save token and expiry to DB
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Create reset URL
        // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process:\n\n\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message,
            });

            console.log('FORGOT PASSWORD SUCCESS - Email sent to:', user.email);
            res.status(200).json({ success: true, message: "Email sent" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            console.log('FORGOT PASSWORD ERROR - Email could not be sent:', error.message);
            res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        console.log('FORGOT PASSWORD ERROR:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    console.log('RESET PASSWORD API HIT');
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify token (or just check DB)
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        console.log('RESET PASSWORD SUCCESS - User ID:', user._id);
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        console.log('RESET PASSWORD ERROR:', error.message);
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
    forgotPassword,
    resetPassword,
    getUserProfile
};