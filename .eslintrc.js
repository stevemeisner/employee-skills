module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb',
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
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error",
          "info"
        ]
      }
    ],
    "max-len": [
      "error",
      {
        "code": 140
      }
    ],
    'react/jsx-filename-extension': [0, { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': [1, { ignorePureComponents: true }],
    'react/jsx-one-expression-per-line': 'off',
    'camelcase': 'off'
  },
};
