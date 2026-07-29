import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1500 },
    price: { type: Number, required: true, min: 0 },
    image: {
      type: String,
      required: true,
      default: "https://placehold.co/600x400?text=Product",
    },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
