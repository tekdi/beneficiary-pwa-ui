import React from 'react';
import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import { formatDate } from '../../utils/jsHelper/helper';
import { useTranslation } from 'react-i18next';

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

interface CustomField {
	label: string;
	value: string | number | null;
}

interface UserData {
	firstName?: string;
	middleName?: string | null;
	lastName?: string;
	dob?: string | null;
	customFields?: CustomField[];
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

// Helper to chunk an array into pairs
function chunkArray<T>(arr: T[], size: number): T[][] {
	return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
		arr.slice(i * size, i * size + size)
	);
}

const UserDetails: React.FC<UserDetailsProps> = ({ userData }) => {
	const { t } = useTranslation();
	
	// Prepare base fields as an array
	const baseFields = [
		{ label: t('USER_DETAILS_FIRST_NAME'), value: userData?.firstName ?? '-' },
		{ label: t('USER_DETAILS_MIDDLE_NAME'), value: userData?.middleName ?? '-' },
		{ label: t('USER_DETAILS_LAST_NAME'), value: userData?.lastName ?? '-' },
		{
			label: t('USER_DETAILS_DATE_OF_BIRTH'),
			value: userData?.dob ? formatDate(userData?.dob) : '-',
		},
	];

	return (
		<Box
			borderRadius="5px"
			boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
			bg="white"
			w="100%"
			borderWidth={1}
			p={6}
		>
			<VStack spacing={6} align="stretch">
				{/* Base fields, 2 per row */}
				{chunkArray(baseFields, 2).map((row) => (
					<HStack key={row.map((f) => f.label).join('_')} spacing={4}>
						{row.map((field) => (
							<Field
								label={field.label}
								value={field.value}
								key={field.label}
							/>
						))}
					</HStack>
				))}
				{/* Custom fields, 2 per row */}
				{userData?.customFields && userData.customFields.length > 0 && (
					<Box>
						<VStack spacing={2} align="stretch">
							{chunkArray(userData.customFields, 2).map((row) => (
								<HStack
									key={row.map((f) => f.label).join('_')}
									spacing={4}
								>
									{row.map((field) => (
										<Field
											label={field.label}
											value={field.value}
											key={field.label}
										/>
									))}
								</HStack>
							))}
						</VStack>
					</Box>
				)}
			</VStack>
		</Box>
	);
};
export default UserDetails;