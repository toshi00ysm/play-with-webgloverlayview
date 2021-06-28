module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react-hooks', 'react', '@typescript-eslint'],
  extends: [
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'no-redeclare': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'no-void': 'warn',
    '@typescript-eslint/no-redeclare': [
      'error',
      {
        'ignoreDeclarationMerge': true
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false
      }
    ],
    '@typescript-eslint/no-use-before-define': [
      'error'
    ]
  }
}