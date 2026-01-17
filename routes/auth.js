const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { email, password, username, firstname, lastname } = req.body;

        if (!email || !password || !username || !firstname || !lastname) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            firstname,
            lastname,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            "tes-auth-my-jsonwebtoken",
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
