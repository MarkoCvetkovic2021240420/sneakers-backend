const express = require("express");
const Sneaker = require("../models/Sneaker");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all sneakers
router.get("/", auth, async (req, res) => {
  try {
    const sneakers = await Sneaker.find();
    res.send(sneakers);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Create new sneaker
router.post("/", auth, async (req, res) => {
  const { name, brand, size, price, image } = req.body;

  try {
    const sneaker = new Sneaker({ name, brand, size, price, image });
    await sneaker.save();
    res.status(201).send(sneaker);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update sneaker by ID
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, brand, size, price, image } = req.body;

  try {
    const sneaker = await Sneaker.findByIdAndUpdate(
      id,
      { name, brand, size, price, image },
      { new: true, runValidators: true }
    );

    if (!sneaker) {
      return res.status(404).send({ error: "Sneaker not found" });
    }

    res.send(sneaker);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete sneaker by ID
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const sneaker = await Sneaker.findByIdAndDelete(id);

    if (!sneaker) {
      return res.status(404).send({ error: "Sneaker not found" });
    }

    res.send({ message: "Sneaker deleted successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
