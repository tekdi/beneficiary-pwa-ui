import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface Application {
	benefit_id: string;
	application_name: string;
	internal_application_id: string;
	status: string;
	application_data: Record<string, unknown>;
}

interface ApplicationListProps {
	applicationList?: Application[];
}

const COLORS = {
	success: '#0B7B69',
	warning: '#EDA145',
	error: '#8C1823',
	text: '#1F1B13',
} as const;

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
	const formattedStatus =
		status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

	return (
		<HStack alignItems="center">
			<Text fontSize="16px" color={COLORS.text}>
				{formattedStatus}
			</Text>
		</HStack>
	);
};

const ApplicationList: React.FC<ApplicationListProps> = ({
	applicationList = [],
}) => {
	const navigate = useNavigate();

	// Group applications dynamically by status
	const groupedApplications = React.useMemo(() => {
		return applicationList.reduce(
			(acc, app) => {
				if (!acc[app.status]) {
					acc[app.status] = [];
				}
				acc[app.status].push(app);
				return acc;
			},
			{} as Record<string, Application[]>
		);
	}, [applicationList]);

	// Get the dynamic list of statuses
	const statusKeys = React.useMemo(
		() => Object.keys(groupedApplications).sort(), // optionally sort alphabetically
		[groupedApplications]
	);

	return (
		<Box
			as="section"
			aria-label="Applications list"
			paddingBottom="100px"
			padding="16px"
			width="100%"
		>
			<VStack spacing={4} align="stretch">
				{statusKeys.map((status, index) => (
					<Box
						borderRadius={10}
						bg="#FFFFFF"
						shadow="md"
						borderWidth="0.5px"
						borderColor="#DDDDDD"
						width="100%"
						key={`${status}${index}`}
					>
						<HStack
							alignItems="center"
							borderBottom="1px"
							borderColor="#DDDDDD"
							height="56px"
							alignContent="center"
							width="100%"
							paddingLeft="16px"
							bg="#EDEFFF"
						>
							<StatusIcon status={status} />
						</HStack>
						<VStack align="stretch" spacing={2}>
							{groupedApplications[status].map((app) => (
								<Box
									as="button"
									onClick={() =>
										navigate(
											`/previewapplication/${app.internal_application_id}`
										)
									}
									width="100%"
									key={app.internal_application_id}
								>
									<HStack
										width="100%"
										height={53}
										padding="20px 8px 16px 16px"
										justifyContent="space-between"
									>
										<Text
											fontSize="14px"
											color={COLORS.text}
											border="none"
										>
											{app.application_name}
										</Text>
									</HStack>
								</Box>
							))}
						</VStack>
					</Box>
				))}
			</VStack>
		</Box>
	);
};

export default ApplicationList;
