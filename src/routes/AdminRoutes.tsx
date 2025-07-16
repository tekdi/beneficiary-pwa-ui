import React, { lazy } from 'react';
const FieldMappingConfig = lazy(
	() => import('../screens/admin/FieldMappingConfig')
);
const DocumentConfig = lazy(() => import('../screens/admin/DocumentConfig'));
const AddFields = lazy(() => import('../screens/admin/AddFields'));
const routes = [
	{
		path: '/fieldConfig',
		component: FieldMappingConfig,
	},
	{
		path: '/fields',
		component: AddFields,
	},
	{
		path: '*',
		component: DocumentConfig,
	},
];

export default routes;
