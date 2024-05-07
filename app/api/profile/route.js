"use server";
import { connectToDatabase } from "../../../utlis/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    address,
    username,
    bio,
    email,
    twitter,
    instagram,
    website,
    profileImage,
    coverImage,
  } = await req.json();

  // Connect to the MongoDB database
  const client = await connectToDatabase();
  const db = client.db("xmutant");
  const collection = db.collection("users");

  try {
    // Check if the address already exists in the database
    const existingUser = await collection.findOne({ address });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Address already exists",
      });
    }

    // Create a new document
    await collection.insertOne({
      address,
      username,
      bio,
      email,
      twitter,
      instagram,
      website,
      profileImage,
      coverImage,
    });

    // Close the MongoDB connection
    client.close();

    return NextResponse.json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    // Handle any potential errors
    console.error("Error creating profile:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function PUT(req) {
  const {
    address,
    username,
    bio,
    email,
    twitter,
    instagram,
    website,
    profileImage,
    coverImage,
  } = await req.json();

  // Connect to the MongoDB database
  const client = await connectToDatabase();
  const db = client.db("xmutant");
  const collection = db.collection("users");

  try {
    // Check if the address already exists in the database
    const existingUser = await collection.findOne({ address });

    if (!existingUser) {
      // Handle the case where the address doesn't exist
      // For example, you can return an error response
      return NextResponse.json({
        success: false,
        message: "Address does not exist",
      });
    }

    // Construct the update object with only the provided fields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (bio) updateFields.bio = bio;
    if (email) updateFields.email = email;
    if (twitter) updateFields.twitter = twitter;
    if (instagram) updateFields.instagram = instagram;
    if (website) updateFields.website = website;
    if (profileImage) updateFields.profileImage = profileImage;
    if (coverImage) updateFields.coverImage = coverImage;

    // Update the existing document with the new profile information
    await collection.updateOne(
      { address },
      {
        $set: updateFields,
      }
    );

    // Close the MongoDB connection
    client.close();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    // Handle any potential errors
    console.error("Error updating profile:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
