import React from "react";
import {
  Box,
  Stack,
  Button,
  Card,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import Footer from "../../components/common/Footer";
import Layout from "../../components/common/layout/Layout";
import HeadingText from "../../components/common/layout/HeadingText";
import { useNavigate } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";

const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout isNavbar={true}>
      <Box className="card-scroll">
        <HeadingText
          heading="My Applications"
          subHeading="Track your application progress"
          beneficiary={false}
          handleBack={handleBack}
        />
        <Stack spacing="4">
          <Box
            m={4}
            p="2"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="lg"
          >
            <VStack align="stretch" spacing="4">
              {/* First Section: Icon and Text */}
              <HStack spacing="3" className="border-bottom" mt="2" pb="2">
                <CheckIcon />
                <Text fontSize="lg" fontWeight="medium">
                  Approved for Disbursal
                </Text>
              </HStack>

              {/* Second Section: Only Text */}
              <Text fontSize="md">Application 1303</Text>
            </VStack>
          </Box>
        </Stack>
      </Box>
      <Footer />
    </Layout>
  );
};

export default MyApplications;
