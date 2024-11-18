import * as React from "react";
import { VStack, Text, Icon, HStack, useTheme } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Loader from "./common/Loader";

interface StatusIconProps {
  status: boolean;
  size?: number;
  "aria-label"?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 5,
  "aria-label": ariaLabel,
}) => {
  const theme = useTheme();
  return (
    <Icon
      as={CheckCircleIcon}
      color={status ? theme.colors.success : theme.colors.error}
      boxSize={size}
      aria-label={
        ariaLabel || `Document status: ${status ? "Available" : "Incomplete"}`
      }
    />
  );
};

interface Document {
  name: string;
  code: string;
}

interface DocumentListProps {
  documents: Document[] | string[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const theme = useTheme();

  return documents && documents.length > 0 ? (
    <VStack
      align="stretch"
      backgroundColor={theme.colors.background}
      padding={0}
      spacing={0}
    >
      {documents.map((document) => (
        <HStack
          key={document.code}
          borderBottomWidth="1px"
          borderBottomColor={theme.colors.border}
          paddingY={3}
          alignItems="center"
          spacing={3}
          height={61}
          width="100%"
          pl={2}
        >
          {/* Default status to false if not provided */}
          <StatusIcon status={false} />
          <Text fontSize="16px" fontWeight="400" color={theme.colors.text}>
            {document.name}
          </Text>
        </HStack>
      ))}
    </VStack>
  ) : (
    <Loader />
  );
};

export default DocumentList;
