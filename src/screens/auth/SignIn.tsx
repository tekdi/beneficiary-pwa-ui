import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  VStack,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import FloatingPasswordInput from "../../components/common/inputs/FloatingPasswordInput";
import { getDocumentsList } from "../../service/auth";
import FloatingInput from "../../components/common/inputs/FlotingInput";
import ConsentDialog from "../../components/common/ConsentDialog";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  const redirectUserProfile = () => {
    console.log("accepted");
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    onOpen(); // Open the modal
  };

  const handleBack = () => {
    navigate("/");
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
              {/* <FloatingInput label="First Name" />
              <FloatingPasswordInput label="Password" /> */}
            </FormControl>
            <CommonButton onClick={handleSubmit} label="Sign In" />
          </VStack>
        </form>
        <ConsentDialog
          isOpen={isOpen}
          onClose={onClose}
          onAccept={redirectUserProfile}
        />
        <Center>
          <Text mt={6}>
            Don't Have An Account?{" "}
            <Link to="/signup" className="text-color text-decoration-underline">
              Sign Up
            </Link>
          </Text>
        </Center>
      </Box>
    </Layout>
  );
};

export default SignIn;
