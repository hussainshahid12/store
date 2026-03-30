import { api } from "./api";

export const createOrderService = async (order) => {
  const response = await api.post("/api/order/create", order);
  return response.data;
};

export const orderAddressService = async () => {
  const response = await api.get("/api/order/my-order-address");
  return response.data;
};

export const myOrderTrackService = async (order_id) => {
  const response = await api.get(`/api/order/${order_id}`);
  return response.data;
};

export const myOrderCancelService = async (order_id) => {
  const response = await api.put(`/api/order/cancel/${order_id}`);
  return response.data;
};

export const myOrderService = async () => {
  const response = await api.get(`/api/order/my-orders`);
  return response.data;
};
