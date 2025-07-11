import { lazy, useContext } from 'react';
import ScanVC from '../components/ScanVC';
import { AuthContext } from '../utils/context/checkToken';

const ExploreBenefits = lazy(() => import('../screens/benefit/Benefits'));
const BenefitsDetails = lazy(() => import('../screens/benefit/Details'));
const Preview = lazy(() => import('../screens/application/Preview'));
const MyApplications = lazy(
	() => import('../screens/application/ApplicationStatus')
);
const UploadDocuments = lazy(
	() => import('../components/common/layout/UploadDocuments')
);
const Home = lazy(() => import('../screens/Home'));
const UserProfile = lazy(() => import('../screens/UserProfile'));
const DocumentScanner = lazy(() => import('../components/DocumentScanner'));
const AdminDashboard = lazy(() => import('../screens/admin/AdminDashboard'));
const routes = [
	{
		path: '/uploaddocuments',
		component: UploadDocuments,
	},
	{
		path: '/explorebenefits',
		component: ExploreBenefits,
	},
	{
		path: '/vcscans',
		component: ScanVC,
	},
	{
		path: '/document-scanner',
		component: () => {
			const { userData } = useContext(AuthContext)!;
			return (
				<DocumentScanner
					userId={userData?.user_id}
					userData={userData?.docs}
				/>
			);
		},
	},
	{
		path: '/benefits/:id',
		component: BenefitsDetails,
	},
	{
		path: '/previewapplication/:id',
		component: Preview,
	},
	{
		path: '/applicationStatus',
		component: MyApplications,
	},
	// {
	//   path: "/editProfile",
	//   component: EditProfile,
	// },
	{
		path: '/userprofile',
		component: UserProfile,
	},
	{
		path: '*',
		component: Home,
	},
	{
		path: '/adminDashboard/admin123',
		component: AdminDashboard,
	},
];

export default routes;