import axios from "axios";

import { getToken } from "../auth/asyncStorage";
import { generateUUID } from "../../utils/jsHelper/helper";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function handleError(error) {
  throw error.response ? error.response.data : new Error("Network Error");
}

export const getAll = async (userData) => {
  try {
    const { token } = await getToken();
    const response = await axios.post(
      `${apiBaseUrl}/content/search`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Login a user
 * @param {Object} loginData - Contains phone_number, password
 */
export const getOne = async ({ id }) => {
  const loginData = {
    context: {
      domain: "onest:financial-support",
      action: "select",
      timestamp: "2023-08-02T07:21:58.448Z",
      ttl: "PT10M",
      version: "1.1.0",
      bap_id: "dev-uba-bap.tekdinext.com",
      bap_uri: "https://dev-uba-bap.tekdinext.com/",
      bpp_id: "dev-uba-bpp.tekdinext.com",
      bpp_uri: "https://dev-uba-bpp.tekdinext.com/",
      transaction_id: generateUUID(),
      message_id: generateUUID(),
    },
    message: {
      order: {
        items: [
          {
            id,
          },
        ],
        provider: {
          id: "BX213573733",
        },
      },
    },
  };
  try {
    const { token } = await getToken();
    const response = await axios.post(`${apiBaseUrl}/select`, loginData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response || {};
  } catch (error) {
    handleError(error);
  }
};

export const applyApplication = async ({ id, context }) => {
  const loginData = {
    context: {
      ...context,
      action: "init",
    },
    message: {
      order: {
        items: [
          {
            id,
          },
        ],
      },
    },
  };
  try {
    const { token } = await getToken();
    const response = await axios.post(`${apiBaseUrl}/init`, loginData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response || {};
  } catch (error) {
    handleError(error);
  }
};

export const confirmApplication = async ({ submission_id, context }) => {
  const data = {
    context: {
      ...context,
      action: "confirm",
      message_id: generateUUID(),
      transaction_id: generateUUID(),
    },
    message: {
      order: {
        provider: {
          id: "79",
          descriptor: {
            name: "",
            images: [],
            short_desc: "",
          },
          rateable: false,
        },
        items: [
          {
            id: "79",
            descriptor: {
              name: "",
              long_desc: "",
            },
            price: {
              currency: "INR",
              value: "Upto Rs.100 per year",
            },
            xinput: {
              required: true,
              form: {
                url: "http://localhost:8001/bpp/public/getAdditionalDetails/1113/5d96c1e2-8963-4e71-8f13-83438d8780e6/1938a8597a944c7884bfa7f20abcdfe4",
                data: {},
                mime_type: "text/html",
                submission_id,
              },
            },
          },
        ],
        fulfillments: [
          {
            id: "",
            type: "SCHOLARSHIP",
            tracking: false,
            customer: {
              person: {
                name: "",
              },
              contact: {
                phone: "",
              },
            },
          },
        ],
      },
    },
  };
  try {
    const { token } = await getToken();
    const response = await axios.post(`${apiBaseUrl}/confirm`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response || {};
  } catch (error) {
    handleError(error);
  }
};

export const createApplication = async (data) => {
  try {
    const { token } = await getToken();
    const response = await axios.post(
      `${apiBaseUrl}/users/user_application`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getApplication = async (filters) => {
  try {
    const { token } = await getToken();
    const response = await axios.post(
      `${apiBaseUrl}/users/user_applications_list`,
      {
        filters,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
