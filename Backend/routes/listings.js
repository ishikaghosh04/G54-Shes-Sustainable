import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
const router = express.Router();   

export default (db) => {
    /*
    Note to frontend: a user lists a product and becomes a seller (if it previously
    was not)
    NECESSARY fields: price, name, size, picture, description, category, productCondition
    */
    router.post("/", verifyToken, (req, res) => {
        const sellerID = req.user.userID;
        const q = `
            INSERT INTO Product 
            (sellerID, price, name, size, picture, description, category, productCondition)
            VALUES (?)
        `;
        const values = [
          sellerID,
          req.body.price,
          req.body.name,
          req.body.size,
          req.body.picture,
          req.body.description,
          req.body.category,
          req.body.productCondition
        ];
  
        db.query(q, [values], (err, data) => {
            if (err) {
                console.error("Insert product error:", err);
                return res.status(500).json(err);
            }
        
            // Update the user's isSeller status
            const updateSeller = "UPDATE User SET isSeller = TRUE WHERE userID = ?";
            db.query(updateSeller, [sellerID], (err2) => {
                if (err2) {
                    console.error("Failed to update isSeller status:", err2);
                    // Note: You may still want to return success for the product insert
                    return res.status(500).json({
                        message: "Product created, but failed to update seller status.",
                    });
                }
                return res.status(201).json({
                    message: "Product created and seller status updated successfully.",
                    productData: data,
                });
            });
        }); 
    });  

    /*
    Note to frontend: a seller can delete a listing (product)
    -- create a button --
    */
    router.delete("/:id", verifyToken, (req, res) => {
        const productID = parseInt(req.params.id);
        if (isNaN(productID)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }
        const userID = req.user.userID;

        const checkOwner = "SELECT sellerID FROM Product WHERE productID = ?";
        db.query(checkOwner, [productID], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length === 0) return res.status(404).json("Product not found");

            if (result[0].sellerID !== userID) {
                return res.status(403).json("Not authorized to delete this product");
            }

            // Delete the product
            const deleteQuery = "DELETE FROM Product WHERE productID = ?";
            db.query(deleteQuery, [productID], (err2) => {
                if (err2) return res.status(500).json(err2);

                // Check if the seller has any other products left
                const checkProductsQuery = "SELECT COUNT(*) AS count FROM Product WHERE sellerID = ?";
                db.query(checkProductsQuery, [userID], (err3, countResult) => {
                    if (err3) return res.status(500).json(err3);

                    const productCount = countResult[0].count;
                    if (productCount === 0) {
                        // Update isSeller to false
                        const updateSellerFlag = "UPDATE User SET isSeller = 0 WHERE userID = ?";
                        db.query(updateSellerFlag, [userID], (err4) => {
                            if (err4) return res.status(500).json(err4);
                            return res.status(200).json("Product deleted. You have no other products listed, so your seller status was removed.");
                        });
                    } else {
                        return res.status(200).json("Product has been deleted successfully.");
                    }
                });
            });
        });
    });

    /*
    Note to frontend: a user can update their listing (product)
    -- create new tab --
    */
    router.patch("/:id", verifyToken, (req, res) => {
        const productID = req.params.id;
        const userID = req.user.userID;
        const fields = req.body;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json("No fields provided for update.");
        }

        const checkOwner = "SELECT sellerID FROM Product WHERE productID = ? AND isActive = TRUE";
        db.query(checkOwner, [productID], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length === 0) return res.status(404).json("Product not found");

            if (result[0].sellerID !== userID) {
                return res.status(403).json("Not authorized to update this product");
            }

            const keys = Object.keys(fields);
            const values = Object.values(fields);
            const setClause = keys.map(key => `\`${key}\` = ?`).join(", ");
            const q = `UPDATE Product SET ${setClause} WHERE productID = ?`;

            db.query(q, [...values, productID], (err2) => {
                if (err2) {
                    console.error("Update error:", err2);
                    return res.status(500).json(err2);
                }
                return res.status(200).json("Product updated successfully.");
            });
        });
    });
    
    // Returns routes to index.js
    return router;
};