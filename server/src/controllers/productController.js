import { Product } from "../models/Product.js";

export async function getProducts(req, res, next) {
  try {
    const { keyword = "", category = "", sort = "newest" } = req.query;
    const filter = {};

    if (keyword.trim()) {
      filter.name = { $regex: keyword.trim(), $options: "i" };
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      nameAsc: { name: 1 },
    };

    const products = await Product.find(filter).sort(sortMap[sort] || sortMap.newest);
    const categories = await Product.distinct("category");

    res.json({ products, categories: categories.sort() });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, price, image, category, stock } = req.body;
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ message: "Please provide all required product fields" });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      image: image || "https://placehold.co/600x400?text=Product",
      category,
      stock: Number(stock),
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const allowedFields = ["name", "description", "price", "image", "category", "stock"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
}
