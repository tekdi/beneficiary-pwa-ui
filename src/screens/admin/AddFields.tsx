import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	fetchFields,
	addField,
	AddFieldPayload,
	FieldOption,
	updateField,
} from '../../services/admin/admin';
import Layout from '../../components/common/admin/Layout';

// Extend Field type locally to include isEditable for table rendering
import type { Field as BaseField } from '../../services/admin/admin';

interface Field extends BaseField {
	isEditable?: boolean;
	ordering?: number;
	fieldParams?: { options?: FieldOption[] };
}

interface FieldForm {
	label: string;
	name: string;
	type: string;
	isRequired: boolean;
	isEditable: boolean;
	options: FieldOption[];
}

const initialForm: FieldForm = {
	label: '',
	name: '',
	type: 'text',
	isRequired: false,
	isEditable: true,
	options: [],
};

const AddFields: React.FC = () => {
	const [fields, setFields] = useState<Field[]>([]);
	const [form, setForm] = useState<FieldForm>(initialForm);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isAdding, setIsAdding] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

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
		idx: number,
		key: 'name' | 'value',
		value: string
	) => {
		setForm((prev) => {
			const options = [...prev.options];
			options[idx] = { ...options[idx], [key]: value };
			return { ...prev, options };
		});
	};

	const addOption = () => {
		setForm((prev) => ({
			...prev,
			options: [...prev.options, { name: '', value: '' }],
		}));
	};

	const removeOption = (idx: number) => {
		setForm((prev) => {
			const options = [...prev.options];
			options.splice(idx, 1);
			return { ...prev, options };
		});
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!form.label.trim()) newErrors.label = 'Label is required';
		if (!form.name.trim()) newErrors.name = 'Name is required';
		if (!form.type) newErrors.type = 'Type is required';
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
				ordering: fields.length + 1,
				fieldParams:
					form.type === 'drop_down'
						? { options: form.options }
						: null,
				fieldAttributes: {
					isEditable: form.isEditable,
					isRequired: form.isRequired,
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
					ordering: fields[editingIndex].ordering || editingIndex + 1,
					fieldParams:
						form.type === 'drop_down'
							? { options: form.options }
							: null,
					fieldAttributes: {
						isEditable: form.isEditable,
						isRequired: form.isRequired,
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

	return (
		<Box bg="gray.50" minH="100vh" py={{ base: 4, md: 8 }}>
			<Layout
				showMenu={true}
				title="Add Fields"
				subTitle="Add, edit, and remove user fields."
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
									<Th borderColor="#E2E8F0">Actions</Th>
								</Tr>
							</Thead>
							<Tbody>
								{fields.map((field, idx) => {
									const editableText =
										typeof field.isEditable === 'boolean'
											? field.isEditable
												? 'Yes'
												: 'No'
											: 'No';
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
										<FormLabel>Label</FormLabel>
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
										<FormLabel>Name</FormLabel>
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

									{form.type === 'drop_down' && (
										<Box>
											<FormLabel>
												Dropdown Options
											</FormLabel>
											{form.options.map((opt, idx) => (
												<HStack key={opt.value} mb={2}>
													<Input
														placeholder="Name"
														value={opt.name}
														onChange={(e) =>
															handleOptionChange(
																idx,
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
																idx,
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
															removeOption(idx)
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
				</VStack>
			</Layout>
		</Box>
	);
};

export default AddFields;
