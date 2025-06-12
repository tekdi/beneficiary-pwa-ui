import React from 'react';
import {
	Box,
	VStack,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';

import FieldMappingTab from '../../components/FieldMappingTab';
import DocumentConfigurationTab from '../../components/DocumentConfigurationTab';

const AdminDashboard = () => {
	return (
		<Box p={6} maxW="1200px" mx="auto">
			<VStack spacing={6} align="stretch">
				<Box>
					<Text fontSize="2xl" fontWeight="bold" mb={2}>
						Admin Dashboard
					</Text>
					<Text color="gray.600">
						Manage field mappings and document configurations
					</Text>
				</Box>

				<Tabs variant="enclosed" colorScheme="blue">
					<TabList>
						<Tab>Field Mapping</Tab>

						<Tab>VC Configuration</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							<FieldMappingTab />
						</TabPanel>

						<TabPanel>
							<DocumentConfigurationTab />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</VStack>
		</Box>
	);
};

export default AdminDashboard;
