import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";  // Hashing passwords
const router = express.Router();

export default (db) => {
    // User can login to their account
    router.post("/", (req, res) => {
        const { email, password } = req.body;
        const emailLower = email.toLowerCase();
        // Find user by email
        db.query("SELECT * FROM User WHERE email = ?", [emailLower], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
        
            if (result.length === 0) {
                return res.status(400).json({ message: "User not found" });
            }
        
            // Compare the hashed password
            const user = result[0]; // Assuming we only get one user from the database
            const isPasswordValid = bcrypt.compareSync(password, user.password);
        
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }
        
            // Generate JWT token (check)
            const token = jwt.sign(
                // VERIFY IF EMAIL OR EMAILLOWER?
                { userID: user.userID, email: user.emailLower }, // Payload
                process.env.JWT_SECRET, // Secret key
                { expiresIn: "1h" } // Token expiration time
            );
        
            return res.status(200).json({ message: "Login successful", token });
        });
    });
    
    // Return the routes to index.js
    return router;
}