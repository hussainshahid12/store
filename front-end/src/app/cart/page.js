import React from "react";
import CartPage from "@/routes_pages/cart/cart";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
const page = () => {
  return (
    <>
      <Navbar />
      <CartPage />
      <Footer/>
    </>
  );
};

export default page;
