import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  width?: string;
  height?: string;
  border?: string;
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
