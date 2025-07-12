import React from 'react';
import { Box, HStack, Text, useToast } from '@chakra-ui/react';
import Logo from '../../../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../../services/auth/auth';

interface HeaderProps {
	showMenu?: boolean;
}

interface MenuItemConfig {
	label: string;
	onClick?: () => void;
}
const ADMIN_ROUTES = {
	DOCUMENT_CONFIG: '/vcConfig',
	FIELD_CONFIG: '/fieldConfig',
	HOME: '/',
} as const;

const Header: React.FC<HeaderProps> = ({ showMenu }) => {
	const navigate = useNavigate();
	const toast = useToast();
	// Get user role from local storage

	const menuNames = [
		{
			label: 'Document Configuration',
			onClick: () => {
				navigate(ADMIN_ROUTES.DOCUMENT_CONFIG);
			},
		},
		{
			label: 'Field Mapping Configuration',
			onClick: () => {
				navigate(ADMIN_ROUTES.FIELD_CONFIG);
			},
		},
		{
			label: 'Log out',
			onClick: () => handleLogout(),
		},
	];
	const handleLogout = async () => {
		try {
			const response = await logoutUser();
			if (response) {
				navigate(ADMIN_ROUTES.HOME);
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
	return (
		<Box
			w="100vw"
			p={4}
			boxShadow="md"
			position="fixed"
			top={0}
			left={0}
			zIndex="1200"
			bg="white"
			minHeight="80px"
			height="80px"
			display="flex"
			alignItems="center"
		>
			<HStack
				align="center"
				justify="space-between" // Keeps left and right sections apart
				w="100%"
			>
				<HStack>
					<img
						src={Logo}
						alt="Logo"
						style={{ width: '40px', marginRight: '8px' }}
					/>
					<Text color="#484848" fontWeight={500} fontSize={'28px'}>
						{'Admin Panel'}
					</Text>
				</HStack>

				{/* Right Section: Menu, Search Bar, and Language Bar */}
				<HeaderRightSection showMenu={showMenu} menuNames={menuNames} />
			</HStack>
		</Box>
	);
};

interface HeaderRightSectionProps {
	showMenu?: boolean;
	menuNames: MenuItemConfig[];
}

const HeaderRightSection: React.FC<HeaderRightSectionProps> = ({
	showMenu,
	menuNames,
}) => {
	const location = useLocation();

	const getMenuPath = (label: string): string => {
		if (label === 'Document Configuration')
			return ADMIN_ROUTES.DOCUMENT_CONFIG;
		if (label === 'Field Mapping Configuration')
			return ADMIN_ROUTES.FIELD_CONFIG;
		return '';
	};

	return (
		<HStack align="center" spacing={6}>
			{showMenu &&
				menuNames.map((menu, index) => {
					const path = getMenuPath(menu.label);
					const isActive = location.pathname === path;

					return (
						<HStack key={menu?.label || index} align="center">
							<Text
								fontSize="16px"
								fontWeight={isActive ? '600' : '400'}
								cursor="pointer"
								onClick={menu?.onClick}
								color={isActive ? '#06164B' : 'black'}
							>
								{menu?.label}
							</Text>
						</HStack>
					);
				})}
		</HStack>
	);
};

export default Header;
