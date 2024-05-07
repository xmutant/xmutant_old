"use server";
import Web3 from "web3";
import { NextResponse } from "next/server";
import ERC721ABI from "../../../components/artifacts/NFTFactoryModule#ERC721Clonable.json";
import MarketPlaceAbi from "@/components/artifacts/NFTMarketplace.json";

export async function GET(req) {
  try {
    // Extract the contract address and token ID from the request parameters
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const address = searchParams.get("address");
    const tokenId = searchParams.get("tokenid");

    // Connect to the Ethereum provider using web3.js
    const web3 = new Web3("https://pre-rpc.bt.io/");

    // Create instances of the ERC721 and marketplace contracts using web3.js
    const erc721Contract = new web3.eth.Contract(ERC721ABI.abi, address);
    const marketplaceContract = new web3.eth.Contract(
      MarketPlaceAbi.abi,
      MarketPlaceAbi.address
    );

    // Fetch token details
    const tokenURI = await erc721Contract.methods.tokenURI(tokenId).call();
    const owner = await erc721Contract.methods.ownerOf(tokenId).call();
    const isListed = await marketplaceContract.methods
      .isNFTListed(address, tokenId)
      .call();

    let activityLog = [];
    let highestBid = -1;
    let highestBidder = null;
    let highestBidInEther;

    if (isListed) {
      activityLog = await marketplaceContract.methods
        .getNFTActivityLog(address, tokenId)
        .call();
    }

    // Convert BigInts to regular numbers
    activityLog = activityLog.map((log) => ({
      activityType: Number(log.activityType),
      nftContract: log.nftContract,
      tokenId: Number(log.tokenId),
      price: Number(log.price),
      timestamp: Number(log.timestamp),
      marketId: Number(log.marketId),
      user: log.user,
    }));

    // Find the highest bid and the user who placed it
    for (const log of activityLog) {
      if (log.activityType === 4 && log.price > highestBid) {
        highestBid = log.price;
        highestBidder = log.user;
      }
    }

    // Convert the highest bid to Ether
    highestBidInEther = web3.utils.fromWei(highestBid.toString(), "ether");

    const token = {
      tokenId,
      metadataURI: tokenURI,
      owner,
      address,
      activityLog,
      isListed,
      highestBid,
      highestBidder,
      highestBidInEther,
    };

    return NextResponse.json(token);
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 500 }
    );
  }
}
