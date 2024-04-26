
import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/pages/edit-profile/Banner";
import EditProfile from "@/pages/edit-profile/EditProfile";


export const metadata = {
  title: "Edit Profile || Xmutant | NFT Marketplace",
};

export default function EditProfilePage() {
  return (
    <>
      <Header/>
      <main className="pt-[5.5rem] lg:pt-24">
        <Banner />
        <EditProfile />
      </main>
      <Footer />
    </>
  );
}
