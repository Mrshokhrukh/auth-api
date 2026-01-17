require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.js");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        message: "server is working"
    })
});

app.use("/api/auth", authRoutes);


const PORT = 2000;

mongoose
    .connect('mongodb+srv://shokhrukh:authentication-test@cluster0.lqfddt4.mongodb.net/')
    .then(() => console.log("MongoDB connected")).then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    })
    .catch((err) => console.error(err));




