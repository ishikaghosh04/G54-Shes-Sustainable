import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { processPayment } from "./mock/mockPayment.js"; 
import { promisify } from "util";

const router = express.Router();
export default (db) => {
  const query = promisify(db.query).bind(db);

  // Process payment
  router.post("/order/:orderID", verifyToken, async (req, res) => {

    const buyerID = req.user.userID;
    const orderID = Number(req.params.orderID);
    const {
      paymentMethod,
      cardNumber,
      expirationDate,
      cvv,
      billingStreet,
      billingCity,
      billingProvince,
      billingPostalCode,
      useProfileAddress
    } = req.body;
  
    try {
      // Step 1: Validate order
      const orderCheck = await query(
        "SELECT status FROM `Order` WHERE orderID = ? AND buyerID = ?",
        [orderID, buyerID]
      );
  
      if (!orderCheck.length || orderCheck[0].status !== "Pending") {
        return res.status(403).json({ message: "Order not available for payment." });
      }
  
      // Step 2: Get order total
      const [orderAmountRow] = await query(
        "SELECT totalAmount FROM `Order` WHERE orderID = ?",
        [orderID]
      );
      const orderSubtotal = parseFloat(orderAmountRow.totalAmount);
  
      // Step 3: Get total shipping cost
      const shippingRows = await query(
        "SELECT shippingCost FROM Shipping s JOIN OrderItem oi ON s.orderItemID = oi.orderItemID WHERE oi.orderID = ?",
        [orderID]
      );
      const totalShipping = shippingRows.reduce((sum, row) => sum + parseFloat(row.shippingCost), 0);
      const totalAmount = orderSubtotal + totalShipping;

      let street, city, province, postalCode;
      if (useProfileAddress) {
        const [profile] = await query(
          "SELECT street, city, province, postalCode FROM User WHERE userID = ?",
          [buyerID]
        );

        if (!profile) {
          return res.status(400).json({ message: "Profile address not found." });
        }

        street = profile.street;
        city = profile.city;
        province = profile.province;
        postalCode = profile.postalCode;
      } else {
        if (!billingStreet || !billingCity || !billingProvince || !billingPostalCode) {
          return res.status(400).json({ message: "Missing billing address details." });
        }

        // Validate postal code (for Canada, e.g., A1A 1A1 or A1A1A1)
        if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(billingPostalCode)) {
          return res.status(400).json({ message: "Invalid postal code format." });
        }

        street = billingStreet;
        city = billingCity;
        province = billingProvince;
        postalCode = billingPostalCode;
      }
  
      // Step 5: Simulate payment
      const paymentResult = processPayment(buyerID, totalAmount);
  
      if (!paymentResult.success) {
        return res.status(402).json({ message: paymentResult.message });
      }
  
      // Step 6: Insert payment
      await query(
        `INSERT INTO Payment (
          orderID, amount, paymentMethod, cardNumber, expirationDate, cvv,
          billingStreet, billingCity, billingProvince, billingPostalCode,
          transactionRef, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderID,
          totalAmount,
          paymentMethod,
          cardNumber,
          expirationDate,
          cvv,
          street,
          city,
          province,
          postalCode,
          paymentResult.transactionID,
          "Paid"
        ]
      );
  
      // Step 7: Mark order as processed (consider changing to 'Processed' to 'Paid')
      await query("UPDATE `Order` SET status = 'Processed' WHERE orderID = ?", [orderID]);
  

      // NEED TO DEACTIVATE THE PRODUCTS(check if code runs smoothly w this new query)
      await query(`UPDATE Product
        JOIN OrderItem ON Product.productID = OrderItem.productID
        SET Product.isActive = FALSE
        WHERE OrderItem.orderID = ?`,[orderID]);

      res.status(201).json({
        message: paymentResult.message,
        transactionRef: paymentResult.transactionID,
        amount: paymentResult.amount
      });
  
    } catch (err) {
      console.error("Payment error:", err);
      res.status(500).json({ error: "Server error during payment." });
    }
  });  

  // GET: Fetch single payment by paymentID
  router.get("/:paymentID", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const paymentID = Number(req.params.paymentID);

    try {
      // Step 1: Join Payment -> Order to ensure the user owns the payment
      const [payment] = await query(
        `SELECT p.paymentID, p.orderID, p.amount, p.paymentMethod, 
                p.billingStreet, p.billingCity, p.billingProvince, p.billingPostalCode,
                p.paymentDate, p.status, p.transactionRef
          FROM Payment p
          JOIN \`Order\` o ON p.orderID = o.orderID
          WHERE p.paymentID = ? AND o.buyerID = ?`,
        [paymentID, buyerID]
      );

      if (!payment) {
        return res.status(404).json({ message: "Payment not found or access denied." });
      }

      res.json(payment);
    } catch (err) {
      console.error("Fetch payment error:", err);
      res.status(500).json({ error: "Server error fetching payment." });
    }
  });

  // return routes to index.js
  return router;
};