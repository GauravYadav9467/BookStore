import express from "express";
import {
  sellerRegister,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getSellerSalesData,
  getSellerProfile,
  updateSellerProfile,
  getPendingOrders,
  approveOrder,
  rejectOrder
} from "../controllers/sellerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public Routes
router.post("/register", sellerRegister);

// Protected Routes (require seller authentication)
router.get("/profile", protect, getSellerProfile);
router.put("/profile", protect, updateSellerProfile);
router.get("/products", protect, getSellerProducts);
router.post("/products", protect, addProduct);
router.put("/products/:id", protect, updateProduct);
router.delete("/products/:id", protect, deleteProduct);
router.get("/sales-data", protect, getSellerSalesData);

// Order Approval Routes
router.get("/orders/pending", protect, getPendingOrders);
router.put("/orders/:orderId/approve", protect, approveOrder);
router.put("/orders/:orderId/reject", protect, rejectOrder);

export default router;
