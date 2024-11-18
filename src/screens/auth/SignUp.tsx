import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  VStack,
  Center,
  PinInput,
  PinInputField,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
// import { registerUser } from "../../services/auth/auth";
import FloatingInput from "../../components/common/input/Input";
import { useTranslation } from "react-i18next";
// import Toaster from "../../components/common/ToasterMessage";
import CommonDialogue from "../../components/common/layout/Dialogue";

interface UserDetails {
  firstName: string;
  lastName: string;
  mobile: string;
  otp?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    mobile: "",
    otp: "",
  });

  // const [error, setError] = useState<string>("");
  // const [success, setSuccess] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const [mobileError, setMobileError] = useState<string>("");
  // const [toastMessage, setToastMessage] = useState(false);
  const otpArray = Array(6).fill("");
  const [modalOpen, setModalOpen] = useState(false);

  const termsAndConditions = true;
  // const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const mobileError = validateMobile(userDetails.mobile);
    setMobileError(mobileError);
    // Ensure isFormValid is strictly boolean
    setIsFormValid(
      !!userDetails.firstName.trim() &&
        !!userDetails.lastName.trim() &&
        !!userDetails.mobile.trim() &&
        userDetails.otp?.length === 6 &&
        !mobileError
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

  const handleSignUp = async () => {
    console.log("register api will call here");
  };

  // const handleSignUp = async () => {
  //   const clearError = () => {
  //     setTimeout(() => {
  //       setError("");
  //     }, 3000);
  //   };

  //   try {
  //     setLoading(true);
  //     const response = await registerUser({
  //       first_name: userDetails.firstName,
  //       last_name: userDetails.lastName,
  //       phone_number: userDetails.mobile,
  //     });

  //     if (response && response?.statusCode === 200) {
  //       setLoading(false);
  //       setSuccess(
  //         response.message || t("SIGNUP_REGISTRATION_SUCCESS_MESSAGE")
  //       );
  //       setToastMessage(true);
  //       setTimeout(() => {
  //         navigate("/signin");
  //       }, 3000);
  //     } else {
  //       setLoading(false);
  //       setToastMessage(true);
  //       setError(response.message || "An error occurred.");
  //       clearError();
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     if (error instanceof Error) {
  //       setError(error.message);
  //       setToastMessage(true);
  //     } else {
  //       setError("An error occurred.");
  //       setToastMessage(true);
  //     }
  //     clearError();
  //   }
  // };
  return (
    <Layout
      isMenu={false}
      _heading={{
        heading: t("LOGIN_REGISTER_BUTTON"),
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
          </FormControl>
          {!mobileError && (
            <FormControl isInvalid={userDetails.otp.length !== 6}>
              <Text fontSize={"16px"}>{t("SIGNUP_OTP_ENTER_OTP_LABEL")}</Text>
              <HStack mt={4}>
                <PinInput
                  value={userDetails.otp}
                  onChange={(value) =>
                    setUserDetails({ ...userDetails, otp: value })
                  }
                  size="lg"
                  otp
                >
                  {otpArray?.map((feild) => {
                    return (
                      <PinInputField
                        key={feild}
                        type="text"
                        w={"60px"}
                        h={"65px"}
                        margin={"10px"}
                        placeholder=""
                        borderRadius={"0px"}
                        border={"1px solid #767680"}
                      />
                    );
                  })}
                </PinInput>
              </HStack>
              <Text mt={6} fontSize={"16px"}>
                {t("SIGNUP_OTP_REQUEST_MESSAGE")}{" "}
                <RouterLink
                  to="/signin"
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    marginRight: "10px",
                  }}
                >
                  {t("SIGNUP_RESENT_OTP")}
                </RouterLink>
                {t("SIGNUP_IN")} 4.59
              </Text>
            </FormControl>
          )}
          <CommonButton
            mt={4}
            label={t("GENERAL_PROCEED")}
            onClick={handleSignUp}
            // onClick={openModal}
            isDisabled={!isFormValid}
          />
        </VStack>
        <Center>
          <Text mt={6}>
            {t("SIGNUP_ALREADY_HAVE_AN_ACCOUNT")}
            <Box as="span" ml={2}>
              <RouterLink
                to="/signin"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {t("LOGIN_LOGIN_BUTTON")}
              </RouterLink>
            </Box>
          </Text>
        </Center>
      </Box>

      <CommonDialogue
        isOpen={modalOpen}
        onClose={closeModal}
        termsAndConditions={termsAndConditions}
      />

      {/* {toastMessage && success && <Toaster message={success} type="success" />}
      {toastMessage && error && <Toaster message={error} type="error" />} */}
    </Layout>
  );
};

export default Signup;
