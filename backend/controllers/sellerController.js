import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d"
  });
};

// Seller Registration
export const sellerRegister = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, shopName, shopDescription, phone, address, city, pincode } = req.body;

    if (!username || !email || !password || !passwordConfirm || !shopName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const seller = await User.create({
      username,
      email,
      password,
      role: "seller",
      shopName,
      shopDescription: shopDescription || "",
      phone: phone || "",
      address: address || "",
      city: city || "",
      pincode: pincode || ""
    });

    const token = generateToken(seller._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        role: seller.role,
        shopName: seller.shopName,
        shopDescription: seller.shopDescription,
        phone: seller.phone,
        address: seller.address,
        city: seller.city,
        pincode: seller.pincode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, image, description, author, publisher, category, class: productClass, stock } = req.body;
    const sellerId = req.user.id;

    if (!name || !price || !image || !stock) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate that at least author or publisher is provided
    if (!author && !publisher) {
      return res.status(400).json({ message: "Please provide either Author or Publisher (at least one is required)" });
    }

    const product = await Product.create({
      name,
      price,
      image,
      description: description || "",
      category: category || [],
      author: author || "",
      publisher: publisher || "",
      class: productClass || "General",
      stock,
      sellerId
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;
    const { name, price, image, description, author, publisher, category, class: productClass, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Validate that at least author or publisher is provided
    if (!author && !publisher) {
      return res.status(400).json({ message: "Please provide either Author or Publisher (at least one is required)" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, image, description, category, author, publisher, class: productClass || "General", stock },
      { new: true }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Products
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const products = await Product.find({ sellerId });

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Sales Data
export const getSellerSalesData = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Get seller products
    const sellerProducts = await Product.find({ sellerId });
    const productIds = sellerProducts.map(p => p._id.toString()); // Convert to strings for comparison

    // Get orders containing seller's products
    const orders = await Order.aggregate([
      {
        $match: {
          "items.productId": { $in: productIds }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Calculate statistics
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalItemsSold = sellerProducts.reduce((sum, p) => sum + (p.sold || 0), 0);

    res.status(200).json({
      success: true,
      totalSales,
      totalOrders,
      totalItemsSold,
      orders,
      products: sellerProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Profile
export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const seller = await User.findById(sellerId).select("-password");

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Seller Profile
export const updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { shopName, shopDescription, phone, address, city, pincode } = req.body;

    const seller = await User.findByIdAndUpdate(
      sellerId,
      { shopName, shopDescription, phone, address, city, pincode },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pending Orders for Seller Approval
export const getPendingOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Get seller products
    const sellerProducts = await Product.find({ sellerId });
    const productIds = sellerProducts.map(p => p._id.toString());

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        pendingCount: 0
      });
    }

    // Get orders containing seller's products that are pending seller approval
    const orders = await Order.find({
      "items.productId": { $in: productIds },
      "sellerApproval.status": { $ne: "approved" }
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    // Filter to only show items from this seller for each order
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => productIds.includes(item.productId))
    }));

    const pendingCount = filteredOrders.filter(
      o => !o.sellerApproval || o.sellerApproval.status === "pending"
    ).length;

    res.status(200).json({
      success: true,
      orders: filteredOrders,
      pendingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Order (Seller)
export const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const sellerId = req.user.id;

    // Get seller products
    const sellerProducts = await Product.find({ sellerId });
    const productIds = sellerProducts.map(p => p._id.toString());

    // Check if order contains seller's products
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify seller has products in this order
    const hasSellerProducts = order.items.some(item =>
      productIds.includes(item.productId.toString())
    );

    if (!hasSellerProducts) {
      return res.status(403).json({ message: "Not authorized to approve this order" });
    }

    // Update seller approval status
    if (!order.sellerApproval) {
      order.sellerApproval = {};
    }
    order.sellerApproval.status = "approved";
    order.sellerApproval.approvedAt = new Date();
    order.sellerApproval.sellerId = sellerId;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order approved successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Order (Seller)
export const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const sellerId = req.user.id;

    // Get seller products
    const sellerProducts = await Product.find({ sellerId });
    const productIds = sellerProducts.map(p => p._id.toString());

    // Check if order contains seller's products
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify seller has products in this order
    const hasSellerProducts = order.items.some(item =>
      productIds.includes(item.productId.toString())
    );

    if (!hasSellerProducts) {
      return res.status(403).json({ message: "Not authorized to reject this order" });
    }

    // Update seller approval status
    if (!order.sellerApproval) {
      order.sellerApproval = {};
    }
    order.sellerApproval.status = "rejected";
    order.sellerApproval.reason = reason || "Rejected by seller";
    order.sellerApproval.rejectedAt = new Date();
    order.sellerApproval.sellerId = sellerId;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
