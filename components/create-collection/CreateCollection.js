/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import FileUpload from "./FileUpload";
import Image from "next/image";
import { ethers } from "ethers";
import NFTFactoryABI from "@/components/artifacts/NFTFactoryModule#NFTFactory.json";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function CreateCollection() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [royaltyFee, setRoyaltyFee] = useState("");
  const [contractURI, setContractURI] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (url) => {
    console.log("URLL from CreateCollection", url);
    setUploadedFileUrl(url);
  };

  const createCollection = async () => {
    try {
      setIsLoading(true);

      // Connect to the Ethereum provider (e.g., MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Get the address of the deployed NFTFactory contract
      const nftFactoryAddress = NFTFactoryABI.address;

      // Create an instance of the NFTFactory contract
      const nftFactory = new ethers.Contract(
        nftFactoryAddress,
        NFTFactoryABI.abi,
        signer
      );
      console.log("urlllllllll::::::", uploadedFileUrl);

      // Call the createERC721Collection function on the factory contract
      const tx = await nftFactory.createERC721Collection(
        name,
        symbol,
        await signer.getAddress(),
        maxSupply,
        royaltyFee,
        uploadedFileUrl
      );

      // Wait for the transaction to be mined
      await tx.wait();

      toast.success(`${name} collection created successfully!`);
    } catch (error) {
      console.error("Error creating ERC721 collection:", error);
      toast.error("Error creating ERC721 collection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-24">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          width={1920}
          height={789}
          src="/img/gradient_light.jpg"
          priority
          alt="gradient"
          className="h-full w-full"
        />
      </picture>
      <div className="container">
        <h1 className="py-16 text-center font-display text-4xl font-medium text-jacarta-700 dark:text-white">
          Create Collection
        </h1>

        <div className="mx-auto max-w-[48.125rem]">
          {/* File Upload */}
          <FileUpload onFileUpload={handleFileUpload} />

          {/* Name */}
          <div className="mb-6">
            <label
              htmlFor="item-name"
              className="mb-2 block font-display text-jacarta-700 dark:text-white"
            >
              Name<span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="item-name"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
              placeholder="Item name"
              required
            />
          </div>

          {/* External Link */}
          <div className="mb-6">
            <label
              htmlFor="item-external-link"
              className="mb-2 block font-display text-jacarta-700 dark:text-white"
            >
              Token symbol
            </label>
            <p className="mb-3 text-2xs dark:text-jacarta-300">
              The token symbol is the shorthand way to identify your contract,
              which is visible on chain. For example, Azuki uses AZUKI and Bored
              Ape Yacht Club uses BAYC as their respective token symbols.
            </p>
            <input
              type="text"
              id="item-external-link"
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
              placeholder="eg.. 1, 2, 100"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="item-royalty-fee"
              className="mb-2 block font-display text-jacarta-700 dark:text-white"
            >
              Royalty Fee (in basis points)
            </label>
            <input
              type="number"
              id="item-royalty-fee"
              value={royaltyFee}
              onChange={(e) => setRoyaltyFee(e.target.value)}
              className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
              placeholder="e.g., 500 for 5%"
            />
          </div>

          {/* Supply */}
          <div className="mb-6">
            <label
              htmlFor="item-supply"
              className="mb-2 block font-display text-jacarta-700 dark:text-white"
            >
              Supply
            </label>

            <div className="mb-3 flex items-center space-x-2">
              <p className="text-2xs dark:text-jacarta-300">
                The number of items that can be minted. No gas cost to you!
                <span
                  className="inline-block"
                  data-tippy-content="Setting your asset as explicit and sensitive content, like pornography and other not safe for work (NSFW) content, will protect users with safe search while browsing Xmutant."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="ml-1 -mb-[3px] h-4 w-4 fill-jacarta-500 dark:fill-jacarta-300"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"></path>
                  </svg>
                </span>
              </p>
            </div>
            <input
              type="number"
              id="item-supply"
              onChange={(e) => setMaxSupply(e.target.value)}
              className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
              placeholder="1"
            />
          </div>

          {/* Submit */}
          <button
            className="cursor-default rounded-full bg-accent py-3 px-8 text-center font-semibold text-white transition-all"
            onClick={() => createCollection()}
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="white" /> : "Create"}
          </button>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
