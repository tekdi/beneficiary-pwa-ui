import React, { useContext, useEffect, useState } from "react";
import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

import { getUser, getDocumentsList } from "../services/auth/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/layout/Layout";
import { AuthContext } from "../utils/context/checkToken";
import DocumentList from "../components/DocumentList";

import ProgressBar from "../components/common/ProgressBar";
import UserDetails from "../components/common/UserDetails";

import UploadDocumentEwallet from "../components/common/UploadDocumentEwallet";
import CommonButton from "../components/common/button/Button";

const UserProfile: React.FC = () => {
  const [showIframe, setShowIframe] = useState(true);

  const { userData, documents, updateUserData } = useContext(AuthContext)!;
  // Function to fetch user data and documents
  const init = async () => {
    try {
      const result = await getUser();
      const data = await getDocumentsList();
      console.log("result---", result);
      updateUserData(result?.data, data?.data); // Update user data and document list in context
    } catch (error) {
      console.error("Error fetching user data or documents:", error);
    }
  };

  useEffect(() => {
    if (!userData || !documents || documents.length === 0) {
      init();
    }
  }, [userData, documents]);

  return (
    <Layout>
      <HStack m={5} mt={0} p={0} h={82}>
        <Avatar
          variant="solid"
          name={`${userData?.first_name || ""} ${userData?.last_name || ""}`}
          mr={2}
        />
        <VStack mt={8} ml={1}>
          <Text
            fontSize="16px"
            fontWeight="500"
            lineHeight="24px"
            color="#433E3F"
            textAlign={"start"}
          >
            {userData?.first_name || ""} {userData?.last_name || ""}
          </Text>
          <Text
            fontSize="11px"
            fontWeight="500"
            lineHeight="24px"
            color="#433E3F"
          >
            {userData?.phone_number || "Phone No"}
          </Text>
        </VStack>
      </HStack>

      <Box
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        className="card-scroll invisible_scroll"
        p={3}
      >
        <ProgressBar value={60} />
        <Text
          fontSize="16px"
          fontWeight="500"
          lineHeight="24px"
          color="#433E3F"
          mt={3}
          ml={4}
        >
          Basic Details
        </Text>
        <UserDetails userData={{ ...userData }} />
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          className="card-scroll invisible_scroll"
        >
          <VStack spacing={4} align="stretch">
            <DocumentList documents={documents} userData={userData.docs} />
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
      </Box>
    </Layout>
  );
};

export default UserProfile;
