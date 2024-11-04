import React, { useState } from "react";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Box,
  Stack,
  BoxProps,
} from "@chakra-ui/react";

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  name: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  onChange,
  isInvalid = false,
  errorMessage,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  // Label styles with BoxProps type
  const labelStyles: BoxProps = {
    position: "absolute",
    left: "12px",
    background: "white",
    px: 1,
    zIndex: 100,
    transition: "all 0.2s ease-out",
    pointerEvents: "none",
    top: isFocused ? "-10px" : "40%", // Dynamic top value based on focus
    color: isFocused ? "blue.500" : "gray.500",
    fontSize: isFocused ? "0.85rem" : "1rem",
    transform: isFocused ? "scale(0.85)" : "translateY(-50%)",
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
        name={name}
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
        <Stack spacing={1} mt={1}>
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </Stack>
      )}
    </FormControl>
  );
};

export default FloatingInput;
