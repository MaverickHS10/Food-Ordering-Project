const express = require("express");
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
const connectDB = require("./src/utils/db"); 

const app = express();
const PORT = process.env.PORT || 4500;

connectDB();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const viewRoutes = require("./src/routes/viewRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/", viewRoutes); 
app.use("/auth", authRoutes); 

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
