import customErrorHandler from "../errorHanlding/error.js";
import product from "../model/product.js";

class Product {
  static async getALLCategory(req, res) {
    try {
      let response = await product.aggregate([
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
      let query = product.find({});
      let result = null;

      if (sort && order) {
        result = await query
          .sort({ price: order })
          .skip(pageSize * (pageNo - 1))
          .limit(pageSize);
      } else result = await query.skip(pageSize * (pageNo - 1)).limit(pageSize);

      res.json({ result, message: "Get products successfully", status: true });
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
        ? product.find({ category: { $in: category } })
        : product.find();
      let countProducts = await query.countDocuments();
      console.log(countProducts);
      let totalPages = Math.ceil(countProducts / pageSize);
      console.log("pages", totalPages);

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
      customErrorHandler({ status: 404, message: err.message }, req, res);
    }
  }

  static async getFilterCategory(req, res) {
    try {
      const category = req.query.category.split(",");
      let pageSize = 30;
      let sort = req.query.sort;
      let order = req.query.order;
      let pageNo = req.query.page || 1;
      let result = null;
      console.log(req.query);
      let query = product.find({ category: { $in: category } });

      if (sort && order) {
        result = await query
          .sort({ price: order })
          .skip(pageSize * (pageNo - 1))
          .limit(pageSize);
      } else result = await query.skip(pageSize * (pageNo - 1)).limit(pageSize);

      res.json({
        result,
        message: "Get all filter category successfully",
        status: true,
      });
    } catch (err) {
      customErrorHandler({ status: 404, message: err.message }, req, res);
    }
  }

  static async getProductDetail(req, res) {
    try {
      let id = req.params.id;
      let result = await product.findById(id);
      res.json({
        result,
        message: "Get product detail successfully",
        status: true,
      });
    } catch (err) {
      customErrorHandler({ status: 404, message: err.message }, req, res);
    }
  }

  static searchProducts = async (req, res) => {
    const normalizeWord = (word) => {
      if (word.endsWith("s")) {
        return [word, word.slice(0, -1)];
      }
      return [word, word + "s"];
    };

    const escapeRegex = (text) => {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    try {
      const query = req.query.q;
      if (!query) return res.json([]);

      const words = query.trim().toLowerCase().split(/\s+/);

      const conditions = words.map((word) => {
        const safeWord = escapeRegex(word);
        const variations = normalizeWord(safeWord);

        return {
          $or: variations.flatMap((v) => [
            { title: { $regex: v, $options: "i" } },
            { brand: { $regex: v, $options: "i" } },
            { category: { $regex: v, $options: "i" } },
          ]),
        };
      });

      const products = await product
        .find({
          $and: conditions,
        })
        .select("title thumbnail brand category")
        .limit(10);

      res.json(products);
    } catch (error) {
      console.error(error); // 👈 VERY IMPORTANT
      res.status(500).json({ message: error.message });
    }
  };
}

export default Product;
