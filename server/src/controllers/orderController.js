import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, paymentMethod = "Cash on Delivery" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const requiredAddress = ["fullName", "phone", "address", "city"];
    const missingAddress = requiredAddress.some((key) => !shippingAddress?.[key]?.trim());
    if (missingAddress) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    const normalizedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid product quantity" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: "A product in your cart no longer exists" });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: `${product.name} does not have enough stock` });
      }

      normalizedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
      totalPrice += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    await Product.bulkWrite(
      normalizedItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.quantity } },
        },
      }))
    );

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const allowedStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
}
