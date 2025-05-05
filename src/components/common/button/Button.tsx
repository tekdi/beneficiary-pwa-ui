import React from 'react';
import { Button, Text, Spinner, Flex } from '@chakra-ui/react';

interface CustomButton {
	onClick?: (event: React.FormEvent<HTMLFormElement>) => void;
	mt?: number;
	width?: string;
	label?: string;
	isDisabled?: boolean;
	variant?: string;
	loading?: boolean; // New loading prop
	loadingLabel?: string;
}

const CommonButton: React.FC<CustomButton> = ({
	onClick,
	mt,
	width = '100%',
	label = 'Submit',
	isDisabled = false,
	variant = 'solid',
	loading = false, // Default to false if not passed
	loadingLabel = 'Loding...', // Default loading label
}) => {
	return (
		<div style={{ textAlign: 'center' }}>
			<Button
				className={
					variant === 'solid' ? 'custom-btn' : 'outline-custom-btn'
				}
				type="submit"
				mt={mt}
				width={width}
				onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
					onClick?.(
						event as unknown as React.FormEvent<HTMLFormElement>
					)
				}
				isDisabled={isDisabled || loading} // Disable button when loading
				sx={{
					'&:disabled': {
						bg: 'gray.300',
						color: 'gray.600',
						cursor: 'not-allowed',
						opacity: 1, // Prevent default opacity reduction
						border:
							variant === 'outline'
								? '1px solid gray'
								: undefined,
					},
				}}
			>
				{loading ? (
					<Flex align="center" gap={2}>
						<Spinner size="sm" color="blue.500" />
						{loadingLabel}
					</Flex>
				) : (
					label
				)}
				{/* Show loading spinner if loading */}
			</Button>
			{loading && <Text mt={2} fontSize="sm" color="gray.500"></Text>}{' '}
			{/* Show loading text below button */}
		</div>
	);
};

export default CommonButton;
