import axios from 'axios';

export interface DocumentFieldMapping {
	document: string;
	documentField: string;
}

export interface FieldValueNormalization {
	rawValue: string;
	transformedValue: string;
}

export interface Mapping {
	name?: string;
	label?: string;
	documentSubType?: string;
	docType?: string;
	fieldName?: string;
	documentMappings?: DocumentFieldMapping[];
	fieldValueNormalizationMapping?: FieldValueNormalization;
}

export interface Field {
	fieldId: string;
	label: string;
	name: string;
	type: string;
	isRequired: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updateMapping = async (value: Mapping[], key: string) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('Authentication token not found');
		}

		const response = await axios.post(
			`${BASE_URL}/admin/config`,
			{
				key,
				value,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error updating document mapping:', error);
		throw error;
	}
};

export const getMapping = async (configType: string) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('Authentication token not found');
		}
		const response = await axios.get(
			`${BASE_URL}/admin/config/${configType}`,
			{
				headers: {
					Authorization:  `Bearer ${authToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching document field mapping:', error);
		throw error;
	}
};

export const fetchFields = async (
	context = 'USERS',
	contextType = 'User'
): Promise<Field[]> => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('Authentication token not found');
		}
		const response = await axios.get(`${BASE_URL}/fields`, {
			params: { context, contextType },
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});
		// Response is an array of field objects
		return response.data.map((field: any) => ({
			fieldId: field.fieldId,
			label: field.label,
			name: field.name,
			type: field.type,
			isRequired: field.fieldAttributes?.isRequired ?? false,
		}));
	} catch (error) {
		console.error('Error fetching fields:', error);
		throw error;
	}
};
