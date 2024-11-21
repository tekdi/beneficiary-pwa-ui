import React, { useContext, useEffect, useState } from "react";
import { Box, VStack } from "@chakra-ui/react";

import { getUser, getDocumentsList } from "../services/auth/auth";
import { useNavigate } from "react-router-dom";
import CommonButton from "../components/common/button/Button";
import Layout from "../components/common/layout/Layout";
import { AuthContext } from "../utils/context/checkToken";
import { useTranslation } from "react-i18next";
import DocumentList from "../components/DocumentList";
import { useKeycloak } from "@react-keycloak/web";

import UploadDocumentEwallet from "../components/common/UploadDocumentEwallet";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showIframe, setShowIframe] = useState(true);
  const handleRedirect = () => {
    navigate("/explorebenefits");
  };

  const { userData, documents, updateUserData } = useContext(AuthContext)!;

  // Function to fetch user data and documents
  const init = async () => {
    try {
      const result = await getUser();

      const data = await getDocumentsList();
      updateUserData(result.data, data.data);
    } catch (error) {
      console.error("Error fetching user data or documents:", error);
    }
  };

  useEffect(() => {
    if (!userData || !documents || documents.length === 0) {
      init();
    }
  }, [userData, documents]);

  const { keycloak } = useKeycloak();

  if (keycloak?.token) {
    try {
      // Save the token in localStorage
      localStorage.setItem("authToken", keycloak.token);

      // Decode the token
    } catch (error) {
      console.error("Failed to decode or save token:", error);
    }
  } else {
    console.warn("No token available on Keycloak instance.");
  }

  return (
    <Layout
      _heading={{
        beneficiary: true,
        heading: keycloak.tokenParsed?.preferred_username,
        subHeading: t("PROFILE_LOGGED_IN_WITH_E_Wallet"),
        label: keycloak.tokenParsed?.preferred_username,
      }}
    >
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        className="card-scroll invisible_scroll"
      >
        <VStack spacing={4} align="stretch">
          <DocumentList documents={documents} userData={userData?.docs} />
          <CommonButton
            onClick={handleRedirect}
            label={t("PROFILE_EXPLORE_BENEFITS")}
          />
          {showIframe ? (
            <UploadDocumentEwallet userId={userData?.user_id} />
          ) : (
            <CommonButton
              onClick={() => setShowIframe(true)}
              label="Upload  Document"
            />
          )}
        </VStack>
      </Box>
    </Layout>
  );
};

export default Home;
