import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'test', 'refactor', 'docs', 'style', 'chore'],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [0, 'always', []],
  },
};

module.exports = Configuration;
