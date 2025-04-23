import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { promisify } from "util";

const router = express.Router();

export default (db) => {
    const query = promisify(db.query).bind(db);
 
    router.post("/process-order", verifyToken, async (req, res) => {
      const userID = req.user.userID;
    
      try {
        // 1. Get active cart for user
        const cartResult = await query("SELECT cartNumber FROM Cart WHERE userID = ? AND isActive = TRUE LIMIT 1", [userID]);
        if (cartResult.length === 0) return res.status(400).json({ message: "No active cart found." });
        const cartNumber = cartResult[0].cartNumber;
    
        // 2. Get items in the cart
        const items = await query(
          `SELECT p.productID, p.price 
           FROM CartStores cs
           INNER JOIN Product p ON cs.productID = p.productID
           WHERE cs.userID = ? AND cs.cartNumber = ?`,
          [userID, cartNumber]
        );
        if (items.length === 0) return res.status(400).json({ message: "Cart is empty." });
    
        const totalAmount = parseFloat(
          items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)
        );
    
        // 3. Check if a pending order already exists for this user
        const existingOrder = await query(
          "SELECT orderNumber FROM `Order` WHERE buyerID = ? AND status = 'Pending' LIMIT 1",
          [userID]
        );
    
        let orderNumber;
    
        if (existingOrder.length > 0) {
          // Reuse the existing pending order
          orderNumber = existingOrder[0].orderNumber;
    
          // Remove old items in case they're stale
          await query("DELETE FROM OrderItem WHERE buyerID = ? AND orderNumber = ?", [userID, orderNumber]);
    
          // Update the total in the existing order
          await query(
            "UPDATE `Order` SET totalAmount = ?, orderDate = CURRENT_TIMESTAMP WHERE buyerID = ? AND orderNumber = ?",
            [totalAmount, userID, orderNumber]
          );
        } else {
          // Create new order with next orderNumber
          const nextOrder = await query(
            "SELECT IFNULL(MAX(orderNumber), 0) + 1 AS nextOrderNumber FROM `Order` WHERE buyerID = ?",
            [userID]
          );
          orderNumber = nextOrder[0].nextOrderNumber;
    
          await query(
            "INSERT INTO `Order` (buyerID, orderNumber, totalAmount) VALUES (?, ?, ?)",
            [userID, orderNumber, totalAmount]
          );
        }
    
        // 4. Insert items into OrderItem table
        const orderItems = items.map(item => [userID, orderNumber, item.productID, item.price]);
        await query(
          "INSERT INTO OrderItem (buyerID, orderNumber, productID, price) VALUES ?",
          [orderItems]
        );
    
        // 5. Deactivate cart
        await query("UPDATE Cart SET isActive = FALSE WHERE userID = ? AND cartNumber = ?", [userID, cartNumber]);
    
        res.status(201).json({ orderNumber, totalAmount, itemsCount: items.length });
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong.", details: err.message });
      }
    });    
    

    /* Note to front end: have a button on the order summary page to return to 
    browsing page (prior to providing any payment or shipment details!)
    */
    router.post("/return-to-browsing", verifyToken, (req, res) => {
      const userID = req.user.userID;
    
      // Step 1: Find the most recent inactive cart with a pending order
      const findSql = `
        SELECT c.cartNumber, o.orderNumber
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
          return res.status(404).json({ message: "No inactive cart or pending order found." });
        }
    
        const { cartNumber, orderNumber } = rows[0];
    
        const reactivateSql = `
          UPDATE Cart SET isActive = TRUE WHERE userID = ? AND cartNumber = ?;
        `;
    
        db.query(reactivateSql, [userID, cartNumber], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
    
          res.json({
            message: "Cart reactivated.",
            cartNumber,
            orderNumber,
          });
        });
      });
    });    

    // return route to index.js
    return router;
};