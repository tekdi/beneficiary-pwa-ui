import React from 'react';
import { Select } from '@chakra-ui/react';

// Define the type for the option
interface Option {
	value: string;
	label: string;
}

// Define the props for the CustomSelect component
interface CustomSelectProps {
	options: Option[];
	placeholder?: string;
	width?: string;
	height?: string;
	border?: string;
	value?: string;
	placeholderStyle?: React.CSSProperties; // Optional style for the placeholder
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Optional onChange function
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	options,
	placeholder = 'Select an option',
	width = '62px',
	height = '35px',
	border = '1px solid var(--input-color)',
	placeholderStyle,
	value,
	onChange,
}) => {
	return (
		<Select
			width={width}
			height={height}
			border={border}
			value={value}
			onChange={onChange} // Add onChange here
			sx={{
				'&::placeholder': {
					color: placeholderStyle?.color || 'gray.500', // Default placeholder color
					fontSize: '12px', // Set the placeholder font size
					marginLeft: '3px',
					paddingLeft: 10,
					...placeholderStyle,
				},
				fontSize: '15px', // Set the font size for the select input itself
				marginLeft: '3px',
				paddingLeft: 2, // Remove padding from the select input
			}}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</Select>
	);
};

export default CustomSelect;
