import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: mongoose.Schema.Types.ObjectId,
    title: String,
    image: String,
    price: Number,
    discountPercent: Number,
    quantity: Number,
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
    items: [itemSchema],
    totalPrice: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔥 FIXED INDEXES (NO DUPLICATE ERROR)
cartSchema.index(
  { userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $type: "objectId" } },
  }
);

cartSchema.index(
  { sessionId: 1 },
  {
    unique: true,
    partialFilterExpression: { sessionId: { $type: "string" } },
  }
);

export default mongoose.model("Cart", cartSchema);