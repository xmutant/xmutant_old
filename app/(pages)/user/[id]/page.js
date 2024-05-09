"use client";
import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/components/pages/user/Banner";
import { useEffect, useState } from "react";

import Collcetions from "@/components/pages/user/Collcetions";
import Profile from "@/components/pages/user/Profile";
import { useAccount } from "wagmi";

// export const metadata = {
//   title: "User || Xmutant | NFT Marketplace",
// };

export default function UserPage() {
  const [item, setItem] = useState();
  const { address } = useAccount();
  const currentUrl = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          `/api/get-nfts?address=${address}`,
          requestOptions
        );
        const data = await response.json();
        console.log("data from userrrrrrr:::::", data);
        setItem(data);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    if (address) {
      fetchTokenData();
    }
  }, [address]);
  return (
    <>
      <Header />
      <main className="pt-[5.5rem] lg:pt-24">
        {item ? <Banner item={item} /> : null}
        {item ? <Profile item={item} /> : null}
        {item ? <Collcetions item={item} /> : null}
      </main>
      <Footer />
    </>
  );
}
