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
import { Castes, IncomeRange, Gender } from '../../assets/mockdata/FilterData';
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
	gender?: string;
	[key: string]: string | undefined;
}

interface PaginationInfo {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

const ExploreBenefits: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<Filter>({});
	const [userFilter, setUserFilter] = useState<Filter>({}); // Filter for "My Benefits"
	const [initState, setInitState] = useState<string>('yes');
	const [error, setError] = useState<string | null>(null);

	// Separate state for each tab
	const [allBenefits, setAllBenefits] = useState<Benefit[]>([]);
	const [myBenefits, setMyBenefits] = useState<Benefit[]>([]);
	const [activeTab, setActiveTab] = useState<number>(0);

	// Separate pagination info for each tab (from API)
	const [allBenefitsPagination, setAllBenefitsPagination] =
		useState<PaginationInfo>({
			total: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
		});
	const [myBenefitsPagination, setMyBenefitsPagination] =
		useState<PaginationInfo>({
			total: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
		});

	// Current page states
	const [allBenefitsPage, setAllBenefitsPage] = useState<number>(1);
	const [myBenefitsPage, setMyBenefitsPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	const handleOpen = () => {};

	const handleSort = (sortKey: string) => {
		const sortFn = (a: Benefit, b: Benefit) => {
			if (sortKey === 'title') {
				return a.title.localeCompare(b.title);
			} else if (sortKey === 'provider_name') {
				return a.provider_name.localeCompare(b.provider_name);
			}
			return 0;
		};

		if (activeTab === 0) {
			setAllBenefits([...allBenefits].sort(sortFn));
		} else {
			setMyBenefits([...myBenefits].sort(sortFn));
		}
	};

	// Initialize user data and set user filter for "My Benefits"
	useEffect(() => {
		const init = async () => {
			try {
				const token = localStorage.getItem('authToken');
				if (token) {
					const user = await getUser();
					const income = getIncomeRangeValue(
						user?.data?.annualIncome
					);

					const userFilters: Filter = {
						caste: user?.data?.caste,
						annualIncome: income,
						gender: user?.data?.gender,
					};

					const newUserFilter: Filter = {};
					Object.keys(userFilters).forEach((key) => {
						if (userFilters[key] && userFilters[key] !== '') {
							newUserFilter[key] =
								userFilters[key]?.toLowerCase() ||
								userFilters[key];
						}
					});

					setUserFilter(newUserFilter);
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

	// Fetch All Benefits (without user-specific filters)
	const fetchAllBenefits = async () => {
		try {
			setLoading(true);
			const result = await getAll({
				filters: {}, // No filters for "All Benefits"
				search,
				page: allBenefitsPage,
				limit: itemsPerPage,
			});
			setAllBenefits(result?.data?.ubi_network_cache || []);
			setAllBenefitsPagination({
				total: result?.data?.total || 0,
				page: result?.data?.page || 1,
				limit: result?.data?.limit || itemsPerPage,
				totalPages: result?.data?.totalPages || 0,
			});
		} catch (e) {
			setError(`Failed to fetch all benefits: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	};

	// Fetch My Benefits (with user-specific filters)
	const fetchMyBenefits = async () => {
		try {
			setLoading(true);
			const result = await getAll({
				filters: {
					...userFilter,
					...filter, // Include any additional filters set by user
					annualIncome:
						userFilter?.annualIncome || filter?.annualIncome
							? `${userFilter?.annualIncome || filter?.annualIncome}`
							: '',
					gender: userFilter?.gender || filter?.gender || '',
				},
				search,
				page: myBenefitsPage,
				limit: itemsPerPage,
			});
			setMyBenefits(result?.data?.ubi_network_cache || []);
			setMyBenefitsPagination({
				total: result?.data?.total || 0,
				page: result?.data?.page || 1,
				limit: result?.data?.limit || itemsPerPage,
				totalPages: result?.data?.totalPages || 0,
			});
		} catch (e) {
			setError(`Failed to fetch my benefits: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	};

	// Fetch data based on active tab
	useEffect(() => {
		if (initState === 'no') {
			if (activeTab === 0) {
				fetchAllBenefits();
			} else {
				fetchMyBenefits();
			}
		}
	}, [
		filter,
		search,
		initState,
		activeTab,
		userFilter,
		allBenefitsPage,
		myBenefitsPage,
		itemsPerPage,
	]);

	// Get current benefits and pagination based on active tab
	const currentBenefits = activeTab === 0 ? allBenefits : myBenefits;
	const currentPagination =
		activeTab === 0 ? allBenefitsPagination : myBenefitsPagination;
	const currentPage = activeTab === 0 ? allBenefitsPage : myBenefitsPage;
	const setCurrentPage =
		activeTab === 0 ? setAllBenefitsPage : setMyBenefitsPage;

	// For server-side pagination, we don't need to slice the data
	const paginatedBenefits = currentBenefits;
	const totalPages = currentPagination.totalPages;

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleItemsPerPageChange = (value: string) => {
		const newItemsPerPage = parseInt(value);
		setItemsPerPage(newItemsPerPage);
		setAllBenefitsPage(1);
		setMyBenefitsPage(1);
		// Update pagination limits
		setAllBenefitsPagination((prev) => ({
			...prev,
			limit: newItemsPerPage,
		}));
		setMyBenefitsPagination((prev) => ({
			...prev,
			limit: newItemsPerPage,
		}));
	};

	const handleTabChange = (index: number) => {
		setActiveTab(index);
		// Reset pagination when switching tabs
		if (index === 0) {
			setAllBenefitsPage(1);
		} else {
			setMyBenefitsPage(1);
		}
	};

	const renderPagination = () => {
		if (currentPagination.total === 0) return null;

		const pageNumbers = [];
		const maxVisiblePages = 7;
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
					Showing {(currentPage - 1) * currentPagination.limit + 1} to{' '}
					{Math.min(
						currentPage * currentPagination.limit,
						currentPagination.total
					)}{' '}
					of {currentPagination.total} results
				</Text>
			</Flex>
		);
	};

	const renderBenefitsContent = () => {
		if (currentBenefits.length === 0) {
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
						{activeTab === 0
							? 'No benefits available'
							: 'No benefits match your profile'}
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

	// Filter inputs for "My Benefits" tab (allows additional filtering on top of user profile)
	const getFilterInputs = () => {
		if (activeTab === 1) {
			return [
				{
					label: 'Caste',
					data: Castes,
					value:
						filter?.['caste']?.toLowerCase() ||
						userFilter?.['caste']?.toLowerCase() ||
						'',
					key: 'caste',
				},
				{
					label: 'Income Range',
					data: IncomeRange,
					value:
						filter?.['annualIncome'] ||
						userFilter?.['annualIncome'] ||
						'',
					key: 'annualIncome',
				},
				{
					label: 'Gender',
					data: Gender,
					value:
						filter?.['gender']?.toLowerCase() ||
						userFilter?.['gender']?.toLowerCase() ||
						'',
					key: 'gender',
				},
			];
		}
		return [];
	};

	return (
		<Layout
			loading={loading}
			_heading={{
				heading: 'Browse Benefits',
				isFilter: activeTab === 1, // Only show filters for "My Benefits" tab
				handleOpen: handleOpen,
				setFilter: setFilter,
				onSearch: setSearch,
				inputs: getFilterInputs(),
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
				onChange={handleTabChange}
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
