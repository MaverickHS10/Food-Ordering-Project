const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  addresses: { type: [String], default: [] },  // Add addresses field
});

// Use `mongoose.models` to prevent overwriting the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
