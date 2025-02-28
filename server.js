const express = require("express");
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser"); 
const connectDB = require("./src/utils/db"); 

const app = express();
const PORT = process.env.PORT || 4500;

connectDB();

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
const viewRoutes = require("./src/routes/viewRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

//Routes Used
app.use("/", viewRoutes); 
app.use("/auth", authRoutes); 
app.use("/api/user", userRoutes); 
app.use("/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
