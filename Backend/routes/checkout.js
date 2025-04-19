import express from "express";
import { processPayment } from "./mock/mockPayment.js";
import { createShipment } from "./mock/mockShipping.js";
import verifyToken from "./middlewares/verifyToken.js";

const router = express.Router();

// delete the cart afterwards? (as of now, sets isActive to 0)
// does not update the Payment and Shipping tables (only Order and OrderContains)
export default (db) => {
    router.post("/", verifyToken, async (req, res) => {
        const userID = req.user.userID;
        const { shippingAddress, billingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !billingAddress || !paymentMethod) {
        return res.status(400).json({ message: "Missing required fields." });
        }

        db.query("SELECT * FROM Cart WHERE userID = ? AND isActive = TRUE", [userID], (err, cartResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (cartResult.length === 0) return res.status(400).json({ message: "No active cart found." });

        const cart = cartResult[0];
        db.query("SELECT * FROM CartStores INNER JOIN Product ON CartStores.productID = Product.productID WHERE CartStores.cartID = ?", [cart.cartID], async (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            if (items.length === 0) return res.status(400).json({ message: "Cart is empty." });

            const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

            db.query(
            "INSERT INTO `Order` (buyerID, totalAmount, shippingAddress, billingAddress) VALUES (?, ?, ?, ?)",
            [userID, totalAmount, shippingAddress, billingAddress],
            (err, orderResult) => {
                if (err) return res.status(500).json({ error: err.message });
                const orderID = orderResult.insertId;

                const orderItems = items.map(item => [orderID, item.productID, item.price]);

                db.query(
                "INSERT INTO OrderContains (orderID, productID, price) VALUES ?",
                [orderItems],
                async (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const payment = await processPayment(userID, totalAmount);
                    const shipping = await createShipment(userID, orderID);

                    db.query("UPDATE Cart SET isActive = FALSE WHERE cartID = ?", [cart.cartID]);

                    return res.status(200).json({ message: "Checkout complete.", orderID, payment, shipping });
                    });
                });
            });
        });
    });
    return router;
};