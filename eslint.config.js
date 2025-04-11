// @ts-check

import eslint from '@eslint/js';
import mochaPlugin from "eslint-plugin-mocha";
import tseslint from 'typescript-eslint';

export default tseslint.config(
    mochaPlugin.configs.flat.recommended,
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
		rules: {
            "@typescript-eslint/no-unused-vars": "warn",
		},
	},
);