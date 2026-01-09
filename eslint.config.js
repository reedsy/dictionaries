import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';
import reedsy from '@reedsy/eslint-plugin';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {js},
    extends: ['js/recommended'],
    languageOptions: {globals: globals.node},
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  globalIgnores(['.github/actions/reencode-dictionaries/*.{js,cjs}']),
  reedsy.configs.recommended,
]);
