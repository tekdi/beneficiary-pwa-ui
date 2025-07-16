import React, { lazy } from 'react';
const FieldMappingConfig = lazy(
	() => import('../screens/admin/FieldMappingConfig')
);
const DocumentConfig = lazy(() => import('../screens/admin/DocumentConfig'));
const routes = [
	{
		path: '/fieldConfig',
		component: FieldMappingConfig,
	},
	{
		path: '*',
		component: DocumentConfig,
	},
];

export default routes;
