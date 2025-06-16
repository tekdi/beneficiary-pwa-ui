import React from 'react';
import { Flex, Text, Button, IconButton, Select } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (itemsPerPage: number) => void;
	itemsPerPageOptions?: number[];
	maxVisiblePages?: number;
	showItemsPerPageSelector?: boolean;
	showResultsText?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
	itemsPerPageOptions = [5, 10, 20, 50],
	maxVisiblePages = 7,
	showItemsPerPageSelector = true,
	showResultsText = true,
	size = 'sm',
}) => {
	// Don't render if there are no items
	if (totalItems === 0) return null;

	const generatePageNumbers = () => {
		const pageNumbers = [];
		let startPage = Math.max(
			1,
			currentPage - Math.floor(maxVisiblePages / 2)
		);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		// Adjust start page if we don't have enough pages at the end
		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		return { pageNumbers, startPage, endPage };
	};

	const { pageNumbers, startPage, endPage } = generatePageNumbers();

	const handleItemsPerPageChange = (value: string) => {
		const newItemsPerPage = parseInt(value, 10);
		onItemsPerPageChange(newItemsPerPage);
	};

	const getResultsText = () => {
		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(currentPage * itemsPerPage, totalItems);
		return `Showing ${startItem} to ${endItem} of ${totalItems} results`;
	};

	return (
		<Flex
			justifyContent="space-between"
			alignItems="center"
			mt={6}
			p={4}
			bg="white"
			borderRadius="md"
			boxShadow="sm"
			flexWrap="nowrap"
			gap={3}
			minH="60px"
		>
			{/* Items per page selector */}
			{showItemsPerPageSelector && (
				<Flex
					alignItems="center"
					gap={2}
					flexShrink={0}
					minW="fit-content"
				>
					<Text fontSize={size} color="gray.600" whiteSpace="nowrap">
						Show
					</Text>
					<Select
						size={size}
						width="70px"
						value={itemsPerPage.toString()}
						onChange={(e) =>
							handleItemsPerPageChange(e.target.value)
						}
					>
						{itemsPerPageOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Select>
					<Text fontSize={size} color="gray.600" whiteSpace="nowrap">
						per page
					</Text>
				</Flex>
			)}

			{/* Page navigation */}
			<Flex
				alignItems="center"
				gap={1}
				flexShrink={1}
				justifyContent="center"
				overflow="hidden"
			>
				{/* Previous button */}
				<IconButton
					aria-label="Previous page"
					icon={<ChevronLeftIcon />}
					size={size}
					onClick={() => onPageChange(currentPage - 1)}
					isDisabled={currentPage === 1}
					variant="outline"
					flexShrink={0}
				/>

				{/* First page + ellipsis */}
				{startPage > 1 && (
					<>
						<Button
							size={size}
							variant="outline"
							onClick={() => onPageChange(1)}
							minW="35px"
							flexShrink={0}
						>
							1
						</Button>
						{startPage > 2 && (
							<Text
								fontSize={size}
								color="gray.500"
								px={1}
								flexShrink={0}
							>
								...
							</Text>
						)}
					</>
				)}

				{/* Page numbers */}
				{pageNumbers.map((page) => (
					<Button
						key={page}
						size={size}
						variant={currentPage === page ? 'solid' : 'outline'}
						colorScheme={currentPage === page ? 'blue' : 'gray'}
						onClick={() => onPageChange(page)}
						minW="35px"
						flexShrink={0}
					>
						{page}
					</Button>
				))}

				{/* Last page + ellipsis */}
				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<Text
								fontSize={size}
								color="gray.500"
								px={1}
								flexShrink={0}
							>
								...
							</Text>
						)}
						<Button
							size={size}
							variant="outline"
							onClick={() => onPageChange(totalPages)}
							minW="35px"
							flexShrink={0}
						>
							{totalPages}
						</Button>
					</>
				)}

				{/* Next button */}
				<IconButton
					aria-label="Next page"
					icon={<ChevronRightIcon />}
					size={size}
					onClick={() => onPageChange(currentPage + 1)}
					isDisabled={currentPage === totalPages}
					variant="outline"
					flexShrink={0}
				/>
			</Flex>

			{/* Results text */}
			{showResultsText && (
				<Text
					fontSize={size}
					color="gray.600"
					flexShrink={0}
					textAlign="right"
					whiteSpace="nowrap"
					minW="fit-content"
				>
					{getResultsText()}
				</Text>
			)}
		</Flex>
	);
};

export default Pagination;
