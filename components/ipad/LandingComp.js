"use client";
import React from "react";
import { ContainerScroll } from "./ContainerScroll";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col overflow-hidden ">
      <div>
        <ContainerScroll
          users={users}
          titleComponent={
            <>
              <h1 className="md:text-[1.5rem] py-7 mb-16 text-black dark:text-white">
                The world's largest digital marketplace for crypto collectibles.
                <br />
                <br />
                <span className="text-2xl md:text-[5rem] font-bold mt-1 leading-none animate-gradient">
                  Buy, sell and collect NFTs.
                </span>
              </h1>
            </>
          }
        />
      </div>
      <div className="flex items-center justify-center py-10 md:items-start md:py-10">
        <div className="flex space-x-4">
          <Link
            href="/create"
            className="w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
          >
            Upload
          </Link>
          <Link
            href="/collections"
            className="rtl:!mr-6 w-36 rounded-full bg-white py-3 px-8 text-center font-semibold text-accent shadow-white-volume transition-all hover:bg-accent-dark hover:text-white hover:shadow-accent-volume"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}

export const users = [
  { 
    name: "Arsito Paul",
    collection: "Arsito's Canvas",
    image: "/img/fakeNFTs/nft1.jpg",
    category: "Art",
  },
  {
    name: "Robert Johnson",
    collection: "Verve",
    image: "/img/fakeNFTs/nft2.jpg",
    category: "Photography",
  },
  {
    name: "Richard Taylor",
    collection: "7 Wonders",
    image: "/img/fakeNFTs/nft3.png",
    category: "Collectible",
  },

  {
    name: "Linda Anderson",
    collection: "Masabi",
    image: "/img/fakeNFTs/nft16.jpg",
    category: "Art",
  },

  {
    name: "Sarah Brown",
    collection: "Wanderlust",
    image: "/img/fakeNFTs/nft5.jpg",
    category: "Art",
  },
  {
    name: "Michael Miller",
    collection: "MichMons",
    image: "/img/fakeNFTs/nft6.jpg",
    category: "Photography",
  },
  {
    name: "Michael Miller",
    collection: "MichMons",
    image: "/img/fakeNFTs/nft7.jpg",
    category: "Photography",
  },
  {
    name: "David White",
    collection: "Dracarys",
    image: "/img/fakeNFTs/nft8.jpg",
    category: "Art",
  },

  {
    name: "Linda Anderson",
    collection: "CryptoUnicorns",
    image: "/img/fakeNFTs/nft9.jpg",
    category: "Art",
  },

  {
    name: "Linda Anderson",
    collection: "Wanderlust",
    image: "/img/fakeNFTs/nft10.jpg",
    category: "Art",
  },

  {
    name: "Gilbert Dayer",
    collection: "Murakami",
    image: "/img/fakeNFTs/nft11.jpg",
    category: "Photography",
  },
  {
    name: "Linda Anderson",
    collection: "CryptoUnicorns",
    image: "/img/fakeNFTs/nft12.jpg",
    category: "Collectible",
  },

  {
    name: "Justin Eversano",
    collection: "Everyday",
    image: "/img/fakeNFTs/nft13.jpg",
    category: "Art",
  },
  {
    name: "Sarah Brown",
    collection: "BasedPunks",
    image: "/img/fakeNFTs/nft14.jpg",
    category: "Collectibles",
  },
  {
    name: "David White",
    collection: "Bored Ape",
    image: "/img/fakeNFTs/nft15.jpg",
    category: "Photography",
  },
];
