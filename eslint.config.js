import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginEslintPrettieRecommendedConfig from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	pluginJsxA11y.flatConfigs.recommended,
	pluginEslintPrettieRecommendedConfig,
	{
		plugins: {
			'react-hooks': pluginReactHooks,
			'react-refresh': pluginReactRefresh,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react-refresh/only-export-components': 'warn',
			// Prettier and Indentation Rules
			'prettier/prettier': [
				'error',
				{
					arrowParens: 'always',
					endOfLine: 'lf',
					semi: true,
					singleQuote: true,
					tabWidth: 4,
					trailingComma: 'es5',
					useTabs: true,
				},
			],
			///SwitchCase is added to handle switch case indentation
			indent: ['error', 'tab', { SwitchCase: 1 }],
		},
	},
	{
		// Optional: ignore specific files or patterns
		ignores: ['**/node_modules/**', 'dist/**', 'build/**'],
	},
];
