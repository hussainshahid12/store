import express from "express";
const product_router = express.Router();
import  Product  from "../controller/product.js";

// Define your user account routes here

product_router
  .get("/", Product.getALLCategory)
  .get("/getproducts", Product.getproducts)
  .get("/getProductCount", Product.getTotalProducts)
  .get("/getFilterCategory", Product.getFilterCategory)
  .get("/getProductDetail/:id", Product.getProductDetail)

export default product_router;
