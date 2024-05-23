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
            <div className="mb-4 lg:mb-16">
              <h1 className="text-2xl md:text-[1.5rem] py-9 mb-4  text-black dark:text-white">
                The world's largest digital marketplace for crypto collectibles.
                <br />
                <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none text-black dark:text-white">
                  Buy, sell and collect NFTs.
                </span>
              </h1>
              <div className="flex items-center justify-center py-2 md:items-start md:py-10 lg:py-6">
                <div className="flex space-x-4">
                  <Link
                    href="/create"
                    className="w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                  >
                    Create
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
          }
        />
      </div>
    </div>
  );
}

export const users = [
  {
    name: "Chimera Paul",
    collection: "Arsito",
    image: "/img/fakeNFTs/nft1.png",
    category: "Art",
  },
  {
    name: "Robert Johnson",
    collection: "Bad Luck",
    image: "/img/fakeNFTs/nft2.png",
    category: "Photography",
  },
  {
    name: "Richard Taylor",
    collection: "The Spiral",
    image: "/img/fakeNFTs/nft12.png",
    category: "Collectible",
  },

  {
    name: "Linda Anderson",
    collection: "The End",
    image: "/img/fakeNFTs/nft5.png",
    category: "Collectible",
  },

  {
    name: "Sarah Brown",
    collection: "BasedPunks",
    image: "/img/fakeNFTs/nft11.png",
    category: "Collectibles",
  },
  {
    name: "Michael Miller",
    collection: "Mochimons",
    image: "/img/fakeNFTs/nft10.png",
    category: "Art",
  },
  {
    name: "Justin Eversano",
    collection: "Dackie on Base",
    image: "/img/fakeNFTs/nft12.png",
    category: "Collectible",
  },
  {
    name: "David White",
    collection: "Metropolis",
    image: "/img/fakeNFTs/nft13.png",
    category: "Collectible",
  },

  {
    name: "Linda Anderson",
    collection: "CryptoUnicorns",
    image: "/img/fakeNFTs/nft9.jpg",
    category: "Collectible",
  },

  {
    name: "Linda Anderson",
    collection: "Chimera",
    image: "/img/fakeNFTs/nft6.jpg",
    category: "Collectible",
  },

  {
    name: "Gilbert Dayer",
    collection: "Murakami",
    image: "/img/fakeNFTs/nft8.jpg",
    category: "Collectible",
  },
  {
    name: "Linda Anderson",
    collection: "CryptoUnicorns",
    image: "/img/fakeNFTs/nft9.jpg",
    category: "Collectible",
  },

  {
    name: "Justin Eversano",
    collection: "Everyday",
    image: "/img/fakeNFTs/nft4.jpg",
    category: "Photography",
  },
  {
    name: "Sarah Brown",
    collection: "BasedPunks",
    image: "/img/fakeNFTs/nft11.png",
    category: "Collectibles",
  },
  {
    name: "David White",
    collection: "Bored Ape",
    image: "/img/fakeNFTs/nft15.png",
    category: "Collectible",
  },
];
