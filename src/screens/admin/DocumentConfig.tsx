import React, { useState, useEffect } from 'react';
import {
	VStack,
	HStack,
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	IconButton,
	FormErrorMessage,
	useToast,
	Divider,
	Textarea,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { getMapping, updateMapping } from '../../services/admin/admin';
import Layout from '../../components/common/admin/Layout';

interface DocumentConfig {
			id: number;
			name: string;
			label: string;
			documentSubType: string;
			docType: string;
			vcFields: string;
		}
		interface ValidationErrors {
					[key: string]: string;
				}
const DocumentConfig = () => {
	const toast = useToast();

	// --- State for document configurations and errors ---
	const [documentConfigs, setDocumentConfigs] = useState<DocumentConfig[]>([]);
	const [errors, setErrors] = useState<ValidationErrors>({});

	// --- Fetch document configurations from API ---
	useEffect(() => {
		const fetchConfigs = async () => {
			try {
				const data = await getMapping('vcConfiguration');
				// Map API response to local state structure
				if (
					Array.isArray(data.data.value) &&
					data.data.value.length > 0
				) {
					const mapped = data.data.value.map((item, idx) => {
						let vcFieldsString = '';
						if (typeof item.vcFields === 'string') {
							vcFieldsString = item.vcFields;
						} else if (item.vcFields) {
							vcFieldsString = JSON.stringify(item.vcFields);
						}
						return {
							id: Date.now() + idx,
							name: item.name || '',
							label: item.label || '',
							documentSubType: item.documentSubType || '',
							docType: item.docType || '',
							vcFields: vcFieldsString,
						};
					});
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
				// Log the error for debugging
				console.error('Error fetching document configurations:', error);
				toast({
					title: 'Error',
					description: 'Failed to fetch document configurations',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			}
		};
		fetchConfigs();
	}, []);

	// --- Validate vcFields JSON structure ---
	const validateVcFields = (value) => {
		if (!value || value.trim() === '') return true;
		try {
			const parsed = JSON.parse(value);
			if (
				typeof parsed !== 'object' ||
				Array.isArray(parsed) ||
				parsed === null
			)
				return false;
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
	const handleChange = (index: number, field: keyof DocumentConfig, value: string) => {

		const updated = [...documentConfigs];
		(updated[index] as any)[field] = value;
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
				description:
					'Please fill in all fields and ensure VC fields are valid JSON with the correct structure.',
				status: 'error',
				duration: 2000,
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
				duration: 2000,
			});
		} catch (error) {
			// Log the error for debugging
			console.error('Error in JSON parsing or mapping:', error);
			toast({
				title: 'Error',
				description: 'Failed to save document configurations',
				status: 'error',
				duration: 2000,
			});
		}
	};

	return (
		<Box bg="gray.50" minH="100vh" py={{ base: 4, md: 8 }}>
			<Layout
				showMenu={true}
				title="Document Configurations"
				subTitle="Add and manage document configurations."
			>
				<VStack
					spacing={10}
					align="stretch"
					px={{ base: 2, md: 8 }}
					py={6}
				>
					<Box>
						<VStack spacing={6} align="stretch">
							{documentConfigs.map((doc, index) => (
								<Box
									key={doc.id}
									borderRadius="xl"
									boxShadow="0 2px 8px rgba(6,22,75,0.08)"
									borderWidth="1.5px"
									borderColor="#06164B"
									bg="white"
									p={{ base: 2, md: 6 }}
									mb={2}
								>
									<VStack spacing={6} align="stretch">
										<HStack justify="flex-end">
											<IconButton
												icon={<DeleteIcon />}
												colorScheme="red"
												aria-label="Remove"
												size="lg"
												variant="ghost"
												onClick={() =>
													removeConfig(index)
												}
												isDisabled={
													documentConfigs.length === 1
												}
											/>
										</HStack>
										<HStack
											spacing={4}
											align={{
												base: 'stretch',
												md: 'start',
											}}
											flexDir={{
												base: 'column',
												md: 'row',
											}}
										>
											<FormControl
												isInvalid={
													!!errors[`name_${index}`]
												}
												flex={1}
											>
												<FormLabel
													fontSize="md"
													fontWeight="bold"
													color="#06164B"
												>
													Document Name
												</FormLabel>
												<Input
													value={doc.name}
													onChange={(e) =>
														handleChange(
															index,
															'name',
															e.target.value
														)
													}
													borderWidth="2px"
													bg="white"
													size="lg"
													borderRadius="md"
													_focus={{
														borderColor: 'blue.400',
														boxShadow:
															'0 0 0 2px #06164B33',
													}}
												/>
												<FormErrorMessage fontSize="xs">
													{errors[`name_${index}`]}
												</FormErrorMessage>
											</FormControl>
											<FormControl
												isInvalid={
													!!errors[`label_${index}`]
												}
												flex={1}
											>
												<FormLabel
													fontSize="md"
													fontWeight="bold"
													color="#06164B"
												>
													Document Label
												</FormLabel>
												<Input
													value={doc.label}
													onChange={(e) =>
														handleChange(
															index,
															'label',
															e.target.value
														)
													}
													borderWidth="2px"
													bg="white"
													size="lg"
													borderRadius="md"
													_focus={{
														borderColor: 'blue.400',
														boxShadow:
															'0 0 0 2px #06164B33',
													}}
												/>
												<FormErrorMessage fontSize="xs">
													{errors[`label_${index}`]}
												</FormErrorMessage>
											</FormControl>
										</HStack>
										<HStack
											spacing={4}
											align={{
												base: 'stretch',
												md: 'start',
											}}
											flexDir={{
												base: 'column',
												md: 'row',
											}}
										>
											<FormControl
												isInvalid={
													!!errors[
														`documentSubType_${index}`
													]
												}
												flex={1}
											>
												<FormLabel
													fontSize="md"
													fontWeight="bold"
													color="#06164B"
												>
													Document Sub Type
												</FormLabel>
												<Input
													value={doc.documentSubType}
													onChange={(e) =>
														handleChange(
															index,
															'documentSubType',
															e.target.value
														)
													}
													borderWidth="2px"
													bg="white"
													size="lg"
													borderRadius="md"
													_focus={{
														borderColor: 'blue.400',
														boxShadow:
															'0 0 0 2px #06164B33',
													}}
												/>
												<FormErrorMessage fontSize="xs">
													{
														errors[
															`documentSubType_${index}`
														]
													}
												</FormErrorMessage>
											</FormControl>
											<FormControl
												isInvalid={
													!!errors[`docType_${index}`]
												}
												flex={1}
											>
												<FormLabel
													fontSize="md"
													fontWeight="bold"
													color="#06164B"
												>
													Document Type
												</FormLabel>
												<Input
													value={doc.docType}
													onChange={(e) =>
														handleChange(
															index,
															'docType',
															e.target.value
														)
													}
													borderWidth="2px"
													bg="white"
													size="lg"
													borderRadius="md"
													_focus={{
														borderColor: 'blue.400',
														boxShadow:
															'0 0 0 2px #06164B33',
													}}
												/>
												<FormErrorMessage fontSize="xs">
													{errors[`docType_${index}`]}
												</FormErrorMessage>
											</FormControl>
										</HStack>
										<FormControl
											isInvalid={
												!!errors[`vcFields_${index}`]
											}
										>
											<FormLabel
												fontSize="md"
												fontWeight="bold"
												color="#06164B"
											>
												VC fields (JSON)
											</FormLabel>
											<Textarea
												value={doc.vcFields || ''}
												onChange={(e) =>
													handleChange(
														index,
														'vcFields',
														e.target.value
													)
												}
												placeholder='e.g. {"field1": {"type": "string"}, "field2": {"type": "number"}}'
												resize="vertical"
												minH="200px"
												bg="white"
												size="lg"
												borderWidth="2px"
												borderRadius="md"
												_focus={{
													borderColor: 'blue.400',
													boxShadow:
														'0 0 0 2px #06164B33',
												}}
											/>
											<FormErrorMessage fontSize="xs">
												{errors[`vcFields_${index}`]}
											</FormErrorMessage>
										</FormControl>
									</VStack>
								</Box>
							))}
							<Button
								leftIcon={<AddIcon />}
								bg="#06164B"
								color="white"
								_hover={{
									bg: '#06164Bcc',
									transform: 'translateY(-2px)',
									boxShadow: 'lg',
								}}
								_active={{ bg: '#06164B' }}
								borderRadius="lg"
								variant="solid"
								size="lg"
								mt={2}
								width="100%"
								onClick={addConfig}
								px={8}
								py={6}
								fontWeight="bold"
								fontSize="md"
								boxShadow="sm"
							>
								Add Configuration
							</Button>
						</VStack>
					</Box>
					<Divider my={6} />
					<HStack justify="flex-end" spacing={4}>
						<Button
							color="white"
							bg="#06164B"
							_hover={{
								bg: '#06164Bcc',
								transform: 'translateY(-2px)',
								boxShadow: 'lg',
							}}
							_active={{ bg: '#06164B' }}
							borderRadius="lg"
							size="lg"
							px={8}
							py={6}
							fontWeight="bold"
							fontSize="md"
							boxShadow="sm"
							onClick={handleSaveAll}
						>
							Save All Configurations
						</Button>
					</HStack>
				</VStack>
			</Layout>
		</Box>
	);
};

export default DocumentConfig;
