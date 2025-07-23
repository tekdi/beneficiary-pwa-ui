import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface UserData {
	firstName?: string;
	middleName?: string;
	lastName?: string;
	dob?: string;
	customFields?: { label: string; value: string }[];
}

interface UserDetailsProps {
	userData: UserData;
}

// Helper function to chunk array into groups
const chunkArray = <T,>(array: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};

// Format date to DD/MM/YYYY
const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

// Define the styles as objects
const labelStyles = {
	fontSize: '12px',
	fontWeight: '500',
	lineHeight: '16px',
	color: '#433E3F',
	marginBottom: '4px',
} as const;

const valueStyles = {
	fontSize: '14px',
	fontWeight: '400',
	lineHeight: '18px',
	color: '#1F1B13',
} as const;

interface FieldProps {
	label: string;
	value: string;
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
