import customErrorHandler from "../errorHanlding/error.js";
import Cart from "../model/cart.js";

// ===============================
// Helper Function (Important)
// ===============================
const recalculateCart = (cart) => {
  let totalPrice = 0;
  let discountAmount = 0;

  cart.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    const itemDiscount = (itemTotal * (item.discountPercent || 0)) / 100;

    totalPrice += itemTotal;
    discountAmount += itemDiscount;
  });

  cart.totalPrice = totalPrice;
  cart.discountAmount = discountAmount;
  cart.finalPrice = totalPrice - discountAmount;
};

// ===============================
// Cart Controller
// ===============================
class UserCart {
  // ===============================
  // Add To Cart
  // ===============================
  static async addToCart(req, res) {
    try {
      const { id } = req.user;

      const {
        title,
        productId,
        price,
        image,
        quantity = 1,
        discountPercent = 0,
      } = req.body;

      let cart = await Cart.findOne({ userId: id });

      if (!cart) {
        cart = new Cart({
          userId: id,
          items: [
            {
              productId,
              title,
              price,
              image,
              quantity,
              discountPercent,
            },
          ],
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId,
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].discountPercent = discountPercent;
        } else {
          cart.items.push({
            productId,
            title,
            price,
            image,
            quantity,
            discountPercent,
          });
        }
      }

      recalculateCart(cart);

      await cart.save();

      res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart,
      });
    } catch (err) {
      customErrorHandler({
        status: 400,
        message: err.message,
        req,
        res,
      });
    }
  }

  // ===============================
  // Get Cart
  // ===============================
  static async getCart(req, res) {
    try {
      const { id } = req.user;

      const cart = await Cart.findOne(
        { userId: id },
        {
          items: 1,
          totalPrice: 1,
          discountAmount: 1,
          finalPrice: 1,
          _id: 0,
        },
      );

      if (!cart) {
        return res.json({
          success: true,
          cart: {
            items: [],
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0,
          },
        });
      }

      res.json({ success: true, cart });
    } catch (err) {
      customErrorHandler({
        status: 400,
        message: err.message,
        req,
        res,
      });
    }
  }

  // ===============================
  // Remove Item
  // ===============================
  static async removeItem(req, res) {
    try {
      const { id } = req.user;
      const { id: productId } = req.params;

      let cart = await Cart.findOne({ userId: id });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId,
      );

      recalculateCart(cart);

      await cart.save();

      res.json({
        success: true,
        message: "Item removed successfully",
        cart,
      });
    } catch (err) {
      customErrorHandler({
        status: 400,
        message: err.message,
        req,
        res,
      });
    }
  }

  // ===============================
  // Update Quantity
  // ===============================
  static async updateQuantity(req, res) {
    try {
      const { id } = req.user;
      const { productId, quantity } = req.body;

      const cart = await Cart.findOne({ userId: id });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      const item = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // update quantity
      item.quantity = quantity;

      // IMPORTANT: recalc everything
      recalculateCart(cart);

      await cart.save();

      res.json({
        success: true,
        message: "Quantity updated successfully",
        cart: item,
        totalPrice: cart.totalPrice,
        discountAmount: cart.discountAmount,
        finalPrice: cart.totalPrice - cart.discountAmount,
      });
    } catch (err) {
      customErrorHandler({
        status: 400,
        message: err.message,
        req,
        res,
      });
    }
  }
}

export default UserCart;
