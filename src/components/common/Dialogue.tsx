import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Text,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Code,
} from '@chakra-ui/react';
import CommonButton from './button/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Term {
	title?: string;
	description?: string;
	list?: {
		value: string;
	}[];
}
interface CommonDialogueProps {
	isOpen?: boolean | object;
	onClose?: () => void;
	termsAndConditions?: Term[];
	handleDialog?: () => void;
	deleteConfirmation?: boolean;
	documentName?: string;
	document?: object;
	previewDocument?: boolean;
}
const CommonDialogue: React.FC<CommonDialogueProps> = ({
	isOpen,
	onClose,
	termsAndConditions,
	handleDialog,
	deleteConfirmation,
	documentName,
	document,
	previewDocument,
}) => {
	const [isAccordionOpen, setIsAccordionOpen] = useState(false);
	const handleAccordionChange = (expandedIndex) => {
		setIsAccordionOpen(expandedIndex.length > 0);
	};
	const { t } = useTranslation();
	if (previewDocument) {
		return (
			<Modal isOpen={previewDocument} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Preview Document</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box
							as="pre"
							p={4}
							bg="gray.100"
							rounded="md"
							overflowX="auto"
							overflowY="auto"
							fontSize="sm"
							whiteSpace="pre-wrap"
							maxHeight="500px"
							width="auto"
						>
							<Code>{JSON.stringify(document, null, 2)}</Code>
						</Box>
					</ModalBody>
					<ModalFooter>
						<CommonButton
							label="Close"
							onClick={onClose}
							width="100px"
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
	if (deleteConfirmation) {
		return (
			<Modal isOpen={Boolean(isOpen)} onClose={onClose}>
				<ModalOverlay />
				<ModalContent borderRadius="md">
					<ModalHeader className="border-bottom">
						<Box className="heading">Confirmation</Box>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						className="border-bottom"
						maxHeight="400px" // Fixed height for Modal Body
						overflowY="auto" // Enables scrolling for Modal Body
						p={5}
					>
						Are you sure you want to delete the document{' '}
						<strong>{documentName}</strong>? This action cannot be
						undone.
					</ModalBody>
					<ModalFooter>
						<CommonButton
							onClick={handleDialog}
							width={'40%'}
							label={t('SUBMIT_DIALOGUE_BUTTON')}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
	return (
		<Modal isOpen={Boolean(isOpen)} onClose={onClose}>
			<ModalOverlay />
			<ModalContent borderRadius="md">
				<ModalHeader className="border-bottom">
					{termsAndConditions ? (
						<>
							<Box className="heading">Terms and Conditions</Box>
							<Box
								color="gray.600"
								fontWeight="300"
								fontSize="18px"
							>
								Confirmation
							</Box>
						</>
					) : (
						<>
							<Box className="heading">Application Submited</Box>
							<Box
								color="gray.600"
								fontWeight="300"
								fontSize="18px"
							>
								Confirmation
							</Box>
						</>
					)}
				</ModalHeader>
				{!termsAndConditions && <ModalCloseButton />}

				<ModalBody
					className="border-bottom"
					maxHeight="400px" // Fixed height for Modal Body
					overflowY="auto" // Enables scrolling for Modal Body
				>
					{termsAndConditions ? (
						<>
							<Text
								mt={4}
								mb={10}
								fontWeight="500"
								fontSize="20px"
							>
								{t('CONFIRMATION_DIALOGUE_CONSENT_TEXT')}
							</Text>
							<Text
								mt={4}
								mb={4}
								fontWeight="normal"
								fontSize="17px"
							>
								{t('DIALOGUE_CLICK_TO_READ_AND_PROCEED')}
							</Text>
							<Accordion
								allowMultiple
								onChange={handleAccordionChange}
							>
								<AccordionItem>
									<h2>
										<AccordionButton>
											<Box flex="1" textAlign="left">
												{t('DIALOGUE_T&C')}
											</Box>
											<AccordionIcon />
										</AccordionButton>
									</h2>
									<AccordionPanel
										pb={4}
										maxHeight="200px" // Fixed height for Accordion Panel
										overflowY="auto" // Enables scrolling for Accordion Panel
									>
										<div>
											{termsAndConditions?.map(
												(item, index) => (
													<Text
														color={'#4D4639'}
														size="16px"
														key={index + 100}
													>
														{index + 1}.{' '}
														{item.description}
													</Text>
												)
											)}
										</div>
									</AccordionPanel>
								</AccordionItem>
							</Accordion>
						</>
					) : (
						<>
							<Text fontSize="md" color="gray.700">
								{t('SUBMIT_DIALOGUE_CONTENT_TEXT')}
								<Text
									as="span"
									color="blue.600"
									fontWeight="medium"
								>
									{(isOpen as { name?: string })?.name || ''}
								</Text>{' '}
								{t('SUBMIT_DIALOGUE_SUBMITTED_TEXT')}!
							</Text>
							<Text fontSize="sm" color="gray.500" mt={3}>
								{t('SUBMIT_DIALOGUE_APPLICATION_ID_TEXT')}:
								<Text as="span" fontWeight="medium">
									{(isOpen as { orderId?: string })
										?.orderId || ''}
								</Text>
							</Text>
						</>
					)}
				</ModalBody>
				<ModalFooter>
					{termsAndConditions ? (
						<>
							<CommonButton
								variant="outline"
								onClick={onClose}
								label={t('CONFIRMATION_DIALOGUE_DENY')}
								isDisabled={!isAccordionOpen}
							/>
							<Box ml={2}>
								<CommonButton
									label={t('CONFIRMATION_DIALOGUE_ACCEPT')}
									isDisabled={!isAccordionOpen}
									onClick={handleDialog}
								/>
							</Box>
						</>
					) : (
						<CommonButton
							onClick={handleDialog}
							width={'40%'}
							label={t('SUBMIT_DIALOGUE_BUTTON')}
						/>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CommonDialogue;
