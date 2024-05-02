"use client";
import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import Image from "next/image";
import { useAccount } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { Toaster, toast } from "react-hot-toast";
import ERC721Abi from "@/components/artifacts/NFTFactoryModule#ERC721Clonable.json";
import { ClipLoader } from "react-spinners";

const currencies = [
  {
    id: 1,
    src: "/img/chains/ETH.png",
    alt: "bttc",
    text: "BTTC",
  },
];
const requestOptions = {
  method: "GET",
  redirect: "follow",
};
export default function Create() {
  const [currcentCollection, setCurrcentCollection] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState(currencies[0]);
  const [collections, setCollections] = useState([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [loading, isLoading] = useState();

  const { address } = useAccount();

  const apiKey = "9b83daf8.ccdb11e9c2aa4f2a86f5f771436c7cd2";

  const handleFileUpload = (url) => {
    console.log("URLL from CreateCollection", url);
    setUploadedFileUrl(url);
  };

  const createNFTMetadata = async () => {
    if (!uploadedFileUrl || !name || !description) {
      console.error("Please provide all required fields.");
      return;
    }

    const metadata = {
      name,
      description,
      image: uploadedFileUrl,
      external_url: externalLink,
    };

    try {
      const uploadedMetadata = await lighthouse.uploadText(
        JSON.stringify(metadata),
        apiKey,
        "metadata"
      );
      console.log("Metadata uploaded successfully:", uploadedMetadata);
      toast.success(`Metadata uploaded successfully!`);
      mintNFT(uploadedMetadata.data.Hash);
    } catch (error) {
      console.error("Error uploading metadata:", error);
      toast.error(`Error uploading metadata!`);
    }
  };

  const mintNFT = async (metadataURI) => {
    try {
      isLoading(true);
      if (!currcentCollection) {
        console.error("Please select a collection first.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        currcentCollection.address,
        ERC721Abi.abi,
        signer
      );

      const transaction = await contract.safeMint(
        address,
        `https://gateway.lighthouse.storage/ipfs/${metadataURI}`
      );
      await transaction.wait();
      console.log("NFT minted successfully!");
      toast.success(`NFT minted successfuly🔥`);
      isLoading(false);
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch(
        `/api/get-collections?address=${address}`,
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setCollections(data);
      setCurrcentCollection(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchCollections();
    }
  }, [address]);
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
          Create
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
              value={name}
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
              External link
            </label>
            <p className="mb-3 text-2xs dark:text-jacarta-300">
              We will include a link to this URL on this item's detail page, so
              that users can click to learn more about it. You are welcome to
              link to your own webpage with more details.
            </p>
            <input
              type="url"
              id="item-external-link"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
              placeholder="https://yoursite.io/item/123"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="item-description"
              className="mb-2 block font-display text-jacarta-700 dark:text-white"
            >
              Description
            </label>
            <p className="mb-3 text-2xs dark:text-jacarta-300">
              The description will be included on the item's detail page
              underneath its image. Markdown syntax is supported.
            </p>
            <textarea
              id="item-description"
              className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Provide a detailed description of your item."
            ></textarea>
          </div>

          {/* Collection */}
          <div className="relative mb-6">
            <div>
              <label className="mb-2 block font-display text-jacarta-700 dark:text-white">
                Collection
              </label>
              <div className="mb-3 flex items-center space-x-2">
                <p className="text-2xs dark:text-jacarta-300">
                  This is the collection where your item will appear.
                  <span
                    className="inline-block"
                    data-tippy-content="Moving items to a different collection may take up to 30 minutes."
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
            </div>

            <div className="dropdown my-1 cursor-pointer">
              <div
                className="dropdown-toggle flex items-center justify-between rounded-lg border border-jacarta-100 bg-white py-3 px-3 dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-jacarta-300"
                role="button"
                id="item-collection"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="">Select collection</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-4 w-4 fill-jacarta-500 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
                </svg>
              </div>

              <div
                className="dropdown-menu z-10 hidden w-full whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800"
                aria-labelledby="item-collection"
              >
                <ul className="scrollbar-custom flex max-h-48 flex-col overflow-y-auto">
                  {collections.length > 0 ? (
                    collections.map((collection, i) => (
                      <li
                        key={i}
                        onClick={() => setCurrcentCollection(collection)}
                      >
                        <div
                          className={
                            collection === currcentCollection
                              ? "cursor-pointer dropdown-item flex w-full items-center justify-between rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                              : " cursor-pointer dropdown-item flex w-full items-center rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                          }
                        >
                          <span className="flex items-center space-x-3">
                            <Image
                              width={64}
                              height={64}
                              src={collection.contractUri}
                              alt={collection.name}
                              className="h-8 w-8 rounded-full"
                              loading="lazy"
                            />
                            <span className="text-jacarta-700 dark:text-white">
                              {collection.name} {collection.symbol}
                            </span>
                          </span>
                          {currcentCollection === collection && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              className="mb-[3px] h-4 w-4 fill-accent"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                            </svg>
                          )}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-jacarta-700 dark:text-white">
                      No collections found
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Blockchain */}
          <div className="mb-6">
            <label
              htmlFor="item-supply"
              className="mb-2 block font-display text-jacarta-700 dark:text-white"
            >
              Blockchain
            </label>

            <div className="dropdown relative mb-4 cursor-pointer">
              <div
                className="dropdown-toggle flex items-center justify-between rounded-lg border border-jacarta-100 bg-white py-3.5 px-3 text-base dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white"
                role="button"
                id="item-blockchain"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="flex items-center">
                  <Image
                    width={400}
                    height={400}
                    src={currentCurrency.src}
                    alt="eth"
                    className="mr-2 h-5 w-5 rounded-full"
                  />
                  {currentCurrency.text}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-4 w-4 fill-jacarta-500 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
                </svg>
              </div>

              <div
                className="dropdown-menu z-10 hidden w-full whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800"
                aria-labelledby="item-blockchain"
              >
                {currencies.map((elm, i) => (
                  <button
                    onClick={() => setCurrentCurrency(elm)}
                    key={i}
                    className="dropdown-item flex w-full items-center justify-between rounded-xl px-5 py-2 text-left text-base text-jacarta-700 transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                  >
                    <span className="flex items-center">
                      <Image
                        width={400}
                        height={400}
                        src={elm.src}
                        alt="eth"
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      {elm.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Submit */}
          <button
            onClick={createNFTMetadata}
            className="cursor-default rounded-full bg-accent-lighter py-3 px-8 text-center font-semibold text-white transition-all"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Mint"}
          </button>
        </div>
        <Toaster />
      </div>
    </section>
  );
}
