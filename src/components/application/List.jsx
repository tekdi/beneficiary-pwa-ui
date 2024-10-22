import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Text,
  Center,
  Badge,
  UnorderedList,
  ListItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Divider,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import '../../assets/styles/App.css'
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const List: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const openModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    onOpen(); 
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
          <Box mt={4} mb={2} p={2} className="border-bottom">
            <Heading as="h4" size="lg" mb={2} className="heading">
              <ArrowBackIcon /> Pre-Matric Scholarship-ST
            </Heading>
          </Box>

          <Box>
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
                The Pre-matric Scholarship-ST, offered by the Ministry of Tribal
                Welfare and the Tribal Welfare Department of Madhya Pradesh,
                supports Scheduled Tribe (ST) students in Classes 9 and 10. The
                scholarship is available to both boys and girls, as well as
                students with disabilities, from families with an annual income
                below ₹2,50,000.
              </Text>
              <Text mt={4}>
                Day scholars receive ₹3500 (₹3850 for disabled students), and
                hostellers receive ₹7000 (₹7700 for disabled students). The
                scholarship is available to students domiciled in Madhya Pradesh
                and is auto-renewed. Students can avail this scholarship even if
                they are benefiting from another government scholarship, and it
                is available for one year if the student fails.
              </Text>
              <Heading size="md" color="#484848" fontWeight={500} mt={6}>
                Objectives of the Pre-matric <br />
                Scholarship-ST:
              </Heading>
              <UnorderedList mt={4}>
                <ListItem>
                  Provide financial assistance to ST students in Classes 9 and
                  10 to encourage continued education.
                </ListItem>
                <ListItem>
                  Support low-income families by reducing the financial burden
                  of schooling.
                </ListItem>
                <ListItem>
                  Promote equal educational opportunities for students with
                  disabilities through higher financial aid.
                </ListItem>
                <ListItem>
                  Reduce dropout rates among ST students by offering incentives
                  to complete secondary education.
                </ListItem>
                <ListItem>
                  Ensure educational support for ST students in both urban and
                  rural areas, particularly in Madhya Pradesh.
                </ListItem>
              </UnorderedList>
              <Heading size="md" color="#484848" fontWeight={500} mt={6}>
                Key Points:
              </Heading>
              <UnorderedList mt={4}>
                <ListItem>Available to ST students in Madhya Pradesh.</ListItem>
                <ListItem>Supports day scholars and hostellers.</ListItem>
                <ListItem>
                  Annual family income must be below ₹2,50,000.
                </ListItem>
                <ListItem>
                  Application deadline: 31st July, valid till 31st October.
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
            </Box>

            <Box m={4}>
              <Button className="custom-btn" type="submit" mt={4} width="100%" onClick={openModal}>
                Proceed To Apply
              </Button>
            </Box>
          </Box>
          </Box>
          <Modal  isCentered finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader className="border-bottom">
                <Box className="heading">Application Submitted</Box>
                <Box color="gray.600" fontWeight="300" fontSize={'18px'}>Confirmation</Box>
              </ModalHeader>
              <Divider />

              <ModalCloseButton />
              <ModalBody className="border-bottom">
              <Heading size="md" color="#484848" fontWeight={500} mt={6}>
              Your application to the <span className="text-blue">Pre-Matric Scholarship-SC </span> Benefit has been submitted!
              </Heading>
              <Box mt={4} mb={4}>Application ID : 1303</Box>
              
              </ModalBody>
              <ModalFooter>
                <Button className="custom-btn" type="submit" mt={4} m={2} width='100%'>
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

export default BenefitsDetails;
