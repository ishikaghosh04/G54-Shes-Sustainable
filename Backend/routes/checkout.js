import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { promisify } from "util";

const router = express.Router();

// Note: consider changing this so that if the user decides to return to the browsing 
// page before paying (completing order), they can continue adding items to their existing cart

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

        // Compute Total
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

        // 3. Insert order
        const orderResult = await query(
          "INSERT INTO `Order` (buyerID, totalAmount, cartID) VALUES (?, ?)",
          [userID, totalAmount, cart.cartID]
        );
        const orderID = orderResult.insertId;

        // 4. Insert OrderContains
        const orderItems = items.map(item => [orderID, item.productID, item.price]);
        await query(
          "INSERT INTO OrderContains (orderID, productID, price) VALUES ?",
          [orderItems]
        );

        // Deactivate cart
        await query(`UPDATE Cart SET isActive = 0 WHERE cartID = ?`, [cart.cartID]);

        res.status(201).json({ orderID, totalAmount, itemsCount: items.length });

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong.", details: err.message });
      }
    });

    /* Note to front end: have a button on the order summary page to return to 
    browsing page (prior to providing any payment or shipment details!)
    */
    // Reactivate cart & mark order as pending again
    router.post("/return-to-browsing", verifyToken, (req, res) => {
      const userID = req.user.userID;

      // Step 1: Find an inactive cart with a matching unpaid order
      const findSql = `
        SELECT c.cartID, o.orderID
          FROM Cart c
          JOIN \`Order\` o ON o.cartID = c.cartID
        WHERE c.userID = ?
          AND c.isActive = FALSE
          AND o.status != 'Processed'
        ORDER BY o.orderDate DESC
        LIMIT 1
      `;

      db.query(findSql, [userID], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!rows.length) {
          return res.status(404).json({ message: "No inactive cart or unpaid order found." });
        }

        const { cartID, orderID } = rows[0];

        // Step 2: Reactivate cart and set order status back to 'Pending'
        
        // NOTE: may cause issues since two queries in one!
        const reactivateSql = `
          UPDATE Cart SET isActive = TRUE WHERE cartID = ?;
          UPDATE \`Order\` SET status = 'Pending' WHERE orderID = ?;
        `;

        db.query(reactivateSql, [cartID, orderID], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            message: "Cart reactivated and order marked as pending.",
            cartID,
            orderID,
          });
        });
      });
    });

    // return route to index.js
    return router;
};