import express from "express";
import { data } from "react-router-dom";
const router = express.Router();

export default (db) => {
  // Display the products
  router.get("/", (req, res) => {
    const q = "SELECT * FROM Product";
    db.query(q, (err, results) => {
      if (err) {
        console.error("Query error:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json(results);
    });
  });

  // Insert product into the table
  router.post("/", (req, res) => {
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
      req.body.productCondition,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("Query error:", err);
        return res.status(500).json(err);
      }
      console.log("Query results:", data);
      return res.status(200).json(data);
    });
  });

// Delete product from table
router.delete("/:id", (req, res) => {
    const productID = req.params.id;
    const q = "DELETE FROM Product WHERE productID = ?";
  
    db.query(q, [productID], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Product has been deleted successfully.");
    });
  });

  // Update product in table
  router.put("/:id", (req, res) => {
    const productID = req.params.id;
    const q = "UPDATE Product SET `sellerID` = ?, `price` = ?, `name` = ?, `size` = ?, `picture` = ?, `description` = ?, `quantity` = ?, `category` = ?, `productCondition` = ? WHERE productID = ?";
    const values = [
      req.body.sellerId, // may delete later (rethink logic)
      req.body.price,
      req.body.name,
      req.body.size,
      req.body.picture,
      req.body.description,
      req.body.quantity,
      req.body.category,
      req.body.productCondition,
    ];

    db.query(q, [...values,productID], (err, data) => {
      if (err) {
        console.log("Query error:", err);
        return res.status(500).json(err);
      }
      console.log("Query results:", data);
      return res.status(200).json("Product has been updated successfully.");
    });
  });


  return router;
};
