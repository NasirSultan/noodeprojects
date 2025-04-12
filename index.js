require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const isAdmin = require("./middleware/isAdmin");
const Item = require("./models/Item");

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


app.get('/role',(req,res)=>{

  Item.find().then(data=>res.json(data)).catch(erro=>res.json(erro));

})


app.post("/role", isAdmin, (req, res) => {
  const { name, role } = req.body;

  const newItem = new Item({ name, role });

  newItem
    .save()
    .then(savedItem => res.status(201).json(savedItem))
    .catch(err => res.status(500).json({ error: "Server error" }));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
