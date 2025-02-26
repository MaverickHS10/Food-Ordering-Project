const express = require("express");
const User = require("../models/userModel");
const Admin = require("../models/adminModel"); 
const router = express.Router();

// Handle Signup
router.post("/signup", async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    // Basic validation
    if (!username || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const newUser = new User({ username, email, password, mobile });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});

// Handle Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password (use bcrypt if passwords are hashed)
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Send user details (excluding sensitive fields like password)
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin login route
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate the password
    const isPasswordValid = await admin.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Admin is authenticated
    return res.status(200).json({ message: "Login successful",
      admin: {
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
