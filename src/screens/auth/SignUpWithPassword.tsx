import React, { useEffect, useState } from 'react';
import {
	Box,
	FormControl,
	Text,
	VStack,
	Center,
	useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Layout from '../../components/common/layout/Layout';
import FloatingInput from '../../components/common/input/Input';
import FloatingPasswordInput from '../../components/common/input/PasswordInput';
import CommonButton from '../../components/common/button/Button';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/common/Loader';
import { registerWithPassword } from '../../services/auth/auth';

interface UserDetails {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	password: string;
}

const SignUpWithPassword: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const toast = useToast();

	const [userDetails, setUserDetails] = useState<UserDetails>({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		password: '',
	});
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const [userName, setUserName] = useState<string>('');
	const handleBack = () => {
		navigate(-1);
	};

	const [mobileError, setMobileError] = useState<string>('');

	const validateMobile = (mobile: string): string => {
		console.log('calling');

		const trimmedMobile = mobile.trim();

		if (!trimmedMobile) {
			return 'Mobile number is required.';
		}

		if (trimmedMobile.length !== 10) {
			return 'Mobile number must be exactly 10 digits long.';
		}

		const mobilePattern = /^[6-9]\d{9}$/;

		if (!mobilePattern.test(trimmedMobile)) {
			return 'Mobile number must start with a digit between 6 and 9.';
		}

		return '';
	};

	const validatePassword = (password: string): string => {
		const trimmedPassword = password.trim();

		if (!trimmedPassword) {
			return 'Password is required.';
		}

		if (trimmedPassword.length < 8) {
			return 'Password must be at least 8 characters long.';
		}

		// Optional: Add more password strength requirements
		const passwordPattern =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

		if (!passwordPattern.test(trimmedPassword)) {
			return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
		}

		return '';
	};

	const [passwordError, setPasswordError] = useState<string>('');
	const [confirmPasswordError, setConfirmPasswordError] =
		useState<string>('');

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		key: keyof UserDetails
	) => {
		const value = e.target.value;

		setUserDetails((prev) => {
			const updatedDetails = {
				...prev,
				[key]: value,
			};

			// Generate username based on available values
			const { firstName, lastName, phoneNumber } = updatedDetails;

			setUserName(
				`${firstName?.trim().toLowerCase() || ''}_${
					lastName?.charAt(0).toLowerCase() || ''
				}_${phoneNumber?.slice(-4) || ''}`
			);

			if (key === 'phoneNumber') {
				const errorMessage = validateMobile(value);
				setMobileError(errorMessage);
			}

			// Add password validation
			if (key === 'password') {
				const errorMessage = validatePassword(value);
				setPasswordError(errorMessage);

				// Also validate confirm password if it exists
				if (confirmPassword) {
					if (value !== confirmPassword) {
						setConfirmPasswordError('Passwords do not match.');
					} else {
						setConfirmPasswordError('');
					}
				}
			}

			return updatedDetails;
		});
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setConfirmPassword(value);

		if (!value.trim()) {
			setConfirmPasswordError('Confirm password is required.');
		} else if (value !== userDetails.password) {
			setConfirmPasswordError('Passwords do not match.');
		} else {
			setConfirmPasswordError('');
		}
	};

	const handleSignUp = async () => {
		// Validate mobile
		const mobileErrorMessage = validateMobile(userDetails.phoneNumber);
		if (mobileErrorMessage) {
			toast({
				title: t('SIGNUP_INVALID_MOBILE_NUMBER'),
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		// Validate password
		const passwordErrorMessage = validatePassword(userDetails.password);
		if (passwordErrorMessage) {
			toast({
				title: 'Invalid Password',
				description: passwordErrorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		// Validate password match
		if (userDetails.password !== confirmPassword) {
			toast({
				title: t('SIGNUP_PASSWORD_NOT_MATCHING'),
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		// Proceed with registration...
		try {
			setLoading(true);
			const response = await registerWithPassword(userDetails);

			if (response) {
				toast({
					title: t('SIGNUP_SUCCESSFUL'),
					status: 'success',
					description: `Your Username is ${response?.data?.userName}`,
					duration: 10000,
					isClosable: true,
				});
				navigate('/signin');
			}
		} catch (error) {
			toast({
				title: t('SIGNUP_FAILED'),
				description: error?.data?.error,
				status: 'error',
				duration: 15000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const { firstName, lastName, phoneNumber } = userDetails;

		if (firstName && lastName && phoneNumber.length >= 6) {
			const name = `${firstName}_${lastName?.charAt(0)}_${phoneNumber?.slice(
				-4
			)}`;
			setUserName(name);
		}
	}, [userDetails.firstName, userDetails.lastName, userDetails.phoneNumber]);
	const validate = (phoneNumber) => {
		const value = validateMobile(phoneNumber);
		if (value === '') {
			return true;
		}
		return false;
	};
	return (
		<Layout
			isMenu={false}
			_heading={{
				heading: t('LOGIN_REGISTER_BUTTON'),
				handleBack,
			}}
			isBottombar={false}
		>
			{loading && <Loader />}
			<Box p={5}>
				<VStack align="stretch" spacing={6}>
					<FormControl>
						<FloatingInput
							name="firstName"
							label={t('SIGNUP_FIRST_NAME')}
							value={userDetails.firstName}
							onChange={(e) => handleInputChange(e, 'firstName')}
							isInvalid={!userDetails.firstName.trim()}
							errorMessage={t('SIGNUP_FIRST_NAME_REQUIRED')}
						/>
						<FloatingInput
							name="lastName"
							label={t('SIGNUP_LAST_NAME')}
							value={userDetails.lastName}
							onChange={(e) => handleInputChange(e, 'lastName')}
							isInvalid={!userDetails.lastName.trim()}
							errorMessage={t('SIGNUP_LAST_NAME_REQUIRED')}
						/>
						<FloatingInput
							name="phoneNumber"
							label={t('SIGNUP_MOBILE_NUMBER')}
							value={userDetails.phoneNumber}
							onChange={(e) =>
								handleInputChange(e, 'phoneNumber')
							}
							isInvalid={!validate(userDetails.phoneNumber)}
							errorMessage={mobileError}
						/>
						<Box mb={passwordError ? 7 : 0}>
							<FloatingPasswordInput
								label={t('SIGNUP_CREATE_PASSWORD')}
								value={userDetails.password}
								onChange={(e) =>
									handleInputChange(e, 'password')
								}
								isInvalid={passwordError !== ''}
								errorMessage={
									passwordError ||
									t('SIGNUP_CREATE_PASSWORD_IS_REQUIRED')
								}
							/>
						</Box>

						<FloatingPasswordInput
							label={t('SIGNUP_CONFIRM_PASSWORD')}
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							isInvalid={confirmPasswordError !== ''}
							errorMessage={
								confirmPasswordError ||
								t('SIGNUP_CONFIRM_PASSWORD_IS_REQUIRED')
							}
						/>
						{userName.length > 0 && (
							<Text textAlign="center" fontSize="14px" mt={4}>
								{t('SIGNUP_USERNAME_WILL_BE')} 
								<Text
									as="span"
									fontWeight="bold"
									color="#06164B"
								>
									{userName}
								</Text>
							</Text>
						)}
						<CommonButton
							mt={4}
							label={t('LOGIN_REGISTER_BUTTON')}
							onClick={handleSignUp}
							//
						/>
					</FormControl>
				</VStack>
				<Center>
					<Text mt={6}>
						{t('SIGNUP_ALREADY_HAVE_AN_ACCOUNT')}
						<Box as="span" ml={2}>
							<RouterLink
								to="/signin"
								style={{
									color: 'blue',
									textDecoration: 'underline',
								}}
							>
								{t('LOGIN_BUTTON')}
							</RouterLink>
						</Box>
					</Text>
				</Center>
			</Box>
		</Layout>
	);
};

export default SignUpWithPassword;
