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

interface MappingRequest {
	configType: string;
	mappings: Mapping[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL = 'http://localhost:5000';
export const updateMapping = async (mappings: Mapping[]) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/admin/config`,
			{
				configType: 'document-mapping',
				mappings,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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
		const response = await axios.get(
			`${BASE_URL}/admin/config/${configType}`,
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching document field mapping:', error);
		throw error;
	}
};
