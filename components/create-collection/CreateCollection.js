/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { ethers } from "ethers";
import NFTFactoryABI from "@/components/artifacts/NFTFactoryModule#NFTFactory.json";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import FileUpload from "../create/FileUpload";
import { formSchema } from "./formSchema";

export default function CreateCollection() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxSupply, setMaxSupply] = useState(0);
  const [royaltyFee, setRoyaltyFee] = useState(0);
  const [file, setFile] = useState(null);
  const [contractURI, setContractURI] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState();
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileUpload = (url) => {
    console.log("URLL from CreateCollection", url);
    setUploadedFileUrl(url);
  };

  // const { uploadFiles, uploadedFileUrls, isUploading, error } =
  //   useNewFileUpload();

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
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorDisplay(false);

    const formData = { name, symbol, royaltyFee, maxSupply, file };

    try {
      formSchema.parse(formData);
      // If validation passes, you can proceed with form submission
      console.log("Form submitted successfully", formData);
    } catch (err) {
      console.log(err.formErrors);
      setErrors(err.formErrors.fieldErrors);
      setErrorDisplay(true);
    }
  };

  useEffect(() => {
    if (name || symbol || maxSupply || file || royaltyFee) {
      setErrors({});
      setErrorDisplay(false);
    }

    return () => {
      // second;
      setErrors({});
      setErrorDisplay(true);
    };
  }, [name, symbol, maxSupply, file, royaltyFee]);

  return (
    <section className="relative py-24">
      <form onSubmit={handleSubmit}>
        <div className="container">
          <h1 className="py-16 text-center font-display text-4xl font-medium text-jacarta-700 dark:text-white">
            Create Collection
          </h1>

          <div className="mx-auto max-w-[48.125rem]">
            {/* File Upload */}
            <FileUpload
              errorDisplay={errorDisplay}
              errors={errors}
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              file={file}
              setFile={setFile}
            />

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
                style={{
                  border:
                    errorDisplay && errors.name ? "1px solid #FF494A" : "",
                }}
              />
              {errorDisplay && errors?.name && (
                <p className="text-[#FF494A]">{errors.name}</p>
              )}
            </div>

            {/* External Link */}
            <div className="mb-6">
              <label
                htmlFor="item-external-link"
                className="mb-2 block font-display text-jacarta-700 dark:text-white"
              >
                Token symbol<span className="text-red">*</span>
              </label>
              <p className="mb-3 text-2xs dark:text-jacarta-300">
                The token symbol is the shorthand way to identify your contract,
                which is visible on chain. For example, Azuki uses AZUKI and
                Bored Ape Yacht Club uses BAYC as their respective token
                symbols.
              </p>
              <input
                type="text"
                id="item-external-link"
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
                placeholder="Enter token symbol"
                style={{
                  border:
                    errorDisplay && errors?.symbol ? "1px solid #FF494A" : "",
                }}
              />
              {errorDisplay && errors?.symbol && (
                <p className="text-[#FF494A]">{errors.symbol}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="item-royalty-fee"
                className="mb-2 block font-display text-jacarta-700 dark:text-white"
              >
                Royalty Fee
                <span className="font-display text-jacarta-500 dark:text-slate dark:text-gray-400 ml-2">
                  (%)
                </span>
              </label>
              <input
                type="number"
                id="item-royalty-fee"
                onChange={(e) => setRoyaltyFee(e.target.value)}
                className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
                placeholder="10"
                style={{
                  border:
                    errorDisplay && errors?.royaltyFee
                      ? "1px solid #FF494A"
                      : "",
                }}
              />
              {errorDisplay && errors?.royaltyFee && (
                <p className="text-[#FF494A]">{errors.royaltyFee}</p>
              )}
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
                style={{
                  border:
                    errorDisplay && errors?.maxSupply
                      ? "1px solid #FF494A"
                      : "",
                }}
              />
              {errorDisplay && errors?.maxSupply && (
                <p className="text-[#FF494A]">{errors.maxSupply}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="cursor-default rounded-full bg-accent py-3 px-8 text-center font-semibold text-white transition-all"
              // onClick={() => createCollection()}
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={20} color="white" /> : "Create"}
            </button>
          </div>
        </div>
      </form>
      <Toaster />
    </section>
  );
}
