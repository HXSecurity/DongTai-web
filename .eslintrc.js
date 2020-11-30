module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-inferrable-types": 0,
    "@typescript-eslint/class-name-casing": 0,
    "@typescript-eslint/no-explicit-any": 0
  }
}
