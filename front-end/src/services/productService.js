import { api } from "./api";
export const getProductsService = async (pageNo, order) => {
  let url = "/product/getproducts";

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
  let url = `/product/getProductCount`;
  if (countFlage && category) {
    url += `?countCategory=${countFlage}&category=${category}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getALLCategoryService = async () => {
  let url = `/product/`;
  const response = await api.get(url);
  return response.data;
};

export const getFilterCategoryService = async (page, category, sort, order) => {
  let url = `/product/getFilterCategory?page=${page}&category=${category}`;
  if (sort && order) {
    url += `&sort=true&order=${order}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getProductDetailService = async (id) => {
  let url = `/product/getProductDetail/${id}`;
  const response = await api.get(url);
  return response.data;
};
