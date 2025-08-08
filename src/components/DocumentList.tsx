import * as React from 'react';
import {
	VStack,
	Text,
	Icon,
	HStack,
	useTheme,
	Box,
	Tooltip,
} from '@chakra-ui/react';

import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import Loader from './common/Loader';
import { findDocumentStatus, getExpiryDate } from '../utils/jsHelper/helper';
import { AiFillCloseCircle } from 'react-icons/ai';
import DocumentActions from './DocumentActions';
import DocumentExpiry from './DocumentExpiry';
import { useTranslation } from 'react-i18next';
interface StatusIconProps {
	status: string;
	size?: number;
	'aria-label'?: string;
	userDocuments: UserDocument[];
}

interface Document {
	name: string;
	code: string;
}
interface UserDocument {
	doc_id: string;
	user_id: string;
	doc_type: string;
	doc_subtype: string;
	doc_name: string;
	imported_from: string;
	doc_path: string;
	doc_data: string; // You can parse this JSON string into an object when needed
	doc_datatype: string;
	doc_verified: boolean;
	uploaded_at: string;
	is_uploaded: boolean;
}
interface DocumentListProps {
	documents: Document[] | string[];
	userDocuments: UserDocument[];
}

const StatusIcon: React.FC<StatusIconProps> = ({
	status,
	size = 5,
	'aria-label': ariaLabel,
	userDocuments,
}) => {
	const { t } = useTranslation();
	const result = findDocumentStatus(userDocuments, status);
	const { success, isExpired } = getExpiryDate(userDocuments, status);
	const documentExpired = success && isExpired;
	let iconComponent;
	let iconColor;

	if (documentExpired) {
		iconComponent = AiFillCloseCircle;
		iconColor = '#C03744';
	} else if (result?.matchFound) {
		iconComponent = CheckCircleIcon;
		iconColor = '#0B7B69';
	} else {
		iconComponent = WarningIcon;
		iconColor = '#EDA145';
	}

	let label;

	if (ariaLabel) {
		label = ariaLabel;
	} else {
		let statusText;

		if (isExpired) {
			statusText = t('DOCUMENT_LIST_STATUS_EXPIRED');
		} else if (result?.matchFound) {
			statusText = t('DOCUMENT_LIST_STATUS_AVAILABLE');
		} else {
			statusText = t('DOCUMENT_LIST_STATUS_INCOMPLETE');
		}

		label = `${t('DOCUMENT_LIST_STATUS_PREFIX')}: ${statusText}`;
	}

	return (
		<Tooltip label={label} hasArrow>
			<Box display="inline-block">
				<Icon
					as={iconComponent}
					color={iconColor}
					boxSize={size}
					aria-label={label}
				/>
			</Box>
		</Tooltip>
	);
};

const DocumentList: React.FC<DocumentListProps> = ({
	documents,
	userDocuments,
}) => {
	const theme = useTheme();

	return documents && documents.length > 0 ? (
		<VStack
			align="stretch"
			backgroundColor={theme.colors.background}
			padding={0}
			spacing={0}
		>
			{documents.map((document) => (
				<HStack
					key={document.docType}
					borderBottomWidth="1px"
					borderBottomColor={theme.colors.border}
					paddingY={3}
					alignItems="center"
					spacing={3}
					height={70}
					width="100%"
					pl={2}
				>
					{/* Default status to false if not provided */}
					<StatusIcon
						status={document.documentSubType}
						userDocuments={userDocuments}
					/>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="space-between"
						width={'100%'}
					>
						<Box width={'70%'}>
							<Text
								fontSize="16px"
								fontWeight="400"
								color={theme.colors.text}
							>
								{document.name}
							</Text>
							<DocumentExpiry
								status={document.documentSubType}
								userDocuments={userDocuments}
							/>
						</Box>

						<DocumentActions
							status={document.documentSubType}
							userDocuments={userDocuments}
						/>
					</Box>
				</HStack>
			))}
		</VStack>
	) : (
		<Loader />
	);
};

export default DocumentList;
