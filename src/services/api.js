import axios from "axios";

export const getProducts = () => {
  return axios.get("http://localhost:5000/api/products");
};

export const getProductById = (id) => {
  return axios.get(`http://localhost:5000/api/products/${id}`);
};

export const addToCart = (cartItem) => {
  return axios.post("http://localhost:5000/api/cart", cartItem);
};