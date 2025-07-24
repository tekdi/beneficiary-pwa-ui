import React, { useEffect, useState } from 'react';

import { Text } from '@chakra-ui/react';
import { getExpiryDate } from '../utils/jsHelper/helper';
import { useTranslation } from 'react-i18next';

interface DocumentExpiryProps {
	status: string;
	userDocuments: {
		doc_id?: string;
		user_id?: string;
		doc_type?: string;
		doc_subtype: string;
		doc_name: string;
		imported_from: string;
		doc_path: string;
		doc_data: string; // You can parse this JSON string into an object when needed
		doc_datatype: string;
		doc_verified: boolean;
		uploaded_at: string;
		is_uploaded: boolean;
	}[];
}

const DocumentExpiry: React.FC<DocumentExpiryProps> = ({
	status,
	userDocuments,
}) => {
	const { t } = useTranslation();
	const [documentStatus, setDocumentStatus] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const [expiryDate, setExpiryDate] = useState('');
	useEffect(() => {
		try {
			const { success, expDate, isExpired } = getExpiryDate(
				userDocuments,
				status
			);
			if (success) {
				setIsExpired(isExpired);
				setExpiryDate(expDate);
				setDocumentStatus(true);
			} else {
				setDocumentStatus(false);
				setIsExpired(false);
				setExpiryDate('');
			}
		} catch (error) {
			console.error('Error getting expiry date:', error);
			setDocumentStatus(false);
			setIsExpired(false);
			setExpiryDate('');
		}
	}, [status, userDocuments]);

	return documentStatus ? (
		<Text fontSize={10} color={isExpired ? '#C03744' : '#4D4639'}>
			{t('DOCUMENT_EXPIRY_PREFIX')}: {expiryDate}
		</Text>
	) : null;
};

export default DocumentExpiry;
