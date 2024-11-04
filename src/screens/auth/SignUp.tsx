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
import FloatingPasswordInput from "../../components/common/input/PasswordInput";
import { registerUser } from "../../services/auth/auth";
import FloatingInput from "../../components/common/input/Input";
import { useTranslation } from "react-i18next";

interface UserDetails {
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");
  const [mobileError, setMobileError] = useState<string>("");

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const mobileError = validateMobile(userDetails.mobile);
    const passwordMatchError = validatePasswordMatch(
      userDetails.password,
      userDetails.confirmPassword
    );

    setMobileError(mobileError);
    setPasswordMatchError(passwordMatchError);

    // Ensure isFormValid is strictly boolean
    setIsFormValid(
      !!userDetails.firstName.trim() &&
        !!userDetails.lastName.trim() &&
        !!userDetails.mobile.trim() &&
        !!userDetails.password.trim() &&
        !!userDetails.confirmPassword.trim() &&
        !mobileError && // Mobile validation result is now boolean
        !passwordMatchError // Password validation result is now boolean
    );
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const validateMobile = (mobile: string) => {
    // Remove any non-numeric characters from the input
    const cleanedMobile = mobile.replace(/\D/g, "");
    // Check if the cleaned mobile number is empty
    if (!cleanedMobile) {
      return t("SIGNUP_MOBILE_NUMBER_IS_REQUIRED");
    }
    // Ensure the mobile number contains exactly 10 digits
    if (!/^\d{10}$/.test(cleanedMobile)) {
      return t("SIGNUP_MOBILE_NUMBER_VALIDATION");
    }
    // Return an empty string if all validations pass
    return "";
  };

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    // Check if either password or confirmPassword is empty
    if (password.trim() === "" || confirmPassword.trim() === "") {
      return t("SIGNUP_PASSWORD_CONFIRM_PASSWORD_IS_REQUIRED");
    }
    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      return t("SIGNUP_PASSWORD_NOT_MATCHING");
    }
    // Regular expression to ensure the password contains letters, special characters, and numbers
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@!#$%]).{8,}$/;
    // Validate password format
    if (!passwordPattern.test(password)) {
      return t("SIGNUP_PASSWORD_VALIDATION_MESSAGE");
    }
    // Return an empty string if all validations pass
    return "";
  };

  const handleSignUp = async () => {
    const clearError = () => {
      setTimeout(() => {
        setError("");
      }, 3000);
    };

    try {
      setLoading(true);
      const response = await registerUser({
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        phone_number: userDetails.mobile,
        password: userDetails.password,
      });

      if (response && response?.statusCode === 200) {
        setLoading(false);
        setSuccess(
          response.message || t("SIGNUP_REGISTRATION_SUCCESS_MESSAGE")
        );
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        setLoading(false);
        setError(response.message || "An error occurred.");
        clearError();
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred.");
      }
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
              name="firstName"
              label={t("SIGNUP_FIRST_NAME")}
              value={userDetails.firstName}
              onChange={(e) => handleChange(e)}
              isInvalid={!userDetails.firstName.trim()}
              errorMessage={t("SIGNUP_FIRST_NAME_REQUIRED")}
            />
            <FloatingInput
              name="lastName"
              label={t("SIGNUP_LAST_NAME")}
              value={userDetails.lastName}
              onChange={(e) => handleChange(e)}
              isInvalid={!userDetails.lastName.trim()}
              errorMessage={t("SIGNUP_LAST_NAME_REQUIRED")}
            />
            <FloatingInput
              name="mobile"
              label={t("SIGNUP_MOBILE_NUMBER")}
              value={userDetails.mobile}
              onChange={(e) => handleChange(e)}
              // onChange={(e) => setFirstName(e.target.value)}
              isInvalid={!!mobileError}
              errorMessage={mobileError}
            />
            <FloatingPasswordInput
              name="password"
              label={t("SIGNUP_CREATE_PASSWORD")}
              value={userDetails.password}
              onChange={handleChange}
              isInvalid={!!passwordMatchError}
              errorMessage={passwordMatchError}
            />
            <FloatingPasswordInput
              name="confirmPassword"
              label={t("SIGNUP_CONFIRM_PASSWORD")}
              value={userDetails.confirmPassword}
              onChange={handleChange}
              isInvalid={!!passwordMatchError}
              errorMessage={passwordMatchError}
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
