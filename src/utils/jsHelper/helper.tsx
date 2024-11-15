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
