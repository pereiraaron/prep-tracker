import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
      }],
      'no-restricted-imports': ['error', {
        patterns: [{
          group: [
            '**/components/*',
            '**/screens/*',
            '**/store/*',
            '**/api/*',
            '**/hooks/*',
            '!./components/*',
            '!./components/**',
          ],
          message: 'Use path aliases (@components, @screens, @store, @api, @hooks) instead of relative imports.',
        }],
      }],
    },
  },
])
