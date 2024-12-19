import React, { useContext, useEffect, useState } from 'react';
import validator from '@rjsf/validator-ajv6';
import { Box } from '@chakra-ui/react';
import { Theme as ChakraTheme } from '@rjsf/chakra-ui';
import { withTheme, IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import Layout from '../components/common/layout/Layout';
import {
	convertToEditPayload,
	transformUserDataToFormData,
} from '../utils/jsHelper/helper';
import { AuthContext } from '../utils/context/checkToken';
import { updateUserDetails } from '../services/user/User';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../components/common/button/Button';
import { getDocumentsList, getUser } from '../services/auth/auth';
import Toaster from '../components/common/ToasterMessage';

// Define the JSON Schema
const schema: RJSFSchema = {
	type: 'object',
	properties: {
		personalInfo: {
			type: 'object',
			title: '',
			properties: {
				firstName: {
					type: 'string',
					title: 'First Name',
					minLength: 2,
				},
				fatherName: {
					type: 'string',
					title: "Father's Name",
					minLength: 2,
				},
				motherName: {
					type: 'string',
					title: "Mother's Name",
					minLength: 2,
				},
				lastName: { type: 'string', title: 'Last Name', minLength: 2 },
				dob: { type: 'string', title: 'Date of Birth', format: 'date' },
				gender: {
					type: 'string',
					title: 'Gender',
					enum: ['Male', 'Female'],
				},
				caste: {
					type: 'string',
					title: 'Caste',
					enum: ['sc', 'st', 'OBC', 'General'],
				},
				disabilityStatus: {
					type: 'string',
					title: 'Disability Status',
					enum: ['yes', 'no'],
				},
				annualIncome: {
					type: 'string',
					title: 'Annual Income',
					enum: [
						'0-50000',
						'50001-100000',
						'100001-250000',
						'250001+',
					],
				},
			},
			required: ['firstName', 'lastName', 'gender', 'caste'],
		},
		academicInfo: {
			type: 'object',
			title: '',
			properties: {
				class: {
					type: 'integer',
					title: 'Class',
					enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				},
				studentType: {
					type: 'string',
					title: 'Student Type',
					enum: ['Day', 'Hosteller'],
				},
				currentSchoolName: {
					type: 'string',
					title: 'Current School Name',
					minLength: 2,
				},
				currentSchoolAddress: {
					type: 'string',
					title: 'Current School Address',
					minLength: 2,
				},
				currentSchoolDistrict: {
					type: 'string',
					title: 'Current School District',
					minLength: 2,
				},
				previousYearMarks: {
					type: 'string',
					title: 'Previous Year Marks',
					pattern: '^[0-9]+(\\.[0-9]{1,2})?%$',
				},
				samagraId: {
					type: 'string',
					title: 'Samagra ID',
					minLength: 5,
				},
			},
			required: ['class', 'studentType', 'currentSchoolName'],
		},
		bankDetails: {
			type: 'object',
			title: '',
			properties: {
				bankAccountHolderName: {
					type: 'string',
					title: 'Bank Account Holder Name',
					minLength: 2,
				},
				bankName: { type: 'string', title: 'Bank Name', minLength: 2 },
				bankAccountNumber: {
					type: 'string',
					title: 'Bank Account Number',
					pattern: '^[0-9]{9,18}$',
				},
				bankIfscCode: {
					type: 'string',
					title: 'Bank IFSC Code',
					pattern: '^[A-Z]{4}[0-9]{7}$',
				},
			},
			required: [
				'bankAccountHolderName',
				'bankName',
				'bankAccountNumber',
				'bankIfscCode',
			],
		},
	},
};

// UI Schema for form layout customization
const uiSchema = {
	personalInfo: {
		dob: {
			'ui:widget': 'date',
		},
	},
	bankDetails: {
		bankAccountNumber: {
			'ui:help': 'Enter valid 9-18 digit account number',
		},
		bankIfscCode: {
			'ui:help': 'Enter valid IFSC code (e.g., SBIN0000123)',
		},
	},
};

// Main Component
const EditProfile = () => {
	const navigate = useNavigate();
	const { userData, updateUserData } = useContext(AuthContext); // Access userData from context
	const [formData, setFormData] = useState<any>(null); // Manage form state
	const [toastMessage, setToastMessage] = useState<{
		message: string;
		type: 'success' | 'error';
	}>({
		message: '',
		type: 'success',
	});

	useEffect(() => {
		// Prefill form with user data when available
		if (userData) {
			setFormData(transformUserDataToFormData(userData));
		}
	}, [userData]);

	// Define RJSF Form with Chakra UI theme
	const Form = withTheme(ChakraTheme);
	const init = async () => {
		try {
			const result = await getUser();
			const data = await getDocumentsList();
			updateUserData(result.data, data.data);
			handleBack();
		} catch (error) {
			console.error('Error fetching user data or documents:', error);
		}
	};

	// Handle form submission
	const onSubmit = async ({ formData }: IChangeEvent) => {
		try {
			const payload = convertToEditPayload(formData);
			await updateUserDetails(userData.user_id, payload);
			console.log('User details updated successfully.');
			setToastMessage({
				message: 'User details updated successfully!',
				type: 'success',
			});
			init(); // Re-fetch data or perform necessary updates
		} catch (error) {
			console.error('Error updating user details:', error);
			setToastMessage({
				message: 'Failed to update user details. Please try again.',
				type: 'error',
			});
		}
	};

	// Navigate back on cancel
	const handleBack = () => navigate(-1);

	return (
		<Layout _heading={{ heading: 'Edit Profile', handleBack }}>
			<Box p={5} className="card-scroll invisible-scroll">
				{formData && (
					<Form
						schema={schema}
						uiSchema={uiSchema}
						formData={formData}
						validator={validator}
						onSubmit={onSubmit}
					>
						<CommonButton label="Edit Profile" />
					</Form>
				)}
			</Box>
			<Toaster message={toastMessage.message} type={toastMessage.type} />
		</Layout>
	);
};

export default EditProfile;
