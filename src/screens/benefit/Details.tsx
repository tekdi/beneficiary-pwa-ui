// BenefitsDetails.tsx

import React from "react";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import ConsentDialog from "../../components/common/ConsentDialog";

const BenefitsDetails: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const redirectToPreviewApplication = () => {
    navigate("/previewapplication");
    onClose();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout
      _heading={{
        heading: "Pre-matric Scholarship-ST",
        handleBack,
      }}
    >
      <Box className="card-scroll invisible_scroll">
        <Box maxW="2xl" m={4}>
          <Heading size="md" color="#484848" fontWeight={500} mt={2}>
            Benefits
          </Heading>
          <Text fontSize="md" mt={2}>
            ₹ 3500 INR 7700
          </Text>
          <Heading size="md" color="#484848" fontWeight={500} mt={6}>
            Details
          </Heading>
          <Text mt={4}>
            {" "}
            The Pre-matric Scholarship-ST, offered by the Ministry of Tribal
            Welfare and the Tribal Welfare Department of Madhya Pradesh,
            supports Scheduled Tribe (ST) students in Classes 9 and 10. The
            scholarship is available to both boys and girls, as well as students
            with disabilities, from families with an annual income below
            ₹2,50,000.
          </Text>
          <Heading size="md" color="#484848" fontWeight={500} mt={6}>
            Objectives of the Pre-matric Scholarship-ST:
          </Heading>
          <UnorderedList mt={4}>
            <ListItem>
              Provide financial assistance to ST students in Classes 9 and 10 to
              encourage continued education.
            </ListItem>
            <ListItem>
              Support low-income families by reducing the financial burden of
              schooling.
            </ListItem>
            <ListItem>
              Promote equal educational opportunities for students with
              disabilities through higher financial aid.
            </ListItem>
          </UnorderedList>
          <Heading size="md" color="#484848" fontWeight={500} mt={6}>
            Mandatory Documents:
          </Heading>
          <UnorderedList mt={4}>
            <ListItem>Marksheet</ListItem>
            <ListItem>Income Certificate</ListItem>
            <ListItem>Caste Certificate</ListItem>
          </UnorderedList>
          <Box m={4}>
            <CommonButton onClick={onOpen} label="Proceed To Apply" />
          </Box>
          <Box height={"55px"}></Box>
        </Box>
      </Box>

      <ConsentDialog
        isOpen={isOpen}
        onClose={onClose}
        onAccept={redirectToPreviewApplication}
      />
    </Layout>
  );
};

export default BenefitsDetails;
