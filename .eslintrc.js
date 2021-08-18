module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-unresolved': 0,
    semi: 0,
    'max-len': ['error', { code: 180 }],
    'import/extensions': 0,
    'no-unused-expressions': 0,
    'global-require': 0,
    'no-plusplus': 0,
    'arrow-parens': 0,
  },
};
