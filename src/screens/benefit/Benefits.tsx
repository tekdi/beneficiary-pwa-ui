import React, {
	useEffect,
	useState,
	useCallback,
	useMemo,
	useRef,
} from 'react';
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
import Pagination from '../../components/common/Pagination';
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
	const [loading, setLoading] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');
	const [userFilter, setUserFilter] = useState<Filter>({});
	const [initState, setInitState] = useState<string>('yes');
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Separate filter states for each tab
	const [allBenefitsFilter, setAllBenefitsFilter] = useState<Filter>({});
	const [myBenefitsFilter, setMyBenefitsFilter] = useState<Filter>({});

	// Separate state for each tab
	const [allBenefits, setAllBenefits] = useState<Benefit[]>([]);
	const [myBenefits, setMyBenefits] = useState<Benefit[]>([]);
	const [activeTab, setActiveTab] = useState<number>(0);

	// Separate pagination info for each tab
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
	const [itemsPerPage, setItemsPerPage] = useState<number>(5);

	// Use refs to track if data has been loaded for each tab
	const allBenefitsLoaded = useRef<boolean>(false);
	const myBenefitsLoaded = useRef<boolean>(false);

	// Debounce search to avoid excessive API calls
	const [debouncedSearch, setDebouncedSearch] = useState<string>('');

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);
		return () => clearTimeout(timer);
	}, [search]);

	// Memoized current tab data
	const currentTabData = useMemo(() => {
		if (activeTab === 0) {
			return {
				benefits: allBenefits,
				pagination: allBenefitsPagination,
				page: allBenefitsPage,
				setPage: setAllBenefitsPage,
				filter: allBenefitsFilter,
				setFilter: setAllBenefitsFilter,
			};
		} else {
			return {
				benefits: myBenefits,
				pagination: myBenefitsPagination,
				page: myBenefitsPage,
				setPage: setMyBenefitsPage,
				filter: myBenefitsFilter,
				setFilter: setMyBenefitsFilter,
			};
		}
	}, [
		activeTab,
		allBenefits,
		myBenefits,
		allBenefitsPagination,
		myBenefitsPagination,
		allBenefitsPage,
		myBenefitsPage,
		allBenefitsFilter,
		myBenefitsFilter,
	]);

	// Initialize user data only once
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
								userFilters[key]?.toLowerCase() ??
								userFilters[key];
						}
					});

					setUserFilter(newUserFilter);
				} else {
					setIsAuthenticated(false);
				}
			} catch (e) {
				setError(
					`Failed to initialize user data: ${(e as Error).message}`
				);
			} finally {
				setInitState('no');
			}
		};

		if (initState === 'yes') {
			init();
		}
	}, [initState]);

	// Memoized fetch functions
	const fetchAllBenefits = useCallback(async () => {
		try {
			setLoading(true);
			const result = await getAll({
				filters: {
					gender: allBenefitsFilter?.gender ?? '',
					annualIncome: allBenefitsFilter?.annualIncome ?? '',
					caste: allBenefitsFilter?.caste ?? '',
				},
				search: debouncedSearch,
				page: allBenefitsPage,
				limit: itemsPerPage,
			});

			setAllBenefits(result?.data?.ubi_network_cache ?? []);
			setAllBenefitsPagination({
				total: result?.data?.total ?? 0,
				page: result?.data?.page ?? 1,
				limit: result?.data?.limit ?? itemsPerPage,
				totalPages: result?.data?.totalPages ?? 0,
			});
			allBenefitsLoaded.current = true;
		} catch (e) {
			setError(`Failed to fetch all benefits: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	}, [allBenefitsFilter, debouncedSearch, allBenefitsPage, itemsPerPage]);

	const fetchMyBenefits = useCallback(async () => {
		try {
			setLoading(true);
			const result = await getAll({
				filters: {
					...userFilter,
					...myBenefitsFilter,
					annualIncome:
						(myBenefitsFilter?.annualIncome ??
						userFilter?.annualIncome)
							? `${myBenefitsFilter?.annualIncome ?? userFilter?.annualIncome}`
							: '',
					gender:
						myBenefitsFilter?.gender ?? userFilter?.gender ?? '',
					caste: myBenefitsFilter?.caste ?? userFilter?.caste ?? '',
				},
				search: debouncedSearch,
				page: myBenefitsPage,
				limit: itemsPerPage,
			});

			setMyBenefits(result?.data?.ubi_network_cache ?? []);
			setMyBenefitsPagination({
				total: result?.data?.total ?? 0,
				page: result?.data?.page ?? 1,
				limit: result?.data?.limit ?? itemsPerPage,
				totalPages: result?.data?.totalPages ?? 0,
			});
			myBenefitsLoaded.current = true;
		} catch (e) {
			setError(`Failed to fetch my benefits: ${(e as Error).message}`);
		} finally {
			setLoading(false);
		}
	}, [
		myBenefitsFilter,
		userFilter,
		debouncedSearch,
		myBenefitsPage,
		itemsPerPage,
	]);

	// Separate useEffect for each tab to avoid unnecessary calls
	useEffect(() => {
		if (initState === 'no' && activeTab === 0) {
			fetchAllBenefits();
		}
	}, [fetchAllBenefits, initState, activeTab]);

	useEffect(() => {
		if (initState === 'no' && activeTab === 1 && isAuthenticated) {
			fetchMyBenefits();
		}
	}, [fetchMyBenefits, initState, activeTab, isAuthenticated]);

	// Optimized handlers
	const handlePageChange = useCallback(
		(page: number) => {
			currentTabData.setPage(page);
		},
		[currentTabData.setPage]
	);

	const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setAllBenefitsPage(1);
		setMyBenefitsPage(1);
		setAllBenefitsPagination((prev) => ({
			...prev,
			limit: newItemsPerPage,
		}));
		setMyBenefitsPagination((prev) => ({
			...prev,
			limit: newItemsPerPage,
		}));
	}, []);

	const handleTabChange = useCallback(
		(index: number) => {
			// Only allow tab change to "My Benefits" if authenticated
			if (index === 1 && !isAuthenticated) {
				return;
			}

			setActiveTab(index);

			// Reset pagination when switching tabs
			if (index === 0) {
				setAllBenefitsPage(1);
			} else {
				setMyBenefitsPage(1);
			}
		},
		[isAuthenticated]
	);

	// Memoized filter inputs
	const filterInputs = useMemo(() => {
		const currentFilter =
			activeTab === 0 ? allBenefitsFilter : myBenefitsFilter;

		if (activeTab === 0) {
			return [
				{
					label: 'Caste',
					data: Castes,
					value: currentFilter?.caste ?? '',
					key: 'caste',
				},
				{
					label: 'Income Range',
					data: IncomeRange,
					value: currentFilter?.annualIncome ?? '',
					key: 'annualIncome',
				},
				{
					label: 'Gender',
					data: Gender,
					value: currentFilter?.gender ?? '',
					key: 'gender',
				},
			];
		}

		return [
			{
				label: 'Caste',
				data: Castes,
				value:
					currentFilter?.caste?.toLowerCase() ??
					userFilter?.caste?.toLowerCase() ??
					'',
				key: 'caste',
			},
			{
				label: 'Income Range',
				data: IncomeRange,
				value:
					currentFilter?.annualIncome ??
					userFilter?.annualIncome ??
					'',
				key: 'annualIncome',
			},
			{
				label: 'Gender',
				data: Gender,
				value:
					currentFilter?.gender?.toLowerCase() ??
					userFilter?.gender?.toLowerCase() ??
					'',
				key: 'gender',
			},
		];
	}, [activeTab, allBenefitsFilter, myBenefitsFilter, userFilter]);

	// Memoized components
	const pagination = useMemo(
		() => (
			<Pagination
				currentPage={currentTabData.page}
				totalPages={currentTabData.pagination.totalPages}
				totalItems={currentTabData.pagination.total}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
				onItemsPerPageChange={handleItemsPerPageChange}
				itemsPerPageOptions={[5, 10, 20]}
				maxVisiblePages={7}
				showItemsPerPageSelector={true}
				showResultsText={true}
				size="sm"
			/>
		),
		[
			currentTabData.page,
			currentTabData.pagination.totalPages,
			currentTabData.pagination.total,
			itemsPerPage,
			handlePageChange,
			handleItemsPerPageChange,
		]
	);

	const benefitsContent = useMemo(() => {
		if (currentTabData.benefits.length === 0) {
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
					{currentTabData.benefits.map((benefit) => (
						<BenefitCard item={benefit} key={benefit.item_id} />
					))}
				</Box>
				{pagination}
			</>
		);
	}, [currentTabData.benefits, activeTab, pagination]);

	return (
		<Layout
			loading={loading}
			_heading={{
				heading: 'Browse Benefits',
				onSearch: setSearch,
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
					position="sticky"
					top={0}
					zIndex={10}
					bg="white"
					direction="row"
					align="center"
					justify="space-between"
					gap={4}
					width="100%"
					px={4}
					py={2}
					flexWrap="nowrap"
					boxShadow="sm"
				>
					<Box flexShrink={0}>
						<TabList>
							<Tab>All Benefits</Tab>
							{isAuthenticated && <Tab>My Benefits</Tab>}
						</TabList>
					</Box>

					<Box flexShrink={0}>
						<FilterDialog
							inputs={filterInputs}
							setFilter={currentTabData.setFilter}
							mr="20px"
						/>
					</Box>
				</Flex>

				<TabPanels>
					<TabPanel px={0}>{benefitsContent}</TabPanel>
					{isAuthenticated && (
						<TabPanel px={0}>{benefitsContent}</TabPanel>
					)}
				</TabPanels>
			</Tabs>
		</Layout>
	);
};

export default ExploreBenefits;
