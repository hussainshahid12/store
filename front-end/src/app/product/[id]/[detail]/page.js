import React from "react";
import ProductDetail from "@/pages/productDetail/ProductDetail";

const page = async ({ params }) => {
  const slug = await params;
  console.log("id", slug.id);
  return (
    <>
      <ProductDetail slug={slug}  />
    </>
  );
};

export default page;
