import React, { lazy } from 'react';
const FieldMappingConfig = lazy(
	() => import('../screens/admin/FieldMappingConfig')
);
const DocumentConfig = lazy(() => import('../screens/admin/DocumentConfig'));
const routes = [
	{
		path: '*',
		component: DocumentConfig,
	},
	{
		path: '/fieldConfig',
		component: FieldMappingConfig,
	},
];

export default routes;
