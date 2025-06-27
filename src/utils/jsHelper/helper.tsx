import { IncomeRange } from '../../assets/mockdata/FilterData';
interface DocumentItem {
	descriptor?: {
		code?: string;
	};
	value?: string;
}

const DATE_FORMAT_OPTIONS = {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
} as const;

export function formatDateString(dateString: string): string {
	if (typeof dateString !== 'string' || dateString.trim() === '') {
		throw new Error('Invalid input: dateString must be a non-empty string');
	}

	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) {
		throw new Error('Invalid date string provided');
	}
	return date.toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS);
}

export const extractMandatoryDocuments = (list: unknown): string[] => {
	if (!Array.isArray(list)) {
		console.error('Expected an array but received:', typeof list);
		return [];
	}

	return list
		.filter(
			(item: DocumentItem) =>
				item?.descriptor?.code === 'mandatory-doc' &&
				typeof item.value === 'string'
		)
		.map((item) => item.value || '')
		.filter((value) => value !== ''); // Ensure no empty strings in the result
};

interface EligibilityItem {
	descriptor: {
		code: string;
		name: string;
		short_desc: string;
	};
	display: boolean;
	item: string;
}

export const extractEligibilityValues = (
	data: EligibilityItem[] | undefined
): string[] => {
	if (!data || !Array.isArray(data)) {
		throw new Error(
			'Invalid input: expected an array of eligibility items'
		);
	}
	// Extracting the 'value' field from each item in the array
	return data.map((item) => item.item);
};

export function generateUUID(): string {
	if (typeof crypto === 'undefined') {
		throw new Error('Crypto API is not available');
	}
	if (crypto.randomUUID) {
		return crypto.randomUUID();
	}
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	array[6] = (array[6] & 0x0f) | 0x40; // Version 4 +
	array[8] = (array[8] & 0x3f) | 0x80; // Variant 10xxxxxxVariant 10xxxxxx +
	// Convert array to UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	return [
		array
			.slice(0, 4)
			.reduce(
				(str, byte) => str + byte.toString(16).padStart(2, '0'),
				''
			),
		array
			.slice(4, 6)
			.reduce(
				(str, byte) => str + byte.toString(16).padStart(2, '0'),
				''
			),
		array
			.slice(6, 8)
			.reduce(
				(str, byte) => str + byte.toString(16).padStart(2, '0'),
				''
			),
		array
			.slice(8, 10)
			.reduce(
				(str, byte) => str + byte.toString(16).padStart(2, '0'),
				''
			),
		array
			.slice(10)
			.reduce(
				(str, byte) => str + byte.toString(16).padStart(2, '0'),
				''
			),
	].join('-');
}

export const hasFiltersInURL = () => {
	const searchParams = new URLSearchParams(window.location.search);
	return [...searchParams.keys()].length > 0;
};

export const getFiltersFromURL = () => {
	const searchParams = new URLSearchParams(window.location.search);
	return {
		'caste-eligibility': searchParams.get('caste-eligibility') || '',
		'annualIncome-eligibility':
			searchParams.get('annualIncome-eligibility') || '',
	};
};

// Utility function to normalize filters
export const normalizeFilters = (filters) => {
	const newFilter = {};
	Object.keys(filters).forEach((key) => {
		if (filters[key]) {
			newFilter[key] =
				typeof filters[key] === 'string'
					? filters[key].toLowerCase()
					: filters[key];
		}
	});
	return newFilter;
};
const jsonToQueryString = (json) => {
	return (
		'?' +
		Object.keys(json)
			.map(
				(key) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
			)
			.join('&')
	);
};

// Function to update URL with filters
export const setQueryParameters = (filters) => {
	const queryString = jsonToQueryString(filters);
	const newUrl =
		window.location.origin + window.location.pathname + queryString;
	window.history.pushState({ path: newUrl }, '', newUrl);
};
/**
 * Parses the document data, replaces forward slashes in doc_data values, and adds a user_id field.
 *
 * @param {Array} documents - Array of document objects
 * @param {string} userId - User ID to add to each document
 * @returns {Array} - Updated documents with parsed doc_data values and added user_id
 */
