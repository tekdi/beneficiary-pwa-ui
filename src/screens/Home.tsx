import React, { useContext, useEffect, useState } from "react";
import { Box, useToast, VStack } from "@chakra-ui/react";
import {
  getUser,
  getDocumentsList,
  sendConsent,
  getUserConsents,
  logoutUser,
} from "../services/auth/auth";
import { useNavigate } from "react-router-dom";
import CommonButton from "../components/common/button/Button";
import Layout from "../components/common/layout/Layout";
import { AuthContext } from "../utils/context/checkToken";
import { useTranslation } from "react-i18next";
import DocumentList from "../components/DocumentList";
import { useKeycloak } from "@react-keycloak/web";
import "../assets/styles/App.css";
import UploadDocumentEwallet from "../components/common/UploadDocumentEwallet";
import CommonDialogue from "../components/common/Dialogue";
import termsAndConditions from "../assets/termsAndConditions.json";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showIframe, setShowIframe] = useState(true);
  const [consentSaved, setConsentSaved] = useState(false);
  const { keycloak } = useKeycloak();
  const { userData, documents, updateUserData } = useContext(AuthContext)!;
  const purpose = "sign_up_tnc";
  const purpose_text = "sign_up_tnc";
  const toast = useToast();
  const handleRedirect = () => {
    navigate("/explorebenefits");
  };
  const init = async () => {
    try {
      const result = await getUser();
      const data = await getDocumentsList();
      updateUserData(result.data, data.data);
    } catch (error) {
      console.error("Error fetching user data or documents:", error);
    }
  };

  const handleConsent = async () => {
    setConsentSaved(!consentSaved);
    try {
      const response = await logoutUser();
      if (response) {
        navigate("/");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Logout failed",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: "Try Again",
      });
    }
  };

  const checkConsent = (consent) => {
    const isPurposeMatched = consent.some((item) => item.purpose === purpose);

    if (!isPurposeMatched) {
      setConsentSaved(true);
    }
  };
  const getConset = async () => {
    try {
      const response = await getUserConsents();
      console.log("response1", response.data.data);

      checkConsent(response?.data.data);
    } catch (error) {
      console.log("Failed to load consents", error);
    }
  };
  const saveConsent = async () => {
    try {
      await sendConsent(userData?.user_id, purpose, purpose_text);

      setConsentSaved(false);
    } catch {
      console.log("Error sending consent");
    }
  };

  useEffect(() => {
    if (!userData || !documents || documents.length === 0) {
      init();
    }
  }, [userData, documents]);
  useEffect(() => {
    getConset();
  }, []);
  return (
    <Layout
      _heading={{
        beneficiary: true,
        heading: `${userData?.firstName || ""} ${userData?.lastName || ""}`,
        label: keycloak.tokenParsed?.preferred_username,
      }}
    >
      <Box shadow="md" borderWidth="1px" borderRadius="md" p={2}>
        <VStack spacing={4} align="stretch">
          <DocumentList documents={documents} userData={userData?.docs} />
          <CommonButton
            onClick={handleRedirect}
            label={t("PROFILE_EXPLORE_BENEFITS")}
          />
          {showIframe ? (
            <UploadDocumentEwallet userId={userData?.user_id} />
          ) : (
            <CommonButton onClick={() => setShowIframe(true)} />
          )}
        </VStack>
      </Box>
      {consentSaved && (
        <CommonDialogue
          isOpen={consentSaved}
          onClose={handleConsent}
          termsAndConditions={termsAndConditions}
          handleDialog={saveConsent}
        />
      )}
    </Layout>
  );
};

export default Home;
