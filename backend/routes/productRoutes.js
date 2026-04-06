import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);        // CREATE
router.get("/", getProducts);           // READ ALL
router.get("/:id", getProductById);     // READ ONE
router.put("/:id", updateProduct);      // UPDATE
router.delete("/:id", deleteProduct);   // DELETE

export default router;