import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";
const router = express.Router();

// To consider: improve UX - refresh will reload the token
// after 3h logged out, loses access to everything

export default (db) => {
    /*
    Note to frontend: user must provide their email and password to login
    */
    router.post("/", (req, res) => {
        const { email, password } = req.body;

        // Basic input validation
        if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
        }

        const emailLower = email.toLowerCase();

        // Find user by email
        db.query("SELECT * FROM User WHERE email = ?", [emailLower], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result[0];

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        try {
            const token = jwt.sign(
            {
                userID: user.userID,
                email: user.email,
                isAdmin: user.isAdmin, // include admin flag in token
            },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
            );
        
            return res.status(200).json({ message: "Login successful", token });
        } catch (tokenError) {
            return res.status(500).json({ message: "Token generation failed", error: tokenError.message });
        }  
        });
    });

    // Return to index.js
    return router;
};