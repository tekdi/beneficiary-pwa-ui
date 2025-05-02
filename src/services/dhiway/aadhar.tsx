import axios from 'axios';
import { uploadUserDocuments } from '../user/User';

const BASE_URI = import.meta.env.VITE_DHIWAY_API_URL;
const token = import.meta.env.VITE_DHIWAY_TOKEN;
export const getDigiLockerRequest = async () => {
	const url = `${BASE_URI}/digilocker-request`;
	// Replace with your actual token

	try {
		const response = await axios.get(url, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		console.error(
			'Error fetching DigiLocker request:',
			error.response?.data || error.message
		);
		throw error;
	}
};

export const generatePayload = (
	data: any,
	options?: Partial<{
		doc_name: string;
		doc_type: string;
		doc_subtype: string;
	}>,
	userId: string
) => {
	const {
		doc_name = 'Aadhaar Card',
		doc_type = 'idProof',
		doc_subtype = 'aadhaar',
	} = options || {};

	const payload = [
		{
			doc_data: data,
			doc_datatype: 'Application/JSON',
			doc_name,
			doc_subtype,
			doc_type,
			imported_from: 'dhiway',
			uploaded_at: new Date().toISOString(), // current timestamp
			user_id: userId,
		},
	];

	return payload;
};
export const getAadhar = async (code: string, userId: string) => {
	try {
		const response = await axios.post(
			`${BASE_URI}/digilocker-auth`,
			{
				code,
				doctype: 'aadhaar',
			},
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const payload = generatePayload(
			response.data.data,
			{
				doc_name: 'Aadhaar Card',
				doc_type: 'identityProof',
				doc_subtype: 'aadhaar',
			},
			userId
		);
		const uploadToApp = await uploadUserDocuments(payload);
		return uploadToApp.data;
	} catch (error) {
		console.error('Error sending code to DigiLocker API:', error);
		throw error;
	}
};
