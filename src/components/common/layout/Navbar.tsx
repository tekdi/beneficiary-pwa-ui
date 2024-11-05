import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Text,
  Flex,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Stack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import CustomSelect from "../input/Select";

import { logoutUser } from "../../../services/auth/auth";
import { getToken } from "../../../services/auth/asyncStorage";
import { AuthContext } from "../../../utils/context/checkToken";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const options = [{ value: "en", label: "English" }];
const Navbar: React.FC<{ isMenu?: boolean }> = ({ isMenu = true }) => {
  const { checkToken, removeContextData } = useContext(AuthContext);
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const token = await getToken();
    if (token?.token && token?.refreshToken) {
      try {
        const response = await logoutUser(token.token, token.refreshToken); // Call the logout function
        removeContextData();
        checkToken();
        if (response.statusCode == 200) {
          setSuccess(t("NAVBAR_LOGGED_OUT_SUCCESSFULLY"));
          navigate("/signin");
        }

        console.log(response, "responseresponse");
      } catch (error) {
        console.error("Logout failed:", error.massage);
      }
    } else {
      console.error("No tokens found, user is not logged in");
    }
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
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}

          <Text>Fast Pass</Text>
        </Box>
        <Box>
          {success && (
            <Alert status="success" variant="solid">
              <AlertIcon />
              {success}
            </Alert>
          )}
        </Box>

        <CustomSelect label="EN" options={options} placeholder="EN" />
      </Flex>
    </Stack>
  );
};

export default Navbar;
