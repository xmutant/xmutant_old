import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Categories from "@/components/home/Categories";
import Collections from "@/components/home/Collections";
import Hero from "@/components/home/Hero";
import Hotbids from "@/components/home/Hotbids";
import Process from "@/components/home/Process";

export const metadata = {
  title: "XMutant | NFT Marketplace",
  description: "Generative Art NFT Marketplace",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Hotbids />
        <Collections />
        <Categories />
        <Process />
      </main>
      <Footer />
    </>
  );
}
