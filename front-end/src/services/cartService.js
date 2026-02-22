import { api } from "./api";

export const addItemService = async (item) => {
  const response = await api.post("/cart/add", item);
  return response.data;
};

export const getCartIemsService = async () => {
  const response = await api.get(`/cart/`);
  return response.data;
};

export const updateCartService = async (cartUpate) => {
  const response = await api.put(`/cart/update`, cartUpate);
  return response.data;
};

export const removeCartService = async (id) => {
  const response = await api.delete(`/cart/remove/${id}`);
  return response.data;
};
