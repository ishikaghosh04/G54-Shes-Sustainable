import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
const router = express.Router();

export default (db) => {
    // Display all products from table (testing purposes)
    router.get("/", (req, res) => {
        const q = "SELECT * FROM Product";
        db.query(q, (err, results) => {
            if (err) {
                console.error("Query error:", err);
                return res.status(500).json({ error: "An error occurred while retrieving products." });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "No products found." });  // In case no products are found
            }
        return res.status(200).json(results);  // Success response with the products data
        });
    });

    // Display a specific product
    router.get("/:id", (req, res) => {
        const productID = req.params.id;
        const q = "SELECT * FROM Product WHERE productID = ?";
        db.query(q, [productID], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                return res.status(500).json(err);
            }
            if (result.length === 0) {
                return res.status(404).json("Product not found");
            }
            return res.status(200).json(result[0]);
        });
    });

    // Insert product into the table and update isSeller in User (only if owner)
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

    // Delete product from table (only if owner)
    router.delete("/:id", verifyToken, (req, res) => {
        const productID = req.params.id;
        const userID = req.user.userID;

        const checkOwner = "SELECT sellerID FROM Product WHERE productID = ?";
        db.query(checkOwner, [productID], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length === 0) return res.status(404).json("Product not found");

            if (result[0].sellerID !== userID) {
                return res.status(403).json("Not authorized to delete this product");
            }

            const q = "DELETE FROM Product WHERE productID = ?";
            db.query(q, [productID], (err2) => {
                if (err2) return res.status(500).json(err2);
            return res.status(200).json("Product has been deleted successfully.");
            });
        });
    });

    // Update product in table dynamically (only if owner)
    router.patch("/:id", verifyToken, (req, res) => {
        const productID = req.params.id;
        const userID = req.user.userID;
        const fields = req.body;

        if (Object.keys(fields).length === 0) {
            return res.status(400).json("No fields provided for update.");
        }

        const checkOwner = "SELECT sellerID FROM Product WHERE productID = ?";
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

    // Display all products listed by a specific seller
    router.get("/seller/:id", (req, res) => {
        const sellerID = req.params.id;
        const q = "SELECT * FROM Product WHERE sellerID = ?";
        db.query(q, [sellerID], (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });
  
    // Get products by category
    router.get("/category/:category", (req, res) => {
        const category = req.params.category;
        const q = "SELECT * FROM Product WHERE category = ?";
        db.query(q, [category], (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    });

    // Returns routes to index.js
    return router;
};
