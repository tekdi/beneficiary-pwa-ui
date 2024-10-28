import React from "react";
import {
  Box,
  Button,
  VStack,
  Flex,
  List,
  ListItem,
  Wrap,
  WrapItem,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import CommonButton from "../components/common/button/Button";
import Layout from "../components/common/layout/Layout";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/explorebenefits");
  };

  return (
    <Layout isNavbar={true}>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Flex align="center">
          <Wrap>
            <WrapItem>
              <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
            </WrapItem>
          </Wrap>
          <Box pl={4}>
            <Text fontSize="lg" fontWeight="600">
              Anay Gupta
            </Text>
            <Text color="gray.600"> Logged with DG locker</Text>
          </Box>
        </Flex>
        <VStack spacing={4} align="stretch">
          <List spacing={3} mt={8}>
            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box>Caste Certificate</Box>
              </Flex>
            </ListItem>
            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box>Income Certificate</Box>
              </Flex>
            </ListItem>

            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box> Domicile Certificate</Box>
              </Flex>
            </ListItem>
            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box> Income Certificate</Box>
              </Flex>
            </ListItem>
            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box> Domicile Certificate</Box>
              </Flex>
            </ListItem>
            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box> Birth Certificate</Box>
              </Flex>
            </ListItem>
            <ListItem className="border-bottom" pb={4}>
              <Flex align="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="green.500"
                  borderRadius="full"
                  boxSize="25px"
                  color="white"
                  marginRight="10px"
                >
                  <CheckIcon boxSize="15px" />
                </Box>
                <Box> Disability Certificate</Box>
              </Flex>
            </ListItem>
          </List>
          <CommonButton onClick={handleRedirect} label="Explore Benefits" />
        </VStack>
      </Box>
      <Footer />
    </Layout>
  );
};

export default UserProfile;
