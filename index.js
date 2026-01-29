const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express"); // <--- ADD THIS LINE
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const databaseUrl = process.env.MONGO_URL; // Use 127.0.0.1 for local stability
const PORT = process.env.PORT || 3000;

// Table of Routes Implementation
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

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