const express = require("express");
const Order = require("../models/orderModel");

const router = express.Router();

async function generateOrderId() {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  const lastNumber = lastOrder ? parseInt(lastOrder.orderId, 10) : 0;
  return String(lastNumber + 1).padStart(8, "0");
}

router.post("/newOrder", async (req, res) => {
  const { userEmail, deliveryAddress, orderItems, totalPrice } = req.body;

  if (!userEmail || !deliveryAddress || !orderItems || !totalPrice) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const orderId = await generateOrderId();

    const newOrder = new Order({
      userEmail,
      orderId,
      deliveryAddress,
      orderItems,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: savedOrder.orderId });
  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({ error: "Failed to place order. Please try again." });
  }
});

router.get("/getOrders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetching orders failed:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

router.patch("/markCompleted", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { orderStatus: "completed" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({ message: "Order marked as completed successfully!", updatedOrder });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

module.exports = router;
