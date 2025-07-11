import React, { useState, useEffect } from 'react';
import {
	VStack,
	HStack,
	Box,
	Text,
	Button,
	FormControl,
	FormLabel,
	Input,
	Card,
	CardBody,
	IconButton,
	FormErrorMessage,
	useToast,
	Alert,
	AlertIcon,
	Divider,
	Textarea,
	Flex,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { updateMapping, getMapping } from '../services/admin/admin';

const DocumentConfigurationTab = () => {
	const toast = useToast();

	// --- State for document configurations and errors ---
	const [documentConfigs, setDocumentConfigs] = useState([]); // List of document configurations
	const [errors, setErrors] = useState({}); // Validation errors
	const [loading, setLoading] = useState(false); // Loading state

	// --- Fetch document configurations from API ---
	useEffect(() => {
		const fetchConfigs = async () => {
			setLoading(true);
			try {
				const data = await getMapping('vcConfiguration');
				// Map API response to local state structure
				if (Array.isArray(data.data.value) && data.data.value.length > 0) {
					const mapped = data.data.value.map((item, idx) => ({
						id: Date.now() + idx,
						name: item.name || '',
						label: item.label || '',
						documentSubType: item.documentSubType || '',
						docType: item.docType || '',
						vcFields: typeof item.vcFields === 'string' ? item.vcFields : (item.vcFields ? JSON.stringify(item.vcFields) : ''),
					}));
					setDocumentConfigs(mapped);
				} else {
					setDocumentConfigs([
						{
							id: Date.now(),
							name: '',
							label: '',
							documentSubType: '',
							docType: '',
							vcFields: '',
						},
					]);
				}
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to fetch document configurations',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			} finally {
				setLoading(false);
			}
		};
		fetchConfigs();
	}, []);

	// --- Validate vcFields JSON structure ---
	const validateVcFields = (value) => {
		if (!value || value.trim() === '') return true;
		try {
			const parsed = JSON.parse(value);
			if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) return false;
			for (const key in parsed) {
				if (
					!parsed[key] ||
					typeof parsed[key] !== 'object' ||
					Array.isArray(parsed[key]) ||
					!('type' in parsed[key]) ||
					typeof parsed[key].type !== 'string'
				) {
					return false;
				}
			}
			return true;
		} catch {
			return false;
		}
	};

	// --- Handle input changes and validate fields ---
	const handleChange = (index: number, field: string, value: string) => {
		const updated = [...documentConfigs];
		updated[index][field] = value;
		setDocumentConfigs(updated);

		const newErrors = { ...errors };
		delete newErrors[`${field}_${index}`];
		// If the field is 'vcFields', validate JSON and structure
		if (field === 'vcFields') {
			if (value.trim() !== '' && !validateVcFields(value)) {
				newErrors[`vcFields_${index}`] =
					'Invalid format: Must be a JSON object where each key is a field name and its value is an object with a "type" property.';
			} else {
				delete newErrors[`vcFields_${index}`];
			}
		}
		setErrors(newErrors);
	};

	// --- Add and remove document configuration blocks ---
	const addConfig = () => {
		setDocumentConfigs([
			...documentConfigs,
			{
				id: Date.now(),
				name: '',
				label: '',
				documentSubType: '',
				docType: '',
				vcFields: '', // New field
			},
		]);
	};

	const removeConfig = (index: number) => {
		const updated = [...documentConfigs];
		updated.splice(index, 1);
		setDocumentConfigs(updated);
	};

	// --- Save all document configurations to the backend ---
	const handleSaveAll = async () => {
		let hasError = false;
		const newErrors = {};
		// Validate all required fields and vcFields structure
		documentConfigs.forEach((doc, index) => {
			['name', 'label', 'documentSubType', 'docType'].forEach((field) => {
				if (!doc[field]) {
					newErrors[`${field}_${index}`] = `${field} is required`;
					hasError = true;
				}
			});
			if (doc.vcFields && doc.vcFields.trim() !== '') {
				if (!validateVcFields(doc.vcFields)) {
					newErrors[`vcFields_${index}`] =
						'Invalid format: Must be a JSON object where each key is a field name and its value is an object with a "type" property.';
					hasError = true;
				} else {
					delete newErrors[`vcFields_${index}`];
				}
			}
		});
		setErrors(newErrors);
		if (hasError) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all fields and ensure VC fields are valid JSON with the correct structure.',
				status: 'error',
			});
			return;
		}
		try {
			// Prepare and send the payload
			const saveData = documentConfigs.map((doc) => ({
				name: doc.name,
				label: doc.label,
				documentSubType: doc.documentSubType,
				docType: doc.docType,
				vcFields: doc.vcFields,
			}));
			await updateMapping(saveData, 'vcConfiguration');
			toast({
				title: 'Success',
				description: `${documentConfigs.length} document configurations saved.`,
				status: 'success',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to save document configurations',
				status: 'error',
			});
		}
	};

	return (
		<VStack spacing={6} align="stretch">
			<Alert status="info">
				<AlertIcon />
				<Box>
					<Text fontSize="lg" fontWeight="semibold" color="blue.700">
						Document Configuration
					</Text>
					<Text fontSize="sm" color="gray.600">
						Add multiple document configurations used for document verification.
					</Text>
				</Box>
			</Alert>

			<Box>
				<Flex justify="space-between" align="center" mb={4}>
					<Text fontSize="xl" fontWeight="bold" color="blue.700">
						Document Configurations
					</Text>
				</Flex>

				<VStack spacing={4} align="stretch">
					{documentConfigs.map((doc, index) => (
						<Card
							key={doc.id}
							borderColor="blue.200"
							borderWidth="1px"
							bg="white"
						>
							<CardBody>
								<VStack spacing={4} align="stretch">
									<HStack justify="flex-end">
										<IconButton
											icon={<DeleteIcon />}
											colorScheme="red"
											aria-label="Remove"
											size="sm"
											variant="ghost"
											onClick={() => removeConfig(index)}
											isDisabled={documentConfigs.length === 1}
										/>
									</HStack>

									<HStack spacing={4} align="start">
										<FormControl
											isInvalid={!!errors[`name_${index}`]}
											flex={1}
										>
											<FormLabel fontSize="sm" fontWeight="semibold" color="blue.700">Document Name</FormLabel>
											<Input
												value={doc.name}
												onChange={(e) => handleChange(index, 'name', e.target.value)}
												borderColor="blue.400"
												borderWidth="2px"
												bg="white"
												size="sm"
											/>
											<FormErrorMessage fontSize="xs">{errors[`name_${index}`]}</FormErrorMessage>
										</FormControl>

										<FormControl
											isInvalid={!!errors[`label_${index}`]}
											flex={1}
										>
											<FormLabel fontSize="sm" fontWeight="semibold" color="blue.700">Document Label</FormLabel>
											<Input
												value={doc.label}
												onChange={(e) => handleChange(index, 'label', e.target.value)}
												borderColor="blue.400"
												borderWidth="2px"
												bg="white"
												size="sm"
											/>
											<FormErrorMessage fontSize="xs">{errors[`label_${index}`]}</FormErrorMessage>
										</FormControl>
									</HStack>

									<HStack spacing={4} align="start">
										<FormControl
											isInvalid={!!errors[`documentSubType_${index}`]}
											flex={1}
										>
											<FormLabel fontSize="sm" fontWeight="semibold" color="blue.700">Document Sub Type</FormLabel>
											<Input
												value={doc.documentSubType}
												onChange={(e) => handleChange(index, 'documentSubType', e.target.value)}
												borderColor="blue.400"
												borderWidth="2px"
												bg="white"
												size="sm"
											/>
											<FormErrorMessage fontSize="xs">{errors[`documentSubType_${index}`]}</FormErrorMessage>
										</FormControl>

										<FormControl
											isInvalid={!!errors[`docType_${index}`]}
											flex={1}
										>
											<FormLabel fontSize="sm" fontWeight="semibold" color="blue.700">Document Type</FormLabel>
											<Input
												value={doc.docType}
												onChange={(e) => handleChange(index, 'docType', e.target.value)}
												borderColor="blue.400"
												borderWidth="2px"
												bg="white"
												size="sm"
											/>
											<FormErrorMessage fontSize="xs">{errors[`docType_${index}`]}</FormErrorMessage>
										</FormControl>
									</HStack>

									<FormControl isInvalid={!!errors[`vcFields_${index}`]}>
										<FormLabel fontSize="sm" fontWeight="semibold" color="blue.700">VC fields (JSON)</FormLabel>
										<Textarea
											value={doc.vcFields || ''}
											onChange={(e) => handleChange(index, 'vcFields', e.target.value)}
											placeholder='e.g. {"field1": {"type": "string"}, "field2": {"type": "number"}}'
											resize='vertical'
											minH='80px'
											bg="white"
											size="sm"
										/>
										<FormErrorMessage fontSize="xs">{errors[`vcFields_${index}`]}</FormErrorMessage>
									</FormControl>
								</VStack>
							</CardBody>
						</Card>
					))}

					{/* Add Configuration button below cards, full width, matching FieldMappingTab */}
					<Button
						leftIcon={<AddIcon />}
						variant="outline"
						colorScheme="blue"
						onClick={addConfig}
						size="lg"
						mt={2}
						width="100%"
					>
						Add Configuration
					</Button>
				</VStack>

				<Divider my={6} />

				<HStack justify="flex-end" spacing={4}>
					<Button colorScheme="green" onClick={handleSaveAll} size="lg">
						Save All Configurations
					</Button>
				</HStack>
			</Box>
		</VStack>
	);
};

export default DocumentConfigurationTab;