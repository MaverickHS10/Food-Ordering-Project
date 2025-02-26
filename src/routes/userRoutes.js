const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Adjusted for src/models folder

// Add Address
router.post("/addAddress", async (req, res) => {
  const { email, address } = req.body;
  try {
    const user = await User.findOne({ email }); // Fetch user by ID
    if (user) {
      user.addresses.push(address); // Add new address to addresses array
      await user.save(); // Save updated user
      res.json({ success: true, user }); // Respond with updated user
    } else {
      res.json({ success: false, message: "User not found." }); // Handle case where user is not found
    }
  } catch (error) {
    res.status(500).json({ success: false, error }); // Handle errors
  }
});

// Remove Address
router.delete("/removeAddress", async (req, res) => {
  const { email, address } = req.body;

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (user) {
      const addressIndex = user.addresses.indexOf(address); // Find index of the address
      if (addressIndex > -1) {
        user.addresses.splice(addressIndex, 1); // Remove the address
        await user.save(); // Save updated user
        res.json({ success: true, user }); // Respond with updated user
      } else {
        res.json({ success: false, message: "Address not found." });
      }
    } else {
      res.json({ success: false, message: "User not found." });
    }
  } catch (error) {
    console.error("Error removing address:", error);
    res.status(500).json({ success: false, error });
  }
});


module.exports = router; // Export the router
