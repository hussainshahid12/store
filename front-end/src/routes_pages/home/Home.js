import Slider from "@/components/slider/Slider";
import ProductListing from "@/components/listing/ListingProducts";
import ProductCategories from "@/components/productCategories/ProductCategories";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <>
      {/* Slider */}

      <Navbar />
      <Slider />
      <ProductCategories />

      <ProductListing />
      <Footer/>
    </>
  );
}
