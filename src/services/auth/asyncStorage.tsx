import localforage from "localforage";
import { jwtDecode } from "jwt-decode";

// Function to save tokens
export const saveToken = async (token: string, refreshToken: string) => {
  try {
    await localforage.setItem("userToken", token);
    await localforage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Function to retrieve the token
export const getToken = async (): Promise<{
  token: string | unknown;
  refreshToken: string | null;
} | null> => {
  try {
    const token = await localforage.getItem("userToken");
    const refreshToken = await localforage.getItem("refreshToken");
    if (token && refreshToken) {
      return { token: token as string, refreshToken: refreshToken as string };
    } else {
      return null; // Return null if either token or refreshToken is not found
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null; // Return null if there's an error
  }
};

// Function to remove tokens
export const removeToken = async (): Promise<void> => {
  try {
    await localforage.removeItem("userToken");
    await localforage.removeItem("refreshToken");
  } catch (error) {
    console.error("Error removing tokens:", error);
  }
};

interface JwtPayload {
  sub: string;
  // other properties of the decoded token
}

export const getTokenData = async (): Promise<JwtPayload | null> => {
  const tokenResponse = await getToken();
  if (tokenResponse && tokenResponse.token) {
    try {
      const decoded = jwtDecode<JwtPayload>(tokenResponse.token as string); // Type assertion here
      return decoded;
    } catch (e) {
      console.error("Error decoding token:", e);
      return null; // Return null if there's an error
    }
  } else {
    return null; // Return null if no token is available
  }
};
