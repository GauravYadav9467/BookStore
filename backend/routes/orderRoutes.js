import express from "express";
import { placeOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protected routes - user must be authenticated
router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/:orderId", protect, getOrderById);
router.put("/:orderId/status", protect, updateOrderStatus);
router.put("/:orderId/cancel", protect, cancelOrder);

export default router;
