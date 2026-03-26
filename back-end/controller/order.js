import Order from "../model/order.js";
import Cart from "../model/cart.js";
import customErrorHandler from "../errorHanlding/error.js";
import mongoose from "mongoose";

class order {
  static createOrder = async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const { address, paymentMethod } = req.body;

      const cart = await Cart.findOne({ userId });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate totals from cart
      const totalPrice = cart.totalPrice;
      const discountAmount = cart.discountAmount;
      const finalPrice = cart.finalPrice;

      const order = await Order.create({
        userId,
        address,
        items: cart.items,
        paymentMethod,
        totalPrice,
        discountAmount,
        finalPrice,
      });

      // Clear cart after order
      cart.items = [];
      cart.totalPrice = 0;
      cart.discountAmount = 0;
      cart.finalPrice = 0;
      await cart.save();

      res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      customErrorHandler({ status: 500, message: err.message }, req, res);
    }
  };

  static getMyOrders = async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const orders = await Order.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json(orders);
    } catch (err) {
      customErrorHandler({ status: 500, message: err.message }, req, res);
    }
  };

  static getSingleOrder = async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      // ✅ Check valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Order ID" });
      }

      const userId = req.user.id;

      const order = await Order.findOne({ _id: id, userId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (err) {
      customErrorHandler(
        { status: 500, message: err.message },
        req,
        res,
      );
    }
  };

  static cancelOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const order = await Order.findOne({ _id: id, userId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.orderStatus !== "Pending") {
        return res.status(400).json({
          message: "Only pending orders can be cancelled",
        });
      }

      order.orderStatus = "Cancelled";
      await order.save();

      // res.status(200).json({
      //   message: "Order cancelled successfully",
      //   order,
      // });

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  static getMyOrderAddress = async (req, res) => {
    try {
      const userId = req.user.id;

      const address = await Order.find({ userId }, { _id: 0, address: 1 });

      res.status(200).json(address);
    } catch (err) {
      customErrorHandler({ status: 500, message: err.message }, req, res);
    }
  };
}

export default order;
