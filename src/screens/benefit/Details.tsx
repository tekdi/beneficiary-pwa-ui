import React, { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	Text,
	UnorderedList,
	ListItem,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@chakra-ui/react';
import '../../assets/styles/App.css';
import { useNavigate, useParams } from 'react-router-dom';
import CommonButton from '../../components/common/button/Button';
import Layout from '../../components/common/layout/Layout';
import { getUser, sendConsent } from '../../services/auth/auth';
import {
	applyApplication,
	checkEligibilityOfUser,
	confirmApplication,
	createApplication,
	getApplication,
	getOne,
} from '../../services/benefit/benefits';
import WebViewFormSubmitWithRedirect from '../../components/WebView';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/common/Loader';
import {
	calculateAge,
	getExpiredRequiredDocsMessage,
} from '../../utils/jsHelper/helper';
import termsAndConditions from '../../assets/termsAndConditions.json';
import CommonDialogue from '../../components/common/Dialogue';
import DocumentActions from '../../components/DocumentActions';

// Define types for benefit item and user
interface BenefitItem {
	descriptor?: {
		name?: string;
		long_desc?: string;
	};
	price?: {
		value?: number;
		currency?: string;
	};
	document?: {
		label?: string;
		proof?: string;
		isRequired?: boolean;
	}[];
	tags?: Array<{
		descriptor?: {
			code?: string;
			short_desc: string;
		};
		list?: Array<{
			value: string;
			descriptor?: {
				code?: string;
				name?: string;
				short_desc?: string;
			};
		}>;
	}>;
}
interface FinancialSupportRequest {
	domain: string;
	action: string;
	version: string;
	bpp_id: string;
	bpp_uri: string;
	country: string;
	city: string;
	bap_id: string;
	bap_uri: string;
	transaction_id: string;
	message_id: string;
	ttl: string;
	timestamp: string;
}
interface AuthUser {
	user_id?: string;
	name?: string;
	current_class?: string;
	previous_year_marks?: string;
	phone_number?: string;
	username: string;
	email: string;
}

interface WebFormProps {
	url?: string;
	formData?: {};
	item?: BenefitItem;
}

const BenefitsDetails: React.FC = () => {
	const [context, setContext] = useState<FinancialSupportRequest | null>(
		null
	);
	const [item, setItem] = useState<BenefitItem | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isApplied, setIsApplied] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [authUser, setAuthUser] = useState<AuthUser | null>(null);
	const [webFormProp, setWebFormProp] = useState<WebFormProps>({});
	const [confirmationConsent, setConfirmationConsent] = useState<
		boolean | object
	>(false);
	const [submitDialouge, setSubmitDialouge] = useState<boolean | object>(
		false
	);
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation();
	// const [isEligible, setIsEligible] = useState<any[]>();
	const [userDocuments, setUserDocuments] = useState();
	const handleConfirmation = async () => {
		setLoading(true);
		const expiredMessage = getExpiredRequiredDocsMessage(
			userDocuments,
			item?.document ?? []
		);

		if (expiredMessage) {
			setError(expiredMessage);
			setLoading(false);
			return;
		}
		// Step 1: Try eligibility API
		let eligibilityResponse;
		try {
			if (!id) {
				setError(
					'Benefit identifier not available. Please retry from the catalogue.'
				);
				setLoading(false);
				return;
			}
			eligibilityResponse = await checkEligibilityOfUser(id);
		} catch (err) {
			console.error('Error in checking eligibility', err);
			setError('Failed to check eligibility. Please try again later.');
			setLoading(false);
			return;
		}

		// Step 2: Process eligibility reasons
		const reasons =
			eligibilityResponse?.ineligible?.[0]?.details?.reasons ?? [];

		const reasonMessages = reasons.map((r: any) => {
			if (
				r.requiredValue &&
				Array.isArray(r.requiredValue) &&
				r.requiredValue.length > 0
			) {
				return `${r.reason} ${r.requiredValue.join(', ')} ${r?.field}`;
			}
			return r.reason;
		});

		if (reasonMessages.length > 0) {
			setError(
				`You cannot proceed further because the following criteria are missing:\n${reasonMessages.join(
					'\n'
				)}`
			);
			setLoading(false);
			return;
		}

		// Step 3: Apply application
		try {
			if (!context) {
				setError('Context unavailable. Please reload the page.');
				setLoading(false);
				return;
			}
			const result = await applyApplication({ id, context });

			const url = (result as { data: { responses: Array<any> } }).data
				?.responses?.[0]?.message?.order?.items?.[0]?.xinput?.form?.url;

			const formData = authUser ?? undefined;
			if (url) {
				setWebFormProp({
					url,
					formData,
				});
			} else {
				setError('URL not found in response');
			}
		} catch (error) {
			console.error('Error during confirmation:', error);
			setError('Something went wrong. Please try again.');
		}

		setLoading(false);
	};

	const handleBack = () => {
		navigate(-1);
	};
	const extractResultItem = (result) => {
		return (
			(result as { data: { responses: Array<any> } }).data?.responses?.[0]
				?.message?.catalog?.providers?.[0]?.items?.[0] || {}
		);
	};

	const extractRequiredDocs = (resultItem) => {
		const requiredDocsTag = resultItem?.tags?.find(
			(e: { descriptor: { code: string } }) =>
				e?.descriptor?.code === 'required-docs'
		);
		if (!requiredDocsTag?.list) return [];

		const docs: { label: string; proof: string; isRequired: boolean }[] =
			[];

		for (const doc of requiredDocsTag.list) {
			try {
				const parsed = JSON.parse(doc.value);
				const allowedProofs = parsed.allowedProofs || [];
				const isRequired = parsed.isRequired;

				const label = allowedProofs
					.map((proof) =>
						proof
							.replace(/([A-Z])/g, ' $1')
							.replace(/^./, (str) => str.toUpperCase())
					)
					.join(' / ');

				docs.push({
					label: `${label} (${isRequired ? 'Mandatory' : 'Non-mandatory'})`,
					proof: allowedProofs[0],
					isRequired,
				});
			} catch (e) {
				console.error('Failed to parse document data:', e);
			}
		}
		return docs;
	};

	const extractContext = (result) => {
		return (result as { data: { responses: Array<any> } }).data
			?.responses?.[0]?.context as FinancialSupportRequest;
	};

	const handleAuthenticatedFlow = async (resultItem, id, user) => {
		if (user?.data?.dob) {
			const age = calculateAge(user.data.dob);
			user.data.age = `${age}`;
		}
		/* const eligibilityArr = checkEligibility(resultItem, user);
		setIsEligible(eligibilityArr.length > 0 ? eligibilityArr : undefined); */
		setAuthUser(user?.data || {});

		const appResult = await getApplication({
			user_id: user?.data?.user_id,
			benefit_id: id,
		});

		if (appResult?.data?.applications?.length > 0) {
			setIsApplied(true);
		}
	};

	/* 	const checkEligibility = (resultItem, user) => {
		const eligibilityArr: string[] = [];

		const eligibilityTag = resultItem?.tags?.find(
			(tag: any) => tag?.descriptor?.code === 'eligibility'
		);

		if (!eligibilityTag?.list || !Array.isArray(eligibilityTag.list)) {
			return eligibilityArr;
		}

		eligibilityTag.list.forEach((item: any) => {
			const code = item?.descriptor?.code;
			const eligibilityObj = JSON.parse(item.value);
			try {
				const payload = {
					condition: eligibilityObj?.criteria?.condition,
					conditionValues: eligibilityObj?.criteria?.conditionValues,
					value: user?.data?.[code],
				};

				const result = checkEligibilityCriteria(payload);

				if (!result) {
					eligibilityArr.push(code);
				}
			} catch (error) {
				console.error(`Failed to parse eligibility criteria:`, error);
				eligibilityArr.push(code);
			}
		});

		return eligibilityArr;
	}; */

	useEffect(() => {
		let mounted = true;
		const init = async () => {
			try {
				const result = await getOne({ id });
				const resultItem = extractResultItem(result);
				const token = localStorage.getItem('authToken');
				let user;
				if (token) {
					try {
						user = await getUser();
						setUserDocuments(user.data.docs ?? []);
					} catch (err) {
						console.error('Failed to fetch user', err);
						user = { data: { docs: [] } };
					}
				}

				const docs = extractRequiredDocs(resultItem);

				setContext(extractContext(result));

				if (mounted) {
					setItem({ ...resultItem, document: docs });

					if (token) {
						await handleAuthenticatedFlow(resultItem, id, user);
					}

					setLoading(false);
				}
			} catch (e: unknown) {
				handleError(e);
			}
		};
		const handleError = (e) => {
			if (mounted) {
				if (e instanceof Error) {
					setError(`Error: ${e.message}`);
				} else {
					setError('An unexpected error occurred');
				}
				setLoading(false);
			}
		};
		init();
		return () => {
			mounted = false;
		};
	}, [id]);

	const submitConfirm = async (payload) => {
		const confirmPayload = {
			item_id: payload?.submit.application.id,
			rawContext: context,
		};

		setLoading(true);
		try {
			const result = await confirmApplication(confirmPayload);
			const orderId = (
				result as {
					data: {
						responses: { message: { order: { id: string } } }[];
					};
				}
			)?.data?.responses?.[0]?.message?.order?.id;
			if (orderId) {
				const payloadCreateApp = {
					user_id: authUser?.user_id,
					benefit_id: id,
					benefit_provider_id: context?.bpp_id,
					benefit_provider_uri: context?.bap_uri,
					external_application_id: orderId,
					application_name: item?.descriptor?.name,
					status: 'submitted',
					application_data: payload?.userData,
				};

				await createApplication(payloadCreateApp);
				setSubmitDialouge({ orderId, name: item?.descriptor?.name });
				setWebFormProp({});
			} else {
				setError(
					'Error while creating application. Please try again later'
				);
			}
		} catch (e) {
			if (e instanceof Error) {
				setError(`Error: ${e.message}`);
			} else {
				setError('An unexpected error occurred');
			}
		}
		setLoading(false);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<Modal isOpen={true} onClose={() => setError('')}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Error</ModalHeader>
					<ModalBody>
						<Text>{error}</Text>
					</ModalBody>
					<ModalFooter>
						<CommonButton
							onClick={() => setError('')}
							label="Close"
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
	if (webFormProp?.url && webFormProp?.formData) {
		return (
			<WebViewFormSubmitWithRedirect
				{...webFormProp}
				context={context}
				item={item}
				submitConfirm={submitConfirm}
			/>
		);
	}
	const closeDialog = async () => {
		try {
			await sendConsent(
				authUser?.user_id,
				`${id}`,
				`Application for ${id}`
			);

			setConfirmationConsent(false);
			navigate('/applicationStatus');
		} catch {
			console.log('Error sending consent');
		}
	};
	const handleRedirect = () => {
		navigate('/applicationStatus');
	};
	return (
		<Layout
			_heading={{ heading: item?.descriptor?.name || '', handleBack }}
			isMenu={Boolean(localStorage.getItem('authToken'))}
		>
			<Box className="card-scroll invisible-scroll">
				<Box maxW="2xl" m={4}>
					<Heading size="md" mt={6} color="#484848" fontWeight={500}>
						{t('BENEFIT_DETAILS_HEADING_DETAILS')}
					</Heading>

					{item?.descriptor?.long_desc !== '' && (
						<Text mt={4}>{item?.descriptor?.long_desc}</Text>
					)}

					<Heading size="md" mt={6} color="#484848" fontWeight={500}>
						{t('BENEFIT_DETAILS_BENEFIT_DETAILS')}
					</Heading>
					<UnorderedList mt={4}>
						{item?.tags
							?.filter(
								(tag) => tag.descriptor?.code === 'benefits'
							) // Filter to find the 'eligibility' object
							.map((tag, index) =>
								tag.list?.map(
									(
										benefitItem,
										innerIndex // Access list inside descriptor and map through it
									) => (
										<ListItem
											key={`benefit-${index}-${innerIndex}`}
										>
											{(() => {
												let parsedValue;
												try {
													parsedValue = JSON.parse(
														benefitItem.value
													);
												} catch {
													parsedValue = {};
												}
												return (
													<>
														<strong>
															{parsedValue.title}
														</strong>
														{parsedValue.description
															? `: ${parsedValue.description}`
															: ''}
													</>
												);
											})()}
										</ListItem>
									)
								)
							)}
					</UnorderedList>

					{/* <Heading size="md" color="#484848" fontWeight={500}>
						{t('BENEFIT_DETAILS_HEADING_TITLE')}
					</Heading>
					<HStack mt={2}>
						<Icon
							as={MdCurrencyRupee}
							boxSize={5}
							color="#484848"
						/>
						<Text>{item?.price?.value}</Text>
					</HStack> */}

					<Heading size="md" mt={6} color="#484848" fontWeight={500}>
						{t('BENEFIT_DETAILS_ELIGIBILITY_DETAILS')}
					</Heading>
					<UnorderedList mt={4}>
						{item?.tags
							?.filter(
								(tag) => tag.descriptor?.code === 'eligibility'
							) // Filter to find the 'eligibility' object
							.map((tag, index) =>
								tag.list?.map(
									(
										eligibilityItem,
										innerIndex // Access list inside descriptor and map through it
									) => (
										<ListItem
											key={`eligibility-${index}-${innerIndex}`}
										>
											{
												eligibilityItem?.descriptor
													?.short_desc
											}{' '}
											{/* Render the short_desc from each item in the list */}
										</ListItem>
									)
								)
							)}
					</UnorderedList>

					<Heading size="md" mt={6} color="#484848" fontWeight={500}>
						{t('BENEFIT_DETAILS_DOCUMENTS_REQUIRED')}
					</Heading>

					<UnorderedList mt={4}>
						{item?.document?.map((document) => (
							<Box
								key={document.proof}
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								width={'100%'}
							>
								<ListItem key={document.label}>
									{document.label}
								</ListItem>
								{userDocuments && (
									<DocumentActions
										status={document.proof}
										userDocuments={userDocuments}
										isDelete={false}
									/>
								)}
							</Box>
						))}
					</UnorderedList>

					{localStorage.getItem('authToken') ? (
						<CommonButton
							mt={6}
							onClick={handleConfirmation}
							label={
								isApplied
									? t('BENEFIT_DETAILS_APPLICATION_SUBMITTED')
									: t('BENEFIT_DETAILS_PROCEED_TO_APPLY')
							}
							isDisabled={isApplied}
						/>
					) : (
						<CommonButton
							mt={6}
							onClick={() => {
								localStorage.setItem(
									'redirectUrl',
									window.location.href
								);
								navigate('/signin');
							}}
							label={t('BENEFIT_DETAILS_LOGIN_TO_APPLY')}
						/>
					)}
				</Box>
			</Box>
			<CommonDialogue
				isOpen={confirmationConsent}
				onClose={closeDialog}
				termsAndConditions={termsAndConditions}
				handleDialog={handleConfirmation}
			/>
			<CommonDialogue
				isOpen={submitDialouge}
				onClose={handleRedirect}
				handleDialog={handleRedirect}
			/>
		</Layout>
	);
};

export default BenefitsDetails;
