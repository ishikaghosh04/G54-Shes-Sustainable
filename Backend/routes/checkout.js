import express from "express";
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
    router.post("/process-order", verifyToken, async (req, res) => {
      const userID = req.user.userID;
    
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
    
        const totalAmount = parseFloat(items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2));
    
        // 3. Check if a pending order already exists 
        const existingOrder = await query(
          "SELECT orderID FROM `Order` WHERE buyerID = ? AND status = 'Pending'",
          [userID]
        );
    
        let orderID;
    
        if (existingOrder.length > 0) {
          // Reuse the existing order
          orderID = existingOrder[0].orderID;
    
          // Clear old order items before re-adding
          await query("DELETE FROM OrderItem WHERE orderID = ?", [orderID]);
    
          // Optional: update totalAmount in case it's changed
          await query("UPDATE `Order` SET totalAmount = ? WHERE orderID = ?", [totalAmount, orderID]);
        } else {
          // No existing order → create new one
          const orderResult = await query(
            "INSERT INTO `Order` (buyerID, totalAmount) VALUES (?, ?)",
            [userID, totalAmount]
          );
          orderID = orderResult.insertId;
        }
    
        // 4. Insert updated cart items into OrderItem
        const orderItems = items.map(item => [orderID, item.productID, item.price]);
        await query("INSERT INTO OrderItem (orderID, productID, price) VALUES ?", [orderItems]);
    
        // 5. Deactivate cart again
        await query("UPDATE Cart SET isActive = FALSE WHERE cartID = ?", [cart.cartID]);
    
        res.status(201).json({ orderID, totalAmount, itemsCount: items.length });
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong.", details: err.message });
      }
    });
    

    /* Note to front end: have a button on the order summary page to return to 
    browsing page (prior to providing any payment or shipment details!)
    */
    // Reactivate cart (do not use as of now. logic needs to be revised)
    router.post("/return-to-browsing", verifyToken, (req, res) => {
      const userID = req.user.userID;

      // Step 1: Find an inactive cart with a matching unpaid order
      const findSql = `
        SELECT c.cartID, o.orderID
          FROM Cart c
          JOIN \`Order\` o ON o.buyerID = c.userID
        WHERE c.userID = ?
          AND c.isActive = FALSE
          AND o.status = 'Pending'
        ORDER BY o.orderDate DESC
        LIMIT 1
      `;

      db.query(findSql, [userID], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!rows.length) {
          return res.status(404).json({ message: "No inactive cart or unpaid order found." });
        }

        const { cartID, orderID } = rows[0];
      
        const reactivateSql = `
          UPDATE Cart SET isActive = TRUE WHERE cartID = ?;
        `;

        db.query(reactivateSql, [cartID, orderID], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            message: "Cart reactivated.",
            cartID,
            orderID,
          });
        });
      });
    });

    // return route to index.js
    return router;
};