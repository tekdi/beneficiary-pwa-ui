import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

// Define the type for the option
interface Option {
  label: string;
  placeholder: string;
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

const CustomDisableInput: React.FC<CustomSelectProps> = ({
  label,
  placeholder,
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor="email">{label}</FormLabel>
      <InputGroup>
        <Input id="email" placeholder={placeholder} disabled />
        <InputRightElement children={<CheckIcon color="green.500" />} />
      </InputGroup>
    </FormControl>
  );
};

export default CustomDisableInput;
