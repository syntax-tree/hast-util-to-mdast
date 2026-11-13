/**
 * @import {FlatXoConfig} from 'xo'
 */

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    name: 'default',
    prettier: 'compat',
    rules: {
      '@typescript-eslint/no-shadow': 'off',
      curly: 'off',
      'import-x/order': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 'off',
      // Wrong for templates on typedefs.
      'jsdoc/check-template-names': 'off',
      'jsdoc/informative-docs': 'off',
      'jsdoc/reject-any-type': 'off',
      'jsdoc/require-asterisk-prefix': 'off',
      // Wrong for TypeScript types.
      'jsdoc/valid-types': 'off',
      'max-depth': 'off',
      'no-shadow': 'off',
      // Asserts are used to narrow types.
      'node-test/no-conditional-assertion': 'off',
      'prefer-arrow-callback': 'off',
      'regexp/no-super-linear-move': 'off',
      'regexp/prefer-named-capture-group': 'off',
      'require-unicode-regexp': 'off',
      'unicorn/better-dom-traversing': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/logical-assignment-operators': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/no-immediate-mutation': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/prefer-continue': 'off',
      'unicorn/prefer-early-return': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      // HTML integers are parsed leniently, like `parseInt`.
      'unicorn/prefer-math-trunc': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-unicode-code-point-escapes': 'off',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/single-line-block-comment-style': 'off'
    },
    space: true
  },
  // Wrong.
  {ignores: ['**/*.md']},
  {ignores: ['test/fixtures/']},
  {
    files: ['test/**/*.js'],
    rules: {
      'no-await-in-loop': 'off'
    }
  },
  {
    files: ['package.json'],
    rules: {
      'package-json/no-orphan-types': 'off',
      'package-json/require-engines': 'off',
      'package-json/sort-files': 'off',
      'package-json/sort-properties': 'off'
    }
  }
]

export default xoConfig
