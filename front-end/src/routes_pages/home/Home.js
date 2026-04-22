import Slider from "@/components/slider/Slider";
import ProductListing from "@/components/listing/ListingProducts";
import ProductCategories from "@/components/productCategories/ProductCategories";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import FlashSaleBanner from "@/components/flashSaleBanner/FlashSaleBanner";
import FeaturesBar from "@/components/featuresBar/FeaturesBar";
import NewArrivals from "@/components/newArrivals/NewArrivals";

export default function HomePage() {
  return (
    <>
      {/* Slider */}
<FlashSaleBanner />
      <Navbar hasBanner />
      <Slider />
      <FeaturesBar/>
      <ProductCategories />
      <NewArrivals/>

      <ProductListing />
      <Footer />
    </>
  );
}
