import { api } from "./api";

export const createOrderService = async (orderData) => {
  console.log("test" ,orderData)
  const { mode } = orderData;
  const response = await api.post(`/api/order/create?mode=${mode}`, orderData);
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

export const BuyNowItemService = async (id, qty) => {
  const response = await api.get(
    `/api/order/buy-now?productId=${id}&quantity=${qty}`,
  );
  return response.data;
};
