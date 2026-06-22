// ESLint flat config（工程规范基线）。
// 规则保持克制：仅把真正影响运行安全和可维护性的问题设为 error，
// 风格类问题交给 Prettier（见 .prettierrc / eslint-config-prettier）。
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  // 忽略目录与产物
  {
    ignores: ['dist/**', 'dist-demo/**', '.vite/**', 'node_modules/**', 'coverage/**', '**/*.min.js'],
  },

  // JS / JSX 源码
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // —— error：影响运行安全 / 明显错误 ——
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      'no-redeclare': 'error',
      'react-hooks/rules-of-hooks': 'error',

      // —— warn：建议修复，但不阻断（历史 mock 代码较多）——
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      // 本项目 DataTable 把 <StatusText/> 等作为「单元格数据」放进 rows 数组，
      // 实际渲染时由 DataTable 在 <td> 上加 key，并非真实的列表渲染缺 key。
      // 设为 error 会对大量单元格误报，故降为 warn（仍能提示真正的列表缺 key）。
      'react/jsx-key': 'warn',

      // —— off：当前项目无需 ——
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // 组件文件混有工具导出，HMR 检查暂不开启，避免大面积告警
      'react-refresh/only-export-components': 'off',
    },
  },

  // CommonJS 脚本（如 scripts/*.cjs）
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  // 关闭与 Prettier 冲突的风格规则（必须放最后）
  prettier,
];
