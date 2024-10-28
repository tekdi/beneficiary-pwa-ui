import React from "react";
import {
  Box,
  FormControl,
  Heading,
  Text,
  VStack,
  Flex,
  Center,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import HeadingText from "../../components/common/layout/HeadingText";
import Navbar from "../../components/common/layout/Navbar";

import FlotingInput from "../../components/common/FlotingInput";
import FloatingSelect from "../../components/common/FloatingSelect";
import FloatingPasswordInput from "../../components/common/FloatingPasswordInput";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/signin");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout isNavbar={false}>
      <Navbar isMenu={false} />
      <HeadingText
        heading="Sign Up with E-Wallet"
        beneficiary={false}
        handleBack={handleBack}
      />
      <Box p={5}>
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
            <CommonButton label="Sign Up" />
          </VStack>
        </form>
        <Center>
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
    </Layout>
  );
};

export default Signup;
