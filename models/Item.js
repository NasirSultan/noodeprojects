const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
});

const Role = mongoose.model("Role", itemSchema); // Model name capitalized by convention

module.exports = Role;
