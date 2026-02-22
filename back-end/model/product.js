import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPercentage: {
      type: Number,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    brand: {
      type: String,
    },

    weight: {
      type: Number,
    },

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },

    warrantyInformation: {
      type: String,
    },

    shippingInformation: {
      type: String,
    },

    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    returnPolicy: {
      type: String,
    },

    minimumOrderQuantity: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum:["active", "inactive"],
      default: "active",
    },
    images: {
      type: [String],
    },

    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

let product= mongoose.model("Product", productSchema);
export default product
