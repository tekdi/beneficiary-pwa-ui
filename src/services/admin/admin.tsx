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

export interface FieldOption {
	id: string;
	name: string;
	value: string;
}

export interface AddFieldPayload {
	name: string;
	label: string;
	context?: string;
	contextType?: string;
	type: string;
	ordering?: number;
	fieldParams?: { options?: FieldOption[] } | null;
	fieldAttributes?: { isEditable: boolean; isRequired: boolean };
	sourceDetails?: any;
	dependsOn?: Record<string, any>;
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
					Authorization: `Bearer ${authToken}`,
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
		return response.data.map((field: unknown) => {
			const fieldObj = field as Record<string, any>;
			return {
				fieldId: fieldObj.fieldId,
				label: fieldObj.label,
				name: fieldObj.name,
				type: fieldObj.type,
				isRequired: fieldObj.fieldAttributes?.isRequired ?? false,
				isEditable: fieldObj.fieldAttributes?.isEditable ?? false,
				ordering: fieldObj.ordering,
				fieldParams: fieldObj.fieldParams ?? undefined,
			};
		});
	} catch (error) {
		console.error('Error fetching fields:', error);
		throw error;
	}
};

export const addField = async (payload: AddFieldPayload) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('Authentication token not found');
		}
		const response = await axios.post(
			`${BASE_URL}/fields`,
			{
				name: payload.name,
				label: payload.label,
				context: payload.context || 'USERS',
				contextType: payload.contextType || 'User',
				type: payload.type,
				ordering: payload.ordering,
				fieldParams: payload.fieldParams ?? null,
				fieldAttributes: payload.fieldAttributes,
				sourceDetails: payload.sourceDetails ?? null,
				dependsOn: payload.dependsOn ?? {},
			},
			{
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error adding field:', error);
		throw error;
	}
};

export const updateField = async (
	fieldId: string,
	payload: AddFieldPayload
) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('Authentication token not found');
		}
		const response = await axios.put(
			`${BASE_URL}/fields/${fieldId}`,
			{
				name: payload.name,
				label: payload.label,
				type: payload.type,
				ordering: payload.ordering,
				fieldParams: payload.fieldParams ?? null,
				fieldAttributes: payload.fieldAttributes,
				sourceDetails: payload.sourceDetails ?? null,
				dependsOn: payload.dependsOn ?? {},
				isRequired: payload.fieldAttributes?.isRequired,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);
		return response.data;
	} catch (error: unknown) {
		console.error('Error updating field:', error);
		throw error;
	}
};

export const deleteField = async (fieldId: string) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('Authentication token not found');
		}
		const response = await axios.delete(
			`${BASE_URL}/fields/${fieldId}`,
			{
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);
		return response.data;
	} catch (error: unknown) {
		console.error('Error deleting field:', error);
		throw error;
	}
};

