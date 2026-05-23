import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import noComments from 'eslint-plugin-no-comments';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['data/docker/**', 'dist/**', 'node_modules/**']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettier,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      'no-comments': noComments,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'prettier/prettier': 'error',
      'no-comments/disallowComments': [
        'error',
        {
          allow: [
            'istanbul ignore next',
            'eslint-disable-next-line @typescript-eslint/ban-types',
            'istanbul ignore file',
            'eslint-disable-next-line @typescript-eslint/ban-ts-comment',
            '@ts-ignore',
            '/',
          ],
        },
      ],
    },
  },
]);