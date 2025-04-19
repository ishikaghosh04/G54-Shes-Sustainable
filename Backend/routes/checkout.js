import express from "express";
import { processPayment } from "./mock/mockPayment.js";
import { createShipment } from "./mock/mockShipment.js";
import verifyToken from "./middlewares/verifyToken.js";
import { promisify } from "util";

const router = express.Router();

export default (db) => {
  const query = promisify(db.query).bind(db);

  router.post("/", verifyToken, async (req, res) => {
    const userID = req.user.userID;
    const { shippingAddress, billingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      // 1. Get active cart
      const cartResult = await query("SELECT * FROM Cart WHERE userID = ? AND isActive = TRUE", [userID]);
      if (cartResult.length === 0) return res.status(400).json({ message: "No active cart found." });

      const cart = cartResult[0];

      // 2. Get cart items
      const items = await query(
        "SELECT * FROM CartStores INNER JOIN Product ON CartStores.productID = Product.productID WHERE CartStores.cartID = ?",
        [cart.cartID]
      );
      if (items.length === 0) return res.status(400).json({ message: "Cart is empty." });

      const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

      // 3. Insert order
      const orderResult = await query(
        "INSERT INTO `Order` (buyerID, totalAmount, shippingAddress, billingAddress) VALUES (?, ?, ?, ?)",
        [userID, totalAmount, shippingAddress, billingAddress]
      );
      const orderID = orderResult.insertId;

      // 4. Insert OrderContains
      const orderItems = items.map(item => [orderID, item.productID, item.price, item.price]);
      await query(
        "INSERT INTO OrderContains (orderID, productID, price, subtotal) VALUES ?",
        [orderItems]
      );

      // 5. Mock services (testing -- Jane's code)
      const payment = processPayment(userID, totalAmount);
      const shipping = createShipment(userID, orderID);

      // 6. Insert Payment
      await query(
        "INSERT INTO Payment (orderID, amount, paymentMethod, status, transactionRef) VALUES (?, ?, ?, ?, ?)",
        [
          orderID,
          totalAmount,
          paymentMethod,
          payment.success ? "Completed" : "Failed",
          payment.transactionID
        ]
      );

      // 7. Insert Shipping
      await query(
        "INSERT INTO Shipping (orderID, trackingNumber, estDeliveryDate, status) VALUES (?, ?, ?, ?)",
        [
          orderID,
          shipping.trackingNumber,
          shipping.estimatedDelivery,
          shipping.success ? "Shipped" : "Pending"
        ]
      );

      // 8. Deactivate cart (maintains history)
      await query("UPDATE Cart SET isActive = FALSE WHERE cartID = ?", [cart.cartID]);

      res.status(200).json({
        message: "Checkout complete.",
        orderID,
        payment,
        shipping
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong.", details: err.message });
    }

    // 9. Deactivate product (maintains history)
    await query("UPDATE Product SET isActive = FALSE WHERE productID IN (?)", [items.map(item => item.productID)]);
  });

  return router;
};