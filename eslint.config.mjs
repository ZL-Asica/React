import { zlAsicaTsReactConfig } from 'eslint-config-zl-asica';

export default [
  ...zlAsicaTsReactConfig,
  {
    rules: {
      'unicorn/filename-case': 'off',
      'import/group-exports': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
];
