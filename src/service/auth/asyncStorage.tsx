import localforage from "localforage";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Function to save tokens
interface TokenPair {
  token: string;
  refreshToken: string;
}
export const saveToken = async (
  token: string,
  refreshToken: string
): Promise<void> => {
  if (!token || !refreshToken) {
    throw new Error("Invalid tokens provided");
  }
  try {
    await localforage.setItem("userToken", token);
    await localforage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

// Function to retrieve the token

export const getToken = async (): Promise<{
  token: string;
  refreshToken: string;
} | null> => {
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
    throw error;
  }
  return null;
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
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        console.error("Token missing expiration");
        return null;
      }
      if (decoded.exp * 1000 < Date.now()) {
        console.error("Token expired");
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
};
