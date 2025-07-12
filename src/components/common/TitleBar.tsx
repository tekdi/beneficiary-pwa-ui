// src/components/TitleBar.tsx
import React from 'react';
import { HStack, VStack, Text } from '@chakra-ui/react';

const TitleBar: React.FC<{ title: string; subTitle?: string }> = ({
	title,
	subTitle,
}) => {
	return (
		<HStack
			bg="#06164B"
			pt="35px"
			pb={'35px'}
			pl={'23px'}
			position="fixed"
			top="80px"
			left={0}
			zIndex={1100}
			w="100vw"
		>
			<VStack align="start" spacing={1}>
				<Text fontSize={'24px'} fontWeight={400} color="white">
					{title}
				</Text>
				{subTitle && (
					<Text
						fontSize={'md'}
						fontWeight={300}
						color="whiteAlpha.800"
					>
						{subTitle}
					</Text>
				)}
			</VStack>
		</HStack>
	);
};

export default TitleBar;
