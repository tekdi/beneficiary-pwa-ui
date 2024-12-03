import React, { useState } from "react";
import {
  FormControl,
  Input,
  FormErrorMessage,
  Box,
  BoxProps,
} from "@chakra-ui/react";

interface FloatingInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  name?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value = "",
  onChange,
  isInvalid = false,
  errorMessage,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const labelStyles: BoxProps = {
    position: "absolute",
    left: "12px",
    background: "white",
    px: 1,
    zIndex: 100,
    transition: "all 0.2s ease-out",
    pointerEvents: "none",
    top: isFocused || value ? "-10px" : "40%", // Adjust based on focus or value
    color: "gray.500",
    fontSize: isFocused || value ? "0.85rem" : "1rem",
    transform: isFocused || value ? "scale(0.85)" : "translateY(-50%)",
  };

  return (
    <FormControl
      height="90px"
      position="relative"
      mt={2}
      isInvalid={isInvalid && touched} // Show error only if touched
    >
      <Box as="label" htmlFor={name} {...labelStyles}>
        {label}
      </Box>
      <Input
        id={name}
        name={name}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setTouched(true); // Mark as touched on blur
        }}
        onChange={(e) => {
          onChange?.(e);
        }}
        placeholder={isFocused ? "" : label}
        size="md"
        height="60px"
        pl="12px"
        borderColor="var(--input-color)"
        borderWidth="2px"
        _focus={{
          borderColor: "gray.500",
        }}
      />
      {isInvalid && touched && (
        <FormErrorMessage mt={2}>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FloatingInput;
