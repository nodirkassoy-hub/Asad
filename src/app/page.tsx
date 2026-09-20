import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Production from "@/components/Production";
import Experience3D from "@/components/Experience3D";
import Why from "@/components/Why";
import Applications from "@/components/Applications";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickyOrder from "@/components/StickyOrder";
import ProductDetailModal from "@/components/ProductDetailModal";
import OrderModal from "@/components/OrderModal";
import SearchPalette from "@/components/SearchPalette";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Production />
        <Experience3D />
        <Why />
        <Applications />
        <About />
        <Contact />
      </main>
      <Footer />

      {/* overlays */}
      <ProductDetailModal />
      <OrderModal />
      <SearchPalette />
      <StickyOrder />
    </>
  );
}
