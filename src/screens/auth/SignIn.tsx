import React, { useContext, useEffect, useState } from "react";
import { Box, FormControl, Text, VStack, Center } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import FloatingInput from "../../components/common/input/Input";
import FloatingPasswordInput from "../../components/common/input/PasswordInput";
import {
  loginUser,
  getUser,
  getDocumentsList,
  sendConsent,
} from "../../services/auth/auth";
import { AuthContext } from "../../utils/context/checkToken";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useTranslation } from "react-i18next";
import Toaster from "../../components/common/ToasterMessage";
import { saveToken } from "../../services/auth/asyncStorage";
import { useKeycloak } from "@react-keycloak/web";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);
  const [success, setSuccess] = useState<string>("");
  const { keycloak } = useKeycloak();

  const { checkToken, documents, updateUserData, userData } =
    useContext(AuthContext)!;

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
      if (response.statusCode === 200) {
        setToastMessage(true);
        setSuccess(t("SIGNIN_LOGGEDIN_SUCCESSFULLY"));
      }
      setLoading(false); // Hide loading indicator after response
      saveToken(response.data.access_token, response.data.refresh_token);
      localStorage.setItem("authToken", response.data.access_token);
      init();
      setDialogVisible(true);
    } catch (error) {
      setError(t("SIGNIN_INVALID_USERNAME_PASSWORD_MESSAGE"));
      setToastMessage(true);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    try {
      setLoading(true);
      const result = await getUser();
      const data = await getDocumentsList();
      updateUserData(result?.data, data?.data);
    } catch (error) {
      setError(t("SIGNIN_ERROR_FETCHING_DATA"));
      throw error;
      setLoading(false);
    }
  };

  const handleConfirmation = async () => {
    try {
      await sendConsent(userData?.user_id);
      checkToken();
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Layout
      isMenu={false}
      _heading={{
        heading: "Sign In with E-Wallet",
        handleBack,
      }}
      isBottombar={false}
    >
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <VStack align="stretch">
          <FormControl>
            <FloatingInput
              label="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isInvalid={username.trim() === ""}
              errorMessage={t("SIGNIN_USER_NAME_IS_REQUIRED")}
            />
            <FloatingPasswordInput
              label="Create Password"
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
            onClick={() => keycloak.login()}
            label="Sign In"
          />
        </VStack>
        <ConfirmationDialog
          loading={loading}
          dialogVisible={dialogVisible}
          closeDialog={setDialogVisible}
          handleConfirmation={handleConfirmation}
          documents={documents}
          consentText={t("SIGNIN_CONSENT_TEXT")}
        />
        <Center>
          <Text mt={6}>
            {t("SIGNIN_DONT_HAVE_AN_ACCOUNT")}
            <Box as="span" ml={2}>
              <Link
                to="/signup"
                className="text-color text-decoration-underline"
              >
                {t("SIGNUP_SIGN_UP")}
              </Link>
            </Box>
          </Text>
        </Center>
      </Box>
      {toastMessage && success && <Toaster message={success} type="success" />}
      {toastMessage && error && <Toaster message={error} type="error" />}
    </Layout>
  );
};

export default SignIn;
