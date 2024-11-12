import * as React from "react";
import {
  VStack,
  Text,
  Spinner,
  Icon,
  HStack,
  useTheme,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

interface Document {
  name: string;
  status: boolean; // Added status field for your component logic
}

interface DocumentListProps {
  documents: Document[];
}

interface StatusIconProps {
  status: boolean;
  size?: number;
  "aria-label"?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 4,
  "aria-label": ariaLabel,
}) => {
  const theme = useTheme();
  return (
    <Icon
      as={status ? CheckCircleIcon : WarningIcon}
      color={status ? theme.colors.success : theme.colors.warning} // Use theme tokens
      boxSize={size}
      aria-label={
        ariaLabel || `Document status: ${status ? "Available" : "Missing"}`
      }
    />
  );
};

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
          key={document.name}
          borderBottomWidth="1px"
          borderBottomColor={theme.colors.border} // Use theme token for border
          paddingY={3}
          alignItems="center"
          spacing={3}
          height={61}
          width="100%"
          pl={7}
        >
          <StatusIcon status={document.status} />
          <Text fontSize="14px" fontWeight="400" color={theme.colors.text}>
            {" "}
            {document.name}
          </Text>
        </HStack>
      ))}
    </VStack>
  ) : (
    <Spinner />
  );
};

export default DocumentList;
