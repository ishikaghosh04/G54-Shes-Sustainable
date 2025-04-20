import express from "express";
import verifyToken from "./middlewares/verifyToken.js";

const router = express.Router();

export default (db) => {
  /**
   * POST /api/reviews
   * Body: { productID, orderID, rating, comment }
   * Only allowed if:
   *  - buyer owns that order+product
   *  - Shipping.status for that (orderID,productID) === "Delivered"
   */
  router.post("/", verifyToken, (req, res) => {
    const buyerID = req.user.userID;
    const { productID, orderID, rating, comment } = req.body;

    // 1) Verify delivered & ownership
    const checkSql = `
      SELECT s.status
        FROM Shipping s
       WHERE s.orderID   = ?
         AND s.productID = ?
         AND EXISTS (
           SELECT 1
             FROM \`Order\` o
            WHERE o.orderID  = s.orderID
              AND o.buyerID = ?
         )
    `;
    db.query(checkSql, [orderID, productID, buyerID], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) {
        return res
          .status(403)
          .json({ message: "Order/item mismatch or not delivered yet." });
      }
      if (rows[0].status !== "Delivered") {
        return res
          .status(400)
          .json({ message: "Item not delivered yet; cannot review." });
      }

      // 2) Insert review
      const insertSql = `
        INSERT INTO Review (buyerID, productID, orderID, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(
        insertSql,
        [buyerID, productID, orderID, rating, comment],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ message: "You’ve already reviewed this item." });
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
        }
      );
    });
  });
  
    // GET /api/reviews?sellerID=…&productID=…&orderID=…
    // if sellerID - will retrieve reviews for all seller's listed products
    // if productID - retreives the reviews of one product
    // if orderID - retrieves the reviews of all items in an order
    router.get("/", (req, res) => {
        const { sellerID, productID, orderID } = req.query;
        let sql = `
        SELECT r.reviewID,
                r.rating,
                r.comment,
                r.reviewDate,
                p.productID,
                p.name       AS productName,
                p.sellerID,
                u.firstName,
                u.lastName
            FROM Review r
            JOIN Product p ON p.productID = r.productID
            JOIN User    u ON u.userID    = r.buyerID
        `;
        const clauses = [];
        const params  = [];
    
        if (sellerID) {
        clauses.push("p.sellerID = ?");
        params.push(sellerID);
        }
        if (productID) {
        clauses.push("r.productID = ?");
        params.push(productID);
        }
        if (orderID) {
        clauses.push("r.orderID = ?");
        params.push(orderID);
        }
        if (!clauses.length) {
        return res
            .status(400)
            .json({ message: "Please specify sellerID, productID or orderID" });
        }
    
        sql += " WHERE " + clauses.join(" AND ") + " ORDER BY r.reviewDate DESC";
    
        db.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
        });
    });
    


  // Update your own review
  router.put("/:reviewID", verifyToken, (req, res) => {
    const buyerID  = req.user.userID;
    const reviewID = parseInt(req.params.reviewID, 10);
    const { rating, comment } = req.body;

    // Ensure this review belongs to you
    const checkSql = `SELECT buyerID FROM Review WHERE reviewID = ?`;
    db.query(checkSql, [reviewID], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length || rows[0].buyerID !== buyerID) {
        return res.status(403).json({ message: "Not authorized to edit this review." });
      }

      const updateSql = `
        UPDATE Review
           SET rating = ?, comment = ?
         WHERE reviewID = ?
      `;
      db.query(updateSql, [rating, comment, reviewID], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Review updated." });
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

  return router;
};
