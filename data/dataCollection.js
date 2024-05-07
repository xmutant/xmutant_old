"use client";
// data/collections.js
export const collections = []; // Initialize an empty array

const currentUrl = process.env.NEXT_PUBLIC_URL;

// Fetch data from the API and store it in the `collections` array
fetch(`${currentUrl}/api/get-all-collection`, {
  method: "GET",
  redirect: "follow",
})
  .then((response) => response.json())
  .then((data) => {
    const metadataPromises = [];

    data.forEach((collection) => {
      const { address, name, symbol, contractUri, tokens } = collection;
      const ownerName = symbol; // Assuming the symbol represents the owner name
      const avatar = "/images/avatars/avatar.jpg"; // Placeholder avatar image

      const tokenMetadataPromises = tokens.map((token) => {
        const metadataURI = token.metadataURI;
        return fetch(metadataURI)
          .then((response) => response.json())
          .then((metadata) => {
            const { name, description, image, external_url } = metadata;
            return {
              tokenId: token.tokenId,
              name,
              description,
              image,
              external_url,
            };
          })
          .catch((error) =>
            console.error(`Error fetching metadata for ${metadataURI}:`, error)
          );
      });

      metadataPromises.push(
        Promise.all(tokenMetadataPromises).then((tokenMetadata) => {
          const formattedCollection = {
            id: address,
            name,
            ownerName,
            avatar,
            itemCount: tokens.length,
            images: tokenMetadata.map((metadata) => metadata.image),
            tokenMetadata,
          };
          return formattedCollection;
        })
      );
    });

    Promise.all(metadataPromises)
      .then((formattedCollections) => {
        formattedCollections.forEach((collection) =>
          collections.push(collection)
        );
      })
      .catch((error) => console.error("Error fetching metadata:", error));
  })
  .catch((error) => console.error(error));
