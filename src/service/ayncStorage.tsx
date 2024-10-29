import localforage from "localforage";
import { jwtDecode } from "jwt-decode";

// Function to save tokens
export const saveToken = async (token, refreshToken) => {
  // Corrected syntax
  try {
    await localforage.setItem("userToken", token);
    await localforage.setItem("refreshToken", refreshToken);
    console.log("Tokens saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Function to retrieve the token
export const getToken = async () => {
  try {
    const token = await localforage.getItem("userToken");
    const refreshToken = await localforage.getItem("refreshToken");
    if (token !== null && refreshToken !== null) {
      return { token, refreshToken };
    } else {
      return null; // Return null if no token found
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
};

// Function to remove tokens
export const removeToken = async () => {
  try {
    await localforage.removeItem("userToken"); // Remove userToken
    await localforage.removeItem("refreshToken"); // Remove refreshToken
  } catch (error) {
    console.error("Error removing tokens:", error);
  }
};

export const getTokenData = async () => {
  const { token } = await getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (e) {
      return {};
    }
  }
};