export function processDocuments(documents, userId) {
	return documents.map((doc) => {
		const parsedDocData =
			typeof doc.doc_data === 'string'
				? JSON.parse(doc.doc_data)
				: doc.doc_data;

		// Replace forward slashes in values of doc_data
		const updatedDocData = Object.fromEntries(
			Object.entries(parsedDocData).map(([key, value]) => [
				key,
				typeof value === 'string' ? value.replace(/\//g, '') : value, // Replace / in values
			])
		);

		// Remove unwanted fields (doc_id, sso_id, issuer) from top-level of the document
		const { doc_id, sso_id, issuer, ...docWithoutUnwantedFields } = doc;

		// Return updated document with added user_id, doc_name, and imported_from
		return {
			...docWithoutUnwantedFields, // Spread the remaining fields
			doc_data: {
				...updatedDocData, // Include updated doc_data
			},
			imported_from: 'e-wallet', // Add the new imported_from field
			user_id: userId, // Add user_id to the document
			doc_datatype: 'Application/JSON',
		};
	});
}

interface DocumentStatus {
	matchFound: boolean;
	doc_verified: boolean | null;
	doc_id?: string;
	doc_data?: unknown;
	doc_name?: string;
}
export function findDocumentStatus(documents, status): DocumentStatus {
	// Iterate through the documents array
	for (const doc of documents) {
		if (doc.doc_subtype === status) {
			// Return true and the doc_verified value for the matched object

			return {
				matchFound: true,
				doc_verified: doc.doc_verified,
				doc_id: doc.doc_id,
				doc_data: doc.doc_data,
				doc_name: doc.doc_name,
			};
		}
	}
	// If no match is found
	return {
		matchFound: false,
		doc_verified: null,
		doc_id: '',
		doc_data: null,
		doc_name: '',
	};
}
export const convertToEditPayload = (formData) => {
	const { personalInfo, academicInfo, bankDetails } = formData;

	return {
		firstName: personalInfo.firstName,
		lastName: personalInfo.lastName,
		dob: personalInfo.dob,
		gender: personalInfo.gender,
		caste: personalInfo.caste,
		annualIncome: personalInfo.annualIncome,
		userInfo: {
			fatherName: personalInfo.fatherName,
			motherName: personalInfo.motherName,
			disabilityStatus: personalInfo.disabilityStatus,
			currentSchoolName: academicInfo.currentSchoolName,
			currentSchoolAddress: academicInfo.currentSchoolAddress,
			class: academicInfo.class,
			studentType: academicInfo.studentType,
			bankAccountHolderName: bankDetails.bankAccountHolderName,
			bankName: bankDetails.bankName,
			bankAccountNumber: bankDetails.bankAccountNumber,
			bankIfscCode: bankDetails.bankIfscCode,
		},
	};
};

export const transformUserDataToFormData = (userData) => {
	const getDefault = (key, defaultValue = '') =>
		userData?.[key] || defaultValue;

	const lowerCaseOrDefault = (key, defaultValue = '') =>
		userData?.[key]?.toLowerCase() || defaultValue;

	return {
		personalInfo: {
			firstName: getDefault('firstName'),
			lastName: getDefault('lastName'),
			fatherName: getDefault('fatherName'),
			motherName: getDefault('motherName'),
			dob: getDefault('dob'),
			gender: getDefault('gender'),
			caste: lowerCaseOrDefault('caste'),
			disabilityStatus: getDefault('disabilityStatus', 'no'),
			annualIncome: getDefault('annualIncome'),
		},
		academicInfo: {
			class: getDefault('class'),
			studentType: getDefault('studentType'),
			currentSchoolName: getDefault('currentSchoolName'),
			currentSchoolAddress: getDefault('currentSchoolAddress'),
			previousYearMarks: getDefault('previousYearMarks'),
			samagraId: getDefault('samagraId'),
		},
		bankDetails: {
			bankAccountHolderName: getDefault('bankAccountHolderName'),
			bankName: getDefault('bankName'),
			bankAccountNumber: getDefault('bankAccountNumber'),
			bankIfscCode: getDefault('bankIfscCode'),
		},
	};
};
const normalizeGender = (input: string) => {
	if (!input) {
		return ' ';
	}
	const normalized = input.trim().toLowerCase();

	if (['m', 'male'].includes(normalized)) {
		return 'male';
	}
	if (['f', 'female'].includes(normalized)) {
		return 'female';
	}
	return 'other';
};
export const transformData = (userData) => {
	return {
		firstName: userData?.firstName ?? '',
		middleName: userData?.middleName ?? '',
		fatherName: userData?.fatherName ?? '',
		lastName: userData?.lastName ?? '',
		gender: normalizeGender(userData?.gender),
		class: userData?.class ? `${userData.class}` : '',
		annualIncome: userData?.annualIncome ?? '',
		// caste: userData?.caste?.toLowerCase() ?? '',
		// disabled: userData?.disability ? 'yes' : 'no',
		// state: userData?.state ?? '',
		studentType: userData?.studentType ?? '',
		docs: userData?.docs ?? [],
		bankAccountHolderName: userData?.bankAccountHolderName ?? '',
		bankName: userData?.bankName ?? '',
		bankAccountNumber: userData?.bankAccountNumber ?? '',
		bankIfscCode: userData?.bankIfscCode ?? '',
		previousYearMarks: userData?.previousYearMarks ?? '',
		phoneNumber: userData?.phoneNumber ?? '',
		aadhaar: userData?.aadhaar?.toString() ?? '',
		udid: userData?.udid ?? '',
		dob: formatDate(userData?.dob) ?? '',
		disabilityRange: userData?.disabilityRange ?? '',
		disabilityType: userData?.disabilityType ?? ' ',
		branchCode: userData?.branchCode ?? ' ',
		bankAddress: userData?.bankAddress ?? ' ',
		nspOtr: userData?.nspOtr ?? ' ',
		tuitionAndAdminFeePaid:
			userData?.tuitionAndAdminFeePaid?.toString() ?? ' ',
		miscFeePaid: userData?.miscFeePaid?.toString() ?? ' ',
		currentSchoolName: userData?.currentSchoolName ?? ' ',
		bapId: import.meta.env.VITE_API_BASE_ID,
		age: userData?.age ?? ' ',
		year: userData?.class ? `${userData.class}` : '',
	};
};

export const formatDate = (dateString) => {
	if (dateString === null) return '-';
	const date = new Date(dateString);
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();

	return `${day}/${month}/${year}`;
};
interface UserData {
	id: number;
	label: string;
	value: string;
	length?: number;
}
export function getPreviewDetails(applicationData, documents) {
	let idCounter = 1; // To generate unique IDs
	const result: UserData[] = [];

	function formatKey(key) {
		// Convert camelCase to space-separated
		const spacedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2');

		// Convert snake_case to space-separated
		const normalizedKey = spacedKey.replace(/_/g, ' ');

		// Capitalize each word
		return normalizedKey.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	for (const key in applicationData) {
		if (applicationData.hasOwnProperty(key)) {
			// Skip keys listed in the `arr`
			if (
				!documents.some(
					(doc: { key: string; value: string }) => doc.key === key
				)
			) {
				result.push({
					id: idCounter++,
					label: formatKey(key),
					value: applicationData[key],
				});
			}
		}
	}

	return result;
}
function decodeFromBase64(base64Str: string): string {
	try {
		const base64Part = base64Str.replace(/^base64,/, '');
		return decodeURIComponent(atob(base64Part));
	} catch (error) {
		console.error('Failed to decode base64 string:', error);
		throw new Error('Failed to decode base64 string');
	}
}
function extractTitle(base64Str: string): string | undefined {
	try {
		const decoded = decodeFromBase64(base64Str);
		const parsed = JSON.parse(decoded); // assumes it's JSON
		const [title] = parsed.credentialSchema.title.split(':');

		return title.trim(); // handles both cases
	} catch (error) {
		console.error('Failed to extract title:', error);
		return undefined;
	}
}

export function getSubmmitedDoc(userData) {
	const result: { key: string; value: string }[] = [];
	for (const key in userData) {
		if (
			typeof userData[key] === 'string' &&
			userData[key].startsWith('base64')
		) {
			const value = extractTitle(userData[key]);
			if (value) {
				result.push({ key, value });
			}
		}
	}

	return result;
}

/**
 * Checks if the given value satisfies the given condition with respect to the given condition values.
 * The condition can be any of the following:
 * - "equals": checks if value equals any of the condition values
 * - "lessThan": checks if value is less than the first condition value
 * - "lessThanOrEquals": checks if value is less than or equals the first condition value
 * - "greaterThan": checks if value is greater than the first condition value
 * - "greaterThanOrEquals": checks if value is greater than or equals the first condition value
 * - "in": checks if value is in the condition values
 * - "notIn": checks if value is not in the condition values
 *
 * @param {string|number} value The value to check
 * @param {string} condition The condition to evaluate
 * @param {string|number|string[]|number[]} conditionValues The values to check against
 * @returns {boolean} true if the value satisfies the condition, false otherwise
 */
export function checkEligibilityCriteria({
	value,
	condition,
	conditionValues,
}: {
	value: string | number | null | undefined;
	condition: string;
	conditionValues: string | number | (string | number)[];
}): boolean {
	if (value == null) return false;
	// Convert value to string if it's a number
	const val =
		typeof value === 'string'
			? value.toLowerCase()
			: (value?.toString() || '').toLowerCase();
	if (!val) return false;

	// Convert conditionValues to an array of strings
	const conditionVals: string[] =
		typeof conditionValues === 'string'
			? [conditionValues.toLowerCase()]
			: (conditionValues as (string | number)[]).map((cv) =>
					cv?.toString().toLowerCase()
				);

	// Evaluate the condition
	switch (condition.trim()) {
		case 'equals':
			// Check if value equals any of the condition values
			return conditionVals.includes(val);
		case 'lessThan':
		case 'less than':
			// Check if value is less than the first condition value
			return (
				conditionVals.length > 0 &&
				parseInt(conditionVals[0], 10) > parseInt(val, 10)
			);
		case 'lessThanOrEquals':
		case 'less than or equals':
		case 'less than equals':
			// Check if value is less than or equals the first condition value
			return (
				conditionVals.length > 0 &&
				parseInt(conditionVals[0], 10) >= parseInt(val, 10)
			);
		case 'greaterThan':
		case 'greater than':
			// Check if value is greater than the first condition value
			return (
				conditionVals.length > 0 &&
				parseInt(conditionVals[0], 10) < parseInt(val, 10)
			);
		case 'greaterThanOrEquals':
		case 'greater than or equals':
		case 'greater than equals':
			// Check if value is greater than or equals the first condition value
			return (
				conditionVals.length > 0 &&
				parseInt(conditionVals[0], 10) <= parseInt(val, 10)
			);
		case 'in':
			// Check if value is in the condition values
			return conditionVals.includes(val);
		case 'notIn':
		case 'not in':
			// Check if value is not in the condition values
			return !conditionVals.includes(val);
		default:
			// Return false for unrecognized conditions
			return false;
	}
}
export function getIncomeRangeValue(annualIncome: string): string | undefined {
	const income = parseFloat(annualIncome);
	if (isNaN(income)) return '';

	for (const range of IncomeRange) {
		if (range.value === '') continue;

		const [minStr, maxStr] = range.value.split('-');
		const min = Number(minStr);
		const max = Number(maxStr);

		if (Number.isNaN(min) || Number.isNaN(max)) {
			console.warn(`Invalid range format in IncomeRange: ${range.value}`);
			continue;
		}

		if (income >= min && income <= max) {
			return range.value;
		}
	}

	return '';
}
export const calculateAge = (birthDateInput: Date | string): number | null => {
	let birthDate: Date;

	if (!birthDateInput) return null;

	if (typeof birthDateInput === 'string') {
		// Check if string is in DD-MM-YYYY format using regex
		const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
		const match = ddmmyyyyRegex.exec(birthDateInput); // using exec instead of match

		if (match) {
			// Rearrange to YYYY-MM-DD for reliable parsing
			const [_, dd, mm, yyyy] = match;
			const isoDateStr = `${yyyy}-${mm}-${dd}`;
			birthDate = new Date(isoDateStr);
		} else {
			// Otherwise, try to parse directly
			birthDate = new Date(birthDateInput);
		}
	} else {
		birthDate = birthDateInput;
	}

	// Check if date is valid
	if (isNaN(birthDate.getTime())) {
		return null;
	}

	const today = new Date(); // If born on Feb 29 and this year isn’t a leap year, roll “today” back to Feb 28 for comparison
	const isFeb29 = birthDate.getMonth() === 1 && birthDate.getDate() === 29;
	const thisYear = today.getFullYear();
	const isLeap =
		thisYear % 4 === 0 && (thisYear % 100 !== 0 || thisYear % 400 === 0);
	const adjustedToday =
		isFeb29 && !isLeap ? new Date(thisYear, 1, 28) : today;
	let age = adjustedToday.getFullYear() - birthDate.getFullYear();
	const monthDiff = adjustedToday.getMonth() - birthDate.getMonth();
	const dayDiff = adjustedToday.getDate() - birthDate.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age >= 0 ? age : 0;
};

export function getExpiryDate(
	userData: { doc_subtype: string; doc_data: string }[],
	doc: string
) {
	try {
		const match = userData.find((item) => item.doc_subtype === doc);
		if (!match) return { success: false };

		const parsedData = JSON.parse(match.doc_data);
		if (!parsedData.validUntil) {
			return { success: false };
		}

		const expiry = new Date(parsedData.validUntil);
		if (isNaN(expiry.getTime())) {
			return { success: false };
		}
		const expDate = formatDate(parsedData.validUntil);
		const now = new Date();
		const isExpired = expiry.getTime() < now.getTime();

		return { success: true, expDate, isExpired };
	} catch (error) {
		console.error('Error parsing document data:', error);
		return { success: false };
	}
}
export const formatLabel = (
	proofs: string[],
	codes: string[],
	isRequired: boolean
) => {
	const label = proofs
		.map((p) =>
			p
				.replace(/([A-Z])/g, ' $1')
				.replace(/^./, (str) => str.toUpperCase())
		)
		.join(' / ');
	const requiredMark = isRequired ? ' *' : '';
	return `Document for ${codes.join(', ')} (${label} )${requiredMark}`;
};
export interface Descriptor {
	code: string;
	name: string;
}
export interface DocumentTag {
	descriptor: Descriptor;
	value: string;
	display: boolean;
}
export const parseDocList = (list: DocumentTag[], fromEligibility = false) => {
	return list.map((item: any) => {
		let value;
		try {
			value = JSON.parse(item?.value ?? '{}');
		} catch (error) {
			console.error('Failed to parse document item value:', error);
			value = {};
		}
		return {
			id: value.id,
			code: value.documentType ?? value.evidence,
			isRequired: fromEligibility ? true : value.isRequired,
			allowedProofs: value.allowedProofs ?? [],
		};
	});
};
