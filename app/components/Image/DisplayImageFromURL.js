import React, { useState, useEffect } from "react";

function DisplayImageFromURL({ imageUrl }) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    fetchImage(imageUrl);
  }, [imageUrl]);

  const fetchImage = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      setImageSrc(objectURL);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return <div>{imageSrc && <img src={imageSrc} alt="Image" />}</div>;
}

export default DisplayImageFromURL;
