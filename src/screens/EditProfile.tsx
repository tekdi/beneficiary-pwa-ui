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
import { useTranslation } from 'react-i18next';

// Define the JSON Schema function
const getSchema = (t: (key: string) => string): RJSFSchema => ({
	type: 'object',
	properties: {
		personalInfo: {
			type: 'object',
			title: '',
			properties: {
				firstName: {
					type: 'string',
					title: t('EDITPROFILE_FIRST_NAME_LABEL'),
					minLength: 2,
				},
				fatherName: {
					type: 'string',
					title: t('EDITPROFILE_FATHER_NAME_LABEL'),
					minLength: 2,
				},
				motherName: {
					type: 'string',
					title: t('EDITPROFILE_MOTHER_NAME_LABEL'),
					minLength: 2,
				},
				lastName: { type: 'string', title: t('EDITPROFILE_LAST_NAME_LABEL'), minLength: 2 },
				dob: { type: 'string', title: t('EDITPROFILE_DOB_LABEL'), format: 'date' },
				gender: {
					type: 'string',
					title: t('EDITPROFILE_GENDER_LABEL'),
					enum: [t('EDITPROFILE_GENDER_MALE_OPTION'), t('EDITPROFILE_GENDER_FEMALE_OPTION')],
				},
				caste: {
					type: 'string',
					title: t('EDITPROFILE_CASTE_LABEL'),
					enum: [t('EDITPROFILE_CASTE_SC_OPTION'), t('EDITPROFILE_CASTE_ST_OPTION'), t('EDITPROFILE_CASTE_OBC_OPTION'), t('EDITPROFILE_CASTE_GENERAL_OPTION')],
				},
				disabilityStatus: {
					type: 'string',
					title: t('EDITPROFILE_DISABILITY_STATUS_LABEL'),
					enum: [t('EDITPROFILE_DISABILITY_YES_OPTION'), t('EDITPROFILE_DISABILITY_NO_OPTION')],
				},
				annualIncome: {
					type: 'string',
					title: t('EDITPROFILE_ANNUAL_INCOME_LABEL'),
					enum: [
						t('EDITPROFILE_INCOME_0_50K'),
						t('EDITPROFILE_INCOME_50K_100K'),
						t('EDITPROFILE_INCOME_100K_250K'),
						t('EDITPROFILE_INCOME_250K_PLUS'),
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
					title: t('EDITPROFILE_CLASS_LABEL'),
					enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				},
				studentType: {
					type: 'string',
					title: t('EDITPROFILE_STUDENT_TYPE_LABEL'),
					enum: [t('EDITPROFILE_STUDENT_TYPE_DAY'), t('EDITPROFILE_STUDENT_TYPE_HOSTELLER')],
				},
				currentSchoolName: {
					type: 'string',
					title: t('EDITPROFILE_CURRENT_SCHOOL_NAME_LABEL'),
					minLength: 2,
				},
				currentSchoolAddress: {
					type: 'string',
					title: t('EDITPROFILE_CURRENT_SCHOOL_ADDRESS_LABEL'),
					minLength: 2,
				},
				currentSchoolDistrict: {
					type: 'string',
					title: t('EDITPROFILE_CURRENT_SCHOOL_DISTRICT_LABEL'),
					minLength: 2,
				},
				previousYearMarks: {
					type: 'string',
					title: t('EDITPROFILE_PREVIOUS_YEAR_MARKS_LABEL'),
					pattern: '^[0-9]+(\\.[0-9]{1,2})?%$',
				},
				samagraId: {
					type: 'string',
					title: t('EDITPROFILE_SAMAGRA_ID_LABEL'),
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
					title: t('EDITPROFILE_BANK_ACCOUNT_HOLDER_NAME_LABEL'),
					minLength: 2,
				},
				bankName: { type: 'string', title: t('EDITPROFILE_BANK_NAME_LABEL'), minLength: 2 },
				bankAccountNumber: {
					type: 'string',
					title: t('EDITPROFILE_BANK_ACCOUNT_NUMBER_LABEL'),
					pattern: '^[0-9]{9,18}$',
				},
				bankIfscCode: {
					type: 'string',
					title: t('EDITPROFILE_BANK_IFSC_CODE_LABEL'),
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
});

// UI Schema for form layout customization
const getUiSchema = (t: (key: string) => string) => ({
	personalInfo: {
		dob: {
			'ui:widget': 'date',
		},
	},
	bankDetails: {
		bankAccountNumber: {
			'ui:help': t('EDITPROFILE_BANK_ACCOUNT_NUMBER_HELP'),
		},
		bankIfscCode: {
			'ui:help': t('EDITPROFILE_BANK_IFSC_CODE_HELP'),
		},
	},
});

// Main Component
const EditProfile = () => {
	const { t } = useTranslation();
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
				message: t('EDITPROFILE_UPDATE_SUCCESS'),
				type: 'success',
			});
			init(); // Re-fetch data or perform necessary updates
		} catch (error) {
			console.error('Error updating user details:', error);
			setToastMessage({
				message: t('EDITPROFILE_UPDATE_ERROR'),
				type: 'error',
			});
		}
	};

	// Navigate back on cancel
	const handleBack = () => navigate(-1);

	return (
		<Layout _heading={{ heading: t('EDITPROFILE_TITLE'), handleBack }}>
			<Box p={5} className="card-scroll invisible-scroll">
				{formData && (
					<Form
						schema={getSchema(t)}
						uiSchema={getUiSchema(t)}
						formData={formData}
						validator={validator}
						onSubmit={onSubmit}
					>
						<CommonButton label={t('EDITPROFILE_TITLE')} />
					</Form>
				)}
			</Box>
			<Toaster message={toastMessage.message} type={toastMessage.type} />
		</Layout>
	);
};

export default EditProfile;
