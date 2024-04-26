import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import ItemDetails from "@/components/pages/item/ItemDetails";

export const metadata = {
  title: "Item Details || Xmutant | NFT Marketplace",
};

export default function ItemDetailsPage({ params }) {
  return (
    <>
      <Header />
      <main className="mt-24">
        <ItemDetails id={params.id} />
      </main>
      <Footer />
    </>
  );
}
