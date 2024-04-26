import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/components/pages/collection/Banner";
import Profile from "@/components/pages/collection/Profile";
import Collcetions from "@/components/pages/user/Collcetions";


export const metadata = {
  title: "User || Xmutant | NFT Marketplace",
};

export default function UserPage() {
  return (
    <>
      <Header />
      <main className="pt-[5.5rem] lg:pt-24">
        <Banner />
        <Profile />
        <Collcetions />
      </main>
      <Footer />
    </>
  );
}
