// CommonDialogue.js
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import OutlineButton from "../button/OutlineButton";
import CommonButton from "../button/Button";
import { useState } from "react";

interface CommonDialogueProps {
  isOpen: boolean;
  onClose: () => void;
  termsAndConditions: boolean;
}

const CommonDialogue: React.FC<CommonDialogueProps> = ({
  isOpen,
  onClose,
  termsAndConditions,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const handleAccordionChange = (expandedIndex) => {
    setIsAccordionOpen(expandedIndex.length > 0);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="md">
        <ModalHeader className="border-bottom">
          {termsAndConditions && (
            <>
              <Box className="heading">Terms and Conditions</Box>
              <Box color="gray.600" fontWeight="300" fontSize="18px">
                Confirmation
              </Box>
            </>
          )}
        </ModalHeader>
        <ModalCloseButton />
        {/* modal body for upload document component */}
        {/* <ModalBody className="border-bottom">
          <Text mt={4} mb={6} fontWeight="500" fontSize="20px">
            Please upload the required documents to proceed with completing your
            profile.
          </Text>
          <Text mt={2} mb={2} fontWeight="normal" fontSize="17px">
            Upload the relevant document in .json or XML format.
          </Text>
          <UploadDocuments />
        </ModalBody> */}
        <ModalBody className="border-bottom">
          {termsAndConditions ? (
            <>
              <Text mt={4} mb={10} fontWeight="500" fontSize="20px">
                Share my documents with the provider for processing my
                application
              </Text>
              <Text mt={4} mb={4} fontWeight="normal" fontSize="17px">
                Read and accept before you proceed
              </Text>
              <Accordion allowMultiple onChange={handleAccordionChange}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Terms and Conditions
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          {termsAndConditions ? (
            <>
              <OutlineButton
                onClick={onClose}
                label="Deny"
                disabled={!isAccordionOpen}
              />
              <Box ml={2}>
                <CommonButton label="Accept" isDisabled={!isAccordionOpen} />
              </Box>
            </>
          ) : (
            ""
          )}
          {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommonDialogue;
