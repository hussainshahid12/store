import Cart from "../model/cart.js";
import Product from "../model/product.js";
import { v4 as uuidv4 } from "uuid";

// ===============================
// SESSION ID
// ===============================
export const getSessionId = (req, res) => {
  let sessionId = req.cookies?.sessionId;

  const isProduction = process.env.NODE_ENV === "production";

  if (!sessionId) {
    sessionId = uuidv4();

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: isProduction, // MUST be HTTPS in production
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
};

// ===============================
// RECALCULATE
// ===============================
export const recalculateCart = (cart) => {
  let total = 0;
  let discount = 0;

  cart.items.forEach((i) => {
    const itemTotal = i.price * i.quantity;
    const itemDiscount = (itemTotal * (i.discountPercent || 0)) / 100;

    total += itemTotal;
    discount += itemDiscount;
  });

  cart.totalPrice = total;
  cart.discountAmount = discount;
  cart.finalPrice = total - discount;
};

// ===============================
// FIND OR CREATE CART
// ===============================
export const findOrCreateCart = async (req, res) => {
  const sessionId = getSessionId(req, res);
  const lastUserId = req.cookies?.lastUserId;

  // ================= LOGIN USER =================
  if (req.user) {
    let userCart = await Cart.findOne({ userId: req.user.id });
    let guestCart = await Cart.findOne({ sessionId });

    // 🔥 MERGE guest → user
    if (
      guestCart &&
      userCart &&
      guestCart._id.toString() !== userCart._id.toString()
    ) {
      guestCart.items.forEach((gItem) => {
        const existing = userCart.items.find(
          (i) => i.productId.toString() === gItem.productId.toString()
        );

        if (existing) existing.quantity += gItem.quantity;
        else userCart.items.push(gItem);
      });

      recalculateCart(userCart); // ✅ FIX
      await userCart.save();     // ✅ FIX

      await Cart.deleteOne({ _id: guestCart._id });
    }

    // 🔥 convert guest → user
    if (!userCart && guestCart) {
      guestCart.userId = req.user.id;
      guestCart.sessionId = sessionId;
      await guestCart.save();
      return guestCart;
    }

    // 🔥 normal user cart
    if (userCart) {
      userCart.sessionId = sessionId;
      await userCart.save();
      return userCart;
    }

    // 🔥 create new cart
    const newCart = new Cart({
      userId: req.user.id,
      sessionId,
      items: [],
    });

    await newCart.save();
    return newCart;
  }

  // ================= LOGOUT USER =================
  if (!req.user && lastUserId) {
    let cart = await Cart.findOne({ userId: lastUserId });

    if (cart) {
      cart.sessionId = sessionId;
      await cart.save();
      return cart;
    }
  }

  // ================= GUEST =================
  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = new Cart({
      sessionId,
      items: [],
    });
    await cart.save();
  }

  return cart;
};

// ===============================
// CONTROLLER
// ===============================
class UserCart {
  // ================= ADD =================
  static async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      const product = await Product.findById(productId).lean();

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // ✅ STOCK CHECK
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      const cart = await findOrCreateCart(req, res);

      const item = cart.items.find(
        (i) => i.productId.toString() === productId
      );

      if (item) {
        item.quantity += Number(quantity);
      } else {
        cart.items.push({
          productId: product._id.toString(),
          title: product.title,
          image: product.thumbnail,
          price: product.price,
          discountPercent: product.discountPercentage || 0,
          quantity: Number(quantity),
        });
      }

      recalculateCart(cart);
      await cart.save();

      res.json({ success: true, cart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // ================= GET =================
  static async getCart(req, res) {
    try {
      const cart = await findOrCreateCart(req, res);

      recalculateCart(cart);
      await cart.save();

      res.json({ success: true, cart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // ================= REMOVE =================
  static async removeItem(req, res) {
    try {
      const { productId } = req.params;

      const cart = await findOrCreateCart(req, res);

      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );

      recalculateCart(cart);
      await cart.save();

      res.json({ success: true, cart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // ================= UPDATE =================
  static async updateQuantity(req, res) {
    try {
      const { productId, quantity } = req.body;

      const cart = await findOrCreateCart(req, res);

      const item = cart.items.find(
        (i) => i.productId.toString() === productId
      );

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // ✅ REMOVE IF 0
      if (quantity < 1) {
        cart.items = cart.items.filter(
          (i) => i.productId.toString() !== productId
        );
      } else {
        item.quantity = Number(quantity);
      }

      recalculateCart(cart);
      await cart.save();

      res.json({ success: true, cart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default UserCart;
