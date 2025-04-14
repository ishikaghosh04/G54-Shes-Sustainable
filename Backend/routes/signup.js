import express from "express";
import bcrypt from "bcryptjs";  // Hashing passwords
const router = express.Router();

export default (db) => {
    // Display all users (testing purposes)
    router.get("/", (req, res) => {
    const q = "SELECT * FROM User";
    db.query(q, (err, results) => {
        if (err) {
        console.error("Query error:", err);
        return res.status(500).json({ error: "An error occurred while retrieving users." });
        }

        if (results.length === 0) {
        return res.status(404).json({ message: "No users found." });  // In case no products are found
        }

        return res.status(200).json(results);  // Success response with the products data
    });
    });

    // Sign up a user
    router.post("/", (req, res) => {
        const { firstName, lastName, email, password } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Normalize and validate email
        const emailLower = email.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailLower)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check for existing user
        db.query("SELECT * FROM User WHERE email = ?", [emailLower], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Insert user
            const query = "INSERT INTO User (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
            db.query(query, [firstName, lastName, emailLower, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                return res.status(201).json({ message: "User created successfully" });
            });
        });
    });

    // Return the routes to index.js
    return router;
};
