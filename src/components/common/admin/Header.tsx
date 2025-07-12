import React from 'react';
import { Box, HStack, MenuItem, Text } from '@chakra-ui/react';
import Logo from '../../../assets/images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
	showMenu?: boolean;
}

interface MenuOption {
	name: string;
	icon?: React.ReactElement; // icon can be a React node
	onClick?: () => void; // optional click handler
}

interface MenuItem {
	label: string;
	option?: MenuOption[];
	onClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showMenu }) => {
	const navigate = useNavigate();

	// Get user role from local storage

	// Array of menu names
	const menuNames = [
		{
			label: 'Document Configuration',
			onClick: () => {
				navigate('/vcConfig');
			},
		},
		{
			label: 'Field Mapping Configuration',
			onClick: () => {
				navigate('/fieldConfig');
			},
		},
		{
			label: 'Log out',
			onClick: () => {
				localStorage.removeItem('token');
				navigate('/');
				window.location.reload();
			},
		},
	];

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
	showSearchBar?: boolean; //NOSONAR
	showLanguage?: boolean;
	menuNames: MenuItem[]; // add new
}

const HeaderRightSection: React.FC<HeaderRightSectionProps> = ({
	showMenu,
	menuNames,
}) => {
	const location = useLocation();

	const getMenuPath = (label: string): string => {
		if (label === 'Document Configuration') return '/vcConfig';
		if (label === 'Field Mapping Configuration') return '/fieldConfig';
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
