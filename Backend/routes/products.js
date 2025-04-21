import express from "express";
const router = express.Router();

// Note: slide bar optimization from front end (once determined, incorporate in backend)

export default (db) => {
    // Display all products from table (main page catalog)
    router.get("/", (req, res) => {
        const q = "SELECT * FROM Product WHERE isActive = TRUE";
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

    /*
    Note to frontend: this displays all products listed by a specific seller
    */
    router.get("/seller/:id", (req, res) => {
        const sellerID = parseInt(req.params.id);
        if (isNaN(sellerID)) {
            return res.status(400).json({ message: "Invalid seller ID." });
        }
        const q = "SELECT * FROM Product WHERE sellerID = ? AND isActive = TRUE";
        db.query(q, [sellerID], (err, results) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(results);
        });
    });

    /*
    Note to front end: this handles the product optimization with the slider
    */
    router.get("/price-range-and-product-condition/:price/:productCondition", (req, res) => {
        const price = req.params.price;
        const productCondition = req.params.productCondition;
    
        const q = "SELECT * FROM Product WHERE price <= ? AND productCondition = ?;";
        db.query(q, [price, productCondition], (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    });    

    /*
    Note to frontend: this displays all the products that fall under a specific
    category
    */
    router.get("/category/:category", (req, res) => {
        const category = req.params.category;
        const q = "SELECT * FROM Product WHERE category = ? AND isActive = TRUE";
        db.query(q, [category], (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(results);
        });
    });

    /*
    Note to frontend: displays a specific product (by id)
    */
    router.get("/:id", (req, res) => {
        const productID = parseInt(req.params.id);
        if (isNaN(productID)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        const q = "SELECT * FROM Product WHERE productID = ? AND isActive = TRUE";
        db.query(q, [productID], (err, result) => {
            if (err) {
                console.error("Query error:", err);
                return res.status(500).json({ message: "An error occurred while retrieving the product." });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Product not found." });
            }

            return res.status(200).json(result[0]);
        });
    });

    // Returns routes to index.js
    return router;
};
