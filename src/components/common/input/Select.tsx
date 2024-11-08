import React from "react";
import { Select } from "@chakra-ui/react";

// Define the type for the option
interface Option {
  value: string;
  label: string;
}

// Define the props for the CustomSelect component
interface CustomSelectProps {
  label: string;
  options: Option[];
  placeholder?: string;
  width?: string;
  height?: string;
  border?: string;
  labelStyle?: React.CSSProperties; // Optional style for the label
  placeholderStyle?: React.CSSProperties; // Optional style for the placeholder
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Select an option",
  width = "60px",
  height = "35px",
  border = "1px solid var(--input-color)",
  placeholderStyle,
}) => {
  return (
    <Select
      placeholder={placeholder}
      width={width}
      height={height}
      border={border}
      sx={{
        "&::placeholder": {
          color: placeholderStyle?.color || "gray.500", // Default placeholder color
          fontSize: "12px", // Set the placeholder font size
          marginLeft: "3px",
          paddingLeft: 10,
          ...placeholderStyle,
        },
        fontSize: "15px", // Set the font size for the select input itself
        marginLeft: "3px",
        paddingLeft: 2, // Remove padding from the select input
      }}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default CustomSelect;
