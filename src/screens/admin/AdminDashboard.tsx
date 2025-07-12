import React, { useState } from 'react';
import {
	Box,
	VStack,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from '@chakra-ui/react';

import FieldMappingTab from '../../components/FieldMappingTab';
import DocumentConfigurationTab from '../../components/DocumentConfigurationTab';

const AdminDashboard = () => {
	// State to track which tab is active and trigger refresh
	const [activeTab, setActiveTab] = useState(0);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Handle tab change
	const handleTabChange = (index) => {
		setActiveTab(index);
		// If switching to Field Mapping tab (index 0), trigger a refresh
		if (index === 0) {
			setRefreshTrigger(prev => prev + 1);
		}
	};

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

				<Tabs variant="enclosed" colorScheme="blue" onChange={handleTabChange}>
					<TabList>
						<Tab>Field Mapping</Tab>

						<Tab>VC Configuration</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							<FieldMappingTab refreshTrigger={refreshTrigger} />
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
