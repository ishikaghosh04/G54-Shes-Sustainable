import express from "express";
const router = express.Router();

export default (db) => {
  // Display the records from Product
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

  // Insert data into the Product table
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

  return router;
};
