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
  author: {
    type: String
  },
  publisher: {
    type: String
  },
  category: {
    type: [String],
    default: []
  },
  class: {
    type: String,
    enum: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Competitive", "General", "All"],
    default: "General"
  },
  stock: {
    type: Number,
    default: 0
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  sold: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;