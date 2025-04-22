import express from "express";
import verifyToken from "./middlewares/verifyToken.js";

const router = express.Router();

export default (db) => {
    /**
     * POST /api/reviews
     */
    router.post("/", verifyToken, (req, res) => {
      const buyerID = req.user.userID;
      const { productID, orderID, rating, comment } = req.body;
    
      // SQL query to check if the product is deactivated, part of an order, and valid shipping details
      const checkSql = `
        SELECT 1
        FROM Product p
        JOIN OrderItem oi ON oi.productID = p.productID
        JOIN \`Order\` o ON o.orderID = oi.orderID
        JOIN Shipping s ON s.orderItemID = oi.OrderItemID
        WHERE p.productID = ?
          AND o.orderID = ?
          AND o.buyerID = ?
          AND o.status = 'Processed'
          AND p.isActive = FALSE
          AND s.estDeliveryDate < CURRENT_DATE
      `;
    
      db.query(checkSql, [productID, orderID, buyerID], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
    
        if (!rows.length) {
          return res.status(403).json({
            message: "Review not allowed: product not eligible, order is not processed, or delivery date is has not passed.",
          });
        }
    
        // Insert the review
        const insertSql = `
          INSERT INTO Review (buyerID, productID, rating, comment)
          VALUES (?, ?, ?, ?)
        `;
    
        db.query(insertSql, [buyerID, productID, rating, comment], (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                message: "You’ve already reviewed this product.",
              });
            }
            return res.status(500).json({ error: err.message });
          }
    
          res.status(201).json({
            reviewID: result.insertId,
            buyerID,
            productID,
            orderID,
            rating,
            comment,
          });
        });
      });
    });

    // GET /api/reviews?sellerID=…&productID=…&orderID=…
    // if sellerID - will retrieve reviews for all seller's listed products
    // if productID - retreives the reviews of one product
    // if orderID - retrieves the reviews of all items in an order
    router.get("/", (req, res) => {
      console.log("GET /reviews hit with query:", req.query);
      const { sellerID, productID, orderID } = req.query;
    
      let query = "";
      let params = [];
    
      if (sellerID) {
        query = `
          SELECT r.*, p.name AS productName
          FROM Review r
          JOIN Product p ON r.productID = p.productID
          WHERE p.sellerID = ?
          ORDER BY r.reviewDate DESC
        `;
        params = [sellerID];
      } else if (productID) {
        query = `
          SELECT r.*, u.firstName AS buyerName
          FROM Review r
          JOIN User u ON r.buyerID = u.userID
          WHERE r.productID = ?
          ORDER BY r.reviewDate DESC
        `;
        params = [productID];
      } else if (orderID) {
        query = `
          SELECT r.*, p.name AS productName
          FROM Review r
          JOIN OrderItem oi ON r.productID = oi.productID
          JOIN Product p ON p.productID = r.productID
          WHERE oi.orderID = ?
          ORDER BY r.reviewDate DESC
        `;
        params = [orderID];
      } else {
        return res.status(400).json({ error: "Missing sellerID, productID, or orderID in query" });
      }
    
      db.query(query, params, (err, results) => {
        if (err) {
          console.error("Error fetching reviews:", err);
          return res.status(500).json({ error: "Server error while fetching reviews" });
        }
    
        res.json(results);
      });
    });    
    
  // PATCH /review/:reviewID - Update part of a review
  router.patch("/:reviewID", verifyToken, (req, res) => {
    const buyerID = req.user.userID;
    const reviewID = parseInt(req.params.reviewID, 10);
    const { rating, comment } = req.body;

    // Ensure this review belongs to the logged-in user
    const checkSql = `SELECT buyerID FROM Review WHERE reviewID = ?`;
    db.query(checkSql, [reviewID], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length || rows[0].buyerID !== buyerID) {
        return res.status(403).json({ message: "Not authorized to edit this review." });
      }

      // Build dynamic update based on provided fields
      const fields = [];
      const values = [];

      if (rating !== undefined) {
        fields.push("rating = ?");
        values.push(rating);
      }

      if (comment !== undefined) {
        fields.push("comment = ?");
        values.push(comment);
      }

      if (fields.length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
      }

      values.push(reviewID); // for WHERE clause

      const updateSql = `
        UPDATE Review
          SET ${fields.join(", ")}
        WHERE reviewID = ?
      `;

      db.query(updateSql, values, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review updated successfully." });
      });
    });
  });

  // Delete your own review
  router.delete("/:reviewID", verifyToken, (req, res) => {
    const buyerID  = req.user.userID;
    const reviewID = parseInt(req.params.reviewID, 10);

    const checkSql = `SELECT buyerID FROM Review WHERE reviewID = ?`;
    db.query(checkSql, [reviewID], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length || rows[0].buyerID !== buyerID) {
        return res.status(403).json({ message: "Not authorized to delete this review." });
      }

      db.query(`DELETE FROM Review WHERE reviewID = ?`, [reviewID], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review deleted." });
      });
    });
  });

  // return routes to index.js
  return router;
};
