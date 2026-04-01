module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, // 添加 Jest 测试环境支持
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React 代码质量规则
    'react/self-closing-comp': 'error',
    'react/jsx-fragments': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-object-type-as-default-prop': 'error',
    
    // React 最佳实践
    'react/no-access-state-in-setstate': 'error',
    'react/no-array-index-key': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-this-in-sfc': 'error',
    'react/no-typos': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'error',
    'react/no-unused-prop-types': 'warn',
    'react/no-will-update-set-state': 'error',
    'react/prefer-es6-class': 'error',
    'react/prefer-stateless-function': 'warn',
    'react/require-render-return': 'error',
    'react/void-dom-elements-no-children': 'error',
    
    // 通用规则
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'warn',
    
    // React hooks 规则
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
  overrides: [
    {
      files: ['**/*.jsx', '**/*.js'],
      rules: {
        // 禁止在 ref 回调中更新状态，这可能导致无限循环
        'no-restricted-syntax': [
          'error',
          {
            selector: 'MethodDefinition[key.name=/Ref$/] CallExpression[callee.property.name="setState"]',
            message: '避免在 ref 回调函数中更新状态，这可能导致无限循环。考虑将 ref 存储为类属性而不是状态。'
          }
        ]
      }
    }
  ]
};
