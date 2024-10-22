import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Divider,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link as RouterLink } from "react-router-dom";
import { MdOutlineFilterAlt } from "react-icons/md";
import FloatingSelect from "../common/FloatingSelect";

const ExploreBenefits: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    onOpen(); 
  };

  const [formData, setFormData] = useState({ name: "" });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const options = [
    { value: "10th", label: "10th" },
    { value: "12th", label: "12th" },
  ];
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
            <Grid
              templateColumns="repeat(2, 1fr)"
              className="border-bottom"
              mt={4}
              mb={2}
              p={2}
            >
              <GridItem>
                <Box>
                  <Heading as="h4" size="lg" mb={2} className="heading">
                    <ArrowBackIcon /> Browse Benefits
                  </Heading>
                </Box>
              </GridItem>
              <GridItem >
                <Box float={"right"} onClick={handleSubmit}>
                  <MdOutlineFilterAlt fontSize={"25px"} />
                </Box>
              </GridItem>
            </Grid>
            <Card
              maxW="2xl"
              m={4}
              shadow="lg"
              sx={{ border: "1px solid #ebe4e4c9", borderRadius: "10px" }}
            >
              <CardBody>
                <Box className="badge-box">31st July,2024</Box>
                <Heading size="md">Pre-Matric Scholarship-SC</Heading>
                <Heading size="sm" color="#484848" fontWeight={400} mt={2}>
                  Ministry of Social Justice
                </Heading>
                <Text fontSize="md" mt={2}>
                  ₹ 3500 INR 7700
                </Text>
                <Flex alignItems="center" mt={2} mb={2}>
                  <Box className="category-box" mr={2}>
                    sc
                  </Box>
                  <Box className="category-box" mr={2}>
                    madhya pradesh
                  </Box>
                  <Box className="category-box" mr={2}>
                    All genders
                  </Box>
                </Flex>
                <Text mt={4}>
                  The Pre-matric Scholarship-SC is provided by the Ministry of
                  Social Justice and the Tribal Welfare Department of Madhya
                  Pradesh. It supports Class 9 and 10 students from low-income
                  families with an annual income below ₹2,50,000. Both genders
                  are eligible.
                </Text>
              </CardBody>
              <Flex
                align="center"
                justify="center"
                width="100%"
                pt={2}
                mb={4}
                fontWeight={400}
              >
                <Link
                  className="text-blue"
                  as={RouterLink}
                  to="/benefitsdetails"
                >
                  View Details <ArrowForwardIcon />
                </Link>
              </Flex>
            </Card>
            <Card
              maxW="2xl"
              m={4}
              shadow="lg"
              sx={{ border: "1px solid #ebe4e4c9", borderRadius: "10px" }}
            >
              <CardBody>
                <Box className="badge-box">31st July,2024</Box>
                <Heading size="md">Pre-Matric Scholarship-SC</Heading>
                <Heading size="sm" color="#484848" fontWeight={400} mt={2}>
                  Ministry of Social Justice
                </Heading>
                <Text fontSize="md" mt={2}>
                  ₹ 3500 INR 7700
                </Text>
                <Flex alignItems="center" mt={2} mb={2}>
                  <Box className="category-box" mr={2}>
                    sc
                  </Box>
                  <Box className="category-box" mr={2}>
                    madhya pradesh
                  </Box>
                  <Box className="category-box" mr={2}>
                    All genders
                  </Box>
                </Flex>
                <Text mt={4}>
                  The Pre-matric Scholarship-SC is provided by the Ministry of
                  Social Justice and the Tribal Welfare Department of Madhya
                  Pradesh. It supports Class 9 and 10 students from low-income
                  families with an annual income below ₹2,50,000. Both genders
                  are eligible.
                </Text>
              </CardBody>
              <Flex
                align="center"
                justify="center"
                width="100%"
                pt={2}
                mb={4}
                fontWeight={400}
              >
                <Link
                  className="text-blue"
                  as={RouterLink}
                  to="/benefitsdetails"
                >
                  View Details <ArrowForwardIcon />
                </Link>
              </Flex>
            </Card>
            <Card
              maxW="2xl"
              m={4}
              shadow="lg"
              sx={{ border: "1px solid #ebe4e4c9", borderRadius: "10px" }}
            >
              <CardBody>
                <Box className="badge-box">31st July,2024</Box>
                <Heading size="md">Pre-Matric Scholarship-SC</Heading>
                <Heading size="sm" color="#484848" fontWeight={400} mt={2}>
                  Ministry of Social Justice
                </Heading>
                <Text fontSize="md" mt={2}>
                  ₹ 3500 INR 7700
                </Text>
                <Flex alignItems="center" mt={2} mb={2}>
                  <Box className="category-box" mr={2}>
                    sc
                  </Box>
                  <Box className="category-box" mr={2}>
                    madhya pradesh
                  </Box>
                  <Box className="category-box" mr={2}>
                    All genders
                  </Box>
                </Flex>
                <Text mt={4}>
                  The Pre-matric Scholarship-SC is provided by the Ministry of
                  Social Justice and the Tribal Welfare Department of Madhya
                  Pradesh. It supports Class 9 and 10 students from low-income
                  families with an annual income below ₹2,50,000. Both genders
                  are eligible.
                </Text>
              </CardBody>
              <Flex
                align="center"
                justify="center"
                width="100%"
                pt={2}
                mb={4}
                fontWeight={400}
              >
                <Link
                  className="text-blue"
                  as={RouterLink}
                  to="/benefitsdetails"
                >
                  View Details <ArrowForwardIcon />
                </Link>
              </Flex>
            </Card>
            <Card
              maxW="2xl"
              m={4}
              shadow="lg"
              sx={{ border: "1px solid #ebe4e4c9", borderRadius: "10px" }}
            >
              <CardBody>
                <Box className="badge-box">31st July,2024</Box>
                <Heading size="md">Pre-Matric Scholarship-SC</Heading>
                <Heading size="sm" color="#484848" fontWeight={400} mt={2}>
                  Ministry of Social Justice
                </Heading>
                <Text fontSize="md" mt={2}>
                  ₹ 3500 INR 7700
                </Text>
                <Flex alignItems="center" mt={2} mb={2}>
                  <Box className="category-box" mr={2}>
                    sc
                  </Box>
                  <Box className="category-box" mr={2}>
                    madhya pradesh
                  </Box>
                  <Box className="category-box" mr={2}>
                    All genders
                  </Box>
                </Flex>
                <Text mt={4}>
                  The Pre-matric Scholarship-SC is provided by the Ministry of
                  Social Justice and the Tribal Welfare Department of Madhya
                  Pradesh. It supports Class 9 and 10 students from low-income
                  families with an annual income below ₹2,50,000. Both genders
                  are eligible.
                </Text>
              </CardBody>
              <Flex
                align="center"
                justify="center"
                width="100%"
                pt={2}
                mb={4}
                fontWeight={400}
              >
                <Link
                  className="text-blue"
                  as={RouterLink}
                  to="/benefitsdetails"
                >
                  View Details <ArrowForwardIcon />
                </Link>
              </Flex>
            </Card>
            <Box m={4}>
              <Button className="custom-btn" type="submit" mt={4} width="100%">
                Load More
              </Button>
            </Box>
          </Box>
          <Modal  isCentered finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader className="border-bottom">
                <Box className="heading">Filters</Box>
              </ModalHeader>
              <Divider />

              <ModalCloseButton />
              <ModalBody>
                
              <FormControl>
                <FloatingSelect
                  label="Education level"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  options={options}
                />
                <FloatingSelect
                  label="Gender"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  options={options}
                />
                <FloatingSelect
                  label="Annual Income"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  options={options}
                />
                <FloatingSelect
                  label="Benefit Amount"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  options={options}
                />
                <FloatingSelect
                  label="Subject"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  options={options}
                />
              </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button className="custom-btn" type="submit" mt={4} m={2} width='100%'>
                  Apply Filters
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

export default ExploreBenefits;
