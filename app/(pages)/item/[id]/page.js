"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import ItemDetails from "@/components/pages/item/ItemDetails";
import { useSearchParams } from "next/navigation";

export default function ItemDetailsPage({ params }) {
  const searchParams = useSearchParams();
  const contractAddress = searchParams.get("contractAddress");

  const tokenId = params.id;
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          `/api/get-nft-item?address=${contractAddress}&tokenid=${tokenId}`,
          requestOptions
        );
        const data = await response.json();
        setTokenData(data);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

   

    if (contractAddress && tokenId) {
      fetchTokenData();
    }
  }, [contractAddress, tokenId]);

  return (
    <>
      <Header />
      <main className="mt-24">
        {tokenData ? <ItemDetails tokenData={tokenData} /> : null}
      </main>
      <Footer />
    </>
  );
}
