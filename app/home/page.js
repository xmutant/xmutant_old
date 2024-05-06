"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import Header from "@/components/headers/Header";
import Categories from "@/components/home/Categories";
import Collections from "@/components/home/Collections";
import Hero from "@/components/home/Hero";
import Hotbids from "@/components/home/Hotbids";
import Process from "@/components/home/Process";
import Link from "next/link";
import { useAccount } from "wagmi";
import CreateProfileModel from "@/components/modals/CreateprofileModel";

export default function HomePage() {
  const { address } = useAccount();
  const [showPopup, setShowPopup] = useState(false);
  const currentUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${currentUrl}/api/get-profile?address=${address}`
        );
        const data = await response.json();

        if (data.success === true) {
          setShowPopup(false);
        } else if (data.success === false) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (address) {
      fetchProfile();
    }
  }, [address]);

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
      {showPopup && <CreateProfileModel onClose={() => setShowPopup(false)} />}
    </>
  );
}
