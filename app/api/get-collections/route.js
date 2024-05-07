"use server";
import { NextResponse } from "next/server";
import Web3 from "web3";
import NFTFactoryABI from "../../../components/artifacts/NFTFactoryModule#NFTFactory.json";
import ERC721ABI from "../../../components/artifacts/NFTFactoryModule#ERC721Clonable.json";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const address = searchParams.get("address");

    // Connect to the Ethereum provider (e.g., Infura, Alchemy, etc.)
    const provider = new Web3.providers.HttpProvider("https://pre-rpc.bt.io/");
    const web3 = new Web3(provider);

    // Get the address of the deployed NFTFactory contract
    const nftFactoryAddress = NFTFactoryABI.address;
    console.log("contract address:::::", nftFactoryAddress);

    // Create an instance of the NFTFactory contract
    const nftFactory = new web3.eth.Contract(
      NFTFactoryABI.abi,
      nftFactoryAddress
    );

    // Call the getDeployedContractsByOwner function on the factory contract
    const deployedContracts = await nftFactory.methods
      .getDeployedContractsByOwner(address)
      .call();

    console.log(deployedContracts);

    const collections = [];

    // Iterate over the deployed contracts and fetch their details
    for (const contractAddress of deployedContracts) {
      const erc721Contract = new web3.eth.Contract(
        ERC721ABI.abi,
        contractAddress
      );

      const name = await erc721Contract.methods.name().call();
      const symbol = await erc721Contract.methods.symbol().call();
      const contractUri = await erc721Contract.methods.contractURI().call();

      collections.push({
        address: contractAddress,
        name,
        symbol,
        contractUri,
      });
    }

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
