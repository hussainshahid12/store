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

export const getProductCountService = async (countFlage, category) => {
  let url = `/products/getProductCount`;
  if (countFlage && category) {
    url += `?countCategory=${countFlage}&category=${category}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getALLCategoryService = async () => {
  const response = await api.get(`/products/`);
  return response.data;
};

export const getFilterCategoryService = async (page, category) => {
  const response = await api.get(
    `/products/getFilterCategory?page=${page}&category=${category}`
  );
  return response.data;
};
