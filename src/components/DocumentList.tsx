import * as React from "react";
import { VStack, Text, Spinner, Icon, HStack } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

interface Document {
  name: string;
}

interface DocumentListProps {
  documents: Document[];
}

const LeftIcon: React.FC<{ status: boolean }> = ({ status }) => {
  return (
    <Icon
      as={status ? CheckCircleIcon : WarningIcon}
      color={status ? "#0B7B69" : "#EDA145"}
      boxSize={4}
    />
  );
};

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  return documents && documents.length > 0 ? (
    <VStack align="stretch" backgroundColor="#FFFFFF" padding={0} spacing={0}>
      {documents.map((document) => (
        <HStack
          key={document.name}
          borderBottomWidth="1px"
          borderBottomColor="#DDDDDD"
          paddingY={3}
          alignItems="center"
          spacing={3}
          height={61}
          width="100%"
          pl={7}
        >
          <LeftIcon status={true} />
          <Text fontSize="14px" fontWeight="400" color="#1F1B13">
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
