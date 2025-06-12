import React, { useState, useEffect, useContext } from 'react';
import {
	Box,
	VStack,
	Text,
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
} from '@chakra-ui/react';
import { CheckCircleIcon, AttachmentIcon } from '@chakra-ui/icons';
import Layout from './common/layout/Layout';
import ScanVC from './ScanVC';
import { getDocumentsList, getUser } from '../services/auth/auth';
import { uploadUserDocuments } from '../services/user/User';
import { findDocumentStatus } from '../utils/jsHelper/helper';
import { AuthContext } from '../utils/context/checkToken';
import { fetchVCJson } from '../services/benefit/benefits';
import Loader from '../components/common/Loader';
interface Document {
	name: string;
	label: string;
	documentSubType: string;
	docType: string;
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

const DocumentScanner: React.FC<DocumentScannerProps> = ({
	userId,
	userData = [],
}) => {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null
	);
	const [documents, setDocuments] = useState<Document[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { updateUserData } = useContext(AuthContext)!;

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userResult = await getUser();
				const docsResult = await getDocumentsList();
				updateUserData(userResult.data, docsResult.data);
			} catch (error) {
				console.error('Failed to fetch user data', error);
			}
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const response = await getDocumentsList();
				console.log('Documents List:', response.data);
				const formattedDocuments = response.data
					.filter((doc: any) => doc.documentSubType !== 'aadhaar')
					.map((doc: any) => ({
						name: doc.name,
						label: doc.label,
						documentSubType: doc.documentSubType,
						docType: doc.docType,
					}));
				setDocuments(formattedDocuments);
			} catch (error) {
				console.error('Error fetching documents:', error);
				toast({
					title: 'Error',
					description: 'Failed to load documents',
					status: 'error',
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

		setIsLoading(true);

		try {
			console.log('Scanned QR code URL:', result);

			// Fetch VC JSON using the service method
			const jsonData = await fetchVCJson(result);
			console.log('jsonData', jsonData);

			if (!jsonData || typeof jsonData !== 'object') {
				throw new Error('Invalid document data structure');
			}

			const credentialTitle = jsonData?.credentialSchema?.title || '';

			const docConfig = documents.find(
				(doc) => doc.name === selectedDocument.name
			);
			if (!docConfig) {
				throw new Error('Invalid document type selected');
			}

			if (!credentialTitle.includes(docConfig.name)) {
				throw new Error(
					`Scanned document is not of type: ${docConfig.name}`
				);
			}

			// Prepare the document payload
			const documentPayload = [
				{
					doc_name: selectedDocument.name,
					doc_type: docConfig.docType,
					doc_subtype: docConfig.documentSubType,
					doc_data: jsonData,
					uploaded_at: new Date().toISOString(),
					imported_from: 'QR Code',
					doc_datatype: 'Application/JSON',
				},
			];

			// Upload the document
			await uploadUserDocuments(documentPayload);

			// Refresh user data to update the UI
			const userResult = await getUser();
			const docsResult = await getDocumentsList();
			updateUserData(userResult.data, docsResult.data);

			toast({
				title: 'Success',
				description: 'Document uploaded successfully',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			onClose(); // Close the modal
		} catch (error) {
			console.error('Error uploading document:', error);

			// Check for API error format
			const apiErrors = error?.response?.data?.errors;
			if (Array.isArray(apiErrors) && apiErrors.length > 0) {
				const errorMessages = apiErrors
					.map((errObj, idx) => `${idx + 1}. ${errObj.error ?? 'Unexpected error occurred'}`)
					.join('\n');
				toast({
					title: 'Error',
					description: (
						<Box as="span" whiteSpace="pre-line">
							{errorMessages}
						</Box>
					),
					status: 'error',
					duration: 10000,
					isClosable: true,
				});
			} else {
				toast({
					title: 'Error',
					description:
						error?.response?.data?.message ??
						(error instanceof Error ? error.message : 'Unexpected error occurred'),
					status: 'error',
					duration: 10000,
					isClosable: true,
				});
			}
		} finally {
			setIsLoading(false); // Hide loader
		}
	};

	const openUploadModal = (document: Document) => {
		setSelectedDocument(document);
		onOpen();
	};

	if (isLoading) {
		return <Loader />;
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
							const documentStatus = findDocumentStatus(
								userData || [],
								doc.documentSubType
							);
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
									<Text>{doc.label}</Text>
									<HStack
										key={`actions-${doc.documentSubType}-${index}`}
									>
										{documentStatus.matchFound && (
											<Icon
												key={`icon-${doc.documentSubType}-${index}`}
												as={CheckCircleIcon}
												color="green.500"
											/>
										)}
										<Button
											key={`button-${doc.documentSubType}-${index}`}
											size="sm"
											colorScheme="blue"
											onClick={() => openUploadModal(doc)}
											leftIcon={<AttachmentIcon />}
										>
											{documentStatus.matchFound
												? 'Re-upload'
												: 'Upload'}
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
					<ModalHeader>Scan {selectedDocument?.name}</ModalHeader>
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
