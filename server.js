require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Product = require("./models/Product");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inventory";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// UI Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/products-page", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "products.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Authentication Routes (Phase 1)
app.use("/api/auth", authRoutes);

// Existing Product API Routes (Untouched for Phase 1 compatibility)
app.post("/add", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.send(product);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

app.get("/products", async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
});

app.delete("/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send("Deleted");
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
});

app.put("/update/:id", async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.send("Updated");
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating product" });
    }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
