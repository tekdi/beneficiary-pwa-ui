import React from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, CloseIcon } from "@chakra-ui/icons";

interface Application {
  benefit_id: string;
  application_name: string;
  internal_application_id: string;
  status: "submitted" | "approved" | "rejected";
  application_data: Record<string, unknown>;
}

interface ApplicationListProps {
  applicationList?: Application[];
}

const STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  SUBMITTED: "submitted",
  DISBURSAL_COMPLETE: "disbursalComplete",
} as const;

const COLORS = {
  success: "#0B7B69",
  warning: "#EDA145",
  error: "#8C1823",
  text: "#1F1B13",
} as const;

const ICON_SIZES = {
  small: "8px",
  default: "18px",
} as const;

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  let icon = (
    <WarningIcon
      aria-label={`Status: ${status}`}
      color={COLORS.error}
      boxSize={ICON_SIZES.default}
    />
  );
  let text = (
    <Text fontSize="14px" color={COLORS.text}>
      {status}
    </Text>
  );

  if (status === STATUS.APPROVED) {
    icon = (
      <CheckCircleIcon color={COLORS.success} boxSize={ICON_SIZES.default} />
    );
    text = (
      <Text fontSize="14px" color={COLORS.text} ml="10px">
        Approved For Disbursal
      </Text>
    );
  } else if (status === STATUS.REJECTED) {
    icon = (
      <CloseIcon
        boxSize={ICON_SIZES.default}
        color="white"
        bg={COLORS.error}
        p="4px"
        borderRadius="50px"
      />
    );
  } else if (status === STATUS.SUBMITTED) {
    icon = (
      <CheckCircleIcon color={COLORS.warning} boxSize={ICON_SIZES.default} />
    );
  } else if (status === STATUS.DISBURSAL_COMPLETE) {
    icon = (
      <CheckCircleIcon
        color={COLORS.success}
        bg={COLORS.success}
        boxSize={ICON_SIZES.small}
        borderRadius="50px"
      />
    );
    text = (
      <Text fontSize="10px" color={COLORS.success}>
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
  applicationList = [],
}) => {
  const groupedApplications = React.useMemo(
    () =>
      applicationList.reduce((acc, app) => {
        if (!acc[app.status]) {
          acc[app.status] = [];
        }
        acc[app.status].push(app);
        return acc;
      }, {} as Record<Application["status"], Application[]>),
    [applicationList]
  );

  const statusOrder = [STATUS.SUBMITTED, STATUS.APPROVED, STATUS.REJECTED];

  return (
    <Box
      as="section"
      aria-label="Applications list"
      style={{
        height: "500px",
        overflowY: "scroll",
        paddingBottom: "100px",
        padding: "16px",
        width: "100%",
      }}
    >
      <VStack spacing={4} align="stretch">
        {statusOrder.map((status) =>
          groupedApplications[status]?.length > 0 ? (
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
                alignContent="center"
                width="100%"
                paddingLeft="16px"
              >
                <StatusIcon status={status} />
              </HStack>
              <VStack align="stretch" spacing={2}>
                {groupedApplications[status].map((app) => (
                  <HStack
                    key={app.benefit_id}
                    width="100%"
                    height={53}
                    padding="20px 8px 16px 16px"
                    justifyContent="space-between"
                  >
                    <Text fontSize="14px" color={COLORS.text} border="none">
                      {app.application_name}
                    </Text>
                    {status === STATUS.APPROVED && (
                      <StatusIcon status={STATUS.DISBURSAL_COMPLETE} />
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>
          ) : null
        )}
      </VStack>
    </Box>
  );
};

export default ApplicationList;
