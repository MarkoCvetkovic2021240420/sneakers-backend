const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Ruta za preuzimanje svih porudžbina, dostupna samo adminima
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders" });
  }
});

// Postojeća POST ruta za dodavanje porudžbine
router.post("/", auth, async (req, res) => {
  const { customer, items, total } = req.body;
  try {
    const order = new Order({ customer, items, total });
    await order.save();
    res.status(201).send({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(400).send({ error: error.message });
  }
});

// Ruta za uklanjanje stavke iz narudžbine
// router.delete("/:orderId/remove-item", async (req, res) => {
//   const { orderId } = req.params;
//   const { itemId } = req.body;

//   console.log("ORDER IDDD:", orderId);
//   console.log("ITEM IDDD:", itemId);

//   try {
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Uklanjanje stavke po ID-ju
//     order.items = order.items.filter((item) => item._id.toString() !== itemId);

//     // Čuvamo izmenjenu narudžbinu
//     await order.save();

//     res.status(200).json({ message: "Item removed successfully" });
//   } catch (error) {
//     console.error("Error removing item:", error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });
router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Brisanje cele narudžbine
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Error removing order:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
