import React, { useState } from "react";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Box,
  Stack,
} from "@chakra-ui/react";

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChange,
  isInvalid = false,
  errorMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const labelStyles = {
    position: "absolute",
    left: "12px",
    background: "white",
    px: 1,
    zIndex: 100,
    transition: "all 0.2s ease-out",
    pointerEvents: "none",
  };

  const focusedLabelStyles = isFocused
    ? {
        top: "-10px",
        color: "blue.500",
        fontSize: "0.85rem",
        transform: "scale(0.85)",
      }
    : {
        top: "34%",
        color: "gray.500",
        fontSize: "1rem",
        transform: "translateY(-50%)",
      };

  const inputStyles = {
    placeholder: isFocused ? "" : label,
    size: "md",
    height: "60px",
    pl: "12px",
    borderColor: "gray.300",
    borderWidth: "2px",
    _focus: {
      borderColor: "blue.500",
    },
  };

  return (
    <FormControl
      height="90px"
      position="relative"
      mt={2}
      isInvalid={isInvalid && touched}
    >
      <Box as="label" htmlFor="name" {...labelStyles} {...focusedLabelStyles}>
        {label}
      </Box>
      <Input
        {...inputStyles}
        id="name"
        onFocus={() => {
          setIsFocused(true);
          setTouched(true);
        }}
        onBlur={() => {
          setIsFocused(value !== "");
        }}
        value={value}
        onChange={(e) => {
          onChange(e);
          if (e.target.value.trim() === "") {
            setTouched(true);
          }
        }}
      />
      {isInvalid && touched && (
        <Stack>
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </Stack>
      )}
    </FormControl>
  );
};

export default FloatingInput;
