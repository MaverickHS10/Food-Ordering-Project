const express = require("express");
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser"); // For parsing JSON data
const connectDB = require("./src/utils/db"); // MongoDB connection utility

const app = express();
const PORT = process.env.PORT || 4500;

// Connect to MongoDB
connectDB();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve images

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const viewRoutes = require("./src/routes/viewRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

// Use Routes
app.use("/", viewRoutes); // Routes for views (HTML pages)
app.use("/auth", authRoutes); // Routes for authentication
app.use("/api/user", userRoutes); // API routes for user-related operations(userRoutes)
app.use("/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
