import localforage from "localforage";
import { jwtDecode } from "jwt-decode";

// Function to save tokens
export const saveToken = async (
  token: string,
  refreshToken: string
): Promise<void> => {
  try {
    await localforage.setItem("userToken", token);
    await localforage.setItem("refreshToken", refreshToken);
    console.log("Tokens saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
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
export const removeToken = async (): Promise<void> => {
  try {
    await Promise.all([
      localforage.removeItem("userToken"),
      localforage.removeItem("refreshToken"),
    ]);
  } catch (error) {
    console.error("Error removing tokens:", error);
    throw error;
  }
};

export const getTokenData = async (): Promise<JwtPayload | null> => {
  const tokenPair = await getToken();
  if (!tokenPair) {
    return null;
  }
  const { token } = tokenPair;
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
};
