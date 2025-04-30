import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  useTheme,
  Button,
  HStack,
  useToast,
  List,
  ListItem,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { CheckCircleIcon, AttachmentIcon } from '@chakra-ui/icons';
import Layout from './common/layout/Layout';
import ScanVC from './ScanVC';
import { getDocumentsList } from '../services/auth/auth';
import { uploadUserDocuments } from '../services/user/User';

interface Document {
  name: string;
  documentSubType: string;
  isUploaded?: boolean;
}

interface DocumentScannerProps {
  userId: string;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ userId }) => {
  const theme = useTheme();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocumentsList();
        const formattedDocuments = response.data.map((doc: any) => ({
          name: doc.name,
          documentSubType: doc.documentSubType,
          isUploaded: false
        }));
        setDocuments(formattedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Failed to load documents",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleScanResult = async (result: string) => {
    if (!selectedDocument) return;

    try {
      // Append .vc to the URL if not already present
      let vcUrl = result.endsWith('.vc') ? result : `${result}.vc`;
      console.log('vcUrl', vcUrl);
      vcUrl = 'https://verifydemo.dhiway.com/m/8d1b9076-0879-4f1b-b972-9131d3b81c5a.vc'

      // Fetch JSON data from the .vc endpoint
      const response = await fetch(vcUrl);
      const jsonData = await response.json();

      // Prepare the document payload
      const documentPayload = [{
        doc_name: selectedDocument.name,
        doc_type: selectedDocument.documentSubType.toLowerCase(),
        doc_subtype: selectedDocument.documentSubType,
        doc_data: jsonData,
        uploaded_at: new Date().toISOString(),
        imported_from: "e-wallet",
        doc_datatype: "Application/JSON"
      }];

      // Upload the document
      await uploadUserDocuments(documentPayload);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update the document's uploaded status
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.documentSubType === selectedDocument.documentSubType
            ? { ...doc, isUploaded: true }
            : doc
        )
      );

    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
  };

  const openUploadModal = (document: Document) => {
    setSelectedDocument(document);
    onOpen();
  };

  if (isLoading) {
    return (
      <Layout
        _heading={{
          heading: 'Document Scanner',
          handleBack: () => window.history.back(),
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout
      _heading={{
        heading: 'Document Scanner',
        handleBack: () => window.history.back(),
      }}
    >
      <Box shadow="md" borderWidth="1px" borderRadius="md" p={4}>
        <VStack spacing={4} align="stretch">
          <List spacing={3}>
            {documents.map((doc, index) => (
              <ListItem
                key={`doc-${doc.documentSubType}-${index}`}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text>{doc.name}</Text>
                <HStack key={`actions-${doc.documentSubType}-${index}`}>
                  {doc.isUploaded && (
                    <Icon key={`icon-${doc.documentSubType}-${index}`} as={CheckCircleIcon} color="green.500" />
                  )}
                  <Button
                    key={`button-${doc.documentSubType}-${index}`}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => openUploadModal(doc)}
                    leftIcon={<AttachmentIcon />}
                  >
                    {doc.isUploaded ? 'Re-upload' : 'Upload'}
                  </Button>
                </HStack>
              </ListItem>
            ))}
          </List>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Scan {selectedDocument?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ScanVC onScanResult={handleScanResult} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default DocumentScanner; 