const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const productRoutes = require("./Routes/productRoutes");
const contactRoutes = require("./Routes/contactRoutes");
const paymentsRoutes = require("./Routes/paymentRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");

dotenv.config();
const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
    origin: true, // reflects request origin dynamically
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use('/uploads', express.static('uploads'));

// ── Routes (MUST come before 404 and error handlers) ───
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/contacts", contactRoutes);

// ── 404 Handler ─────────────────────────────────────────
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// ── Error Handler (4 params = JSON parse errors etc) ────
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ success: false, message: 'Invalid JSON body' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: err.message });
});

// ── Database + Server ────────────────────────────────────
const databaseUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(databaseUrl)
    .then(() => {
        console.log("Successfully connected to MongoDB: anzatexintl");
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

mongoose.connection.on('error', err => {
    console.error('Mongoose runtime error:', err);
});