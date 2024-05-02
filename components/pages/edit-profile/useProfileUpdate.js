import React, { useState } from "react";

const useProfileUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (formData) => {
    setIsLoading(true);
    setError(null);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(formData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/profile",
        requestOptions
      );
      const result = await response.text();
      console.log(result);
      // Handle the response as needed
    } catch (error) {
      setError("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
};

export default useProfileUpdate;
