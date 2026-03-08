const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const productRoutes = require("./Routes/productRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const paymentsRoutes = require("./Routes/paymentRoutes");
// Load environment variables FIRST
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Database Connection
const databaseUrl = process.env.MONGO_URL; // Use 127.0.0.1 for local stability
const PORT = process.env.PORT || 3000;

// Table of Routes Implementation
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);

// Error Handling (Optional but recommended)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

mongoose.connect(databaseUrl)
    .then(() => {
        console.log("Successfully connected to MongoDB: anzatexintl");
        // Only start the server after a successful DB connection
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

// Optional: Listen for connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('Mongoose runtime error:', err);
});