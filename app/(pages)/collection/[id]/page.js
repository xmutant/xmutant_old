"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Banner from "@/components/pages/collection/Banner";
import Collection from "@/components/pages/collection/Collection";
import Profile from "@/components/pages/collection/Profile";
// import { items } from "@/data/item";
import { useState, useEffect } from "react";

// export const metadata = {
//   title: "Collection Details || XMutant | NFT Marketplace",
// };

export default function CollectionSinglePage({ params }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/get-single-nft?address=${params.id}`
        );
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  console.log("itemmmmm::", item);

  return (
    <>
      <Header />
      <main className="pt-[5.5rem] lg:pt-24">
        {item ? <Profile id={params.id} item={item} /> : null}
        {item ? <Collection id={params.id} item={item} /> : null}
      </main>
      <Footer />
    </>
  );
}
