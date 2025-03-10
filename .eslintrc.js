module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    semi: 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'consistent-return': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'no-shadow': 'warn',
    'no-return-assign': 'warn',
    indent: 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'max-len': [
      'error',
      {
        code: 140,
      },
    ],
    'react/jsx-filename-extension': [0, { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': [1, { ignorePureComponents: true }],
    'react/jsx-one-expression-per-line': 'off',
    camelcase: 'off',
    'comma-dangle': 'off',
  },
}
