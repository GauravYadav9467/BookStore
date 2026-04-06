import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;