import Create from "@/components/create/Create";
import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";


export const metadata = {
  title: "Create || Xmutant | NFT Marketplace",
};

export default function CreatePage() {
  return (
    <>
      <Header />
      <main>
        <Create />
      </main>
      <Footer />
    </>
  );
}
