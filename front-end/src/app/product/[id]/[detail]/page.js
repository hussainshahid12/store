import React from "react";
import ProductDetail from "@/routes_pages/productDetail/ProductDetail"; // Ensure this path is correct
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

const Page = async ({ params }) => {
  // Await params in Next.js 15+
  const slug = await params;

  return (
    <>
      <Navbar />
      <main>
        <ProductDetail slug={slug} />
      </main>
      <Footer/>
    </>
  );
};

export default Page;