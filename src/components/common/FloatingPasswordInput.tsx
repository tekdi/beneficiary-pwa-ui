import { Box, FormControl, Input, InputGroup, InputRightElement, Button, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function FloatingPasswordInput({ value, onChange, label }) {
  const [isFocused, setIsFocused] = useState(false);
  const [show, setShow] = useState(false); // State for showing/hiding password

  const handleClick = () => setShow(!show); // Toggle show/hide

  return (
    <FormControl height="80px" position="relative" mt={2}>
      <Box
        as="label"
        htmlFor="password"
        position="absolute"
        top={isFocused ? "-10px" : "40%"}
        left="12px"
        bg="white"
        px={1}
        transform={isFocused ? "scale(0.85)" : "translateY(-50%)"}
        transition="all 0.2s ease-out"
        color={isFocused ? "blue.500" : "gray.500"}
        fontSize={isFocused ? "0.85rem" : "1rem"}
        zIndex={100}
        pointerEvents="none"
      >
        {label}
      </Box>
      <InputGroup size='md'>
        <Input
          placeholder={isFocused ? "" : label}
          type={show ? 'text' : 'password'} // Toggle between text and password
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(e.target.value !== "")}
          size="md"
          height="60px"
          pl="12px"
          borderColor="gray.300"
          borderWidth="2px"
          _focus={{
            borderColor: "blue.500",
          }}
          sx={{
            // Remove part of the border under the label when it's focused
            "&::before": {
              content: '""',
              position: "absolute",
              top: isFocused ? "-10px" : "50%",
              left: "10px",
              width: "30px", // adjust based on your label size
              height: "2px",
              background: "white", // same color as background
              zIndex: 2,
              
            },
          }}
          {...{ value, onChange }}
        />
        <InputRightElement width='4.5rem' sx={{marginTop: '3%'}}>
          <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show ? <Icon as={ViewOffIcon} /> : <Icon as={ViewIcon} />} {/* Toggle between icons */}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}
