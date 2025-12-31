import express from "express";
const product_router = express.Router();
import { product } from "../controller/product.js";

// Define your user account routes here

product_router
  .get("/", product.getALLCategory)
  .get("/getproducts", product.getproducts)
  .get("/getProductCount", product.getTotalProducts);

export default product_router;
