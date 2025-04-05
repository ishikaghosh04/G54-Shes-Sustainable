import express from "express";
import cors from "cors";
import mysql from "mysql2";     // Import mysql
import dotenv from "dotenv";   // Import dotenv to load .env

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
// Display the records from Product
app.get("/products", (req, res) => {
  const q = "SELECT * FROM Product";
  db.query(q, (err, results) => {
    if (err){
      console.error("Query error:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(results);
  });
});

// Inserts data into the Product table from user input
app.post("/products", (req, res) => {
  const q = "INSERT INTO Product (`sellerID`, `price`, `name`, `size`, `picture`, `description`, `quantity`, `category`, `productCondition`) VALUES (?)";
  const values = [
    req.body.sellerId,
    req.body.price,
    req.body.name,
    req.body.size,
    req.body.picture,
    req.body.description,
    req.body.quantity,
    req.body.category,
    req.body.productCondition
  ]

  db.query(q, [values], (err, data) => {
    if (err) {
      console.log("Query error:", err); // Log the error
      return res.status(500).json(err); // Send error response
    }

    console.log("Query results:", data); // Log the results
    return res.status(200).json(data); // Send success response
  });
});

// Listen on port 8800
const PORT = process.env.PORT || 8800;
app.listen(8800, () => {
  console.log("Connected to backend on port 8800!");
});