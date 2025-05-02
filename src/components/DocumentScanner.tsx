import React, { useState, useEffect, useContext } from 'react';
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
import { getDocumentsList, getUser } from '../services/auth/auth';
import { uploadUserDocuments } from '../services/user/User';
import { findDocumentStatus } from '../utils/jsHelper/helper';
import { AuthContext } from '../utils/context/checkToken';

interface Document {
  name: string;
  documentSubType: string;
}

interface UserDocument {
  doc_id: string;
  user_id: string;
  doc_type: string;
  doc_subtype: string;
  doc_name: string;
  imported_from: string;
  doc_path: string;
  doc_data: string;
  doc_datatype: string;
  doc_verified: boolean;
  uploaded_at: string;
  is_uploaded: boolean;
}

interface DocumentScannerProps {
  userId: string;
  userData: UserDocument[];
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ userId, userData = [] }) => {
  const theme = useTheme();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateUserData } = useContext(AuthContext)!;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocumentsList();
        const formattedDocuments = response.data.map((doc: any) => ({
          name: doc.name,
          documentSubType: doc.documentSubType,
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
      //   vcUrl = 'https://verifydemo.dhiway.com/m/8d1b9076-0879-4f1b-b972-9131d3b81c5a.vc'

      // Fetch JSON data from the .vc endpoint
      const response = await fetch(vcUrl);
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch document data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw new Error('Failed to fetch document data');
      }

      let jsonData;
      try {
        jsonData = await response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid document data format",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw new Error('Invalid document data format');
      }

      if (!jsonData || typeof jsonData !== 'object') {
        toast({
          title: "Error",
          description: "Invalid document data structure",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw new Error('Invalid document data structure');
      }

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

      // Refresh user data to update the UI
      const userResult = await getUser();
      const docsResult = await getDocumentsList();
      updateUserData(userResult.data, docsResult.data);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
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
            {documents.map((doc, index) => {
              const documentStatus = findDocumentStatus(userData || [], doc.documentSubType);
              return (
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
                    {documentStatus.matchFound && (
                      <Icon key={`icon-${doc.documentSubType}-${index}`} as={CheckCircleIcon} color="green.500" />
                    )}
                    <Button
                      key={`button-${doc.documentSubType}-${index}`}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => openUploadModal(doc)}
                      leftIcon={<AttachmentIcon />}
                    >
                      {documentStatus.matchFound ? 'Re-upload' : 'Upload'}
                    </Button>
                  </HStack>
                </ListItem>
              );
            })}
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