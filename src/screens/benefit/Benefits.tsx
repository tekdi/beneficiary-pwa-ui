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
} from '@chakra-ui/react';
import BenefitCard from '../../components/common/Card';
import Layout from '../../components/common/layout/Layout';
import { getUser, logoutUser } from '../../services/auth/auth';
import { getAll } from '../../services/benefit/benefits';
import { Castes, IncomeRange } from '../../assets/mockdata/FilterData';
import { getIncomeRangeValue } from '../../utils/jsHelper/helper';
import { useNavigate } from 'react-router-dom';

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
	const navigate = useNavigate();
	const handleOpen = () => {};

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
				const errorMessage = (e as Error).message;

				// Check for invalid token and log out
				if (errorMessage.includes('Unauthorized')) {
					const response = await logoutUser();
					if (response) {
						navigate('/');
						navigate(0);
					}
				} else {
					setError(`Failed to initialize user data: ${errorMessage}`);
					console.log(
						'Error fetching user data:',
						(e as any).code || errorMessage
					);
				}

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

			{benefits.length === 0 ? (
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
			) : (
				<Box className="card-scroll">
					{benefits.map((benefit) => (
						<BenefitCard item={benefit} key={benefit.item_id} />
					))}
				</Box>
			)}
		</Layout>
	);
};

export default ExploreBenefits;
