import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
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
import { ArrowBackIcon } from "@chakra-ui/icons";
import Header from "../common/Header";
import Footer from "../common/Footer";
import CustomDisableInput from "../common/inputs/DisableInput";

const Preview: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const openModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };
  return (
    <Box className="main-bg">
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Box
          width="550px"
          height="100vh"
          borderRadius="lg"
          shadow="lg"
          borderWidth="1px"
          background="#fff"
        >
          <Header />
          <Box className="card-scroll">
            <Box mt={6} p={2} className="border-bottom">
              <Heading as="h4" size="lg" mb={2} className="heading">
                <ArrowBackIcon /> Preview Application
              </Heading>
              <Text ml={2} mb={6}>
                Application for SC Scholarship 1
              </Text>
            </Box>
            <Box>
              <Box maxW="2xl" m={4} className="border-bottom">
                <Stack gap="4" align="flex-start">
                  <CustomDisableInput
                    label="Full Name"
                    placeholder="Anay Gupta"
                  />
                </Stack>
                <Stack gap="4" align="flex-start" mt={2}>
                  <CustomDisableInput
                    label="Gender"
                    placeholder="Male"
                  />
                </Stack>
                <Stack gap="4" align="flex-start" mt={2}>
                  <CustomDisableInput
                    label="Age"
                    placeholder="14"
                  />
                </Stack>
                <Stack gap="4" align="flex-start" mt={2}>
                  <CustomDisableInput
                    label="Class"
                    placeholder="10th "
                  />
                </Stack>
                <Stack gap="4" align="flex-start" mt={2}>
                  <CustomDisableInput
                    label="Marks"
                    placeholder="80%"
                  />
                </Stack>
                <Stack gap="4" align="flex-start" mt={2}>
                  <CustomDisableInput
                    label="Disability"
                    placeholder="80%"
                  />
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
                <Button
                  className="custom-btn"
                  type="submit"
                  mt={4}
                  width="100%"
                  onClick={openModal}
                >
                  Confirm Submission
                </Button>
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
                <Button
                  className="custom-btn"
                  type="submit"
                  mt={4}
                  m={2}
                  width="100%"
                  onClick={closeModal}
                >
                  Okay
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Footer />
        </Box>
      </Flex>
    </Box>
  );
};

export default Preview;
