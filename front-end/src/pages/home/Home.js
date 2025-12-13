import Slider from "@/components/slider/Slider";
import ProductListing from "@/components/listing/ListingProducts";
import ProductCategories from "@/components/productCategories/ProductCategories";

export default function HomePage() {
  return (
    <>
      {/* Slider */}
      <Slider />
      <ProductCategories />

      <ProductListing />
    </>
  );
}
