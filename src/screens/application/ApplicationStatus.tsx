import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import "../../assets/styles/App.css";
import Layout from "../../components/common/layout/Layout";
import ApplicationList from "../../components/ApplicationList";
import { applicationList } from "../../assets/mockdata/applicationList";

const MyApplications: React.FC = () => {
  return (
    <Layout
      _heading={{
        heading: "My Applications",
        subHeading: "Track your application progress",
      }}
    >
      <Box>
        <Stack>
          <ApplicationList applicationList={applicationList} />
        </Stack>
      </Box>
    </Layout>
  );
};

export default MyApplications;
