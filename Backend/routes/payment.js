import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { processPayment } from "./mock/mockPayment.js"; 

const router = express.Router();

export default (db) => {
  const query = (sql, params) =>
    new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

  async function getBillingAddress(useProfileAddress, billingAddress, buyerID) {
    if (useProfileAddress) {
      const rows = await query(
        `SELECT street, city, province, postalCode FROM User WHERE userID = ?`,
        [buyerID]
      );
      if (!rows.length) throw new Error("No profile address found.");
      return rows[0];
    } else {
      const { street, city, province, postalCode } = billingAddress || {};
      if (!street || !city || !province || !postalCode) {
        throw new Error("Billing address info incomplete.");
      }
      return { street, city, province, postalCode };
    }
  }

  // POST: Process Payment
  router.post("/orders/:orderID/payments", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderID = parseInt(req.params.orderID, 10);
    const {
      amount,
      paymentMethod,
      cardNumber,
      expirationDate,
      cvv,
      billingAddress,
      useProfileAddress
    } = req.body;

    if (!cardNumber || !expirationDate || !cvv) {
      return res.status(400).json({ message: "Missing payment method details." });
    }

    try {
      // 1. Validate order
      const orders = await query(
        `SELECT totalAmount, cartID FROM \`Order\` WHERE orderID = ? AND buyerID = ?`,
        [orderID, buyerID]
      );
      if (!orders.length) {
        return res.status(403).json({ message: "Cannot pay for someone else’s order." });
      }
      const { cartID } = orders[0];

      // 2. Simulate payment
      const result = processPayment(buyerID, amount);
      if (!result.success) {
        return res.status(402).json({ message: result.message });
      }

      // 3. Get billing address
      const billing = await getBillingAddress(useProfileAddress, billingAddress, buyerID);

      // 4. Insert Payment
      const paymentRes = await query(
        `INSERT INTO Payment (
          orderID, amount, paymentMethod, transactionRef, status,
          billingStreet, billingCity, billingProvince, billingPostalCode,
          cardNumber, expirationDate, cvv
        ) VALUES (?, ?, ?, ?, 'Completed', ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderID,
          amount,
          paymentMethod,
          result.transactionID,
          billing.street,
          billing.city,
          billing.province,
          billing.postalCode,
          cardNumber,
          expirationDate,
          cvv,
        ]
      );

      const paymentID = paymentRes.insertId;

      // 5. Update Order status
      await query(`UPDATE \`Order\` SET status = 'Processed' WHERE orderID = ?`, [orderID]);

      // 6. Clear cart
      await query(`DELETE FROM CartStores WHERE cartID = ?`, [cartID]);
      await query(`DELETE FROM Cart WHERE cartID = ?`, [cartID]);

      // 7. Deactivate purchased products
      await query(
        `UPDATE Product 
         SET isActive = FALSE
         WHERE productID IN (
           SELECT productID FROM OrderContains WHERE orderID = ?
         )`,
        [orderID]
      );

      res.status(201).json({
        paymentID,
        orderID,
        amount,
        paymentMethod,
        transactionRef: result.transactionID,
        status: "Completed",
      });
    } catch (err) {
      console.error("Payment error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET: Fetch single payment
  router.get("/:paymentID", verifyToken, async (req, res) => {
    try {
      const rows = await query(
        `SELECT * FROM Payment WHERE paymentID = ?`,
        [parseInt(req.params.paymentID, 10)]
      );
      if (!rows.length) return res.status(404).json({ message: "Payment not found." });
      res.json(rows[0]);
    } catch (err) {
      console.error("Fetch payment error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
