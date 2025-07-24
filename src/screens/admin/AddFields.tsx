import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
	Input,
	IconButton,
	useToast,
	Switch,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, InfoIcon } from '@chakra-ui/icons';
import {
	fetchFields,
	addField,
	AddFieldPayload,
	FieldOption,
	updateField,
	deleteField,
} from '../../services/admin/admin';
import Layout from '../../components/common/admin/Layout';

// Extend Field type locally to include isEditable for table rendering
import type { Field as BaseField } from '../../services/admin/admin';

interface Field extends BaseField {
    isEditable?: boolean;
    isEncrypted?: boolean; // Add this line
    ordering?: number;
    fieldParams?: { options?: FieldOption[] };
}

interface FieldForm {
    label: string;
    name: string;
    type: string;
    isRequired: boolean;
    isEditable: boolean;
    isEncrypted: boolean; // Add this line
    ordering: number | '';
    options: FieldOption[];
}

const initialForm: FieldForm = {
    label: '',
    name: '',
    type: 'text',
    isRequired: false,
    isEditable: true,
    isEncrypted: false, // Add this line
    ordering: '',
    options: [],
};

// Helper function to get encrypted text
function getEncryptedText(isEncrypted: boolean | undefined) {
    if (typeof isEncrypted === 'boolean') {
        return isEncrypted ? 'Yes' : 'No';
    }
    return 'No';
}

// Helper function to get editable text
function getEditableText(isEditable: boolean | undefined) {
    if (typeof isEditable === 'boolean') {
        return isEditable ? 'Yes' : 'No';
    }
    return 'Yes';
}

