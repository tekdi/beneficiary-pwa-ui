import React, { useContext, useEffect } from "react";
import { Box, VStack, Flex, List, ListItem } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { getUser, getDocumentsList } from "../services/auth/auth";
import { useNavigate } from "react-router-dom";
import CommonButton from "../components/common/button/Button";
import Layout from "../components/common/layout/Layout";
import { getTokenData } from "../services/auth/asyncStorage";
import { AuthContext } from "../utils/context/checkToken";
import { useTranslation } from "react-i18next";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRedirect = () => {
    navigate("/explorebenefits");
  };

  const { userData, documents, updateUserData } = useContext(AuthContext);

  // Function to fetch user data and documents
  const init = async () => {
    try {
      const { sub } = await getTokenData(); // Assuming sub is the user identifier
      const result = await getUser(sub);
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
          userData && userData?.last_name?.length > 1
            ? `${userData?.first_name?.[0]}${userData?.last_name?.[0]}`
            : userData?.first_name?.[0],
      }}
    >
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <VStack spacing={4} align="stretch">
          <List spacing={3}>
            <ListItem className="border-bottom" pb={4}>
              {documents &&
                documents.map((document) => (
                  <Flex align="center" key={document.name} mt={4}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="green.500"
                      borderRadius="full"
                      boxSize="25px"
                      color="white"
                      marginRight="10px"
                    >
                      <CheckIcon boxSize="15px" />
                    </Box>
                    <Box> {document.name}</Box>
                  </Flex>
                ))}
            </ListItem>
          </List>
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
