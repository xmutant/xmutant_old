// useFileUpload.js
import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";

const useNewFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = async (file) => {
    setIsUploading(true);
    setError(null);

    try {
      if (file) {
        const output = await lighthouse.upload(
          file,
          process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY
        );
        setUploadedFileUrls((prevUrls) => [
          ...prevUrls,
          "https://gateway.lighthouse.storage/ipfs/" + output.data.Hash,
        ]);
        return ["https://gateway.lighthouse.storage/ipfs/" + output.data.Hash];
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

export default useNewFileUpload;
