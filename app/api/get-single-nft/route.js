"use server";
import Web3 from "web3";
import { NextResponse } from "next/server";
import ERC721ABI from "../../../components/artifacts/NFTFactoryModule#ERC721Clonable.json";
import MarketPlaceAbi from "@/components/artifacts/NFTMarketplace.json";

export async function GET(req) {
  try {
    // Extract the contract address from the request parameters
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const address = searchParams.get("address");

    // Connect to the Ethereum provider using web3.js
    const web3 = new Web3("https://pre-rpc.bt.io/");

    // Create an instance of the ERC721 contract using web3.js
    const erc721Contract = new web3.eth.Contract(ERC721ABI.abi, address);

    const marketplaceContract = new web3.eth.Contract(
      MarketPlaceAbi.abi,
      MarketPlaceAbi.address
    );

    // Fetch contract details
    const name = await erc721Contract.methods.name().call();
    const symbol = await erc721Contract.methods.symbol().call();
    const contractUri = await erc721Contract.methods.contractURI().call();
    const totalSupplyBigInt = await erc721Contract.methods.totalSupply().call();
    const totalSupply = Number(totalSupplyBigInt); // Convert BigInt to number
    const owner = await erc721Contract.methods.owner().call();
    const tokenIDs = [];

    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
      tokenIDs.push(tokenId.toString()); // Convert BigInt to string
    }

    const totalMintedNFTs = tokenIDs.length;

    const owners = {};

    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
      const owner = await erc721Contract.methods.ownerOf(tokenId).call();
      owners[owner] = true; // Store owner address as key to ensure uniqueness
    }

    const uniqueOwners = Object.keys(owners).length;
    const tokens = [];
    // Iterate over the tokenIds and fetch their details
    // Iterate over the tokenIds and fetch their details
    for (let tokenId = 0; tokenId < Number(totalSupply); tokenId++) {
      const tokenURI = await erc721Contract.methods.tokenURI(tokenId).call();
      const isListed = await marketplaceContract.methods
        .isNFTListed(address, tokenId)
        .call();

      tokens.push({
        tokenId: tokenId.toString(),
        metadataURI: tokenURI,
        isListed,
      });
    }
    const collection = {
      address: address,
      name,
      symbol,
      contractUri,
      tokens,
      totalSupply,
      totalMintedNFTs,
      uniqueOwners,
      owner,
    };

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
