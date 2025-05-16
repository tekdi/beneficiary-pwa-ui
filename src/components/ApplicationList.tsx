import React from 'react';
import { Box, Text, VStack, HStack, Divider } from '@chakra-ui/react';
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
		<Text fontSize="16px" fontWeight="semibold" color={COLORS.text}>
			{formattedStatus}
		</Text>
	);
};

const ApplicationList: React.FC<ApplicationListProps> = ({
	applicationList = [],
}) => {
	const navigate = useNavigate();

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

	const statusKeys = React.useMemo(() => {
		return Object.keys(groupedApplications).sort((a, b) =>
			a.localeCompare(b, undefined, { sensitivity: 'base' })
		);
	}, [groupedApplications]);

	return (
		<Box
			as="section"
			aria-label="Applications list"
			pb="100px"
			px="16px"
			width="100%"
		>
			<VStack spacing={4} align="stretch" mt={'10px'}>
				{statusKeys.map((status, index) => (
					<Box
						key={`${status}${index}`}
						borderRadius="10px"
						bg="#FFFFFF"
						shadow="md"
						border="1px solid #DDDDDD"
						width="100%"
					>
						<Box
							height="56px"
							px="16px"
							display="flex"
							alignItems="center"
							bg="#EDEFFF"
							borderBottom="1px solid #DDDDDD"
							borderTopRadius="10px"
						>
							<StatusIcon status={status} />
						</Box>

						<VStack align="stretch" spacing={0}>
							{groupedApplications[status].map((app, i, arr) => (
								<React.Fragment
									key={app.internal_application_id}
								>
									<Box
										as="button"
										onClick={() =>
											navigate(
												`/previewapplication/${app.internal_application_id}`
											)
										}
										width="100%"
										textAlign="left"
										px="16px"
										py="12px"
										_hover={{ bg: '#F5F5F5' }}
									>
										<Text
											fontSize="14px"
											color={COLORS.text}
										>
											{app.application_name}
										</Text>
									</Box>
									{i !== arr.length - 1 && (
										<Divider
											borderColor="#E2E8F0"
											marginX="16px"
										/>
									)}
								</React.Fragment>
							))}
						</VStack>
					</Box>
				))}
			</VStack>
		</Box>
	);
};

export default ApplicationList;
