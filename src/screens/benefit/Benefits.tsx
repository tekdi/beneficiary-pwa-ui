import React, { useEffect, useState, useMemo } from 'react';
import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Flex,
	IconButton,
	Select,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import BenefitCard from '../../components/common/Card';
import Layout from '../../components/common/layout/Layout';
import { getUser } from '../../services/auth/auth';
import { getAll } from '../../services/benefit/benefits';
import { Castes, IncomeRange } from '../../assets/mockdata/FilterData';
import { getIncomeRangeValue } from '../../utils/jsHelper/helper';

// Define types for benefit data and filter structure
interface Benefit {
	item_id: number;
	title: string;
	provider_name: string;
	description: string;
	item: {
		price?: {
			value?: number;
			currency?: string;
		};
		tags: { list?: string[] }[];
		time?: {
			range?: {
				end?: string;
			};
		};
	};
}

interface Filter {
	caste?: string;
	annualIncome?: string;
	[key: string]: string | undefined; // This allows any string key to be used
}

const ExploreBenefits: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<Filter>({});
	const [initState, setInitState] = useState<string>('yes');
	const [error, setError] = useState<string | null>(null); // Allow null for error state
	const [benefits, setBenefits] = useState<Benefit[]>([]); // Use Benefit[] type for benefits
	const [activeTab, setActiveTab] = useState<number>(0);

	// Pagination states
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	const handleOpen = () => {};

	const handleSort = (sortKey: string) => {
		const sortedBenefits = [...benefits].sort((a, b) => {
			if (sortKey === 'title') {
				return a.title.localeCompare(b.title);
			} else if (sortKey === 'provider_name') {
				return a.provider_name.localeCompare(b.provider_name);
			}
			return 0;
		});
		setBenefits(sortedBenefits);
	};

	useEffect(() => {
		const init = async () => {
			try {
				const token = localStorage.getItem('authToken');
				if (token) {
					const user = await getUser();
					const income = getIncomeRangeValue(
						user?.data?.annualIncome
					);

					const filters: Filter = {
						caste: user?.data?.caste,
						annualIncome: income,
					};

					const newFilter: Filter = {};
					Object.keys(filters).forEach((key) => {
						if (filters[key] && filters[key] !== '') {
							newFilter[key] =
								filters[key]?.toLowerCase() || filters[key];
						}
					});

					// setFilter(newFilter);
				}
				setInitState('no');
			} catch (e) {
				setError(
					`Failed to initialize user data: ${(e as Error).message}`
				);
				setInitState('no');
			}
		};
		init();
	}, []);

	useEffect(() => {
		const init = async () => {
			setLoading(true);
			try {
				if (initState === 'no') {
					const result = await getAll({
						filters: {
							...filter,
							annualIncome: filter?.['annualIncome']
								? `${filter?.['annualIncome']}`
								: '',
						},
						search,
					});

					setBenefits(result?.data?.ubi_network_cache || []);
				}
			} catch (e) {
				setError(`Failed to fetch benefits: ${(e as Error).message}`);
			} finally {
				setLoading(false);
			}
		};
		init();
	}, [filter, search, initState]);

	// Pagination logic
	const paginatedBenefits = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return benefits.slice(startIndex, endIndex);
	}, [benefits, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(benefits.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleItemsPerPageChange = (value: string) => {
		setItemsPerPage(parseInt(value));
		setCurrentPage(1); // Reset to first page when changing items per page
	};

	const renderPagination = () => {
		if (benefits.length === 0) return null;

		const pageNumbers = [];
		const maxVisiblePages = 7; // Increased from 5 to 7 to show more pages
		let startPage = Math.max(
			1,
			currentPage - Math.floor(maxVisiblePages / 2)
		);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		return (
			<Flex
				justifyContent="space-between"
				alignItems="center"
				mt={6}
				p={4}
				bg="white"
				borderRadius="md"
				boxShadow="sm"
			>
				<Flex alignItems="center" gap={2}>
					<Text fontSize="sm" color="gray.600">
						Show
					</Text>
					<Select
						size="sm"
						width="80px"
						value={itemsPerPage.toString()}
						onChange={(e) =>
							handleItemsPerPageChange(e.target.value)
						}
					>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
					</Select>
					<Text fontSize="sm" color="gray.600">
						per page
					</Text>
				</Flex>

				<Flex alignItems="center" gap={2}>
					<IconButton
						aria-label="Previous page"
						icon={<ChevronLeftIcon />}
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						isDisabled={currentPage === 1}
						variant="outline"
					/>

					{startPage > 1 && (
						<>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handlePageChange(1)}
							>
								1
							</Button>
							{startPage > 2 && <Text>...</Text>}
						</>
					)}

					{pageNumbers.map((page) => (
						<Button
							key={page}
							size="sm"
							variant={currentPage === page ? 'solid' : 'outline'}
							colorScheme={currentPage === page ? 'blue' : 'gray'}
							onClick={() => handlePageChange(page)}
						>
							{page}
						</Button>
					))}

					{endPage < totalPages && (
						<>
							{endPage < totalPages - 1 && <Text>...</Text>}
							<Button
								size="sm"
								variant="outline"
								onClick={() => handlePageChange(totalPages)}
							>
								{totalPages}
							</Button>
						</>
					)}

					<IconButton
						aria-label="Next page"
						icon={<ChevronRightIcon />}
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						isDisabled={currentPage === totalPages}
						variant="outline"
					/>
				</Flex>

				<Text fontSize="sm" color="gray.600">
					Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
					{Math.min(currentPage * itemsPerPage, benefits.length)} of{' '}
					{benefits.length} results
				</Text>
			</Flex>
		);
	};

	const renderBenefitsContent = () => {
		if (benefits.length === 0) {
			return (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					padding={5}
					height="200px"
					bg="#F7F7F7"
					borderRadius="md"
				>
					<Text fontSize="lg" color="gray.600">
						No benefits available
					</Text>
				</Box>
			);
		}

		return (
			<>
				<Box className="card-scroll">
					{paginatedBenefits.map((benefit) => (
						<BenefitCard item={benefit} key={benefit.item_id} />
					))}
				</Box>
				{renderPagination()}
			</>
		);
	};

	return (
		<Layout
			loading={loading}
			_heading={{
				heading: 'Browse Benefits',
				isFilter: true,
				handleOpen: handleOpen,
				setFilter: setFilter,
				onSearch: setSearch,
				inputs: [
					{
						label: 'Caste',
						data: Castes,
						value: filter?.['caste']?.toLowerCase() || '',
						key: 'caste',
					},
					{
						label: 'Income Range',
						data: IncomeRange,
						value: filter?.['annualIncome'] || '',
						key: 'annualIncome',
					},
				],
				sortOptions: [
					{ label: 'Title', value: 'title' },
					{ label: 'Provider Name', value: 'provider_name' },
				],
			}}
			isSearchbar={true}
			isMenu={Boolean(localStorage.getItem('authToken'))}
			handleSort={handleSort}
		>
			{error && (
				<Modal isOpen={!!error} onClose={() => setError(null)}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Error</ModalHeader>
						<ModalBody>
							<Text>{error}</Text>
						</ModalBody>
						<ModalFooter>
							<Button
								colorScheme="blue"
								onClick={() => setError(null)}
							>
								Close
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}

			<Tabs
				index={activeTab}
				onChange={(index) => {
					setActiveTab(index);
					setCurrentPage(1); // Reset to first page when switching tabs
				}}
				colorScheme="blue"
			>
				<TabList>
					<Tab>All Benefits</Tab>
					<Tab>My Benefits</Tab>
				</TabList>

				<TabPanels>
					<TabPanel px={0}>{renderBenefitsContent()}</TabPanel>
					<TabPanel px={0}>{renderBenefitsContent()}</TabPanel>
				</TabPanels>
			</Tabs>
		</Layout>
	);
};

export default ExploreBenefits;
