import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  IconButton,
  VStack,
  Spinner,
  ListItem,
  Button,
  HStack,
  UnorderedList,
} from "@chakra-ui/react";

import { CloseIcon, CheckIcon } from "@chakra-ui/icons";
import SubmitDialog from "./SubmitDialog";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import CustomButton from "./common/button/Button";

interface Document {
  name: string;
}

interface ConfirmationDialogProps {
  dialogVisible: boolean;
  closeDialog: (isVisible: boolean) => void;
  handleConfirmation: () => Promise<void>;
  documents?: Document[];
  loading?: boolean;
  consentText?: string;
}

const LeftIcon: React.FC = () => <CheckIcon color="blue.600" w={5} h={5} />;

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogVisible,
  closeDialog,
  handleConfirmation,
  documents = [],
  loading = false,
  consentText,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  consentText = consentText || t("CONFIRMATION_DIALOGUE_CONSENT_TEXT");

  // Function to call the parent's function
  const sendCloseDialog = () => {
    closeDialog(false);
  };

  const openSubmitDialog = async () => {
    if (handleConfirmation) {
      handleConfirmation();
      navigate("/userprofile");
    }
  };
  const closeSubmitDialog = () => {
    closeDialog(false);
  };

  return (
    <VStack>
      {typeof dialogVisible !== "boolean" ? (
        <SubmitDialog
          dialogVisible={dialogVisible}
          closeSubmit={closeSubmitDialog}
        />
      ) : (
        <Modal isOpen={dialogVisible} onClose={sendCloseDialog} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px"
              borderColor="gray.200"
            >
              <Text fontSize="lg" fontWeight="medium" color="gray.700">
                {t("CONFIRMATION_DIALOGUE_SHARE_INFORMATION")}
              </Text>
              <IconButton
                icon={<CloseIcon />}
                onClick={sendCloseDialog}
                variant="ghost"
                aria-label="Close modal"
              />
            </ModalHeader>

            <ModalBody py={4}>
              <Text fontSize="md" mb={4} color="gray.600">
                {consentText}
              </Text>
              <VStack spacing={3}>
                {loading ? (
                  <Spinner color="blue.600" />
                ) : (
                  <UnorderedList mt={4}>
                    {documents.map((document) => (
                      <ListItem key={document.name} display="flex">
                        <LeftIcon />
                        <Text
                          ml={3}
                          fontSize="sm"
                          fontWeight="normal"
                          color="gray.700"
                        >
                          {document.name}
                        </Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter display="flex" justifyContent="space-between" mt={4}>
              {loading ? (
                <Spinner color="blue.600" />
              ) : (
                <HStack spacing={4}>
                  <Button variant="outline" onClick={sendCloseDialog} size="md">
                    {t("CONFIRMATION_DIALOGUE_DENY")}
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={openSubmitDialog}
                    size="md"
                  >
                    {t("CONFIRMATION_DIALOGUE_ACCEPT")}
                  </Button>
                </HStack>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default ConfirmationDialog;
