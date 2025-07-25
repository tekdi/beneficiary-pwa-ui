import React, { useMemo } from 'react';
import { Box, HStack, Text, useToast } from '@chakra-ui/react';
import Logo from '../../../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../../services/auth/auth';
import { useTranslation } from 'react-i18next';

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
	ADD_FIELD: '/fields',
	HOME: '/',
} as const;

const Header: React.FC<HeaderProps> = ({ showMenu }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const toast = useToast();
	// Get user role from local storage

	const menuNames = [
		{
			label: t('ADMIN_HEADER_FIELDS_MENU'),
			onClick: () => {
				navigate(ADMIN_ROUTES.ADD_FIELD);
			},
		},
		{
			label: t('ADMIN_HEADER_DOCUMENTS_MASTER_MENU'),
			onClick: () => {
				navigate(ADMIN_ROUTES.DOCUMENT_CONFIG);
			},
		},
		{
			label: t('ADMIN_HEADER_FIELD_MAPPING_MENU'),
			onClick: () => {
				navigate(ADMIN_ROUTES.FIELD_CONFIG);
			},
		},
		{
			label: t('ADMIN_HEADER_LOGOUT_MENU'),
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
				title: t('ADMIN_HEADER_LOGOUT_FAILED_MESSAGE'),
				status: 'error',
				duration: 3000,
				isClosable: true,
				description: t('ADMIN_HEADER_TRY_AGAIN_MESSAGE'),
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
						{t('ADMIN_HEADER_PANEL_TITLE')}
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
	const { t } = useTranslation();
	const getMenuPath = (label: string): string | undefined => {
		if (label === t('ADMIN_HEADER_DOCUMENTS_MASTER_MENU'))
			return ADMIN_ROUTES.DOCUMENT_CONFIG;
		if (label === t('ADMIN_HEADER_FIELD_MAPPING_MENU'))
			return ADMIN_ROUTES.FIELD_CONFIG;
		if (label === t('ADMIN_HEADER_FIELDS_MENU')) return ADMIN_ROUTES.ADD_FIELD;
		return undefined;
	};

	// Optimize with useMemo - only recalculate when location.pathname or menuNames change
	const activeLabel = useMemo(() => {
		const foundMenu = menuNames.find((menu) => {
			const path = getMenuPath(menu.label);
			return path && location.pathname === path;
		});

		// If no match, fallback to "Documents Master"
		return foundMenu?.label || t('ADMIN_HEADER_DOCUMENTS_MASTER_MENU');
	}, [location.pathname, menuNames]);

	return (
		<HStack align="center" spacing={6}>
			{showMenu &&
				menuNames.map((menu, index) => {
					const isActive = menu.label === activeLabel;

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
