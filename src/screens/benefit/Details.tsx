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
import "../../assets/styles/App.css";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import OutlineButton from "../../components/common/button/OutlineButton";
import Layout from "../../components/common/layout/Layout";
import HeadingText from "../../components/common/layout/HeadingText";

const BenefitsDetails: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const navigate = useNavigate();

  const redirectToPreviewApplication = () => {
    navigate("/previewapplication");
  };

  const openModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOpen();
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Layout isNavbar={true}>
      <Box className="card-scroll">
        <HeadingText
          heading="Pre-Matric Scholarship-ST"
          beneficiary={false}
          handleBack={handleBack}
        />

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
              they are benefiting from another government scholarship, and it is
              available for one year if the student fails.
            </Text>
            <Heading size="md" color="#484848" fontWeight={500} mt={6}>
              Objectives of the Pre-matric <br />
              Scholarship-ST:
            </Heading>
            <UnorderedList mt={4}>
              <ListItem>
                Provide financial assistance to ST students in Classes 9 and 10
                to encourage continued education.
              </ListItem>
              <ListItem>
                Support low-income families by reducing the financial burden of
                schooling.
              </ListItem>
              <ListItem>
                Promote equal educational opportunities for students with
                disabilities through higher financial aid.
              </ListItem>
              <ListItem>
                Reduce dropout rates among ST students by offering incentives to
                complete secondary education.
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
              <ListItem>Annual family income must be below ₹2,50,000.</ListItem>
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
            <CommonButton onClick={openModal} label="Proceed To Apply" />
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
            <Box className="heading">Terms and Conditions</Box>
            <Box color="gray.600" fontWeight="300" fontSize={"18px"}>
              Confirmation
            </Box>
          </ModalHeader>
          <Divider />

          <ModalCloseButton />
          <ModalBody className="border-bottom">
            <Text mt={4} mb={10} fontWeight="500" fontSize={"20px"}>
              {" "}
              Share my documents with the provider for processing my application
            </Text>
            <Text mt={4} mb={4} fontWeight="normal" fontSize={"17px"}>
              Read and accept before you proceed
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <OutlineButton onClick={onClose} label="Deny" />
            <CommonButton
              onClick={redirectToPreviewApplication}
              label="Accept"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
    </Layout>
  );
};

export default BenefitsDetails;
