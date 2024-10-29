import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Heading,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  Center,
  Divider,
} from "@chakra-ui/react";
import { BiCheck } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import FlotingInput from "../../components/common/inputs/FlotingInput";
import OutlineButton from "../../components/common/button/OutlineButton";
import Layout from "../../components/common/layout/Layout";
import FloatingPasswordInput from "../../components/common/inputs/FloatingPasswordInput";
import { getDocumentsList } from "../../service/auth";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const handleRedirect = () => {
    navigate("/signin");
  };
  const redirectUserProfile = () => {
    navigate("/userprofile");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getDocumentList = async () => {
    try {
      const response = await getDocumentsList();
      console.log(response, "response");

      setDocuments(response); // Set the response data to state
    } catch (error) {
      console.error("Error fetching documents list:", error);
    }
  };
  console.log(documents, "documents");

  useEffect(() => {
    getDocumentList();
  }, []);

  const finalRef = React.useRef(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    onOpen(); // Open the modal
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout
      isMenu={false}
      _heading={{
        heading: "Sign In with E-Wallet",
        handleBack,
      }}
      isBottombar={false}
    >
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <VStack align="stretch">
            <FormControl>
              <FlotingInput label="User Name" name="username" />
              <FloatingPasswordInput label="Password" name="password" />
            </FormControl>
            <CommonButton onClick={handleRedirect} label="Sign In" />
          </VStack>
        </form>
        <Modal
          isCentered
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className="border-bottom">
              <Box className="heading">Share Information</Box>
              <Box color="gray.600" fontWeight="300" fontSize={"18px"}>
                Confirmation
              </Box>
            </ModalHeader>
            <Divider />

            <ModalCloseButton />
            <ModalBody className="border-bottom">
              <Heading
                as="h5"
                size="md"
                mt="1"
                mb="2"
                color="gray.800"
                fontWeight="400"
                lineHeight={"30px"}
              >
                Please provide your consent to share the following with Fast
                Pass
              </Heading>
              <List spacing={3} mt="4">
                {documents.map((item) => (
                  <ListItem mb="2">
                    <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                    {item.name}
                  </ListItem>
                ))}
              </List>
            </ModalBody>
            <Divider />
            <ModalFooter gap={2}>
              <OutlineButton onClick={onClose} label="Deny" />
              <CommonButton onClick={redirectUserProfile} label="Accept" />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Center>
          <Text mt={6}>
            Don't Have An Account?{" "}
            <Link
              as={RouterLink}
              to="/signup"
              className="text-color text-decoration-underline"
            >
              Sign Up
            </Link>
          </Text>
        </Center>
      </Box>
    </Layout>
  );
};

export default SignIn;
