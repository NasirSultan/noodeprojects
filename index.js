require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Item = require("./models/Item");
const req = require("express/lib/request");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGO_URI) // Removed deprecated options
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => res.send("API is running"));

app.get("/api/items", async (req, res) => {
  try {
    const { page = 1, limit = 4, search = "" } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const totalItems = await Item.countDocuments(query);
    const items = await Item.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validate input
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    // Create new item
    const newItem = new Item({ name, price });

    // Save to DB
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});






app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





app.post("/post", async(req,req)=>{
        const {name,price}=req.body;
        const newitem= new item({name ,price});
        const saveitem=await newitem.save()
        req.status(201).json(saveitem);

});