const AddFields: React.FC = () => {
	const { t } = useTranslation();
	const [fields, setFields] = useState<Field[]>([]);
	const [form, setForm] = useState<FieldForm>(initialForm);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isAdding, setIsAdding] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isInfoModalOpen, onOpen: onInfoModalOpen, onClose: onInfoModalClose } = useDisclosure();
	const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [fieldToDelete, setFieldToDelete] = useState<{
		idx: number;
		fieldId: string;
	} | null>(null);

	// Fetch fields on mount
	useEffect(() => {
		fetchAllFields();
	}, []);

	const fetchAllFields = async () => {
		try {
			const data = await fetchFields('USERS', 'User');
			setFields(data);
		} catch (error: any) {
			toast({
				title: 'Error fetching fields',
				description:
					error.message || 'Failed to fetch fields from server.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type, checked } = e.target as any;
		setForm((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
		setErrors((prev) => ({ ...prev, [name]: '' }));
	};

	const handleOptionChange = (
		id: string,
		key: 'name' | 'value',
		value: string
	) => {
		setForm((prev) => ({
			...prev,
			options: prev.options.map((opt) =>
				opt.id === id ? { ...opt, [key]: value } : opt
			),
		}));
	};

	const addOption = () => {
		setForm((prev) => ({
			...prev,
			options: [
				...prev.options,
				{ id: Date.now().toString(), name: '', value: '' },
			],
		}));
	};

	const removeOption = (id: string) => {
		setForm((prev) => ({
			...prev,
			options: prev.options.filter((opt) => opt.id !== id),
		}));
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!form.label.trim()) newErrors.label = 'Label is required';
		if (!form.name.trim()) newErrors.name = 'Name is required';
		if (!form.type) newErrors.type = 'Type is required';
		if (form.ordering === '' || isNaN(Number(form.ordering)))
			newErrors.ordering = 'Ordering is required and must be a number';
		if (form.type === 'drop_down' && form.options.length === 0)
			newErrors.options = 'At least one option is required';
		if (form.type === 'drop_down') {
			form.options.forEach((opt, idx) => {
				if (!opt.name.trim() || !opt.value.trim()) {
					newErrors[`option_${idx}`] =
						'Both name and value are required';
				}
			});
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;
		setIsAdding(true);
		try {
			const payload: AddFieldPayload = {
				name: form.name,
				label: form.label,
				type: form.type,
				ordering: Number(form.ordering),
				fieldParams:
					form.type === 'drop_down'
						? { options: form.options }
						: null,
				fieldAttributes: {
					isEditable: form.isEditable,
					isRequired: form.isRequired,
					isEncrypted: form.isEncrypted, // Add this line
				},
			};
			await addField(payload);
			toast({
				title: 'Field added',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			setForm(initialForm);
			setEditingIndex(null);
			fetchAllFields();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to add field',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		} finally {
			setIsAdding(false);
		}
	};

	const openAddModal = () => {
		setForm(initialForm);
		setEditingIndex(null);
		setModalMode('add');
		onOpen();
	};

	const handleEdit = (idx: number) => {
		const field = fields[idx];
		setForm({
			label: field.label,
			name: field.name,
			type: field.type,
			isRequired: field.isRequired,
			isEditable: field.isEditable,
			isEncrypted: field.isEncrypted || false, // Add this line
			ordering: field.ordering ?? '',
			options:
				field.type === 'drop_down' && field.fieldParams?.options
					? field.fieldParams.options
					: [],
		});
		setEditingIndex(idx);
		setModalMode('edit');
		onOpen();
	};

	const handleModalSave = async () => {
		if (modalMode === 'edit' && editingIndex !== null) {
			// Edit mode: update the field
			const fieldId = fields[editingIndex]?.fieldId;
			if (!fieldId) return;
			if (!validateForm()) return;
			setIsAdding(true);
			try {
				const payload: AddFieldPayload = {
					name: form.name,
					label: form.label,
					type: form.type,
					ordering: Number(form.ordering),
					fieldParams:
						form.type === 'drop_down'
							? { options: form.options }
							: null,
					fieldAttributes: {
						isEditable: form.isEditable,
						isRequired: form.isRequired,
						isEncrypted: form.isEncrypted, // Add this line
					},
				};
				await updateField(fieldId, payload);
				toast({
					title: 'Field updated',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
				setForm(initialForm);
				setEditingIndex(null);
				fetchAllFields();
				onClose();
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error.message || 'Failed to update field',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
			} finally {
				setIsAdding(false);
			}
		} else {
			// Add mode
			await handleSubmit();
			if (Object.keys(errors).length === 0) {
				onClose();
			}
		}
	};

	const handleModalCancel = () => {
		handleCancel();
		onClose();
	};

	const handleCancel = () => {
		setForm(initialForm);
		setEditingIndex(null);
		setErrors({});
	};

	const handleRemove = async (idx: number) => {
		const field = fields[idx];
		setFieldToDelete({ idx, fieldId: field.fieldId });
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!fieldToDelete) return;

		setIsAdding(true);
		try {
			await deleteField(fieldToDelete.fieldId);
			toast({
				title: 'Field deleted',
				status: 'success',
				duration: 2000,
				isClosable: true,
			});
			fetchAllFields(); // Refresh the fields list
		} catch (error: any) {
			// Handle different error response structures
			const errorMessage =
				error?.data?.message ||
				error?.response?.data?.message ||
				error?.message ||
				'Failed to delete field';

			toast({
				title: 'Error',
				description: errorMessage,
				status: 'error',
				duration: 4000, // Longer duration for important error messages
				isClosable: true,
			});
		} finally {
			setIsAdding(false);
			setDeleteModalOpen(false);
			setFieldToDelete(null);
		}
	};

	const cancelDelete = () => {
		setDeleteModalOpen(false);
		setFieldToDelete(null);
	};

	return (
		<Box bg="gray.50" minH="100vh" py={{ base: 4, md: 8 }}>
			<Layout
				showMenu={true}
				title="Add Fields"
				subTitle="Add and edit fields."
			>
				<VStack
					spacing={10}
					align="stretch"
					px={{ base: 2, md: 8 }}
					py={6}
				>
					<Box>
						<HStack justify="space-between" mb={4}>
							<Text
								fontSize="xl"
								fontWeight="bold"
								color="#06164B"
							>
								Fields
							</Text>
							<Button
								leftIcon={<AddIcon />}
								color="white"
								bg="#06164B"
								_hover={{
									bg: '#06164Bcc',
									transform: 'translateY(-2px)',
									boxShadow: 'lg',
								}}
								_active={{ bg: '#06164B' }}
								borderRadius="lg"
								variant="solid"
								size="md"
								px={6}
								py={4}
								fontWeight="bold"
								fontSize="md"
								boxShadow="sm"
								onClick={openAddModal}
							>
								Add Field
							</Button>
						</HStack>
						<Table
							variant="simple"
							bg="white"
							borderRadius="xl"
							boxShadow="0 2px 8px rgba(6,22,75,0.08)"
							borderWidth="1.5px"
							borderColor="#E2E8F0"
							sx={{
								'th, td, tr, thead, tbody, table': {
									borderColor: '#E2E8F0',
									borderWidth: '1px',
								},
							}}
						>
							<Thead bg="#F5F6FA">
								<Tr>
									<Th borderColor="#E2E8F0">Label</Th>
									<Th borderColor="#E2E8F0">Name</Th>
									<Th borderColor="#E2E8F0">Type</Th>
									<Th borderColor="#E2E8F0">Required</Th>
									<Th borderColor="#E2E8F0">Editable</Th>
									<Th borderColor="#E2E8F0">Encrypted</Th>
									<Th borderColor="#E2E8F0">Actions</Th>
								</Tr>
							</Thead>
							<Tbody>
								{fields.map((field, idx) => {
									const editableText = getEditableText(
										field.isEditable
									);
									const encryptedText = getEncryptedText(
										field.isEncrypted
									);
									return (
										<Tr
											key={field.fieldId}
											borderBottom="1px solid #E2E8F0"
										>
											<Td borderColor="#E2E8F0">
												{field.label}
											</Td>
											<Td borderColor="#E2E8F0">
												{field.name}
											</Td>
											<Td borderColor="#E2E8F0">
												{field.type}
											</Td>
											<Td borderColor="#E2E8F0">
												{field.isRequired
													? 'Yes'
													: 'No'}
											</Td>
											<Td borderColor="#E2E8F0">
												{editableText}
											</Td>
											<Td borderColor="#E2E8F0">
												{encryptedText}
											</Td>
											<Td borderColor="#E2E8F0">
												<HStack>
													<IconButton
														icon={<EditIcon />}
														aria-label="Edit"
														size="sm"
														onClick={() =>
															handleEdit(idx)
														}
														variant="ghost"
													/>
													<IconButton
														icon={<DeleteIcon />}
														aria-label="Remove"
														size="sm"
														onClick={() =>
															handleRemove(idx)
														}
														colorScheme="red"
														variant="ghost"
													/>
												</HStack>
											</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>
					</Box>

					{/* Edit/Add Modal */}
					<Modal
						isOpen={isOpen}
						onClose={handleModalCancel}
						size="lg"
					>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>
								{modalMode === 'add'
									? 'Add Field'
									: 'Edit Field'}
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<VStack spacing={4} align="stretch">
									<FormControl
										isInvalid={!!errors.label}
										isRequired
									>
										<FormLabel>Label </FormLabel>
										<Input
											name="label"
											value={form.label}
											onChange={handleInputChange}
										/>
										<FormErrorMessage>
											{errors.label}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										isInvalid={!!errors.name}
										isRequired
									>
										<FormLabel>Name </FormLabel>
										<Input
											name="name"
											value={form.name}
											onChange={handleInputChange}
										/>
										<FormErrorMessage>
											{errors.name}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										isInvalid={!!errors.type}
										isRequired
									>
										<FormLabel>Type </FormLabel>
										<Select
											name="type"
											value={form.type}
											onChange={handleInputChange}
										>
											<option value="text">Text</option>
											<option value="numeric">
												Numeric
											</option>
											<option value="date">Date</option>
											<option value="boolean">
												Boolean
											</option>
											<option value="drop_down">
												Dropdown
											</option>
										</Select>
										<FormErrorMessage>
											{errors.type}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										isInvalid={!!errors.ordering}
										isRequired
									>
										<FormLabel>Ordering </FormLabel>
										<Input
											type="number"
											name="ordering"
											value={form.ordering}
											onChange={handleInputChange}
											min={1}
										/>
										<FormErrorMessage>
											{errors.ordering}
										</FormErrorMessage>
									</FormControl>

									{form.type === 'drop_down' && (
										<Box>
											<FormLabel>
												Dropdown Options
											</FormLabel>
											{form.options.map((opt, idx) => (
												<HStack key={opt.id} mb={2}>
													<Input
														placeholder="Name"
														value={opt.name}
														onChange={(e) =>
															handleOptionChange(
																opt.id,
																'name',
																e.target.value
															)
														}
														width="40%"
													/>
													<Input
														placeholder="Value"
														value={opt.value}
														onChange={(e) =>
															handleOptionChange(
																opt.id,
																'value',
																e.target.value
															)
														}
														width="40%"
													/>
													<IconButton
														icon={<DeleteIcon />}
														aria-label="Remove option"
														size="sm"
														colorScheme="red"
														onClick={() =>
															removeOption(opt.id)
														}
													/>
													<FormErrorMessage>
														{
															errors[
																`option_${idx}`
															]
														}
													</FormErrorMessage>
												</HStack>
											))}
											<Button
												leftIcon={<AddIcon />}
												onClick={addOption}
												size="sm"
												mt={2}
											>
												Add Option
											</Button>
											<FormErrorMessage>
												{errors.options}
											</FormErrorMessage>
										</Box>
									)}
									<HStack mb={2} mt={3}>
										<FormControl
											display="flex"
											alignItems="center"
											isInvalid={!!errors.isRequired}
											isRequired
										>
											<FormLabel mb="0">
												Required?{' '}
											</FormLabel>
											<Switch
												name="isRequired"
												isChecked={form.isRequired}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														isRequired:
															e.target.checked,
													}))
												}
											/>
											<FormErrorMessage>
												{errors.isRequired}
											</FormErrorMessage>
										</FormControl>
										<FormControl
											display="flex"
											alignItems="center"
											isInvalid={!!errors.isEditable}
											isRequired
										>
											<FormLabel mb="0">
												Editable?{' '}
											</FormLabel>
											<Switch
												name="isEditable"
												isChecked={form.isEditable}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,
														isEditable:
															e.target.checked,
													}))
												}
											/>
											<FormErrorMessage>
												{errors.isEditable}
											</FormErrorMessage>
										</FormControl>
									</HStack>

                                    <HStack mb={2}>
                                        <FormControl
                                            display="flex"
                                            alignItems="center"
                                            isInvalid={!!errors.isEncrypted}
                                            isRequired
                                        >
                                            <FormLabel mb="0">
                                                Encrypted?{' '}
                                            </FormLabel>
											<IconButton
												icon={<InfoIcon />}
												aria-label="Encryption Information"
												size="xs"
												variant="ghost"
												color="blue.500"
												onClick={onInfoModalOpen}
												mr={3}
											/>
                                            <Switch
                                                name="isEncrypted"
                                                isChecked={form.isEncrypted}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        isEncrypted:
                                                            e.target.checked,
                                                    }))
                                                }
                                            />
                                            <FormErrorMessage>
                                                {errors.isEncrypted}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </HStack>
								</VStack>
							</ModalBody>
							<ModalFooter>
								<Button
									onClick={handleModalCancel}
									variant="outline"
									mr={3}
								>
									Cancel
								</Button>
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
									variant="solid"
									size="md"
									px={8}
									py={4}
									fontWeight="bold"
									fontSize="md"
									boxShadow="sm"
									onClick={handleModalSave}
									isLoading={isAdding}
								>
									{modalMode === 'add' ? 'Add Field' : 'Save'}
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>

					{/* Delete Confirmation Modal */}
					<Modal
						isOpen={deleteModalOpen}
						onClose={cancelDelete}
						size="md"
					>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Confirm Delete</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Text mb={4}>
									Are you sure you want to delete the field "
									{fieldToDelete
										? fields[fieldToDelete.idx]?.label
										: ''}
									"?
								</Text>
								<Text color="gray.600" fontSize="sm">
									This action cannot be undone.
								</Text>
							</ModalBody>
							<ModalFooter>
								<Button
									onClick={cancelDelete}
									variant="outline"
									mr={3}
								>
									Cancel
								</Button>
								<Button
									colorScheme="red"
									onClick={confirmDelete}
									isLoading={isAdding}
								>
									Delete
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>

					{/* Encryption Information Modal */}
					<Modal isOpen={isInfoModalOpen} onClose={onInfoModalClose} size="md">
						<ModalOverlay />
						<ModalContent
							borderRadius="xl"
							boxShadow="0 2px 8px rgba(6,22,75,0.08)"
							borderWidth="1.5px"
							borderColor="#E2E8F0"
						>
							<ModalHeader
								bg="#F5F6FA"
								borderBottom="1px solid #E2E8F0"
								borderTopRadius="xl"
								py={4}
							>
								<HStack spacing={3}>
									<InfoIcon color="#06164B" fontSize="20px" />
									<Text
										fontSize="lg"
										fontWeight="bold"
										color="#06164B"
									>
										{t('ENCRYPTION_MODAL_TITLE')}
									</Text>
								</HStack>
							</ModalHeader>
							<ModalCloseButton
								color="#06164B"
								_hover={{ bg: "#F5F6FA" }}
								top={4}
								right={4}
							/>
							<ModalBody pb={6} pt={6}>
								<VStack spacing={4} align="stretch">
									<Box
										bg="white"
										p={4}
										borderRadius="lg"
										borderWidth="1px"
										borderColor="#E2E8F0"
									>
										<Text
											fontSize="md"
											color="#1F1B13"
											lineHeight="1.6"
										>
											{t('ENCRYPTION_MODAL_DESCRIPTION')}
										</Text>
									</Box>

									<Alert
										status="warning"
										borderRadius="lg"
										borderWidth="1px"
										borderColor="#FBD38D"
										bg="#FEF5E7"
									>
										<AlertIcon color="#D69E2E" />
										<Box>
											<AlertTitle
												fontSize="md"
												fontWeight="bold"
												color="#D69E2E"
											>
												{t('ENCRYPTION_MODAL_IMPORTANT')}
											</AlertTitle>
											<AlertDescription
												fontSize="sm"
												color="#744210"
												lineHeight="1.5"
											>
												{t('ENCRYPTION_MODAL_WARNING')}
											</AlertDescription>
										</Box>
									</Alert>

									<Box
										bg="#F7FAFC"
										p={3}
										borderRadius="md"
										borderLeft="4px solid #06164B"
									>
										<Text
											fontSize="sm"
											color="#4A5568"
											fontWeight="medium"
										>
											{t('ENCRYPTION_MODAL_TIP')}
										</Text>
									</Box>
								</VStack>
							</ModalBody>
						</ModalContent>
					</Modal>
				</VStack>
			</Layout>
		</Box>
	);
};

export default AddFields;
