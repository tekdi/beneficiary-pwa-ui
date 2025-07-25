import {
	Box,
	Button,
	Flex,
	Image,
	List,
	ListIcon,
	ListItem,
	Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

function UploadDocuments() {
	const { t } = useTranslation();
	const [fileName, setFileName] = useState('');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file size (e.g., 5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				alert(t('UPLOAD_DOCUMENTS_FILE_SIZE_ERROR'));
				return;
			}
			// Validate file type
			const allowedTypes = ['.json', '.xml', '.docx'];
			const fileExt = file.name.split('.').pop()?.toLowerCase();
			if (!fileExt || !allowedTypes.includes(`.${fileExt}`)) {
				alert(t('UPLOAD_DOCUMENTS_INVALID_FILE_TYPE'));
				return;
			}
			setFileName(file.name);
		}
	};

	const removeFile = () => {
		setFileName('');
	};
	return (
		<>
			{/* Hidden file input */}
			<input
				type="file"
				id="fileInput"
				onChange={handleFileChange}
				style={{ display: 'none' }}
				aria-label="Upload document"
				accept=".json,.xml,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			/>

			{/* Styled button that looks like a link */}
			<Box>
				<Button
					as="label"
					htmlFor="fileInput"
					variant="link"
					style={{ color: 'var(--theme-color)' }}
					textDecoration="underline"
					fontWeight="normal"
					cursor="pointer"
					padding={0} // Remove default button padding
					mt="6"
				>
					<Image
						src="../../assets/images/file_upload.png"
						alt="Upload Documents"
						mr="2"
					/>
					{t('UPLOAD_DOCUMENTS_UPLOAD_BUTTON')}
				</Button>
			</Box>
			<Box>
				<Button
					as="label"
					htmlFor="fileInput"
					variant="link"
					style={{ color: 'var(--theme-color)' }}
					textDecoration="underline"
					fontWeight="normal"
					cursor="pointer"
					padding={0} // Remove default button padding
					mt="6"
				>
					<Image
						src="../../assets/images/file_upload.png"
						alt="Upload Documents"
						mr="2"
					/>
					{t('UPLOAD_DOCUMENTS_CASTE_CERTIFICATE')}
				</Button>
			</Box>

			{fileName && (
				<Flex
					align={'center'}
					justifyContent={'space-between'}
					mt="4"
					mb="4"
				>
					<Box>
						<List spacing={3}>
							<ListItem>
								<ListIcon
									as={CheckIcon}
									color="var(--theme-color)"
								/>
								{t('UPLOAD_DOCUMENTS_CASTE_CERTIFICATE')}
							</ListItem>
						</List>
						<Text mt={2}>{fileName}</Text>
					</Box>

					<Box>
						{' '}
						<CloseIcon onClick={removeFile} cursor={'pointer'} />
					</Box>
				</Flex>
			)}
		</>
	);
}

export default UploadDocuments;
