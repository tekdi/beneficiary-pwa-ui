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
import { registerUser } from "../../service/auth";
import FloatingInput from "../../components/common/inputs/FlotingInput";

const Signup: React.FC = () => {
  const navigate = useNavigate();
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

  console.log(passwordMatchError, "passwordMatchError");
  console.log(mobileError, "mobileError");

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
    const isMobileValid = /^\d{10}$/.test(mobile.trim());
    if (!isMobileValid) {
      setMobileError("Mobile Number must be 10 digits and numeric.");
    } else {
      setMobileError("");
    }

    // Set password match error
    if (password.trim() !== "" && confirmPassword.trim() !== "") {
      if (password !== confirmPassword) {
        setPasswordMatchError("Passwords do not match.");
      } else {
        setPasswordMatchError("");
      }
    } else {
      setPasswordMatchError(""); // Clear error if fields are empty
    }

    // Set form validity
    setIsFormValid(isValid && password === confirmPassword && isMobileValid);
  }, [firstName, lastName, mobile, password, confirmPassword]);

  const handleSignUp = async () => {
    const clearError = () => {
      setTimeout(() => {
        setError("");
      }, 3000); // 3 seconds timeout
    };

    if (!isFormValid) {
      setError("Please fill in all fields and ensure passwords match.");
      clearError();
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        first_name: firstName,
        last_name: lastName,
        phone_number: mobile,
        password,
      });
      setLoading(false);
      setSuccess("Registration successful! Redirecting to login...");
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
        heading: "Sign Up with E-Wallet",
        handleBack,
      }}
      isBottombar={false}
    >
      <Box p={5}>
        <VStack align="stretch" spacing={4}>
          <FormControl>
            <FloatingInput
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              isInvalid={firstName.trim() === ""}
              errorMessage="First name is required."
            />

            <FloatingInput
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isInvalid={lastName.trim() === ""}
              errorMessage="Last name is required."
            />
            <FloatingInput
              label="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              isInvalid={!!mobileError || mobile.trim() === ""}
              errorMessage={mobileError || "Mobile Number is required."}
            />
            <FloatingPasswordInput
              label="Create Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isInvalid={password.trim() === ""}
              errorMessage="Password is required."
            />
            <FloatingPasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              isInvalid={!!passwordMatchError || confirmPassword.trim() === ""}
              errorMessage={
                passwordMatchError || "Confirm Password is required."
              }
            />
          </FormControl>
          <CommonButton
            label="Sign Up"
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
            Already Have An Account?{" "}
            <RouterLink
              to="/signin"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Sign in
            </RouterLink>
          </Text>
        </Center>
      </Box>
    </Layout>
  );
};

export default Signup;
