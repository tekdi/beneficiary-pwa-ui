import React from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, CloseIcon } from "@chakra-ui/icons";

interface Application {
  benefit_id: string;
  application_name: string;
  internal_application_id: string;
  status: string;
}

interface ApplicationListProps {
  applicationList: Application[];
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  let icon = <WarningIcon color="red.500" />;
  let text = (
    <Text fontSize="14px" color={"#1F1B13"}>
      {status}
    </Text>
  );
  if (status === "Approved") {
    icon = <CheckCircleIcon color="#0B7B69" boxSize="18px" />;
    text = (
      <Text fontSize="14px" color="#1F1B13" ml={"10px"}>
        Approved For Disbursal
      </Text>
    );
  } else if (status === "Rejected") {
    icon = (
      <CloseIcon
        boxSize="18px"
        color="white"
        bg={"#8C1823"}
        p={"4px"}
        borderRadius={"50px"}
      />
    );
  } else if (status === "Submitted") {
    icon = <CheckCircleIcon color="#EDA145" boxSize="18px" />;
  } else if (status === "disbursalComplete") {
    icon = (
      <CheckCircleIcon
        color="#0B7B69"
        bg="#0B7B69"
        boxSize="8px"
        borderRadius="50px"
      />
    );
    text = (
      <Text fontSize="10px" color="#0B7B69">
        Disbursal Complete
      </Text>
    );
  }
  return (
    <HStack alignItems="center">
      {icon}
      {text}
    </HStack>
  );
};

const ApplicationList: React.FC<ApplicationListProps> = ({
  applicationList,
}) => {
  const groupedApplications = {
    Submitted: applicationList.filter((app) => app.status === "Submitted"),
    Approved: applicationList.filter((app) => app.status === "Approved"),
    Rejected: applicationList.filter((app) => app.status === "Rejected"),
  };

  return (
    <VStack
      spacing={4}
      h="500px"
      p={4}
      width="100%"
      overflowY={"scroll"}
      pb={100}
    >
      {Object.keys(groupedApplications).map(
        (status) =>
          groupedApplications[status as keyof typeof groupedApplications]
            .length > 0 && (
            <Box
              key={status}
              borderRadius={10}
              bg="#FFFFFF"
              shadow="md"
              borderWidth="0.5px"
              borderColor="#DDDDDD"
              width="100%"
            >
              <HStack
                alignItems="center"
                borderBottom="1px"
                borderColor="#DDDDDD"
                height="56px"
                alignContent={"center"}
                width={"100%"}
                paddingLeft={"16px"}
              >
                <StatusIcon status={status} />
              </HStack>

              <VStack align="stretch" spacing={2}>
                {groupedApplications[
                  status as keyof typeof groupedApplications
                ].map((app) => (
                  <HStack
                    key={app.benefit_id}
                    width="100%"
                    height={53}
                    padding="20px 8px 16px 16px"
                    justifyContent="space-between"
                    // bg={"grey"}
                  >
                    <Text fontSize={"14px"} color="#1F1B13" border={"none"}>
                      {app.application_name}
                    </Text>
                    {status === "Approved" && (
                      <StatusIcon status="disbursalComplete" />
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>
          )
      )}
    </VStack>
  );
};

export default ApplicationList;
