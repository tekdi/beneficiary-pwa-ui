import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  BoxProps,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface FloatingPasswordInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  name?: string;
}

const FloatingPasswordInput: React.FC<FloatingPasswordInputProps> = ({
  label = "Password",
  value = "",
  onChange,
  isInvalid = false,
  errorMessage,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleClick = () => setShowPassword(!showPassword);

  // Dynamic label styles
  const labelStyles: BoxProps = {
    position: "absolute",
    left: "12px",
    bg: "white",
    px: 1,
    zIndex: 100,
    transition: "all 0.2s ease-out",
    pointerEvents: "none",
    top: isFocused || value ? "-10px" : "32%", // Adjust position based on focus or value
    color: "gray.500",
    fontSize: isFocused || value ? "0.85rem" : "1rem",
    transform: isFocused || value ? "scale(0.85)" : "translateY(-50%)",
  };

  return (
    <FormControl
      height="90px"
      position="relative"
      mt={2}
      isInvalid={isInvalid && touched}
    >
      <Box as="label" htmlFor={name} {...labelStyles}>
        {label}
      </Box>
      <InputGroup size="md">
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"} // Toggle between text and password
          placeholder={isFocused ? "" : label}
          autoComplete="new-password"
          spellCheck="false"
          autoCorrect="off"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(value !== "");
            setTouched(true); // Mark as touched on blur
          }}
          onChange={onChange}
          size="md"
          height="60px"
          pl="12px"
          borderColor="var(--input-color)"
          borderWidth="2px"
          _focus={{
            borderColor: "gray.500",
          }}
        />
        <InputRightElement
          width="4.5rem"
          top="50%"
          transform="translateY(-50%)"
        >
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {showPassword ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {isInvalid && touched && (
        <FormErrorMessage mt={2}>
          {errorMessage || "This field is required."}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FloatingPasswordInput;
