import express from "express";
import cors from "cors";
import mysql from "mysql2";     // Import mysql
import dotenv from "dotenv";   // Import dotenv to load .env
import productRoutes from "./routes/products.js";

dotenv.config(); // Load variables from .env

const app = express();
app.use(express.json());
app.use(cors());

// 4) Create connection using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // "localhost"
  user: process.env.DB_USER,       // "myapp_user" or "root"
  password: process.env.DB_PASSWORD, // "securePassword"
  database: process.env.DB_NAME    // "ShesSustainable"
});

// Connect and log success/error
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Root route
app.get("/", (req, res) => {
  res.json("Hello! This is the backend for She's Sustainable");
});

// Listen on port 8800
const PORT = process.env.PORT || 8800;
app.listen(8800, () => {
  console.log("Connected to backend on port 8800!");
});

// Use product routes
app.use("/products", productRoutes(db));