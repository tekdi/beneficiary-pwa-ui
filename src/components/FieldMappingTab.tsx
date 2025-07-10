import React, { useState, useEffect } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Select,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Card,
	CardBody,
	IconButton,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Spinner,
	Divider,
	Badge,
	Flex,
	Collapse,
	useToast,
	Textarea,
} from '@chakra-ui/react';
import {
	AddIcon,
	DeleteIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@chakra-ui/icons';
import { getDocumentsList } from '../services/auth/auth';
import { vcFieldMocks } from '../assets/mockdata/VCFields';
import { updateMapping, getMapping } from '../services/admin/admin';
const FieldMappingTab = () => {
	const [fields, setFields] = useState([]);
	const [documents, setDocuments] = useState([]);
	const [fieldMappings, setFieldMappings] = useState([
		{
			id: Date.now(),
			fieldId: '',
			documentMappings: [
				{
					id: Date.now() + 1,
					selectedDocument: '',
					vcFields: [],
					selectedVcField: '',
				},
			],
			isExpanded: false,
			addMapping: '', // always present
		},
	]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState({});
	const toast = useToast();

	// Mock API functions - replace with actual API calls
	const fetchFields = async () => {
		setLoading(true);
		try {
			// Mock API response based on your example
			const mockResponse = {
				id: 'api.form.read',
				ver: '1.0',
				ts: '2025-05-28T06:41:27.764Z',
				params: {
					resmsgid: '0bc91d3b-7e6a-4da9-aaea-1740987bcff1',
					status: 'successful',
					err: null,
					errmsg: null,
					successmessage: 'Fields fetched successfully.',
				},
				responseCode: 200,
				result: {
					formid: '2338bd9b-3257-4040-816a-82686108fff2',
					title: 'CREATE LEARNER',
					fields: [
						{
							hint: null,
							name: 'firstName',
							type: 'text',
							label: 'First Name',
							order: '1',
							fieldId: 'field_1',
							options: [],
							pattern: '/^[A-Za-z]$/',
							coreField: 0,
							dependsOn: null,
							maxLength: null,
							minLength: 3,
							isEditable: true,
							isPIIField: null,
							isRequired: true,
							validation: ['string'],
							placeholder: 'ENTER_FIRST_NAME',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
						{
							hint: null,
							name: 'lastName',
							type: 'text',
							label: 'Last Name',
							order: '2',
							fieldId: 'field_2',
							options: [],
							pattern: '/^[A-Za-z]$/',
							coreField: 1,
							dependsOn: null,
							maxLength: null,
							minLength: 2,
							isEditable: true,
							isPIIField: null,
							isRequired: true,
							validation: ['string'],
							placeholder: 'ENTER_LAST_NAME',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
						{
							hint: null,
							name: 'income',
							type: 'number',
							label: 'Income',
							order: '3',
							fieldId: 'field_3',
							options: [],
							pattern: '^[0-9]+$', // regex for numeric input
							coreField: 3,
							dependsOn: null,
							maxLength: null,
							minLength: 1,
							isEditable: true,
							isPIIField: null,
							isRequired: true,
							validation: ['number'],
							placeholder: 'ENTER_INCOME',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
						{
							hint: null,
							name: 'phoneNumber',
							type: 'tel',
							label: 'Phone Number',
							order: '4',
							fieldId: 'field_4',
							options: [],
							pattern: '/^[0-9]{10}$/',
							coreField: 4,
							dependsOn: null,
							maxLength: 10,
							minLength: 10,
							isEditable: true,
							isPIIField: true,
							isRequired: false,
							validation: ['phone'],
							placeholder: 'ENTER_PHONE',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
						{
							hint: null,
							name: 'dateOfBirth',
							type: 'date',
							label: 'Date of Birth',
							order: '5',
							fieldId: 'field_5',
							options: [],
							pattern: null,
							coreField: 5,
							dependsOn: null,
							maxLength: null,
							minLength: null,
							isEditable: true,
							isPIIField: true,
							isRequired: true,
							validation: ['date'],
							placeholder: 'SELECT_DATE',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
						{
							hint: null,
							name: 'gender',
							type: 'select',
							label: 'Gender',
							order: '6',
							fieldId: 'field_',
							options: [
								{ label: 'Male', value: 'male' },
								{ label: 'Female', value: 'female' },
								{ label: 'Other', value: 'other' },
							],
							pattern: null,
							coreField: 6,
							dependsOn: null,
							maxLength: null,
							minLength: null,
							isEditable: true,
							isPIIField: null,
							isRequired: true,
							validation: ['string'],
							placeholder: 'SELECT_GENDER',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
						{
							hint: null,
							name: 'class',
							type: 'select',
							label: 'Class',
							order: '7',
							fieldId: 'field_7',
							options: [
								{ label: '10th', value: '10' },
								{ label: '11th', value: '11' },
								{ label: '12th', value: '12' },
							],
							pattern: null,
							coreField: 7,
							dependsOn: null,
							maxLength: null,
							minLength: null,
							isEditable: true,
							isPIIField: null,
							isRequired: true,
							validation: ['number'],
							placeholder: 'SELECT_CLASS',
							isMultiSelect: false,
							maxSelections: 0,
							sourceDetails: {},
						},
					],
				},
			};

			// Extract fields with label and type
			const extractedFields = mockResponse.result.fields.map((field) => ({
				id: field.fieldId || field.name,
				label: field.label,
				type: field.validation?.[0],
				name: field.name,
				isRequired: field.isRequired,
			}));

			setFields(extractedFields);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch fields',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
		setLoading(false);
	};

	const fetchDocuments = async () => {
		try {
			const data = await getDocumentsList();
			setDocuments(
				data.data.map((doc, i) => ({
					id: `doc_${i + 1}`,
					name: doc.name,
					label: doc.label,
					documentSubType: doc.documentSubType,
					docType: doc.docType,
				}))
			);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch documents',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const fetchVcFields = async (documentSubType, fieldIndex, docIndex) => {
		if (!documentSubType) return;

		try {
			console.log('Requested VC fields for:', documentSubType);
			console.log('Available mock keys:', Object.keys(vcFieldMocks));

			const vcFields = vcFieldMocks[documentSubType] || [];

			console.log('VC fields fetched:', vcFields);

			const newFieldMappings = [...fieldMappings];
			newFieldMappings[fieldIndex].documentMappings[docIndex].vcFields =
				vcFields;
			setFieldMappings(newFieldMappings);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch VC fields',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const saveAllMappings = async () => {
		const validationErrors = {};
		let hasErrors = false;

		fieldMappings.forEach((fieldMapping, fieldIndex) => {
			// Validate field selection
			if (!fieldMapping.fieldId) {
				validationErrors[`field_${fieldIndex}`] =
					'Form field selection is required';
				hasErrors = true;
			}

			// ✅ Validate required and valid JSON in addMapping
			if (
				!fieldMapping.addMapping ||
				fieldMapping.addMapping.trim() === ''
			) {
				validationErrors[`addMapping_${fieldIndex}`] =
					'Add Mapping is required';
				hasErrors = true;
			} else {
				try {
					JSON.parse(fieldMapping.addMapping);
				} catch (err) {
					validationErrors[`addMapping_${fieldIndex}`] =
						'Add Mapping must be valid JSON';
					hasErrors = true;
				}
			}

			// Validate document mappings
			fieldMapping.documentMappings.forEach((docMapping, docIndex) => {
				if (!docMapping.selectedDocument) {
					validationErrors[`field_${fieldIndex}_doc_${docIndex}`] =
						'Document selection is required';
					hasErrors = true;
				}
				if (
					!docMapping.selectedVcField &&
					docMapping.selectedDocument
				) {
					validationErrors[`field_${fieldIndex}_vc_${docIndex}`] =
						'VC Field selection is required';
					hasErrors = true;
				}
			});
		});

		setErrors(validationErrors);

		if (hasErrors) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all required fields correctly.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setSaving(true);
		try {
			// Prepare data for submission
			const saveData = fieldMappings
				.filter((f) => f.fieldId)
				.map((fieldMapping) => ({
					fieldName: getFieldLabel(fieldMapping.fieldId), // Use field label instead of fieldId
					documentMappings: fieldMapping.documentMappings
						.filter(
							(doc) => doc.selectedDocument && doc.selectedVcField
						)
						.map((doc) => ({
							document: doc.selectedDocument,
							documentField: doc.selectedVcField,
						})),
					fieldValueNormalizationMapping:
						fieldMapping.addMapping.trim()
							? JSON.parse(fieldMapping.addMapping.trim())
							: undefined,
				}));

			// Call the API with the correct config key
			await updateMapping(saveData, 'profileFieldToDocumentFieldMapping');

			const totalFields = saveData.length;
			const totalDocMappings = saveData.reduce(
				(sum, field) => sum + field.documentMappings.length,
				0
			);

			toast({
				title: 'Success',
				description: `Mappings saved! ${totalFields} fields with ${totalDocMappings} document mappings.`,
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			console.log('Saved data:', saveData);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to save mappings',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
		setSaving(false);
	};

	// Field Management
	const addFieldMapping = () => {
		setFieldMappings([
			...fieldMappings,
			{
				id: Date.now(),
				fieldId: '',
				documentMappings: [
					{
						id: Date.now() + 1,
						selectedDocument: '',
						vcFields: [],
						selectedVcField: '',
					},
				],
				isExpanded: false,
				addMapping: '', // always present
			},
		]);
	};

	const removeFieldMapping = (fieldIndex) => {
		let newFieldMappings = fieldMappings.filter((_, i) => i !== fieldIndex);
		if (newFieldMappings.length === 0) {
			newFieldMappings = [
				{
					id: Date.now(),
					fieldId: '',
					documentMappings: [
						{
							id: Date.now() + 1,
							selectedDocument: '',
							vcFields: [],
							selectedVcField: '',
						},
					],
					isExpanded: false,
					addMapping: '',
				},
			];
		}
		setFieldMappings(newFieldMappings);

		// Clear related errors
		const newErrors = { ...errors };
		Object.keys(errors).forEach((key) => {
			if (key.startsWith(`field_${fieldIndex}`)) {
				delete newErrors[key];
			}
		});
		setErrors(newErrors);
	};

	const updateFieldMapping = (fieldIndex, fieldId) => {
		const newFieldMappings = [...fieldMappings];
		newFieldMappings[fieldIndex].fieldId = fieldId;
		newFieldMappings[fieldIndex].isExpanded = !!fieldId;
		setFieldMappings(newFieldMappings);

		// Clear related errors
		const newErrors = { ...errors };
		delete newErrors[`field_${fieldIndex}`];
		setErrors(newErrors);
	};

	const toggleFieldExpansion = (fieldIndex) => {
		const newFieldMappings = [...fieldMappings];
		newFieldMappings[fieldIndex].isExpanded =
			!newFieldMappings[fieldIndex].isExpanded;
		setFieldMappings(newFieldMappings);
	};

	// Document Mapping Management
	const addDocumentMapping = (fieldIndex) => {
		const newFieldMappings = [...fieldMappings];
		newFieldMappings[fieldIndex].documentMappings.push({
			id: Date.now(),
			selectedDocument: '',
			vcFields: [],
			selectedVcField: '',
		});
		setFieldMappings(newFieldMappings);
	};

	const removeDocumentMapping = (fieldIndex, docIndex) => {
		const newFieldMappings = [...fieldMappings];
		if (newFieldMappings[fieldIndex].documentMappings.length > 1) {
			newFieldMappings[fieldIndex].documentMappings = newFieldMappings[
				fieldIndex
			].documentMappings.filter((_, i) => i !== docIndex);
			setFieldMappings(newFieldMappings);

			// Clear related errors
			const newErrors = { ...errors };
			delete newErrors[`field_${fieldIndex}_doc_${docIndex}`];
			delete newErrors[`field_${fieldIndex}_vc_${docIndex}`];
			setErrors(newErrors);
		}
	};
	const handleDocumentChange = (fieldIndex, docIndex, documentSubType) => {
		console.log('documentSubType handleDocumentChange', documentSubType);

		const newFieldMappings = [...fieldMappings];
		newFieldMappings[fieldIndex].documentMappings[
			docIndex
		].selectedDocument = documentSubType;
		newFieldMappings[fieldIndex].documentMappings[docIndex].vcFields = [];
		newFieldMappings[fieldIndex].documentMappings[
			docIndex
		].selectedVcField = '';
		setFieldMappings(newFieldMappings);

		// Clear errors
		const newErrors = { ...errors };
		delete newErrors[`field_${fieldIndex}_doc_${docIndex}`];
		delete newErrors[`field_${fieldIndex}_vc_${docIndex}`];
		setErrors(newErrors);

		if (documentSubType) {
			fetchVcFields(documentSubType, fieldIndex, docIndex);
		}
	};

	const handleVcFieldChange = (fieldIndex, docIndex, vcFieldId) => {
		const newFieldMappings = [...fieldMappings];
		newFieldMappings[fieldIndex].documentMappings[
			docIndex
		].selectedVcField = vcFieldId;
		setFieldMappings(newFieldMappings);

		// Clear VC field error
		const newErrors = { ...errors };
		delete newErrors[`field_${fieldIndex}_vc_${docIndex}`];
		setErrors(newErrors);
	};

	// Helper functions
	const getFieldLabel = (fieldId) => {
		const field = fields.find((f) => f.id === fieldId);
		return field ? field.name : '';
	};

	const getDocumentName = (docId) => {
		const doc = documents.find((d) => d.id === docId);
		return doc ? doc.name : '';
	};

	const getVcFieldLabel = (vcFields, vcFieldId) => {
		const vcField = vcFields.find((f) => f.id === vcFieldId);
		return vcField ? vcField.label : '';
	};

	const getTotalConfiguredMappings = () => {
		return fieldMappings.reduce((total, fieldMapping) => {
			if (!fieldMapping.fieldId) return total;
			return (
				total +
				fieldMapping.documentMappings.filter(
					(doc) => doc.selectedDocument && doc.selectedVcField
				).length
			);
		}, 0);
	};

	// Prefill fieldMappings from API
	const fetchFieldMappings = async () => {
		setLoading(true);
		try {
			const data = await getMapping('profileFieldToDocumentFieldMapping');
			if (Array.isArray(data.data.value) && data.data.value.length > 0) {
				const mapped = data.data.value.map((item, idx) => ({
					id: Date.now() + idx,
					fieldId: fields.find(f => f.name === item.fieldName)?.id || '',
					documentMappings: (item.documentMappings || []).map((doc, j) => ({
						id: Date.now() + idx * 100 + j,
						selectedDocument: doc.document,
						vcFields: [],
						selectedVcField: doc.documentField,
					})),
					isExpanded: true,
					addMapping: item.fieldValueNormalizationMapping
						? (typeof item.fieldValueNormalizationMapping === 'string'
							? item.fieldValueNormalizationMapping
							: JSON.stringify(item.fieldValueNormalizationMapping))
						: '',
				}));
				setFieldMappings(mapped);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to fetch field mappings',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const init = async () => {
			await fetchFields();
			await fetchDocuments();
		};
		init();
	}, []);

	useEffect(() => {
		if (fields.length > 0) {
			fetchFieldMappings();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields]);

	return (
		<VStack spacing={6} align="stretch">
			<Alert status="info">
				<AlertIcon />
				<Box>
					<AlertTitle>Field Mapping Configuration</AlertTitle>
					<AlertDescription>
						Configure form fields and their corresponding document
						mappings.
					</AlertDescription>
				</Box>
			</Alert>

			{loading ? (
				<Flex justify="center" align="center" h="200px">
					<Spinner size="lg" />
					<Text ml={4}>Loading fields...</Text>
				</Flex>
			) : (
				<VStack spacing={6} align="stretch">
					{/* Field Mappings Section */}
					<Box>
						<Flex justify="space-between" align="center" mb={4}>
							<Text
								fontSize="xl"
								fontWeight="bold"
								color="blue.700"
							>
								Field Mappings
							</Text>
							<Badge
								colorScheme="green"
								variant="solid"
								fontSize="sm"
								px={3}
								py={1}
							>
								{getTotalConfiguredMappings()} total mappings
							</Badge>
						</Flex>

						<VStack spacing={4} align="stretch">
							{fieldMappings.map((fieldMapping, fieldIndex) => (
								<Card
									key={fieldMapping.id}
									borderColor="blue.200"
									borderWidth="1px"
								>
									<CardBody>
										<VStack spacing={4} align="stretch">
											{/* Field Selection */}
											<HStack
												justify="space-between"
												align="start"
											>
												<FormControl
													flex="1"
													isInvalid={
														errors[
															`field_${fieldIndex}`
														]
													}
												>
													<FormLabel
														fontSize="sm"
														fontWeight="semibold"
														color="blue.700"
													>
														Form Field #
														{fieldIndex + 1}
													</FormLabel>
													<Select
														placeholder="Select form field"
														value={
															fieldMapping.fieldId
														}
														onChange={(e) =>
															updateFieldMapping(
																fieldIndex,
																e.target.value
															)
														}
														bg="white"
													>
														{fields.map((field) => (
															<option
																key={field.id}
																value={field.id}
															>
																{console.log(
																	field.label,
																	field.validation
																)}
																{field.label} (
																{field.type})
																{field.isRequired &&
																	' *'}
															</option>
														))}
													</Select>
													<FormErrorMessage>
														{
															errors[
																`field_${fieldIndex}`
															]
														}
													</FormErrorMessage>
												</FormControl>

												<HStack>
													{fieldMapping.fieldId && (
														<IconButton
															aria-label="Toggle expansion"
															icon={
																fieldMapping.isExpanded ? (
																	<ChevronUpIcon />
																) : (
																	<ChevronDownIcon />
																)
															}
															size="sm"
															colorScheme="blue"
															variant="ghost"
															onClick={() =>
																toggleFieldExpansion(
																	fieldIndex
																)
															}
														/>
													)}
													<IconButton
														aria-label="Remove field mapping"
														icon={<DeleteIcon />}
														size="sm"
														colorScheme="red"
														variant="ghost"
														onClick={() =>
															removeFieldMapping(
																fieldIndex
															)
														}
														isDisabled={
															fieldMappings.length ===
															1
														}
													/>
												</HStack>
											</HStack>

											{/* {fieldMapping.fieldId && (
												<Box
													p={3}
													borderRadius="md"
													borderWidth="1px"
													borderColor="blue.300"
												>
													<Text
														fontSize="sm"
														color="blue.800"
													>
														<strong>
															Selected Field:
														</strong>{' '}
														{getFieldLabel(
															fieldMapping.fieldId
														)}
													</Text>
												</Box>
											)} */}

											{/* Document Mappings Subsection */}

											<Box
												mt={4}
												p={4}
												borderRadius="md"
												borderWidth="1px"
												borderColor="blue.200"
											>
												<Flex
													justify="space-between"
													align="center"
													mb={4}
												>
													<Text
														fontSize="lg"
														fontWeight="semibold"
														color="blue.700"
													>
														Document Mappings
													</Text>
													<Badge
														colorScheme="blue"
														variant="outline"
													>
														{
															fieldMapping.documentMappings.filter(
																(doc) =>
																	doc.selectedDocument &&
																	doc.selectedVcField
															).length
														}{' '}
														configured
													</Badge>
												</Flex>

												<VStack
													spacing={3}
													align="stretch"
												>
													{fieldMapping.documentMappings.map(
														(
															docMapping,
															docIndex
														) => (
															<Card
																key={
																	docMapping.id
																}
																variant="outline"
																bg="white"
																size="sm"
															>
																<CardBody>
																	<HStack
																		justify="space-between"
																		align="center"
																		mb={3}
																	>
																		<Text
																			fontSize="sm"
																			fontWeight="medium"
																			color="blue.600"
																		>
																			Document
																			#
																			{docIndex +
																				1}
																		</Text>
																		<IconButton
																			aria-label="Remove document mapping"
																			icon={
																				<DeleteIcon />
																			}
																			size="xs"
																			colorScheme="red"
																			variant="ghost"
																			onClick={() =>
																				removeDocumentMapping(
																					fieldIndex,
																					docIndex
																				)
																			}
																			isDisabled={
																				fieldMapping
																					.documentMappings
																					.length ===
																				1
																			}
																		/>
																	</HStack>

																	<HStack
																		spacing={
																			3
																		}
																		align="start"
																	>
																		<FormControl
																			flex="1"
																			isInvalid={
																				errors[
																					`field_${fieldIndex}_doc_${docIndex}`
																				]
																			}
																		>
																			<FormLabel fontSize="xs">
																				Document
																				Type
																			</FormLabel>
																			<Select
																				placeholder="Select document"
																				value={
																					docMapping.selectedDocument
																				}
																				onChange={(
																					e
																				) =>
																					handleDocumentChange(
																						fieldIndex,
																						docIndex,
																						e
																							.target
																							.value
																					)
																				}
																				size="sm"
																			>
																				{documents.map(
																					(
																						doc
																					) => (
																						<option
																							key={
																								doc.id
																							}
																							value={
																								doc.documentSubType
																							}
																						>
																							{
																								doc.name
																							}{' '}
																							(
																							{
																								doc.documentSubType
																							}

																							)
																						</option>
																					)
																				)}
																			</Select>

																			<FormErrorMessage fontSize="xs">
																				{
																					errors[
																						`field_${fieldIndex}_doc_${docIndex}`
																					]
																				}
																			</FormErrorMessage>
																		</FormControl>

																		<FormControl
																			flex="1"
																			isInvalid={
																				errors[
																					`field_${fieldIndex}_vc_${docIndex}`
																				]
																			}
																		>
																			<FormLabel fontSize="xs">
																				VC
																				Field
																			</FormLabel>
																			<Select
																				placeholder="Select VC field"
																				value={
																					docMapping.selectedVcField
																				}
																				onChange={(
																					e
																				) =>
																					handleVcFieldChange(
																						fieldIndex,
																						docIndex,
																						e
																							.target
																							.value
																					)
																				}
																				disabled={
																					!docMapping.selectedDocument
																				}
																				size="sm"
																			>
																				{docMapping.vcFields.map(
																					(
																						vcField
																					) => (
																						<option
																							key={
																								vcField.id
																							}
																							value={
																								vcField.id
																							}
																						>
																							{
																								vcField.label
																							}{' '}
																							(
																							{
																								vcField.type
																							}

																							)
																						</option>
																					)
																				)}
																			</Select>
																			<FormErrorMessage fontSize="xs">
																				{
																					errors[
																						`field_${fieldIndex}_vc_${docIndex}`
																					]
																				}
																			</FormErrorMessage>
																		</FormControl>
																	</HStack>

																	{docMapping.selectedDocument &&
																		docMapping.selectedVcField && (
																			<Box
																				mt={
																					2
																				}
																				p={
																					2
																				}
																				bg="green.50"
																				borderRadius="sm"
																			>
																				<Text
																					fontSize="xs"
																					color="green.700"
																				>
																					<strong>
																						Mapping:
																					</strong>{' '}
																					{getDocumentName(
																						docMapping.selectedDocument
																					)}{' '}
																					→{' '}
																					{getVcFieldLabel(
																						docMapping.vcFields,
																						docMapping.selectedVcField
																					)}
																				</Text>
																			</Box>
																		)}
																</CardBody>
															</Card>
														)
													)}

													<Flex
														justify="flex-end"
														mt={2}
													>
														<IconButton
															icon={<AddIcon />}
															aria-label="Add Document Mapping"
															colorScheme="blue"
															size="sm"
															variant="solid"
															borderRadius="full"
															onClick={() =>
																addDocumentMapping(
																	fieldIndex
																)
															}
														/>
													</Flex>
												</VStack>
											</Box>

											<FormControl
												isInvalid={
													!!errors[
														`addMapping_${fieldIndex}`
													]
												}
											>
												<FormLabel
													fontSize="sm"
													color="blue.700"
												>
													Add Mapping (JSON)
												</FormLabel>
												<Textarea
													placeholder='e.g. { "original": "m" , "mapped":"male"}'
													value={
														fieldMapping.addMapping
													}
													onChange={(e) => {
														const newFieldMappings =
															[...fieldMappings];
														newFieldMappings[
															fieldIndex
														].addMapping =
															e.target.value;

														try {
															if (
																e.target.value.trim() !==
																''
															) {
																JSON.parse(
																	e.target
																		.value
																);
																const newErrors =
																	{
																		...errors,
																	};
																delete newErrors[
																	`addMapping_${fieldIndex}`
																];
																setErrors(
																	newErrors
																);
															}
														} catch {
															setErrors(
																(prev) => ({
																	...prev,
																	[`addMapping_${fieldIndex}`]:
																		'Invalid JSON format',
																})
															);
														}

														setFieldMappings(
															newFieldMappings
														);
													}}
													bg="white"
													size="sm"
												/>
												<FormErrorMessage fontSize="xs">
													{
														errors[
															`addMapping_${fieldIndex}`
														]
													}
												</FormErrorMessage>
											</FormControl>
										</VStack>
									</CardBody>
								</Card>
							))}

							<Button
								leftIcon={<AddIcon />}
								variant="outline"
								colorScheme="blue"
								onClick={addFieldMapping}
								size="lg"
							>
								Add Field Mapping
							</Button>
						</VStack>
					</Box>

					<Divider />

					<HStack justify="flex-end" spacing={4}>
						{/* <Button
							variant="outline"
							onClick={() => {
								setFieldMappings([
									{
										id: Date.now(),
										fieldId: '',
										documentMappings: [
											{
												id: Date.now() + 1,
												selectedDocument: '',
												vcFields: [],
												selectedVcField: '',
											},
										],
										isExpanded: false,
									},
								]);
								setErrors({});
							}}
						>
							Reset All
						</Button> */}
						<Button
							colorScheme="green"
							onClick={saveAllMappings}
							isLoading={saving}
							loadingText="Saving..."
							size="lg"
						>
							Save All Mappings
						</Button>
					</HStack>
				</VStack>
			)}
		</VStack>
	);
};

export default FieldMappingTab;
