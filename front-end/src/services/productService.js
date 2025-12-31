import { api } from "./api";
export const getProductsService = async (pageNo, order) => {
  let url = "/products/getproducts";

  if (pageNo) {
    url += `?page=${pageNo}`;
    if (order) {
      url += `&sort=price&order=${order}`;
    }
  }

  const response = await api.get(url);
  return response.data;
};

export const getProductCountService = async () => {
  const response = await api.get(`/products/getProductCount`);
  return response.data;
};

export const getALLCategoryService = async () => {
  const response = await api.get(`/products/`);
  return response.data;
};
