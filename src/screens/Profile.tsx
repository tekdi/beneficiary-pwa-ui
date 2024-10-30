import React from "react";
import { Box, VStack } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import CommonButton from "../components/common/button/Button";
import Layout from "../components/common/layout/Layout";
import DocumentList from "../components/DocumentList";
import { document } from "../assets/mockdata/document";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/explorebenefits");
  };

  return (
    <Layout
      _heading={{
        beneficiary: true,
        heading: "Vidya Khandekar",
        subHeading: "Logged in with E-Wallet",
        label: "VK",
      }}
    >
      <Box shadow="md" borderWidth="1px" borderRadius="md">
        <VStack spacing={4} align="stretch" width={"100%"}>
          <DocumentList documents={document} />
          <CommonButton
            onClick={handleRedirect}
            label="Explore Benefits"
            width="90%"
          />
        </VStack>
      </Box>
    </Layout>
  );
};

export default UserProfile;
