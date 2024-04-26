import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/pages/collection/Banner";
import Collection from "@/pages/collection/Collection";
import Profile from "@/pages/collection/Profile";


export const metadata = {
  title: "Collection Details || XMutant | NFT Marketplace",
};

export default function ClooectionSinglePage({ params }) {
  return (
    <>
      <Header/>
      <main className="pt-[5.5rem] lg:pt-24">
        <Banner />
        <Profile id={params.id} />
        <Collection />
      </main>
      <Footer />
    </>
  );
}
