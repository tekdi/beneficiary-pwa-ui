// src/theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  colors: {
    success: "#0B7B69", 
    warning: "#EDA145", 
    text: "#1F1B13",   
    background: "#FFFFFF",
    border: "#DDDDDD",
  },
});


export default theme;
