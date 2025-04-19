import express from "express";
// simulate payment
// import { processPayment } from "./mock/mockPayment.js";
// simulate shipment
// import { createShipment } from "./mock/mockShipment.js";
import verifyToken from "./middlewares/verifyToken.js";
import { promisify } from "util";

const router = express.Router();

export default (db) => {
  const query = promisify(db.query).bind(db);
  /*
  Note to front end: PENDING CHANGES (Jane's code will be integrated)
  As of now, the following occurs when the buyer clicks Order Now.
  (Made updates (Jane) This mainly handles Transferring items from Cart to Order
  Now we have the option of clearing or deactivating the cart we need to pick one )
  */
  router.post("/processOrder", verifyToken, async (req, res) => {
    const userID = req.user.userID;

    try {
      // 1. Get active cart
      const cartResult = await query("SELECT * FROM Cart WHERE userID = ? AND isActive = TRUE", [buyerID]);

      if (cartResult.length === 0) return res.status(400).json({ message: "No active cart found." });

      
      const cart = cartResult[0];
    

      // 2. Get cart items
      const items = await query(
        "SELECT * FROM CartStores INNER JOIN Product ON CartStores.productID = Product.productID WHERE CartStores.cartID = ?",
        [cart.cartID]
      );
      if (items.length === 0) return res.status(400).json({ message: "Cart is empty." });

      // Compute Total
      const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

      // 3. Insert order
      const orderResult = await query(
        "INSERT INTO `Order` (buyerID, totalAmount) VALUES (?, ?)",
        [userID, totalAmount]
      );
      const orderID = orderResult.insertId;

      // 4. Insert OrderContains
      const orderItems = items.map(item => [orderID, item.productID, item.price]);
      await query(
        "INSERT INTO OrderContains (orderID, productID, price) VALUES ?",
        [orderItems]
      );

      // Optional Deactivate Cart or Clear 
      await query(`UPDATE Cart SET isActive = 0 WHERE cartID = ?`, [cartID]);
      await query(
        `DELETE FROM CartStores WHERE cartID = ?`,
        [cartID]
      );


      res.status(201).json({ orderID, totalAmount, itemsCount: items.length });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong.", details: err.message });
    }
  });
  return router;
};