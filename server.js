const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Product = require("./models/Product");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/inventory");

// UI Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/products-page", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "products.html"));
});

// API Routes
app.post("/add", async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send(product);
});

app.get("/products", async (req, res) => {
    const data = await Product.find();
    res.json(data);
});

app.delete("/delete/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});

app.put("/update/:id", async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send("Updated");
});

app.listen(5000, () => console.log("Server running on 5000"));
