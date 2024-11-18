import React, { useContext, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";

import { getUser, getDocumentsList } from "../services/auth/auth";
import { useNavigate } from "react-router-dom";
import CommonButton from "../components/common/button/Button";
import Layout from "../components/common/layout/Layout";
import { AuthContext } from "../utils/context/checkToken";
import { useTranslation } from "react-i18next";
import DocumentList from "../components/DocumentList";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRedirect = () => {
    navigate("/explorebenefits");
  };

  const { userData, documents, updateUserData } = useContext(AuthContext)!;

  // Function to fetch user data and documents
  const init = async () => {
    try {
      const result = await getUser();
      const data = await getDocumentsList();
      updateUserData(result.data, data.data); // Update user data and document list in context
    } catch (error) {
      console.error("Error fetching user data or documents:", error);
    }
  };

  // Call init if userData or documents is not available
  useEffect(() => {
    if (!userData || !documents || documents.length === 0) {
      init();
    }
  }, [userData, documents]);

  return (
    <Layout
      _heading={{
        beneficiary: true,
        heading: `${userData?.first_name || ""} ${userData?.last_name || ""}`,
        subHeading: t("PROFILE_LOGGED_IN_WITH_E_Wallet"),
        label:
          userData?.last_name?.length && userData?.last_name.length > 1
            ? `${userData.first_name?.[0]}${userData.last_name[0]}`
            : userData?.first_name?.[0] ?? "",
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
          <DocumentList documents={documents} />
          <CommonButton
            onClick={handleRedirect}
            label={t("PROFILE_EXPLORE_BENEFITS")}
          />
        </VStack>
      </Box>
    </Layout>
  );
};

export default UserProfile;
