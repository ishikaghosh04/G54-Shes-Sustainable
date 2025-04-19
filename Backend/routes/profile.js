// ADD PROFILE INFO TO USER TABLE (NULL)
import express from "express";
import verifyToken from "./middlewares/verifyToken.js";

const router = express.Router();

export default (db) => {
    // Get profile information (testing purposes)
    router.get("/", verifyToken, (req, res) => {
        const userID = req.user.userID;
        db.query("SELECT * FROM User WHERE userID = ?", [userID], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            // Remove password before sending user data
            const user = results[0];
            delete user.password;
            return res.status(200).json(user);
        });
    });

    // Dynamically update profile
    router.patch("/:id", verifyToken, (req, res) => {
        const userId = parseInt(req.params.id);
    
        // Only allow updates to your own profile (should never occur)
        if (userId !== req.user.userID) {
            return res.status(403).json({ message: "You can only update your own profile." });
        }
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

    // Delete user profile (hard delete - no history)
    router.delete("/:id", verifyToken, (req, res) => {
        const userId = parseInt(req.params.id);

        // Only allow deletion of your own profile
        if (userId !== req.user.userID) {
            return res.status(403).json({ message: "You can only delete your own profile." });
        }

        const query = `DELETE FROM User WHERE userID = ?`;

        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error("Delete error:", err);
                return res.status(500).json({ message: "Failed to delete user", error: err });
            }

            return res.status(200).json({ message: "User deleted successfully" });
        });
    });
  
    // Return routes to index.js
    return router;
};
