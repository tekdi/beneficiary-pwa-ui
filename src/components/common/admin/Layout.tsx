
import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Header';
import TitleBar from '../TitleBar';

// Define the props for the layout
interface LayoutProps {
	children: React.ReactNode; // Allows for passing children
	showMenu?: boolean;
	showSearchBar?: boolean;
	showLanguage?: boolean;
	title?: string;
	subTitle?: string;
	_titleBar?: {
		title?: string;
		subTitle?: string;
	};
}

// Layout Component
const Layout: React.FC<LayoutProps> = ({
	children,
	showMenu,
	title,
	subTitle,
	_titleBar,
}) => {
	return (
		<Box>
			{/* Header */}
			<Header
				showMenu={showMenu}
			/>
			{(title || subTitle || _titleBar) && (
				<TitleBar
					{...(_titleBar || {})}
					title={title || ( _titleBar?.title) || ''}
					subTitle={
						subTitle || (_titleBar?.subTitle) || ''
					}
				/>
			)}
			{/* Content */}
			<Box pt="180px">{children}</Box>
		</Box>
	);
};

export default Layout;
