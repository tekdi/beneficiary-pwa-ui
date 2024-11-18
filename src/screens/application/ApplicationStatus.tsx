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

// Define a type for your application object if you have specific fields
type ApplicationType = {
  benefit_id: string;
  application_name: string;
  internal_application_id: string;
  status: "submitted" | "approved" | "rejected";
  application_data: Record<string, unknown>;
};

const ApplicationStatus: React.FC = () => {
  // Explicitly type applicationList as an array of ApplicationType
  const [applicationList, setApplicationList] = useState<ApplicationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const init = async (SearchText?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUser();
      const user_id = result?.data?.user_id;

      const data = await getApplicationList(SearchText, user_id);
      setApplicationList(data.data.applications || []); // Ensure it's an array
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to fetch applications: ${error.message}`);
      } else {
        setError(`Failed to fetch applications: ${String(error)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (error) {
    return (
      <Modal isOpen={true} onClose={() => setError(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Text>{error}</Text>
          </ModalBody>
          <ModalFooter>
            <CommonButton onClick={() => setError(null)} label="Close" />
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
          {applicationList.length > 0 ? (
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
