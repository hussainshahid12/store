import Cart from "../model/cart.js";
import Product from "../model/product.js";
import { v4 as uuidv4 } from "uuid";

// ===============================
// SESSION ID
// ===============================
export const getSessionId = (req, res) => {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
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

  // ================= USER =================
  if (req.user) {
    let cart = await Cart.findOne({
      $or: [
        { userId: req.user.id },
        { sessionId: sessionId }, //  IMPORTANT
      ],
    });

    if (cart) {
      // attach user
      cart.userId = req.user.id;
      cart.sessionId = sessionId; //  keep session
      await cart.save();
      return cart;
    }

    // create new
    cart = new Cart({
      userId: req.user.id,
      sessionId: sessionId,
      items: [],
    });

    await cart.save();
    return cart;
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
  //  ADD
  static async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const cart = await findOrCreateCart(req, res);

      const item = cart.items.find((i) => i.productId.toString() === productId);

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

  //  GET
  static async getCart(req, res) {
    const cart = await findOrCreateCart(req, res);
    recalculateCart(cart);
    await cart.save();

    res.json({ success: true, cart });
  }

  //  REMOVE
  static async removeItem(req, res) {
    const { productId } = req.params;

    const cart = await findOrCreateCart(req, res);

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    recalculateCart(cart);
    await cart.save();

    res.json({ success: true, cart });
  }

  // UPDATE
  static async updateQuantity(req, res) {
    const { productId, quantity } = req.body;

    const cart = await findOrCreateCart(req, res);

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = Number(quantity);

    recalculateCart(cart);
    await cart.save();

    res.json({ success: true, cart });
  }
}

export default UserCart;
