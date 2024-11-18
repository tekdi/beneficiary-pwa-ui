import * as React from "react";
import {
  Text,
  IconButton,
  VStack,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CommonButton from "./common/button/Button";

interface SubmitDialogProps {
  dialogVisible: { name?: string; orderId?: string } | undefined;
  closeSubmit: (visible: boolean) => void;
}

const SubmitDialog: React.FC<SubmitDialogProps> = ({
  dialogVisible,
  closeSubmit,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sendCloseDialog = () => {
    closeSubmit(false);
    navigate("/explorebenefits");
  };

  return (
    <VStack>
      <Modal isOpen={!!dialogVisible} onClose={sendCloseDialog} size="lg">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md" p={5}>
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
          >
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              {t("SUBMIT_DIALOGUE_HEADING_TEXT")}
            </Text>
            <IconButton
              icon={<CloseIcon />}
              onClick={sendCloseDialog}
              variant="ghost"
              aria-label="Close modal"
            />
          </ModalHeader>

          <ModalBody py={4}>
            <Text fontSize="md" color="gray.700">
              {t("SUBMIT_DIALOGUE_CONTENT_TEXT")}
              <Text as="span" color="blue.600" fontWeight="medium">
                {dialogVisible?.name || ""}
              </Text>{" "}
              {t("SUBMIT_DIALOGUE_SUBMITTED_TEXT")}!
            </Text>
            <Text fontSize="sm" color="gray.500" mt={3}>
              {t("SUBMIT_DIALOGUE_APPLICATION_ID_TEXT")}:{" "}
              <Text as="span" fontWeight="medium">
                {dialogVisible?.orderId || ""}
              </Text>{" "}
            </Text>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <CommonButton
              onClick={sendCloseDialog}
              width={"40%"}
              label={t("SUBMIT_DIALOGUE_BUTTON")}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default SubmitDialog;
