import React from 'react';
import {
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

interface CustomSelectProps {
	label: string;
	placeholder?: string;
}

const CustomDisableInput: React.FC<CustomSelectProps> = ({
	label,
	placeholder,
}) => {
	return (
		<FormControl>
			<FormLabel htmlFor="email">{label}</FormLabel>
			<InputGroup>
				<Input id="email" placeholder={placeholder} disabled />
				<InputRightElement>
					<CheckIcon color="green.500" />
				</InputRightElement>
			</InputGroup>
		</FormControl>
	);
};

export default CustomDisableInput;
