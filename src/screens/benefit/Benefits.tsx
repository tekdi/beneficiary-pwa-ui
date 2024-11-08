import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import FloatingSelect from "../../components/common/input/FloatingSelect";
import BenefitCard from "../../components/common/Card";
import { scholarships } from "../../assets/mockdata/benefit";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";

const ExploreBenefits: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const handleOpen = () => {
    onOpen();
    console.log("Filter clicked");
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
    <Layout
      _heading={{
        heading: "Browse Benefits",
        isFilter: true,
        handleOpen: { handleOpen },
      }}
    >
      <Box className="card-scroll invisible_scroll">
        {/* Map through the scholarships data and render BenefitCard */}
        {scholarships.map((scholarship) => (
          <BenefitCard
            key={scholarship.title}
            date={scholarship.date}
            title={scholarship.title}
            ministry={scholarship.ministry}
            amount={scholarship.amount}
            categories={scholarship.categories}
            description={scholarship.description}
          />
        ))}

        <Box m={4}>
          <Button className="custom-btn" type="submit" mt={4} width="100%">
            Load More
          </Button>
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
            <CommonButton label="Apply Filters" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default ExploreBenefits;
