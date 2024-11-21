import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const uploadUserDocuments = async (documents) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.post(
      `${apiBaseUrl}/users/wallet/user_docs`,
      documents,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return response data
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading documents:",
      error.response || error.message
    );
    throw error; // Rethrow error to handle it in the calling code
  }
};
