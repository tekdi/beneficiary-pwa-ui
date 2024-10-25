import React from "react";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Text,
  VStack,
  Flex,
  Center,
  Grid,
  GridItem,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Select,

} from "@chakra-ui/react";
// import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/signin");
  };

  return (
      <Box bg="#EDEFFF" p="4">
      <Flex justifyContent="space-between" alignItems="center">
        <Text>
          Fast Pass
        </Text>
        <Select placeholder="EN" width="auto" border= '1px solid #0000006b'>
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="es">Sp</option>
          {/* Add more language options as needed */}
        </Select>
      </Flex>
    </Box>
  );
};

export default Header;
