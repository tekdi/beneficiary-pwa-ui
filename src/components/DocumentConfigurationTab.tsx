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
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const DocumentConfigurationTab = () => {
	const toast = useToast();

	const [documentConfigs, setDocumentConfigs] = useState([]);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		// Simulate fetching from API/localStorage/etc.
		const existingConfigs = [
			{
				id: 1,
				name: 'Aadhaar Card',
				label: 'Aadhaar',
				documentSubType: 'aadhaarCard',
				docType: 'identityProof',
			},
			{
				id: 2,
				name: 'Income Certificate',
				label: 'Income Cert.',
				documentSubType: 'incomeCert',
				docType: 'incomeProof',
			},
		];

		if (existingConfigs.length > 0) {
			setDocumentConfigs(existingConfigs);
		} else {
			setDocumentConfigs([
				{
					id: Date.now(),
					name: '',
					label: '',
					documentSubType: '',
					docType: '',
				},
			]);
		}
	}, []);

	const handleChange = (index: number, field: string, value: string) => {
		const updated = [...documentConfigs];
		updated[index][field] = value;
		setDocumentConfigs(updated);

		const newErrors = { ...errors };
		delete newErrors[`${field}_${index}`];
		setErrors(newErrors);
	};

	const addConfig = () => {
		setDocumentConfigs([
			...documentConfigs,
			{
				id: Date.now(),
				name: '',
				label: '',
				documentSubType: '',
				docType: '',
			},
		]);
	};

	const removeConfig = (index: number) => {
		const updated = [...documentConfigs];
		updated.splice(index, 1);
		setDocumentConfigs(updated);
	};

	const handleSaveAll = () => {
		let hasError = false;
		const newErrors = {};

		documentConfigs.forEach((doc, index) => {
			['name', 'label', 'documentSubType', 'docType'].forEach((field) => {
				if (!doc[field]) {
					newErrors[`${field}_${index}`] = `${field} is required`;
					hasError = true;
				}
			});
		});

		setErrors(newErrors);

		if (hasError) {
			toast({
				title: 'Validation Error',
				description: 'Please fill in all fields',
				status: 'error',
			});
			return;
		}

		// Simulate API call (replace with actual API later)
		console.log('Saving configs:', documentConfigs);
		toast({
			title: 'Success',
			description: `${documentConfigs.length} document configurations saved.`,
			status: 'success',
		});
	};

	return (
		<VStack align="stretch" spacing={6}>
			<Alert status="info">
				<AlertIcon />
				Add multiple document configurations used for document
				verification.
			</Alert>

			<Box>
				<HStack justify="space-between">
					<Text fontSize="xl" fontWeight="bold">
						Document Configurations
					</Text>
					<Button
						size="sm"
						leftIcon={<AddIcon />}
						onClick={addConfig}
						colorScheme="blue"
					>
						Add Configuration
					</Button>
				</HStack>

				<VStack spacing={4} mt={4} width={'80%'}>
					{documentConfigs.map((doc, index) => (
						<Card
							key={doc.id}
							borderColor="blue.200"
							borderWidth="1px"
						>
							<CardBody width="90%">
								<VStack spacing={3} align="stretch">
									<HStack justify="flex-end">
										<IconButton
											icon={<DeleteIcon />}
											colorScheme="red"
											aria-label="Remove"
											size="sm"
											onClick={() => removeConfig(index)}
											isDisabled={
												documentConfigs.length === 1
											}
										/>
									</HStack>

									<HStack spacing={4}>
										<FormControl
											isInvalid={
												!!errors[`name_${index}`]
											}
											flex={1}
										>
											<FormLabel>Document Name</FormLabel>
											<Input
												value={doc.name}
												onChange={(e) =>
													handleChange(
														index,
														'name',
														e.target.value
													)
												}
												borderColor="blue.400"
												borderWidth="2px"
											/>
											<FormErrorMessage>
												{errors[`name_${index}`]}
											</FormErrorMessage>
										</FormControl>

										<FormControl
											isInvalid={
												!!errors[`label_${index}`]
											}
											flex={1}
										>
											<FormLabel>
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
												borderColor="blue.400"
												borderWidth="2px"
											/>
											<FormErrorMessage>
												{errors[`label_${index}`]}
											</FormErrorMessage>
										</FormControl>
									</HStack>

									<HStack spacing={4}>
										<FormControl
											isInvalid={
												!!errors[
													`documentSubType_${index}`
												]
											}
											flex={1}
										>
											<FormLabel>
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
												borderColor="blue.400"
												borderWidth="2px"
											/>
											<FormErrorMessage>
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
											<FormLabel>Document Type</FormLabel>
											<Input
												value={doc.docType}
												onChange={(e) =>
													handleChange(
														index,
														'docType',
														e.target.value
													)
												}
												borderColor="blue.400"
												borderWidth="2px"
											/>
											<FormErrorMessage>
												{errors[`docType_${index}`]}
											</FormErrorMessage>
										</FormControl>
									</HStack>
								</VStack>
							</CardBody>
						</Card>
					))}
				</VStack>

				<Divider my={6} />

				<HStack justify="flex-end">
					<Button colorScheme="green" onClick={handleSaveAll}>
						Save All Configurations
					</Button>
				</HStack>
			</Box>
		</VStack>
	);
};

export default DocumentConfigurationTab;
