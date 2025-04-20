import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
const { processPayment } = require("../mock/mockPayment"); 
const router = express.Router();

// Note: take card information as argument

export default (db) => {
  // Create a payment and finalize order
  router.post("/orders/:orderID/payments", verifyToken, (req, res) => {
    const buyerID     = req.user.userID;
    const orderID     = parseInt(req.params.orderID, 10);
    const {
      amount,
      paymentMethod,
      cardNumber,
      expirationDate,
      cvv,
      billingAddress, // this will be an object with address, city, province, postalCode
    } = req.body;    

    if (!cardNumber || !expirationDate || !cvv || !billingAddress) {
      return res.status(400).json({ message: "Missing payment or billing information." });
    }    

    // 1) Verify ownership & total
    db.query(
      `SELECT totalAmount FROM \`Order\` WHERE orderID = ? AND buyerID = ?`,
      [orderID, buyerID],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!rows.length) {
          return res.status(403).json({ message: "Cannot pay for someone else’s order." });
        }

         // 2.) Simulate the gateway
         // verify
         const result = processPayment(buyerID, amount);
         const transactionRef = result.transactionID;
         
         if (!result.success) {
          // 402 Payment Required is often used for declines
           return res.status(402).json({ message: result.message });
         }
 
         // 3) Insert into your Payment table using the mock’s transactionID
        db.query(
          `INSERT INTO Payment (orderID, amount, paymentMethod, transactionRef, status)
           VALUES (?, ?, ?, ?, 'Completed')`,
          [orderID, amount, paymentMethod, transactionRef],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const paymentID = result.insertId;

            // 3) Update Order.status → 'Processed'
            db.query(
              `UPDATE \`Order\` SET status = 'Processed' WHERE orderID = ?`,
              [orderID],
              (err) => {
                if (err) {
                  console.error("Failed to update order status:", err);
                }

                // 4) Deactivate each product in that order
                db.query(
                  `UPDATE Product 
                     SET isActive = FALSE
                   WHERE productID IN (
                     SELECT productID FROM OrderContains WHERE orderID = ?
                   )`,
                  [orderID],
                  (err) => {
                    if (err) {
                      console.error("Failed to deactivate products:", err);
                    }
                    // Finally respond
                    res.status(201).json({
                      paymentID,
                      orderID,
                      amount,
                      paymentMethod,
                      transactionRef,
                      status: "Completed",
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });

  // Get a single payment
  router.get("/:paymentID", verifyToken, (req, res) => {
    db.query(
      `SELECT * FROM Payment WHERE paymentID = ?`,
      [parseInt(req.params.paymentID, 10)],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows[0] || null);
      }
    );
  });

  return router;
};
