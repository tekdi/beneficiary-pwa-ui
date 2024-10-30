import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  VStack,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import FloatingPasswordInput from "../../components/common/inputs/FloatingPasswordInput";
import { registerUser } from "../../service/auth/auth";
import FloatingInput from "../../components/common/inputs/FlotingInput";
import { useTranslation } from "react-i18next";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");
  const [mobileError, setMobileError] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Check for empty fields
    const isValid =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      mobile.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "";

    // Mobile number validation
    if (mobile.trim() === "") {
      setMobileError(t("SIGNUP_MOBILE_NUMBER_IS_REQUIRED"));
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      setMobileError(t("SIGNUP_MOBILE_NUMBER_VALIDATION"));
    } else {
      setMobileError("");
    }

    // Set password match error
    if (password.trim() === "" || confirmPassword.trim() === "") {
      setPasswordMatchError("Both Password and Confirm Password are required.");
    } else if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError(""); // Clear error if both are valid and match
    }

    // Set form validity
    setIsFormValid(
      isValid && password === confirmPassword && mobileError === ""
    );
  }, [firstName, lastName, mobile, password, confirmPassword, mobileError]);

  const handleSignUp = async () => {
    const clearError = () => {
      setTimeout(() => {
        setError("");
      }, 3000); // 3 seconds timeout
    };

    try {
      setLoading(true);
      const response = await registerUser({
        first_name: firstName,
        last_name: lastName,
        phone_number: mobile,
        password,
      });
      setLoading(false);
      setSuccess(t("SIGNUP_REGISTRATION_SUCCESS_MESSAGE"));
      setTimeout(() => {
        navigate("/signin");
      }, 3000); // Redirect after 3 seconds
    } catch (error: any) {
      setLoading(false);
      setError(error.message || "An error occurred.");
      clearError();
    }
  };

  return (
    <Layout
      isMenu={false}
      _heading={{
        heading: t("SIGNUP_WITH_E_WALLET"),
        handleBack,
      }}
      isBottombar={false}
    >
      <Box p={5}>
        <VStack align="stretch" spacing={4}>
          <FormControl>
            <FloatingInput
              label={t("SIGNUP_FIRST_NAME")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              isInvalid={firstName.trim() === ""}
              errorMessage={t("SIGNUP_FIRST_NAME_REQUIRED")}
            />

            <FloatingInput
              label={t("SIGNUP_LAST_NAME")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isInvalid={lastName.trim() === ""}
              errorMessage={t("SIGNUP_LAST_NAME_REQUIRED")}
            />
            <FloatingInput
              label={t("SIGNUP_MOBILE_NUMBER")}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              isInvalid={mobileError !== ""}
              errorMessage={mobileError}
            />
            <FloatingPasswordInput
              label={t("SIGNUP_CREATE_PASSWORD")}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isInvalid={password.trim() === ""}
              errorMessage={t("SIGNUP_PASSWORD_IS_REQUIRED")}
            />
            <FloatingPasswordInput
              label={t("SIGNUP_CONFIRM_PASSWORD")}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              isInvalid={!!passwordMatchError || confirmPassword.trim() === ""}
              errorMessage={
                passwordMatchError || t("SIGNUP_CONFIRM_PASSWORD_IS_REQUIRED")
              }
            />
          </FormControl>
          <CommonButton
            label={t("SIGNUP_SIGN_UP")}
            onClick={handleSignUp}
            isDisabled={!isFormValid || loading}
          />
          {error && (
            <Alert status="error" variant="solid">
              <AlertIcon />
              {error}
            </Alert>
          )}
          {success && (
            <Alert status="success" variant="solid">
              <AlertIcon />
              {success}
            </Alert>
          )}
        </VStack>
        <Center>
          <Text mt={6}>
            {t("SIGNUP_ALREADY_HAVE_AN_ACCOUNT")}
            <RouterLink
              to="/signin"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {t("SIGNUP_SIGN_IN")}
            </RouterLink>
          </Text>
        </Center>
      </Box>
    </Layout>
  );
};

export default Signup;
