"use server";
import { connectToDatabase } from "../../../utlis/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const address = searchParams.get("address");

  // Connect to the MongoDB database
  const client = await connectToDatabase();
  const db = client.db("xmutant");
  const collection = db.collection("users");

  try {
    // Find the user profile with the provided address
    const userProfile = await collection.findOne({ address });

    if (!userProfile) {
      // Handle the case where the user profile with the given address doesn't exist
      return NextResponse.json({
        success: false,
        status: 404,
        message: "User profile not found",
      });
    }

    // Close the MongoDB connection
    client.close();

    // Return the user profile with success status
    return NextResponse.json({
      success: true,
      userProfile,
    });
  } catch (error) {
    // Handle any potential errors
    console.error("Error fetching user profile:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
}
