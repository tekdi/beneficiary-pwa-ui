import React, { useEffect, useState } from 'react';

import { Text } from '@chakra-ui/react';
import { getExpiryDate } from '../utils/jsHelper/helper';

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
	const [documentStatus, setDocumentStatus] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const [expiryDate, setExpiryDate] = useState('');
	useEffect(() => {
		try {
			const { success, expDate, isExpired } = getExpiryDate(
				userDocuments,
				status
			);

			setIsExpired(isExpired || false);
			setExpiryDate(expDate || '');
			setDocumentStatus(success || false);
		} catch (error) {
			console.error('Error getting expiry date:', error);
			setDocumentStatus(false);
		}
	}, [status, userDocuments]);

	return documentStatus ? (
		<Text fontSize={10} color={isExpired ? '#C03744' : '#4D4639'}>
			Expiry Date: {expiryDate}
		</Text>
	) : null;
};

export default DocumentExpiry;
