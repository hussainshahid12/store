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
      let sort = req.query.sort
      let order = req.query.order;
      let query = Product.find({ });
      console.log(req.query)

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
      let pageSize = 30;
      let countProducts = await Product.find().countDocuments();
      let totalPages = Math.ceil(countProducts / pageSize);

      if (countProducts) {
        res.status(200).json({
          count: countProducts,
          pages: totalPages,
          message: "product count successfully",
        });
        return;
      }
      res.json({
        message: "product not found",
      });
    } catch (err) {
      customErrorHandler({ status: 404, message: err.message }, req, res);
    }
  }
}

export { product };
