const express = require("express");
const path = require("path");
const router = express.Router();

// Serve views
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "index.html"));
});

router.get("/menu.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "menu.html"));
});

router.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "signup.html"));
});

router.get("/cart.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "cart.html"));
});

router.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views", "admin.html"));
});

module.exports = router;
