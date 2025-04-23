import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
const router = express.Router();

export default (db) => {
    /*
    Note to frontend: a user can add an item to their cart (assuming it is not in
    another user's cart already)
    */
    router.post("/add", verifyToken, (req, res) => {
        const userID = req.user.userID;
        const { productID } = req.body;
      
        // Step 1: Check for an existing active cart
        const getCartQuery = `SELECT cartNumber FROM Cart WHERE userID = ? AND isActive = TRUE LIMIT 1`;
        db.query(getCartQuery, [userID], (err, cartResults) => {
          if (err) return res.status(500).json(err);
      
          let cartNumber = cartResults.length > 0 ? cartResults[0].cartNumber : null;
      
          // Step 2: Create a new cart if none exists
          const createCartIfNeeded = cartNumber
            ? Promise.resolve(cartNumber)
            : new Promise((resolve, reject) => {
                // Get the max cartNumber for this user to generate the next one
                const getNextCartNumberQuery = `SELECT IFNULL(MAX(cartNumber), 0) + 1 AS nextCartNumber FROM Cart WHERE userID = ?`;
                db.query(getNextCartNumberQuery, [userID], (err2, result) => {
                  if (err2) return reject(err2);
                  const nextCartNumber = result[0].nextCartNumber;
      
                  const createCartQuery = `INSERT INTO Cart (userID, cartNumber) VALUES (?, ?)`;
                  db.query(createCartQuery, [userID, nextCartNumber], (err3) => {
                    if (err3) return reject(err3);
                    resolve(nextCartNumber);
                  });
                });
              });
      
          // Step 3: Add the product to the CartStores table
          createCartIfNeeded
            .then((finalCartNumber) => {
              const insertQuery = `
                INSERT INTO CartStores (userID, cartNumber, productID) 
                VALUES (?, ?, ?)
              `;
              db.query(insertQuery, [userID, finalCartNumber, productID], (err4) => {
                if (err4) {
                  if (err4.code === "ER_DUP_ENTRY") {
                    return res.status(400).json("Product is already in another user's cart.");
                  }
                  return res.status(500).json(err4);
                }
                return res.status(200).json("Item added to cart.");
              });
            })
            .catch((err5) => res.status(500).json(err5));
        });
    });
      
    /*
    Note to frontend: the user can view all the items in their cart
    */
    router.get("/", verifyToken, (req, res) => {
        const userID = req.user.userID;
    
        const query = `
        SELECT cs.productID, p.name, p.price, p.picture
        FROM Cart c
        JOIN CartStores cs 
            ON c.userID = cs.userID AND c.cartNumber = cs.cartNumber
        JOIN Product p 
            ON cs.productID = p.productID
        WHERE c.userID = ? AND c.isActive = TRUE
        `;
    
        db.query(query, [userID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
        });
    });
  

    /*
    Note to frontend: a user can remove an item from their cart
    Note to backend: the cart will continue to exist even if the buyer removes all items
    */
    router.delete("/:productID", verifyToken, (req, res) => {
        const userID = req.user.userID;
        const productID = req.params.productID;
    
        const getCartQuery = `
        SELECT cartNumber 
        FROM Cart 
        WHERE userID = ? AND isActive = TRUE 
        LIMIT 1
        `;
    
        db.query(getCartQuery, [userID], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json("Active cart not found");
        }
    
        const cartNumber = result[0].cartNumber;
    
        const deleteQuery = `
            DELETE FROM CartStores 
            WHERE userID = ? AND cartNumber = ? AND productID = ?
        `;
    
        db.query(deleteQuery, [userID, cartNumber, productID], (err2) => {
            if (err2) return res.status(500).json(err2);
            return res.status(200).json("Item removed from cart.");
        });
        });
    });

    // return route to index.js
    return router;
};
