const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  addresses: { type: [String], default: [] },  
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
