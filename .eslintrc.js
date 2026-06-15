module.exports = {
  extends: [
    'react-app',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier', // This should be last in extends array to override other configs
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
    'import',
    'simple-import-sort',
    'sort-keys-fix',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/sort-type-constituents': 'error',

    // Cruft prevention
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',

    // Comments formatting
    'lines-around-comment': [
      'error',
      {
        allowArrayStart: true,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        beforeBlockComment: true,
        beforeLineComment: true,
      },
    ],

    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // React Hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',

    // Imports and exports
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',

    // Object key sorting
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', { caseSensitive: false, natural: true }],
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        map: [
          ['@', './src']
        ]
      },
      typescript: {
        alwaysTryTypes: true,
      }
    },
    react: {
      version: 'detect',
    }
  },
};
