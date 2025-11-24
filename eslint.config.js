// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      '*.config.js',
      'vite.config.ts',
    ],
  },

  js.configs.recommended,

  // Convert your old .eslintrc.cjs automatically
  ...compat.config({
    extends: ['./.eslintrc.cjs'],
  }),
];
