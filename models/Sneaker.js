const mongoose = require("mongoose");

const SneakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Sneaker", SneakerSchema);
