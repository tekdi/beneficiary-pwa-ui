import * as React from "react";
import {
  Button,
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

interface SubmitDialogProps {
  dialogVisible: boolean | { name?: string; orderId?: string };
  closeSubmit: (visible: boolean) => void;
}

const SubmitDialog: React.FC<SubmitDialogProps> = ({
  dialogVisible,
  closeSubmit,
}) => {
  const navigate = useNavigate();

  const sendCloseDialog = () => {
    closeSubmit(false);
    navigate("/BenefitsListing");
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
              Share Information
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
              Confirmation
            </Text>
            <Text fontSize="md" color="gray.700">
              Your application to the{" "}
              <Text as="span" color="blue.600" fontWeight="medium">
                {typeof dialogVisible === "object" && dialogVisible.name}
              </Text>{" "}
              Benefit has been submitted!
            </Text>
            <Text fontSize="sm" color="gray.500" mt={3}>
              Application ID:{" "}
              {typeof dialogVisible === "object" && dialogVisible.orderId}
            </Text>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={sendCloseDialog}
              size="md"
              w={32}
            >
              Okay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default SubmitDialog;
