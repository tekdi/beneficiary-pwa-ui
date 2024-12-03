import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  VStack,
  Center,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import FloatingInput from "../../components/common/input/Input";
import FloatingPasswordInput from "../../components/common/input/PasswordInput";
import { loginUser } from "../../services/auth/auth";
import { useTranslation } from "react-i18next";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    // Check for empty fields
    const isValid = username.trim() !== "" && password.trim() !== "";

    // Set form validity
    setIsFormValid(isValid);
  }, [username, password]);

  const handleLogin = async () => {
    try {
      setLoading(true); // Show loading indicator

      const response = await loginUser({ username, password });
      if (response) {
        toast({
          title: t("SIGNIN_SUCCESSFULL"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        navigate(0);
      }
    } catch (error) {
      console.log("error", error);

      toast({
        title: t("SIGNIN_FAILED"),
        status: "error",
        duration: 10000,
        isClosable: true,
        description: t("SIGNIN_INVALID_USERNAME_PASSWORD_MESSAGE"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };
  return (
    <Layout
      isMenu={false}
      _heading={{
        heading: t("LOGIN_LOGIN_BUTTON"),
        handleBack,
      }}
      isBottombar={false}
    >
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <VStack align="stretch">
          <FormControl>
            <FloatingInput
              label="Enter User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isInvalid={username.trim() === ""}
              errorMessage={t("SIGNIN_USER_NAME_IS_REQUIRED")}
            />
            <FloatingPasswordInput
              label="Enter Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isInvalid={password.trim() === ""}
              errorMessage={t("SIGNIN_PASSWORD_IS_REQUIRED")}
            />
          </FormControl>
          <CommonButton
            isDisabled={!isFormValid || loading}
            onClick={() => handleLogin()}
            label={t("LOGIN_LOGIN_BUTTON")}
          />
        </VStack>

        <Center>
          <Text mt={6}>
            {t("SIGNIN_DONT_HAVE_AN_ACCOUNT")}
            <Box as="span" ml={2}>
              <Link
                to="/signup"
                className="text-color text-decoration-underline"
              >
                {t("LOGIN_REGISTER_BUTTON")}
              </Link>
            </Box>
          </Text>
        </Center>
      </Box>
    </Layout>
  );
};

export default SignIn;
