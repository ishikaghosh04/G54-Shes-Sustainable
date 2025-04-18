import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
const router = express.Router();

// NOTE (things to keep in mind)
// A SELLER SHOULD NOT BE ABLE TO BUY THEIR OWN PRODUCT

export default (db) => {
    // User can add an item to their cart
    router.post("/add", verifyToken, (req, res) => {
        const userID = req.user.userID;
        const { productID } = req.body;
        // A user should never have more than one cart, but just in case, we limit to 1
        const getCartQuery = `SELECT cartID FROM Cart WHERE userID = ? AND isActive = TRUE LIMIT 1`;
        db.query(getCartQuery, [userID], (err, cartResults) => {
            if (err) return res.status(500).json(err);

            const cartID = cartResults.length > 0 ? cartResults[0].cartID : null;
            const createCartIfNeeded = cartID
                ? Promise.resolve(cartID)
                : new Promise((resolve, reject) => {
                    const createCartQuery = `INSERT INTO Cart (userID) VALUES (?)`;
                    db.query(createCartQuery, [userID], (err, result) => {
                    if (err) return reject(err);
                    resolve(result.insertId);
                    });
                });

            createCartIfNeeded
                .then((cartID) => {
                const insertQuery = `
                    INSERT INTO CartStores (cartID, productID) 
                    VALUES (?, ?)
                `;
                db.query(insertQuery, [cartID, productID], (err2) => {
                    if (err2) {
                        if (err2.code === "ER_DUP_ENTRY") {
                            return res.status(400).json("Product is already in another user's cart.");
                        }
                        return res.status(500).json(err2);
                    }
                    return res.status(200).json("Item added to cart.");
                });
            })
            .catch((err3) => res.status(500).json(err3));
        });
    });

    // Get all the items in the user's cart
    router.get("/", verifyToken, (req, res) => {
        const userID = req.user.userID;
        const query = `
        SELECT cs.productID, p.name, p.price, p.picture
        FROM Cart c
        JOIN CartStores cs ON c.cartID = cs.cartID
        JOIN Product p ON cs.productID = p.productID
        WHERE c.userID = ? AND c.isActive = TRUE
        `;

        db.query(query, [userID], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });

    // User can remove a product from the cart
    router.delete("/:productID", verifyToken, (req, res) => {
        const userID = req.user.userID;
        const productID = req.params.productID;
        const getCartID = `SELECT cartID FROM Cart WHERE userID = ? AND isActive = TRUE LIMIT 1`;

        db.query(getCartID, [userID], (err, result) => {
            if (err || result.length === 0) return res.status(404).json("Active cart not found");

            const cartID = result[0].cartID;
            const deleteQuery = `
                DELETE FROM CartStores WHERE cartID = ? AND productID = ?
            `;
            db.query(deleteQuery, [cartID, productID], (err2) => {
                if (err2) return res.status(500).json(err2);
                return res.status(200).json("Item removed from cart.");
            });
        });
    });

    // return route to index.js
    return router;
};
