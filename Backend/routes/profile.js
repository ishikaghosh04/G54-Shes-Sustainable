import express from "express";
import verifyToken from "./middlewares/verifyToken.js";

const router = express.Router();

export default (db) => {
    /*
    Note to frontend: provides the profile information for that user (which is
    relevant/not for backend purposes)
    */
    router.get("/", verifyToken, (req, res) => {
        const userID = req.user.userID;
        db.query("SELECT * FROM User WHERE userID = ?", [userID], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            const user = results[0];
            // Exclude sensitive or internal fields
            delete user.password;
            delete user.userID;
            delete user.isSeller;
            delete user.isBuyer;
            return res.status(200).json(user);
        });
    });

    /*
    Note to frontend: this allows the user to update various fields of their account 
    (EXCLUDING the mandatory fields -- should not even appear on front end)
    */
    router.patch("/update", verifyToken, (req, res) => {
        const userId = req.user.userID;
        const fields = req.body;
    
        // Prevent updates to required fields
        const blockedFields = ["firstName", "lastName", "email", "password", "userID", "isSeller", "isBuyer"];
        for (let key of Object.keys(fields)) {
            if (blockedFields.includes(key)) {
                return res.status(400).json({ message: `Field '${key}' cannot be updated via this route.` });
            }
        }
    
        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }
    
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        const setClause = keys.map((key) => `\`${key}\` = ?`).join(", ");
        const query = `UPDATE User SET ${setClause} WHERE userID = ?`;
    
        db.query(query, [...values, userId], (err, result) => {
            if (err) {
                console.error("Update error:", err);
                return res.status(500).json({ message: "Failed to update profile", error: err });
            }
    
            return res.status(200).json({ message: "Profile updated successfully" });
        });
    });

    /*
    Note to frontend: this allows the user to delete their account
    */
    router.delete("/delete", verifyToken, (req, res) => {
        const userId = req.user.userID;
        const query = `DELETE FROM User WHERE userID = ?`;

        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ message: "Failed to delete user", error: err });
            }

            return res.status(200).json({ message: "User deleted successfully" });
        });
    });

    /*
    Note to frontend: displays the products that have been sold by the user
    */
    router.get("/soldProducts", verifyToken, (req, res) => {
        const sellerID = req.user.userID;

        const q = `
            SELECT price, name, size, description, category, productCondition FROM Product
            WHERE sellerID = ? AND isActive = FALSE
        `;

        db.query(q, [sellerID], (err, results) => {
            if (err) {
                console.error("Error fetching sold products:", err);
                return res.status(500).json({ message: "Failed to fetch sold products", error: err });
            }

            return res.status(200).json(results);
        });
    });

  
    // Return routes to index.js
    return router;
};
