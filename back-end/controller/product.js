import customErrorHandler from "../errorHanlding/error.js";
import Product from "../model/product.js";

class product {
  static async getALLCategory(req, res) {
    try {
      let response = await Product.aggregate([
        { $group: { _id: "$category", images: { $first: "$thumbnail" } } },
      ]);
      res.json({ response, message: "Get all category successfully" });
    } catch (err) {
      customErrorHandler({ status: 400, message: err.message }, req, res);
    }
  }

  static async getproducts(req, res) {
    try {
      let pageNo = req.query.page || 1;
      let pageSize = 30;
      let sort = req.query.sort;
      let order = req.query.order;
      let query = Product.find({});
      console.log(req.query);

      if (sort && order) {
        query = await query
          .sort({ price: order })
          .skip(pageSize * (pageNo - 1))
          .limit(pageSize);
      } else query = await query.skip(pageSize * (pageNo - 1)).limit(pageSize);

      res.json({ query, message: "Get products successfully" });
    } catch (err) {
      customErrorHandler({ status: 400, message: err.message }, req, res);
    }
  }
  static async getTotalProducts(req, res) {
    try {
      const isValid = req.query.countCategory === "true";
      const category = req.query.category?.split(",");
      console.log(req.query);
      let pageSize = 30;
      let query = isValid
        ? Product.find({ category: { $in: category } })
        : Product.find();
      let countProducts = await query.countDocuments();
      console.log(countProducts)
      let totalPages = Math.ceil(countProducts / pageSize);
           console.log("pages", totalPages)

      if (countProducts) {
        res.status(200).json({
          count: countProducts,
          pages: totalPages,
          status: true,
          message: "product count successfully",
        });
        return;
      }
      res.json({
        message: "product not found",
      });
    } catch (err) {
      customErrorHandler(
        { status: 404, message: err.message, status: false },
        req,
        res
      );
    }
  }

  static async getFilterCategory(req, res) {
    try {
      const category = req.query.category.split(",");
      let pageSize = 30;
      let pageNo = req.query.page || 1;
      console.log(req.query);
      let query = await Product.find({ category: { $in: category } })
        .skip(pageSize * (pageNo - 1))
        .limit(pageSize);
      res.json({
        query,
        message: "Get all filter category successfully",
        status: true,
      });
    } catch (err) {
      customErrorHandler(
        { status: 404, message: err.message, status: false },
        req,
        res
      );
    }
  }
}

export { product };
