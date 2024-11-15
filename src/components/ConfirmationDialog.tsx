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
  Button,
  HStack,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import SubmitDialog from "./SubmitDialog";
import { useTranslation } from "react-i18next";
import Loader from "./common/Loader";

interface ConfirmationDialogProps {
  dialogVisible: boolean;
  closeDialog: (isVisible: boolean) => void;
  handleConfirmation: () => Promise<void>;
  loading?: boolean;
  consentText?: string;
  documents?: string[];
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogVisible,
  closeDialog,
  handleConfirmation,
  loading = false,
  consentText,
}) => {
  const { t } = useTranslation();

  consentText = consentText || t("CONFIRMATION_DIALOGUE_CONSENT_TEXT");

  // Function to call the parent's function
  const sendCloseDialog = () => {
    closeDialog(false);
  };

  const openSubmitDialog = async () => {
    if (handleConfirmation) {
      handleConfirmation();
      // navigate("/userprofile");
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

            <ModalBody py={4} className="card-scroll invisible_scroll">
              <Text fontSize="md" mb={4} color="gray.600">
                {consentText}
              </Text>
              <VStack>
                {/* need to add new document list as per figma {loading ? <Loader /> : <DocumentList documents={documents} />} */}
                {loading ? <Loader /> : <Text>List of documents</Text>}
              </VStack>
            </ModalBody>

            <ModalFooter display="flex" justifyContent="space-between" mt={4}>
              {loading ? (
                <Loader />
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
