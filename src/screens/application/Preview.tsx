import React from "react";
import { Box, useDisclosure, Stack } from "@chakra-ui/react";
import "../../assets/styles/App.css";
import CustomDisableInput from "../../components/common/input/DisabledInput";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import { useNavigate } from "react-router-dom";
// import ConfirmationDialog from "../../components/common/ConfirmationDialog";

const Preview: React.FC = () => {
  const { onOpen } = useDisclosure();

  const navigate = useNavigate();

  const openModal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOpen();
  };

  // const closeModal = () => {
  //   onClose();
  // };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Layout
      _heading={{
        heading: "My Applications",
        subHeading: `Application ID 1308`,
        handleBack,
      }}
    >
      <Box className="card-scroll invisible_scroll">
        <Box maxW="2xl" m={4} className="border-bottom">
          <Stack gap="4" align="flex-start">
            <CustomDisableInput label="Full Name" placeholder="Anay Gupta" />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput label="Gender" placeholder="Male" />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput label="Age" placeholder="14" />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput label="Class" placeholder="10th " />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput label="Marks" placeholder="80%" />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput label="Disability" placeholder="80%" />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput label="Annual Income" placeholder="7,00,000" />
          </Stack>
          <Stack gap="4" align="flex-start" mt={2}>
            <CustomDisableInput
              label="Parent Occupation"
              placeholder="Cleaness worker"
            />
          </Stack>
        </Box>
        <Box m={4}>
          <CommonButton onClick={openModal} label="Confirm Submission" />
        </Box>
      </Box>
      {/* <ConfirmationDialog isOpen={isOpen} onClose={onClose} /> */}
    </Layout>
  );
};

export default Preview;
