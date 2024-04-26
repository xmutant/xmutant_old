import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Collections from "@/components/pages/Collections";


export const metadata = {
  title: "Collcetions || XMutant | NFT Marketplace",
};

export default function CollectionsPage() {
  return (
    <>
      <Header />
      <main>
        <Collections />
      </main>
      <Footer/>
    </>
  );
}
