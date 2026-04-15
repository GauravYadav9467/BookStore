import axios from "axios";

export const getProducts = () => {
  return axios.get("/api/products");
};

export const getProductById = (id) => {
  return axios.get(`/api/products/${id}`);
};

export const searchProducts = (query) => {
  return axios.get(`/api/products/search?q=${encodeURIComponent(query)}`);
};

export const addToCart = (cartItem) => {
  return axios.post("/api/cart", cartItem);
};