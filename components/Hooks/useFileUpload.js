import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";

const useFileUpload = (apiKey) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = async (file) => {
    setIsUploading(true);
    setError(null);
    console.log("file from hook:::::", file);
    const apiKey = "9b83daf8.ccdb11e9c2aa4f2a86f5f771436c7cd2";

    try {
      if (file) {
        console.log("File:::::::::::::::::::::::::::::", file);
        const output = await lighthouse.upload(file, apiKey);
        console.log("File Status:", output);
        setUploadedFileUrls([
          "https://gateway.lighthouse.storage/ipfs/" + output.data.Hash,
        ]); // Set uploaded file URL directly
      }
    } catch (error) {
      setError("Failed to upload file");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFiles, uploadProgress, uploadedFileUrls, isUploading, error };
};

export default useFileUpload;
