import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

dotenv.config();

const products = [
  {
    name: "Classic Backpack",
    description: "A simple everyday backpack with enough room for books, a laptop and daily accessories.",
    price: 1450,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    category: "Bags",
    stock: 15,
  },
  {
    name: "Wireless Headphones",
    description: "Comfortable over-ear headphones for music, online classes and regular use.",
    price: 2200,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    stock: 12,
  },
  {
    name: "Minimal Wrist Watch",
    description: "A clean and lightweight wrist watch suitable for casual and formal outfits.",
    price: 1850,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    stock: 10,
  },
  {
    name: "Cotton T-Shirt",
    description: "Soft regular-fit cotton T-shirt for everyday comfort.",
    price: 650,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    category: "Clothing",
    stock: 25,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with a flexible sole for walking and everyday workouts.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "Shoes",
    stock: 14,
  },
  {
    name: "Ceramic Coffee Mug",
    description: "A durable ceramic mug for tea, coffee and other hot drinks.",
    price: 420,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    stock: 30,
  },
];

async function seed() {
  try {
    await connectDB();
    await Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);

    await User.create([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "Admin123!",
        role: "admin",
      },
      {
        name: "Demo User",
        email: "user@example.com",
        password: "User123!",
        role: "user",
      },
    ]);

    await Product.insertMany(products);
    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
