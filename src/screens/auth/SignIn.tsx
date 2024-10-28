import React from "react";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Text,
  VStack,
  Flex,
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
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import FlotingInput from "../../components/common/FlotingInput";
import OutlineButton from "../../components/common/button/OutlineButton";
import Layout from "../../components/common/layout/Layout";
import HeadingText from "../../components/common/layout/HeadingText";
import Navbar from "../../components/common/layout/Navbar";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/signin");
  };
  const redirectUserProfile = () => {
    navigate("/userprofile");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    onOpen(); // Open the modal
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <Navbar isMenu={false} />
      <HeadingText
        heading="Sign In with E-Wallet"
        beneficiary={false}
        handleBack={handleBack}
      />
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <VStack align="stretch">
            <FormControl>
              <FlotingInput label="First Name" name="firstname" />
              <FlotingInput label="Password" name="password" />
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
                <ListItem mb="2">
                  <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                  Caste Certificate
                </ListItem>
                <ListItem mb="2">
                  <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                  Income Certificate
                </ListItem>
                <ListItem mb="2">
                  <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                  Domicile Certificate
                </ListItem>
                <ListItem mb="2">
                  <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                  Marksheet (10th)
                </ListItem>
                <ListItem mb="2">
                  <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                  Birth Certificate
                </ListItem>
                <ListItem mb="2">
                  <ListIcon as={BiCheck} color="#3C5FDD" fontSize={"25px"} />
                  Disability Certificate
                </ListItem>
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
