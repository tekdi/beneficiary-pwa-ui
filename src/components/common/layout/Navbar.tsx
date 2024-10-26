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
  Stack,
} from "@chakra-ui/react";
// import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowBackIcon,
  ChevronDownIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import CustomSelect from "../inputs/Select";
const options = [
  { value: "en", label: "English" },
  // Add more options as needed
];
const Navbar: React.FC = ({ isMenu = true }) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/signin");
  };

  return (
    <Stack bg="#EDEFFF" p="6">
      <Flex justifyContent="space-between" alignItems="center">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          paddingLeft={0}
          marginLeft={0}
        >
          {isMenu && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<HamburgerIcon w={5} h={5} />}
                paddingLeft={0}
              ></MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}

          <Text>Fast Pass</Text>
        </Box>

        <CustomSelect label="EN" options={options} placeholder="EN" />
      </Flex>
    </Stack>
  );
};

export default Navbar;
