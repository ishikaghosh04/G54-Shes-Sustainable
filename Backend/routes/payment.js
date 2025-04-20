import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { processPayment } from "./mock/mockPayment"; 
const router = express.Router();

export default (db) => {
  function getBillingAddressAsync(useProfileAddress, billingAddress, buyerID) {
    if (useProfileAddress) {
      return query(
        `SELECT street, city, province, postalCode FROM User WHERE userID = ?`,
        [buyerID]
      ).then(rows => {
        if (!rows.length) throw new Error("No profile address found.");
        return {
          street: rows[0].street,
          city: rows[0].city,
          province: rows[0].province,
          postalCode: rows[0].postalCode,
        };
      });
    } else {
      if ( !billingAddress.street || !billingAddress.city || !billingAddress.province || !billingAddress.postalCode ) {
        throw new Error("Billing address info incomplete.");
      }
      return Promise.resolve(billingAddress);
    }
  }  

  // Process payment
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
      // 1. Get Order
      const rows = await query(
        `SELECT totalAmount, cartID FROM \`Order\` WHERE orderID = ? AND buyerID = ?`,
        [orderID, buyerID]
      );
      if (!rows.length) {
        return res.status(403).json({ message: "Cannot pay for someone else’s order." });
      }
  
      const { cartID } = rows[0];
  
      // 2. Simulate payment
      const result = processPayment(buyerID, amount);
      if (!result.success) {
        return res.status(402).json({ message: result.message });
      }
  
      // 3. Get final billing address
      const finalBillingAddress = await getBillingAddressAsync(useProfileAddress, billingAddress, buyerID);
  
      // 4. Insert into Payment
      const paymentResult = await query(
        `INSERT INTO Payment (
          orderID, amount, paymentMethod, transactionRef, status,
          billingStreet, billingCity, billingProvince, billingPostalCode
        ) VALUES (?, ?, ?, ?, 'Completed', ?, ?, ?, ?)`,
        [
          orderID,
          amount,
          paymentMethod,
          result.transactionID,
          finalBillingAddress.street,
          finalBillingAddress.city,
          finalBillingAddress.province,
          finalBillingAddress.postalCode,
        ]
      );
  
      const paymentID = paymentResult.insertId;
  
      // 5. Update Order
      await query(`UPDATE \`Order\` SET status = 'Processed' WHERE orderID = ?`, [orderID]);
  
      // 6. Delete Cart & CartStores
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
