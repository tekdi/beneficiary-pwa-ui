interface DocumentItem {
  descriptor?: {
    code?: string;
  };
  value?: string;
}

const DATE_FORMAT_OPTIONS = {
  day: "numeric",
  month: "long",
  year: "numeric",
} as const;

export function formatDateString(dateString: string): string {
  if (typeof dateString !== "string" || dateString.trim() === "") {
    throw new Error("Invalid input: dateString must be a non-empty string");
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string provided");
  }
  return date.toLocaleDateString("en-GB", DATE_FORMAT_OPTIONS);
}

export const extractMandatoryDocuments = (list: unknown): string[] => {
  if (!Array.isArray(list)) {
    console.error("Expected an array but received:", typeof list);
    return [];
  }

  return list
    .filter(
      (item: DocumentItem) =>
        item?.descriptor?.code === "mandatory-doc" &&
        typeof item.value === "string"
    )
    .map((item) => item.value || "")
    .filter((value) => value !== ""); // Ensure no empty strings in the result
};

interface EligibilityItem {
  descriptor: {
    code: string;
    name: string;
    short_desc: string;
  };
  display: boolean;
  item: string;
}

export const extractEligibilityValues = (
  data: EligibilityItem[] | undefined
): string[] => {
  if (!data || !Array.isArray(data)) {
    throw new Error("Invalid input: expected an array of eligibility items");
  }
  // Extracting the 'value' field from each item in the array
  return data.map((item) => item.item);
};

export function generateUUID(): string {
  if (typeof crypto === "undefined") {
    throw new Error("Crypto API is not available");
  }
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40; // Version 4 +
  array[8] = (array[8] & 0x3f) | 0x80; // Variant 10xxxxxxVariant 10xxxxxx +
  // Convert array to UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return [
    array
      .slice(0, 4)
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""),
    array
      .slice(4, 6)
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""),
    array
      .slice(6, 8)
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""),
    array
      .slice(8, 10)
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""),
    array
      .slice(10)
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""),
  ].join("-");
}

export const hasFiltersInURL = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return [...searchParams.keys()].length > 0;
};

export const getFiltersFromURL = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    "social-eligibility": searchParams.get("social-eligibility") || "",
    "ann-hh-inc": searchParams.get("ann-hh-inc") || "",
    "gender-eligibility": searchParams.get("gender-eligibility") || "",
  };
};

// Utility function to normalize filters
export const normalizeFilters = (filters) => {
  const newFilter = {};
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      newFilter[key] =
        typeof filters[key] === "string"
          ? filters[key].toLowerCase()
          : filters[key];
    }
  });
  return newFilter;
};
const jsonToQueryString = (json) => {
  return (
    "?" +
    Object.keys(json)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
      )
      .join("&")
  );
};

// Function to update URL with filters
export const setQueryParameters = (filters) => {
  const queryString = jsonToQueryString(filters);
  const newUrl =
    window.location.origin + window.location.pathname + queryString;
  window.history.pushState({ path: newUrl }, "", newUrl);
};
/**
 * Parses the document data, replaces forward slashes in doc_data values, and adds a user_id field.
 *
 * @param {Array} documents - Array of document objects
 * @param {string} userId - User ID to add to each document
 * @returns {Array} - Updated documents with parsed doc_data values and added user_id
 */
export function processDocuments(documents, userId) {
  return documents.map((doc) => {
    // Parse the doc_data if it's a string
    const parsedDocData =
      typeof doc.doc_data === "string"
        ? JSON.parse(doc.doc_data)
        : doc.doc_data;

    // Replace forward slashes in values of doc_data
    const updatedDocData = Object.fromEntries(
      Object.entries(parsedDocData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.replace(/\//g, "") : value, // Replace / in values
      ])
    );

    // Remove unwanted fields (doc_id, sso_id, issuer) from top-level of the document
    const { doc_subtype, doc_id, sso_id, issuer, ...docWithoutUnwantedFields } =
      doc;

    // Return updated document with added user_id, doc_name, and imported_from
    return {
      ...docWithoutUnwantedFields, // Spread the remaining fields
      doc_data: {
        ...updatedDocData, // Include updated doc_data
      },
      doc_name: "abc", // Add the new doc_name field
      imported_from: "e-wallet", // Add the new imported_from field
      doc_subtype: "disabilityCertificate",
      user_id: userId, // Add user_id to the document
      doc_datatype: "Application/JSON",
    };
  });
}

export function findDocumentStatus(documents, status) {
  // Iterate through the documents array
  for (let doc of documents) {
    if (doc.doc_subtype === status) {
      // Return true and the doc_verified value for the matched object
      return { matchFound: true, doc_verified: doc.doc_verified };
    }
  }
  // If no match is found
  return { matchFound: false, doc_verified: null };
}
