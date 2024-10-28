import React from "react";
import {
  Box,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Divider,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import Footer from "../../components/common/Footer";
import CustomDisableInput from "../../components/common/inputs/DisabledInput";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import HeadingText from "../../components/common/layout/HeadingText";
import { useNavigate } from "react-router-dom";

const Preview: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const navigate = useNavigate();

  const openModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Layout isNavbar={true}>
      <Box className="card-scroll">
        <HeadingText
          heading="Preview Application"
          subHeading="Application for SC Scholarship 1"
          beneficiary={false}
          handleBack={handleBack}
        />
        <Box>
          <Box maxW="2xl" m={4} className="border-bottom">
            <Stack gap="4" align="flex-start">
              <CustomDisableInput label="Full Name" placeholder="Anay Gupta" />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput label="Gender" placeholder="Male" />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput label="Age" placeholder="14" />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput label="Class" placeholder="10th " />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput label="Marks" placeholder="80%" />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput label="Disability" placeholder="80%" />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput
                label="Annual Income"
                placeholder="7,00,000"
              />
            </Stack>
            <Stack gap="4" align="flex-start" mt={2}>
              <CustomDisableInput
                label="Parent Occupation"
                placeholder="Cleaness worker"
              />
            </Stack>
          </Box>
          <Box m={4}>
            <CommonButton onClick={openModal} label="Confirm Submission" />
          </Box>
        </Box>
      </Box>
      <Modal
        isCentered
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="border-bottom">
            <Box className="heading">Application Submitted</Box>
            <Box color="gray.600" fontWeight="300" fontSize={"18px"}>
              Confirmation
            </Box>
          </ModalHeader>
          <Divider />

          <ModalCloseButton />
          <ModalBody className="border-bottom">
            <Heading size="md" color="#484848" fontWeight={500} mt={6}>
              Your application to the{" "}
              <span className="text-blue">Pre-Matric Scholarship-SC </span>{" "}
              Benefit has been submitted!
            </Heading>
            <Box mt={4} mb={4}>
              Application ID : 1303
            </Box>
          </ModalBody>
          <ModalFooter>
            <CommonButton onClick={closeModal} label="Okay" />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
    </Layout>
  );
};

export default Preview;
