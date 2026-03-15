const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

/* ===========================
   CREATE ORDER (Protected)
=========================== */
router.post("/create", protect, async (req, res) => {
  try {
    const { items, totalPrice, address, payment } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    const order = new Order({
      user: req.user.id, // associate order with logged-in user
      items,
      totalPrice,
      address,
      payment
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: createdOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   GET MY ORDERS (Protected)
=========================== */
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   GET ALL ORDERS (Admin/Unprotected for now)
=========================== */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   GET SINGLE ORDER
=========================== */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    // Check if the order belongs to the user or if user is admin (admin not fully implemented)
    if (order.user && order.user.toString() !== req.user.id) {
       return res.status(401).json({ success: false, message: "Not authorized to view this order" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ===========================
   UPDATE ORDER STATUS
=========================== */
router.put("/status/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();

    res.json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;