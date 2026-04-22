import Order from "../model/order.js";
import Cart from "../model/cart.js";
import customErrorHandler from "../errorHanlding/error.js";
import mongoose from "mongoose";
import product from "../model/product.js";
import calculatePrice from "../utils/calculations/priceCalculate.js";

class order {
  static buyNowItem = async (req, res) => {
    const { productId, quantity } = req.query;
    console.log("qnty", quantity);
    console.log("th8s", productId, quantity);
    try {
      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product & quantity required" });
      }

      const order_product = await product.findById(productId);

      if (!order_product) {
        return res.status(404).json({ message: "Product not found" });
      }

      let items = [
        {
          productId: order_product._id,
          name: order_product.name,
          price: order_product.price,
          quantity,
          image: order_product.thumbnail,
          discountPercent: order_product.discountPercentage,
          title: order_product.title,
        },
      ];
      // price calculate
      let { totalPrice, discountAmount, finalPrice } = calculatePrice(
        order_product,
        quantity,
      );

      res.json({
        items,
        totalPrice,
        discountAmount,
        finalPrice,
        message: "success",
      });
    } catch (err) {
      customErrorHandler({ status: 500, message: err.message }, req, res);
    }
  };

  static createOrder = async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const { address, paymentMethod, productId, quantity } = req.body;
      const mode = req.query.mode;
      console.log(address, paymentMethod, productId, quantity);

      let items = [];
      let totalPrice = 0;
      let discountAmount = 0;
      let finalPrice = 0;

      if (mode === "buy-now") {
        if (!productId || !quantity) {
          return res
            .status(400)
            .json({ message: "Product & quantity required" });
        }

        const prod = await product.findById(productId);
        if (!prod) {
          return res.status(404).json({ message: "Product not found" });
        }

        items = [
          {
            productId: prod._id,
            title: prod.title,
            price: prod.price,
            quantity: parseInt(quantity),
            image: prod.thumbnail,
            discountPercent: prod.discountPercentage,
          },
        ];
        // price calculate
        let result = calculatePrice(prod, quantity);
        totalPrice = result.totalPrice;
        discountAmount = result.discountAmount;
        finalPrice = result.finalPrice;
      } else if (mode === "cart") {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ message: "Cart is empty" });
        }

        items = cart.items;
        totalPrice = cart.totalPrice;
        discountAmount = cart.discountAmount;
        finalPrice = cart.finalPrice;

        // Clear the cart after order creation
        await Cart.findOneAndUpdate(
          { userId },
          {
            items: [],
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0,
          },
        );
      } else {
        return res.status(400).json({ message: "Invalid mode" });
      }

      // CREATE ORDER
      const order = await Order.create({
        userId,
        address, // Ensure your Schema accepts the object: { firstName, lastName, phone, address, city, email }
        items,
        paymentMethod,
        totalPrice,
        discountAmount,
        finalPrice,
        status: "Pending",
      });

      return res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    } catch (err) {
      console.error("Order Error:", err); // Log the actual error for debugging
      res.status(500).json({ message: err.message });
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
      let { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const userId = req.user.id;

      let order;

      // ✅ CASE 1: Full ObjectId
      if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
        order = await Order.findOne({ _id: id, userId });
      }

      // ✅ CASE 2: Short ID (last 8 chars)
      else {
        order = await Order.findOne({
          userId,
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: id + "$", // match ending
              options: "i",
            },
          },
        });
      }

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (err) {
      customErrorHandler({ status: 500, message: err.message }, req, res);
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
