import axios from "axios";
import { removeToken } from "./asyncStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
interface UserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface MobileData {
  phoneNumber: string;
  otp: number;
  token: string;
}

export const loginUser = async (loginData: object) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/auth/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the error with specific type if it's an Axios error
      return Promise.reject(error.response.data);
    } else {
      // For other types of errors (like network errors)
      return Promise.reject(new Error("Network Error"));
    }
  }
};

export const logoutUser = async (accessToken: string, refreshToken: string) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/auth/logout`,
      {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await removeToken();
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the error with specific type if it's an Axios error
      return Promise.reject(error.response.data);
    } else {
      // For other types of errors (like network errors)
      return Promise.reject(new Error("Network Error"));
    }
  }
};

export const getUser = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(
      `${apiBaseUrl}/users/get_one/?decryptData=true`,
      {
        headers: {
          Accept: "application/json", // 'application/json' is more specific and commonly used for APIs
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data);
    } else {
      console.log("get user failed");

      return Promise.reject(new Error("Network Error"));
    }
  }
};
export const getUserConsents = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${apiBaseUrl}/users/get_my_consents`, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching consents:", error);
    throw new Error("Error fetching consents");
  }
};
export const sendConsent = async (
  user_id: string | number,
  purpose?: string,
  purpose_text?: string
) => {
  const token = localStorage.getItem("authToken");
  const data = {
    user_id: user_id,
    purpose: purpose,
    purpose_text: purpose_text,
    accepted: true,
  };
  const headers = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(`${apiBaseUrl}/users/consent`, data, {
      headers,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the error with specific type if it's an Axios error
      return Promise.reject(error.response.data);
    } else {
      // For other types of errors (like network errors)
      return Promise.reject(new Error("Network Error"));
    }
  }
};
export const getDocumentsList = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${apiBaseUrl}/content/documents_list`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the documents list data
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the error with specific type if it's an Axios error
      return Promise.reject(error.response.data);
    } else {
      // For other types of errors (like network errors)
      return Promise.reject(new Error("Network Error"));
    }
  }
};
export const getApplicationList = async (
  searchText: string,
  user_id: string | number
) => {
  try {
    const requestBody =
      searchText !== ""
        ? {
            filters: {
              user_id: user_id, // Reference the user_id variable directly
            },
            search: searchText,
          }
        : {
            filters: {
              user_id: user_id, // Reference the user_id variable directly
            },
          };

    // Send the dynamically created requestBody in the axios post request
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
      `${apiBaseUrl}/users/user_applications_list`,
      requestBody, // Use the dynamically created requestBody
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the error with specific type if it's an Axios error
      return Promise.reject(error.response.data);
    } else {
      // For other types of errors (like network errors)
      return Promise.reject(new Error("Network Error"));
    }
  }
};

export const getApplicationDetails = async (applicationId: string | number) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      const response = await axios.get(
        `${apiBaseUrl}/users/user_application/${applicationId}`,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } else {
      console.error("Token not found");
    }
  } catch (error) {
    console.error("Failed to fetch application details:", error);
    throw error;
  }
};
export const sendOTP = async (mobileNumber: string) => {
  try {
    const payload = {
      phoneNumber: mobileNumber,
    };
    const response = await axios.post(`${apiBaseUrl}/otp/send_otp`, payload);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};
export const verifyOTP = async (payload: MobileData) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/otp/verify_otp`, payload);
    console.log(response);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const registerUser = async (userData: UserData) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/auth/register_with_password`,
      userData
    );
    console.log(response);
    return response?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const registerWithPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/auth/register_with_password`,
      userData
    );
    console.log(response.data);

    return response.data; // Handle the response data
  } catch (error) {
    console.log(error);
    console.error(
      "Error during registration:",
      error.response?.data?.message?.[0] || ""
    );
    throw error.response?.data?.message?.[0];
  }
};
