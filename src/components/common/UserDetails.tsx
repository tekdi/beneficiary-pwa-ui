import React from 'react';
import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { calculateAge, formatDate } from '../../utils/jsHelper/helper';

// Define common styles for Text and Input components
const labelStyles = {
	fontSize: '12px',
	fontWeight: '600',
	mb: 1,
	color: '#06164B',
	lineHeight: '16px',
};

const valueStyles = {
	fontSize: '14px',
	fontWeight: '400',
	color: '#1F1B13',
	lineHeight: '14px',
};

interface UserData {
	firstName?: string;
	middleName?: string | null;
	lastName?: string;
	fatherName?: string;
	motherName?: string;
	dob?: string | null;
	gender?: string;
	// Contact Information
	email?: string;
	phoneNumber?: string;
	state?: string;
	// Educational Information
	class?: string;
	currentSchoolName?: string | null;
	currentSchoolAddress?: string | null;
	currentSchoolDistrict?: string | null;
	previousYearMarks?: string;

	// Demographic Information
	caste?: string;
	disabilityStatus?: string | null;
	udid?: string | null;
	disabilityType?: string | null;
	disabilityRange?: string | null;
	annualIncome?: string;
	studentType?: string;
	nspOtr?: string;
	tuitionAndAdminFeePaid?: string;
	miscFeePaid?: string;

	// System Information
	user_id?: string;
	sso_id?: string;
	sso_provider?: string;
	samagraId?: string;
	aadhaar?: string;
	status?: string;
	created_at?: string;
	updated_at?: string;
	image?: string | null;
}

interface UserDetailsProps {
	userData: UserData;
}
type FieldValue = string | number | null | undefined;
interface FieldProps {
	label: string;
	value?: FieldValue;
	defaultValue?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, defaultValue = '-' }) => (
	<Box flex={1}>
		<Text {...labelStyles}>{label}</Text>
		<Text {...valueStyles}>{value ?? defaultValue}</Text>
	</Box>
);

const UserDetails: React.FC<UserDetailsProps> = ({ userData }) => {
	const { t } = useTranslation();

	const formattedDate = formatDate(userData?.dob);

	return (
		<Box
			borderRadius="5px"
			boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
			bg="white"
			w="100%"
			borderWidth={1}
			p={6}
		>
			{/* <VStack spacing={6} align="stretch" mb={6}>
        <Field
          label={t("USER_DETAILS_FATHER_NAME")}
          value={userData?.fatherName}
        />
        <Field
          label={t("USER_DETAILS_MOTHER_NAME")}
          value={userData?.motherName}
        />
        <Field label={t("USER_DETAILS_LAST_NAME")} value={userData?.lastName} />
      </VStack> */}

			<VStack spacing={6} align="stretch">
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_FIRST_NAME')}
						value={userData?.firstName}
					/>{' '}
					<Field
						label={t('USER_DETAILS_MIDDLE_NAME')}
						value={userData?.middleName}
					/>{' '}
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_LAST_NAME')}
						value={userData?.lastName}
					/>{' '}
					<Field
						label={t('USER_DETAILS_FATHER_NAME')}
						value={userData?.fatherName}
					/>{' '}
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_GENDER')}
						value={userData?.gender}
					/>
					<Field
						label={t('USER_DETAILS_DOB')}
						value={formattedDate}
					/>{' '}
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_AADHAAR')}
						value={userData?.aadhaar}
					/>
					<Field
						label={t('USER_DETAILS_STATE')}
						value={userData?.state}
					/>
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_CLASS')}
						value={userData?.class}
					/>
					<Field
						label={t('USER_DETAILS_PREVIOUS_YEAR_MARKS')}
						value={userData?.previousYearMarks}
					/>
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_ANNUAL_INCOME')}
						value={
							userData?.annualIncome &&
							`INR ${userData?.annualIncome}`
						}
					/>
					<Field
						label={t('USER_DETAILS_NSP_OTR')}
						value={userData?.nspOtr}
					/>
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_DISABILITY')}
						value={userData?.disabilityStatus}
					/>
					<Field
						label={t('USER_DETAILS_UDID')}
						value={userData?.udid}
					/>
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_DISABILITY_Type')}
						value={userData?.disabilityType
							?.split('_')
							.map(
								(word) =>
									word.charAt(0).toUpperCase() + word.slice(1)
							)
							.join(' ')}
					/>
					<Field
						label={t('USER_DETAILS_DISABILITY_RANGE')}
						value={userData?.disabilityRange}
					/>
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_TUTION_ADMIN_FEE_PAID')}
						value={userData?.tuitionAndAdminFeePaid}
					/>
					<Field
						label={t('USER_DETAILS_MISC_FEE_PAID')}
						value={userData?.miscFeePaid}
					/>
				</HStack>
				<HStack spacing={4}>
					<Field
						label={t('USER_DETAILS_AGE')}
						value={calculateAge(userData?.dob)}
					/>
				</HStack>
			</VStack>
		</Box>
	);
};
export default UserDetails;
