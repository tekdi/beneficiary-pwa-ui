import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import i18n from "../../components/common/i18n";
import Layout from "../../components/common/layout/Layout";
import { useTranslation } from "react-i18next";
import FloatingSelect from "../../components/common/input/FloatingSelect";
import CommonButton from "../../components/common/button/Button";
import { useKeycloak } from "@react-keycloak/web";
import { jwtDecode } from "jwt-decode";
import { saveToken } from "../../services/auth/asyncStorage";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();

  interface DecodedToken {
    exp: number;
    // add other expected token fields
  }

  try {
    if (keycloak?.token) {
      const decodedToken = jwtDecode<DecodedToken>(keycloak.token);
      if (decodedToken.exp * 1000 > Date.now()) {
        navigate("/home", { replace: true });
      }
    }
  } catch (error) {
    console.error(
      "Error decoding token:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  const [formData, setFormData] = useState({ name: "" });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    i18n.changeLanguage(value); // Change language based on selection
  };

  const options = [{ label: t("LOGIN_ENGLISH"), value: "en" }];
  const handleRedirect = () => {
    navigate("/SignUp");
  };

  const handleLogin = async () => {
    try {
      await keycloak.login();
      if (keycloak.token) {
        const decodedToken = jwtDecode<DecodedToken>(keycloak.token);
        if (decodedToken.exp * 1000 > Date.now()) {
          saveToken(keycloak.token, keycloak.token);
          localStorage.setItem("authToken", keycloak.token);
          navigate("/home");
        } else {
          console.warn("Token expired. Consider refreshing the token.");
        }
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };
  return (
    <Layout isNavbar={false} isBottombar={false}>
      <Flex height="50%" justifyContent="flex-end" className="purple-bg">
        <Image
          src="../src/assets/images/frame.png"
          alt="Login Image"
          objectFit="contain"
          transform="translateX(-50%)"
          width="60%"
          height="400px"
        />
      </Flex>
      <Stack p={4} mt={4} pt={12} className="login-form" shadow="lg">
        <form>
          <FormControl>
            <FormLabel color={"#45464F"}>
              {t("LOGIN_SELECT_PREFERRED_LANGUAGE")}
            </FormLabel>
            <FloatingSelect
              label={t("LOGIN_SELECT_LANGUAGE")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              options={options}
            />
            <FormHelperText marginTop={"-15px"}>
              {t("LOGIN_CHANGE_LATER")}
            </FormHelperText>
          </FormControl>
        </form>
        <CommonButton
          onClick={handleRedirect}
          label={t("LOGIN_REGISTER_BUTTON")}
          mt={8}
        />
        <Button
          className="outline-custom-btn"
          variant="outline"
          mt={2}
          onClick={handleLogin}
        >
          {t("LOGIN_LOGIN_BUTTON")}
        </Button>
      </Stack>
    </Layout>
  );
};

export default Login;
