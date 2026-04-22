"use client";
import React, { useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTagProducts } from "../../../lib/features/productSlice/product";
import ProductCarousel from "../Carousel/ProductCarousel";

const NewArrivals = () => {
  const dispatch = useDispatch();
  const { tagProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchTagProducts("New Arrivals"));
  }, [dispatch]);

  // Extract products safely
  const arrivalItems =
    tagProducts?.new_arrivals?.result || tagProducts?.result || [];
  return (
    <>
      <ProductCarousel
        title="New Arrivals"
        subtitle="Trending Now"
        products={arrivalItems}
        isLoading={isLoading}
      />
    </>
  );
};

export default memo(NewArrivals);
