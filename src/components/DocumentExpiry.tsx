import React, { useEffect, useState } from 'react';
import { getExpiryDate } from '../utils/jsHelper/helper';
import { Text } from '@chakra-ui/react';

interface DocumentExpiryProps {
	status: string;
	userData: {
		doc_subtype: string;
		doc_data: string;
	}[];
}

const DocumentExpiry: React.FC<DocumentExpiryProps> = ({
	status,
	userData,
}) => {
	const [documentStatus, setDocumentStatus] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const [expiryDate, setExpiryDate] = useState('');
	useEffect(() => {
		try {
			const { success, expDate, isExpired } = getExpiryDate(
				userData,
				status
			);
			setIsExpired(isExpired || false);
			setExpiryDate(expDate || '');
			setDocumentStatus(success || false);
		} catch (error) {
			console.error('Error getting expiry date:', error);
			setDocumentStatus(false);
		}
	}, [status, userData]);

	return documentStatus ? (
		<Text fontSize={10} color={isExpired ? '#C03744' : '#4D4639'}>
			Expiry Date: {expiryDate}
		</Text>
	) : null;
};

export default DocumentExpiry;
