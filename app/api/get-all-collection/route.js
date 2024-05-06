"use server";
import Web3 from "web3";
import { NextResponse } from "next/server";
import NFTFactoryABI from "../../../components/artifacts/NFTFactoryModule#NFTFactory.json";
import ERC721ABI from "../../../components/artifacts/NFTFactoryModule#ERC721Clonable.json";

export async function GET() {
  try {
    // Connect to the Ethereum provider using web3.js
    const web3 = new Web3("https://pre-rpc.bt.io/");

    // Get the address of the deployed NFTFactory contract
    const nftFactoryAddress = NFTFactoryABI.address;
    console.log("contract address:::::", nftFactoryAddress);

    // Create an instance of the NFTFactory contract using web3.js
    const nftFactory = new web3.eth.Contract(
      NFTFactoryABI.abi,
      nftFactoryAddress
    );

    // Call the getDeployedContractsByOwner function on the factory contract
    const deployedContracts = await nftFactory.methods
      .getAllDeployedContracts()
      .call();
    console.log(deployedContracts);

    const collections = [];

    // Iterate over the deployed contracts and fetch their details using web3.js
    for (const contractAddress of deployedContracts) {
      const erc721Contract = new web3.eth.Contract(
        ERC721ABI.abi,
        contractAddress
      );

      const name = await erc721Contract.methods.name().call();
      const symbol = await erc721Contract.methods.symbol().call();
      const contractUri = await erc721Contract.methods.contractURI().call();

      const totalSupply = await erc721Contract.methods.totalSupply().call();
      const tokens = [];
      console.log("total supploy", totalSupply);

      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const tokenURI = await erc721Contract.methods.tokenURI(tokenId).call();
        tokens.push({ tokenId, metadataURI: tokenURI });
      }

      collections.push({
        address: contractAddress,
        name,
        symbol,
        contractUri,
        tokens,
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
