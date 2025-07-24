import React, { useEffect, useState } from 'react';
import {
	Box,
	IconButton,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from '@chakra-ui/react';
import { MdOutlineFilterAlt } from 'react-icons/md';
import FloatingSelect from '../input/FloatingSelect';
import CommonButton from '../button/Button';
import { useTranslation } from 'react-i18next';

interface FilterDialogProps {
	inputs: {
		label: string;
		key: string;
		value: string;
		data: Array<{ label: string; value: string }>;
	}[];
	setFilter: (values: Record<string, string>) => void;
	mr?: string;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
	inputs,
	setFilter,
	mr,
}) => {
	const { t } = useTranslation();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [values, setValues] = useState<Record<string, string>>({});

	useEffect(() => {
		const inputsValues = inputs?.reduce(
			(acc, item) => {
				acc[item.key] = item.value;
				return acc;
			},
			{} as Record<string, string>
		);
		setValues(inputsValues);
	}, [inputs]);

	const getValue = (item: { key: string }, value?: string) => {
		setValues((prevValues) => ({ ...prevValues, [item.key]: value ?? '' }));
	};

	if (!Array.isArray(inputs) || inputs.length === 0) {
		return null;
	}

	const handleFilter = () => {
		setFilter(values);
		onClose();
	};
	return (
		<Box>
			<IconButton
				aria-label="Filter"
				icon={<MdOutlineFilterAlt />}
				fontSize="25px"
				// marginLeft="100%"
				onClick={onOpen}
				variant="ghost"
				colorScheme="#484848"
				marginRight={mr}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{t('COMMON_FILTERS_TITLE')}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{inputs.map((item) => (
							<FloatingSelect
								key={item.key}
								label={item.label}
								options={item.data}
								value={values?.[item?.key] || ''}
								onChange={(e) => {
									getValue(item, e.target.value);
								}}
								name="label"
							/>
						))}
					</ModalBody>

					<ModalFooter>
						<CommonButton
							label={t('COMMON_FILTERS_APPLY_BUTTON')}
							onClick={handleFilter}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default FilterDialog;
