const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const databaseUrl = process.env.MONGO_URL; // Use 127.0.0.1 for local stability

mongoose.connect(databaseUrl)
    .then(() => {
        console.log("Successfully connected to MongoDB: anzatexintl");
        
        // Only start the server after a successful DB connection
        const PORT = 3000;
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