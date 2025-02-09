const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    if (!username || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ username, email, password, mobile });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
