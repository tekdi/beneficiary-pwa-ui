import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import BenefitCard from '../../components/common/Card';
import Layout from '../../components/common/layout/Layout';
import FilterDialog from '../../components/common/layout/Filters';
import Pagination from '../../components/common/Pagination'; // Import the new Pagination component
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
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Separate state for each tab
	const [allBenefits, setAllBenefits] = useState<Benefit[]>([]);
	const [myBenefits, setMyBenefits] = useState<Benefit[]>([]);
	const [activeTab, setActiveTab] = useState<number>(0);

	// Separate pagination info for each tab (from API)
	const [allBenefitsPagination, setAllBenefitsPagination] =
		useState<PaginationInfo>({
			total: 0,
			page: 1,
			limit: 5,
			totalPages: 0,
		});
	const [myBenefitsPagination, setMyBenefitsPagination] =
		useState<PaginationInfo>({
			total: 0,
			page: 1,
			limit: 5,
			totalPages: 0,
		});

	// Current page states
	const [allBenefitsPage, setAllBenefitsPage] = useState<number>(1);
	const [myBenefitsPage, setMyBenefitsPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(5); // Changed from 10 to 1

	const handleOpen = () => {};

	/* const handleSort = (sortKey: string) => {
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
	}; */

	// Initialize user data and set user filter for "My Benefits"
	useEffect(() => {
		const init = async () => {
			try {
				const token = localStorage.getItem('authToken');
				if (token) {
					setIsAuthenticated(true);
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
				} else {
					setIsAuthenticated(false);
					// If user is not authenticated and on "My Benefits" tab, switch to "All Benefits"
					if (activeTab === 1) {
						setActiveTab(0);
					}
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
	}, [activeTab]);

	// Fetch All Benefits (without user-specific filters)
	const fetchAllBenefits = async () => {
		try {
			setLoading(true);
			const result = await getAll({
				filters: { gender: '', annualIncome: '', caste: '' }, // Always empty filters for "All Benefits"
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
			} else if (activeTab === 1 && isAuthenticated) {
				fetchMyBenefits();
			}
		}
	}, [
		// Remove 'filter' from dependencies for "All Benefits" tab
		...(activeTab === 0 ? [] : [filter]),
		search,
		initState,
		activeTab,
		userFilter,
		allBenefitsPage,
		myBenefitsPage,
		itemsPerPage,
		isAuthenticated,
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

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
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
		// Only allow tab change to "My Benefits" if authenticated
		if (index === 1 && !isAuthenticated) {
			return;
		}

		setActiveTab(index);
		// Reset pagination when switching tabs
		if (index === 0) {
			setAllBenefitsPage(1);
			// Don't clear filters, just keep them visible but inactive
		} else {
			setMyBenefitsPage(1);
		}
	};

	const renderPagination = () => {
		return (
			<Pagination
				currentPage={currentPage}
				totalPages={currentPagination.totalPages}
				totalItems={currentPagination.total}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onItemsPerPageChange={handleItemsPerPageChange}
				itemsPerPageOptions={[5, 10, 20]}
				maxVisiblePages={7}
				showItemsPerPageSelector={true}
				showResultsText={true}
				size="sm"
			/>
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

	// Filter inputs for both tabs
	const getFilterInputs = () => {
		// For "All Benefits" tab, show empty filter values
		if (activeTab === 0) {
			return [
				{
					label: 'Caste',
					data: Castes,
					value: '', // Always empty for "All Benefits"
					key: 'caste',
				},
				{
					label: 'Income Range',
					data: IncomeRange,
					value: '', // Always empty for "All Benefits"
					key: 'annualIncome',
				},
				{
					label: 'Gender',
					data: Gender,
					value: '', // Always empty for "All Benefits"
					key: 'gender',
				},
			];
		}

		// For "My Benefits" tab, show actual filter values
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
	};

	return (
		<Layout
			loading={loading}
			_heading={{
				heading: 'Browse Benefits',
			}}
			isSearchbar={true}
			isMenu={Boolean(localStorage.getItem('authToken'))}
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
				{/* Header section with tabs and filter */}
				<Flex
					position="sticky" // or "fixed" if you want it always visible
					top={0} // sticks to top
					zIndex={10} // stay above scrollable content
					bg="white" // background to avoid see-through
					direction="row"
					align="center"
					justify="space-between"
					gap={4}
					width="100%"
					px={4}
					py={2}
					flexWrap="nowrap"
					boxShadow="sm" // optional: add shadow to separate from content
				>
					<Box flexShrink={0}>
						<TabList>
							<Tab>All Benefits</Tab>
							{isAuthenticated && <Tab>My Benefits</Tab>}
						</TabList>
					</Box>

					<Box flexShrink={0}>
						<FilterDialog
							inputs={getFilterInputs()}
							setFilter={activeTab === 0 ? () => {} : setFilter}
							mr="20px"
						/>
					</Box>
				</Flex>

				<TabPanels>
					<TabPanel px={0}>{renderBenefitsContent()}</TabPanel>
					{isAuthenticated && (
						<TabPanel px={0}>{renderBenefitsContent()}</TabPanel>
					)}
				</TabPanels>
			</Tabs>
		</Layout>
	);
};

export default ExploreBenefits;
