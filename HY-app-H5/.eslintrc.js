module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    // 'no-console': 'off',
    // 'no-debugger': 'off',
    // 'import/no-duplicates': 'off',
    // 'indent': 'off',
    // 'space-before-function-paren': ['off','never'],
    // 'brace-style': 'off',
    // 'no-extend-native': 'off',
    // 'no-trailing-spaces': 'off',
    // 'no-prototype-builtins': 'off',
    // 'no-undef': 'off',
    // 'no-new': 'off',
    // 'new-cap': 'off',
    // 'no-unused-vars': 'off'
  }
}
