module.exports = {
  extends: [
    'stylelint-config-standard',
    // 'stylelint-config-standard-scss',
    'stylelint-config-sass-guidelines',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-vue',
  ],
  // plugins: ['stylelint-scss'],
  rules: {
    'order/properties-alphabetical-order': null,
    'scss/at-import-partial-extension-blacklist': null,
    'selector-max-id': null,
    'scss/at-extend-no-missing-placeholder': null,
    'selector-class-pattern': null,
    'max-nesting-depth': 2,
    'alpha-value-notation': 'number',
  },
  defaultSeverity: 'warning',
};
