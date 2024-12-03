import React, { useState } from "react";
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
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import CustomSelect from "../input/Select";
// import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const options: { value: string; label: string }[] = [];
const Navbar: React.FC<{ isMenu?: boolean }> = ({ isMenu = true }) => {
  const [success] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const { keycloak } = useKeycloak();
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    navigate("/");
    navigate(0);
    // keycloak.logout({ redirectUri: window.location.origin });
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
              <MenuList bg="var(--menu-background)" mt={"15px"}>
                <MenuItem
                  bg="var(--menu-background)"
                  className="border-bottom"
                  p={4}
                  onClick={() => {
                    navigate("/userprofile");
                  }}
                >
                  <Image src="../assets/images/profile.png" />
                  <Text ml={4}>{t("NAVBAR_PROFILE")}</Text>
                </MenuItem>
                <MenuItem
                  bg="var(--menu-background)"
                  onClick={handleLogout}
                  p={4}
                >
                  <Image ml={1} src="../assets/images/logout.png" />

                  <Text ml={4}>{t("NAVBAR_LOGOUT")}</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <Text fontStyle={"italic"}> {t("NAVBAR_FAST_PASS")}</Text>
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
