import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // 忽略 _开头的参数
          varsIgnorePattern: '^_', // 忽略 _开头的变量
          caughtErrorsIgnorePattern: '^_' // 忽略 _开头的错误
        }
      ]
    }
  }
);
