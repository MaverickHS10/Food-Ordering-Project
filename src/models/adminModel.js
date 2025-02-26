const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving the admin
adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next(); // Skip if password is not modified
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add a method to validate admin credentials
adminSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw err;
  }
};

// Create the Admin model
const Admin = mongoose.model.Admin || mongoose.model("Admin", adminSchema);

module.exports = Admin;
