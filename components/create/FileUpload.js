"use client";
import React, { useState } from "react";
import useNewFileUpload from "../Hooks/useNewFileUpload";

export default function FileUpload({
  setImageUrl,
  imageUrl,
  setFile,
  file,
  errorDisplay,
  errors,
}) {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  // Import the useFileUpload hook

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    console.log(file);
    if (file) {
      setFile(file);
      try {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setFileName(file.name);
        // // Upload the file using the uploadFiles function from the hook
        // const urls = await uploadFiles([file]);
        // // Pass the URL to the parent component
        // console.log("file from importHook", uploadedFileUrls);
        // console.log("urls from File Upload", urls);
        // onFileUpload(urls[0]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      try {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setFileName(file.name);
        // Upload the file using the uploadFiles function from the hook
        // const [url] = await uploadFiles([file]); // Destructure the return value to get the URL
        // // Pass the URL to the parent component
        // onFileUpload(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  const truncateFileName = (name, maxLength = 15) => {
    if (name.length <= maxLength) {
      return name;
    }
    const ext = name.split(".").pop();
    const truncated =
      name.substring(0, maxLength - ext.length - 3) + "..." + ext;
    return truncated;
  };

  const handleRemoveImageClick = () => {
    setFileName(null);
    setImageUrl(null);
    setFile(null);
  };
  return (
    <div className="mb-6 w-full">
      <label className="mb-2 block font-display text-jacarta-700 dark:text-white">
        Image, Video, Audio, or 3D Model<span className="text-red">*</span>
      </label>
      <p className="mb-3 text-2xs dark:text-jacarta-300">
        {!imageName ? (
          "Drag or choose your file to upload"
        ) : (
          <span className="text-green">Successfully Uploaded {imageName}</span>
        )}
      </p>
      {imageUrl ? (
        <div className="group relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-jacarta-100 bg-white py-10 px-5 text-center dark:border-jacarta-600 dark:bg-jacarta-700">
          <img src={imageUrl} alt="Uploaded File" className="w-3/12" />
          <p className="text-center mt-2 text-sm text-gray-700">
            {truncateFileName(fileName)}
          </p>
          <button
            className="w-36 rounded-full bg-accent mt-3 py-2 px-3 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
            onClick={handleRemoveImageClick}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragging
              ? "2px dashed #000"
              : errorDisplay && errors.file
              ? "2px dashed #FF494A"
              : "",
            borderRadius: "5px",
          }}
          className="group relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-jacarta-100 bg-white py-20 px-5 text-center dark:border-jacarta-600 dark:bg-jacarta-700"
        >
          <>
            <div className="relative z-10 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="mb-4 inline-block fill-jacarta-500 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
              </svg>
              <p className="mx-auto max-w-xs text-xs dark:text-jacarta-300">
                JPG, PNG, GIF, WEBP, MP4 or MP3. Max size: 30 MB
              </p>
            </div>
            <div className="absolute inset-4 cursor-pointer rounded bg-jacarta-50 opacity-0 group-hover:opacity-100 dark:bg-jacarta-600"></div>
          </>

          <div></div>
          <input
            type="file"
            accept="image/*,video/*,audio/*,webgl/*,.glb,.gltf"
            id="file-upload"
            onChange={handleImageChange}
            className="absolute inset-0 z-20 cursor-pointer opacity-0"
          />
        </div>
      )}
      {/* Display uploaded file URLs */}
      {/* {uploadedFileUrls.map((url) => (
        <div key={url}>Uploaded File: {url}</div>
      ))} */}
      {/* Display upload status */}
      {/* {isUploading && <div>Uploading...</div>} */}
      {/* Display error message */}
      {/* {error && <div>Error: {error}</div>} */}
      {errorDisplay && errors?.file && (
        <p className="text-[#FF494A]">{errors.file}</p>
      )}
    </div>
  );
}
