import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import verifyAdmin from "./middlewares/verifyAdmin.js";

const router = express.Router();

export default (db) => {
  // View all products (even sold or inactive)
  router.get("/products", verifyToken, verifyAdmin, (req, res) => {
    const sql = "SELECT * FROM Product";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // User activity summary: #listings, #reviews per user
  router.get("/user-activity", verifyToken, verifyAdmin, (req, res) => {
    const sql = `
      SELECT u.userID, CONCAT(u.firstName, ' ', u.lastName) AS fullName,
      COUNT(DISTINCT p.productID) AS listings, COUNT(DISTINCT r.reviewID) AS reviews
      FROM User u
      LEFT JOIN Product p ON u.userID = p.userID
      LEFT JOIN Review r ON u.userID = r.userID
      GROUP BY u.userID
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Order history (all orders)
  router.get("/orders", verifyToken, verifyAdmin, (req, res) => {
    const sql = "SELECT * FROM `Order` ORDER BY orderDate DESC";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // View reviews with abusive content (naive version: flagged manually or use keyword match)
  router.get("/abusive-reviews", verifyToken, verifyAdmin, (req, res) => {
    const sql = `
      SELECT * FROM Review
      WHERE reviewText LIKE '%stupid%' OR reviewText LIKE '%shit%' OR reviewText LIKE '%bitch%'
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Delete abusive review by ID
  router.delete("/review/:id", verifyToken, verifyAdmin, (req, res) => {
    const reviewID = req.params.id;
    db.query("DELETE FROM Review WHERE reviewID = ?", [reviewID], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Review deleted successfully." });
    });
  });

  // Site-wide metrics: active users, new signups, sales per day
  router.get("/metrics", verifyToken, verifyAdmin, (req, res) => {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM User WHERE isActive = TRUE) AS activeUsers,
        (SELECT COUNT(*) FROM User WHERE createdAt >= CURDATE()) AS newSignupsToday,
        (SELECT COUNT(*) FROM \`Order\` WHERE DATE(orderDate) = CURDATE()) AS salesToday
    `;
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result[0]);
    });
  });

  // return route to index.js
  return router;
};