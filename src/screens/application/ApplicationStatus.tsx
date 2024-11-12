import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import Layout from "../../components/common/layout/Layout";
import ApplicationList from "../../components/ApplicationList";

import { getApplicationList, getUser } from "../../services/auth/auth";
import CommonButton from "../../components/common/button/Button";

const ApplicationStatus: React.FC = () => {
  const [applicationList, setApplicationList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const init = async (SearchText?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUser();

      const user_id = result?.data?.user_id;

      const data = await getApplicationList(SearchText, user_id);

      setApplicationList(data.data.applications);
    } catch (error) {
      setError("Failed to fetch applications");
      throw new Error(`Failed to fetch applications: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    init();
  }, []);
  if (error) {
    return (
      <Modal isOpen={true} onClose={() => setError("")}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Text>{error}</Text>
          </ModalBody>
          <ModalFooter>
            <CommonButton onClick={() => setError("")} label="Close" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <Layout
      loading={isLoading}
      _heading={{
        heading: "My Applications",
        subHeading: "Track your application progress",
        isFilter: true,
        onSearch: init,
      }}
      isSearchbar={true}
    >
      <Box>
        <Stack spacing={4}>
          {applicationList?.length ? (
            <ApplicationList applicationList={applicationList} />
          ) : (
            <Box textAlign="center" pt={"30%"}>
              No applications found
            </Box>
          )}
        </Stack>
      </Box>
    </Layout>
  );
};

export default ApplicationStatus;
