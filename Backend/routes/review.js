import express from "express";
import verifyToken from "./middlewares/verifyToken.js";

const router = express.Router();

export default (db) => {
    // EXPECT CHANGES

    /**
     * POST /api/reviews
     */
    router.post("/", verifyToken, (req, res) => {
      const buyerID = req.user.userID;
      const { productID, orderNumber, rating, comment } = req.body;
    
      // Optional: Validate required fields
      if (!productID || !orderNumber || !rating) {
        return res.status(400).json({ message: "Missing required fields: productID, orderID, or rating." });
      }
    
      const checkSql = `
        SELECT 1
        FROM Product p
        JOIN OrderItem oi ON oi.productID = p.productID
        JOIN \`Order\` o ON o.orderNumber = oi.orderNumber AND o.buyerID = oi.buyerID
        JOIN Shipping s ON s.buyerID = oi.buyerID AND s.orderNumber = oi.orderNumber AND s.productID = oi.productID
        WHERE p.productID = ?
          AND o.orderNumber = ?
          AND o.buyerID = ?
          AND o.status = 'Processed'
          AND p.isActive = FALSE
          AND s.estDeliveryDate < '2025-05-15'
      `;
    
      db.query(checkSql, [productID, orderNumber, buyerID], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
    
        if (!rows.length) {
          return res.status(403).json({
            message: "Review not allowed: product is not eligible, order is not processed, or delivery hasn't occurred yet.",
          });
        }
    
        const insertSql = `
          INSERT INTO Review (buyerID, productID, rating, comment)
          VALUES (?, ?, ?, ?)
        `;
    
        db.query(insertSql, [buyerID, productID, rating, comment], (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                message: "You've already reviewed this product.",
              });
            }
            return res.status(500).json({ error: err.message });
          }
    
          res.status(201).json({
            message: "Review submitted successfully.",
            buyerID,
            productID,
            orderNumber,
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
    
      const { sellerID, productID, orderNumber } = req.query;
    
      let sql = "";
      let params = [];
    
      if (sellerID) {
        sql = `
          SELECT r.*, p.name AS productName
          FROM Review r
          JOIN Product p ON r.productID = p.productID
          WHERE p.sellerID = ?
          ORDER BY r.reviewDate DESC
        `;
        params = [sellerID];
      } else if (productID) {
        sql = `
          SELECT r.*, u.firstName AS buyerName
          FROM Review r
          JOIN User u ON r.buyerID = u.userID
          WHERE r.productID = ?
          ORDER BY r.reviewDate DESC
        `;
        params = [productID];
      } else if (orderNumber) {
        sql = `
          SELECT r.*, p.name AS productName
          FROM Review r
          JOIN OrderItem oi ON r.productID = oi.productID
          JOIN Product p ON p.productID = r.productID
          WHERE oi.orderNumber = ?
          ORDER BY r.reviewDate DESC
        `;
        params = [orderNumber];
      } else {
        return res.status(400).json({
          error: "Please provide a sellerID, productID, or orderNumber as a query parameter.",
        });
      }
    
      db.query(sql, params, (err, results) => {
        if (err) {
          console.error("Error fetching reviews:", err);
          return res.status(500).json({ error: "Server error while fetching reviews" });
        }
    
        res.json(results);
      });
    });    

  // PATCH /review/:productID - Update part of a review
  router.patch("/:productID", verifyToken, (req, res) => {
    const buyerID = req.user.userID;
    const productID = parseInt(req.params.productID, 10);
    const { rating, comment } = req.body;

    // Step 1: Confirm the review exists and belongs to the user
    const checkSql = `SELECT 1 FROM Review WHERE buyerID = ? AND productID = ?`;
    db.query(checkSql, [buyerID, productID], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) {
        return res.status(403).json({ message: "Review not found or not authorized." });
      }

      // Step 2: Build dynamic update
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

      values.push(buyerID, productID); // for WHERE clause

      const updateSql = `
        UPDATE Review
        SET ${fields.join(", ")}
        WHERE buyerID = ? AND productID = ?
      `;

      db.query(updateSql, values, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review updated successfully." });
      });
    });
  });
  
  // DELETE /review/:productID - Delete your own review
  router.delete("/:productID", verifyToken, (req, res) => {
    const buyerID = req.user.userID;
    const productID = parseInt(req.params.productID, 10);

    const checkSql = `SELECT 1 FROM Review WHERE buyerID = ? AND productID = ?`;
    db.query(checkSql, [buyerID, productID], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!rows.length) {
        return res.status(403).json({ message: "Review not found or not authorized to delete." });
      }

      db.query(
        `DELETE FROM Review WHERE buyerID = ? AND productID = ?`,
        [buyerID, productID],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Review deleted." });
        }
      );
    });
  });

  // return routes to index.js
  return router;
};
