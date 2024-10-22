import React from "react";
import {
  Box,
  Button,
  FormControl,
  Heading,
  Text,
  VStack,
  Flex,
  Center,
} from "@chakra-ui/react";
// import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Header from "../common/Header";
import FlotingInput from "../common/FlotingInput";
import FloatingPasswordInput from "../common/FloatingPasswordInput";
import { ArrowBackIcon } from "@chakra-ui/icons";


const Signup: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/signin");
  };

  return (
    <Box className="main-bg">
      <Flex height="100vh" alignItems="center" justifyContent="center"  position="relative">
        <Box
          width="550px"
          height="100vh"
          borderRadius="lg"
          shadow="lg"
          borderWidth="1px"
          background="#fff"
        >
          <Header />
          <Box p={5}>
            <Heading as="h2" size="lg" mb={4} mt={1} className="heading">
              <ArrowBackIcon /> Sign Up with E-Wallet
            </Heading>
            <form>
              <VStack align="stretch">
                <FormControl>
                  <FlotingInput label="First Name" name="firstname" />
                  <FlotingInput label="Last Name" name="lasttname" />
                  <FlotingInput label="Mobile Number" name="mobilenumber" />
                  <FloatingPasswordInput
                    label="Create Password"
                    name="createpassword"
                  />
                  <FloatingPasswordInput
                    label="Confirm Password"
                    name="confirmpassword"
                  />
                </FormControl>
                <Button className="custom-btn" type="submit" mt={4}>
                  Sign Up
                </Button>
              </VStack>
            </form>
            <Center>
              {" "}
              <Text mt={6}>
                Already Have An Account?{" "}
                <Link
                  as={RouterLink}
                  to="/signin"
                  className="text-color text-decoration-underline"
                >
                  Sign in
                </Link>
              </Text>
            </Center>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Signup;
