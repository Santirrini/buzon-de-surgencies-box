module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    node: true, // Enable Node.js global variables and Node.js scoping.
    es2020: true, // Add ES2020 globals and automatically set the ecmaVersion parser option to 11.
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'warn', // Show Prettier problems as warnings
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
        printWidth: 80,
        tabWidth: 2,
      },
    ],
    // You can add more specific rules here
  },
};
