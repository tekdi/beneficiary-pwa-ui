import React, { useContext, useEffect, useState } from 'react';
import { Box, useToast, VStack } from '@chakra-ui/react';
import {
	getUser,
	getDocumentsList,
	sendConsent,
	getUserConsents,
	logoutUser,
} from '../services/auth/auth';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../components/common/button/Button';
import Layout from '../components/common/layout/Layout';
import { AuthContext } from '../utils/context/checkToken';
import { useTranslation } from 'react-i18next';
import DocumentList from '../components/DocumentList';
// import { useKeycloak } from '@react-keycloak/web';
import '../assets/styles/App.css';
import UploadDocumentEwallet from '../components/common/UploadDocumentEwallet';
import CommonDialogue from '../components/common/Dialogue';
import termsAndConditions from '../assets/termsAndConditions.json';
/* import { getAadhar, getDigiLockerRequest } from '../services/dhiway/aadhar'; */

const Home: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [showIframe, setShowIframe] = useState(false);
	const [consentSaved, setConsentSaved] = useState(false);
	// const { keycloak } = useKeycloak();
	const { userData, documents, updateUserData } = useContext(AuthContext)!;
	const purpose = 'sign_up_tnc';
	const purpose_text = 'sign_up_tnc';
	const toast = useToast();
	/* 	const [fetchingAadhar, setFetchingAadhar] = useState(false); */

	const handleRedirect = () => {
		navigate('/explorebenefits');
	};
	const handleScanRedirect = () => {
		navigate('/document-scanner');
	};
	const init = async () => {
		try {
			const result = await getUser();
			const data = await getDocumentsList();
			updateUserData(result.data, data.data);
		} catch (error) {
			console.error('Error fetching user data or documents:', error);
		}
	};

	const handleConsent = async () => {
		setConsentSaved(!consentSaved);
		try {
			const response = await logoutUser();
			if (response) {
				navigate('/');
				navigate(0);
			}
		} catch (error) {
			console.log(error);
			toast({
				title: 'Logout failed',
				status: 'error',
				duration: 3000,
				isClosable: true,
				description: 'Try Again',
			});
		}
	};

	const checkConsent = (consent: any[]) => {
		const isPurposeMatched = consent.some(
			(item) => item.purpose === purpose
		);

		if (!isPurposeMatched) {
			setConsentSaved(true);
		}
	};

	const getConsent = async () => {
		try {
			const response = await getUserConsents();
			checkConsent(response?.data.data);
		} catch (error) {
			console.log('Failed to load consents', error);
		}
	};

	const saveConsent = async () => {
		try {
			await sendConsent(userData?.user_id, purpose, purpose_text);
			setConsentSaved(false);
		} catch {
			console.log('Error sending consent');
		}
	};

	useEffect(() => {
		if (!userData || !documents || documents.length === 0) {
			init();
		}
	}, [userData, documents]);

	useEffect(() => {
		getConsent();
	}, []);

	/* 	const handleAadharFetch = async () => {
		try {
			const digilockerURL = await getDigiLockerRequest();

			const popup = window.open(
				digilockerURL.url,
				'DigiLockerPopup',
				'width=800,height=600,resizable,scrollbars'
			);

			if (!popup) {
				console.error(
					'Failed to open popup. Please allow popups for this website.'
				);
				return;
			}

			const handleMessage = async (event) => {
				if (event.origin !== import.meta.env.VITE_DHIWAY_REDIRECT_URL)
					return;

				const { type, finalUrl } = event.data;

				if (type === 'DIGILOCKER_DONE') {
					const url = new URL(finalUrl);

					const uriCode = url.searchParams.get('code');

					if (popup && !popup.closed) {
						popup.close();
					}

					cleanupListener();
					clearInterval(interval);

					setFetchingAadhar(true);
					try {
						await getAadhar(uriCode, userData.user_id);
						// handle result if needed
					} catch (error) {
						console.error('Failed to fetch Aadhaar:', error);
					} finally {
						setFetchingAadhar(false); // Ensure it's reset
						init();
					}
				}
			};

			window.addEventListener('message', handleMessage);

			const cleanupListener = () => {
				window.removeEventListener('message', handleMessage);
			};

			const interval = setInterval(() => {
				if (popup.closed) {
					clearInterval(interval);
					cleanupListener();
				}
			}, 500);
		} catch (err) {
			console.error('Error fetching DigiLocker URL:', err);
		}
	}; */

	return (
		<Layout
			_heading={{
				beneficiary: true,
				heading: `${userData?.firstName || ''} ${userData?.lastName || ''}`,
				// label: keycloak.tokenParsed?.preferred_username,
			}}
		>
			<Box shadow="md" borderWidth="1px" borderRadius="md" p={2}>
				<VStack spacing={4} align="stretch">
					<DocumentList
						documents={documents}
						userDocuments={userData?.docs}
					/>
					<CommonButton
						onClick={handleScanRedirect}
						label={t('SCAN_UPLOAD_DOCUMENT')}
					/>
					{/* <CommonButton
						onClick={handleAadharFetch}
						label={t('FETCH_AADHAAR_FROM_DIGILOCKER')}
						loading={fetchingAadhar}
						loadingLabel={t('FETCHING_AADHAAR')}
					/> */}
					<CommonButton
						onClick={handleRedirect}
						label={t('PROFILE_EXPLORE_BENEFITS')}
					/>
					{!showIframe ? (
						<UploadDocumentEwallet userId={userData?.user_id} />
					) : (
						<CommonButton
							onClick={() => setShowIframe(false)}
							label={t('HIDE_DIGILOCKER')}
						/>
					)}
				</VStack>
			</Box>

			{consentSaved && (
				<CommonDialogue
					isOpen={consentSaved}
					onClose={handleConsent}
					termsAndConditions={termsAndConditions}
					handleDialog={saveConsent}
				/>
			)}
		</Layout>
	);
};

export default Home;
