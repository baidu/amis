import {ExpressionComplex, Field, Funcs} from './types';
import React from 'react';

/**
 * 支持4中表达式设置方式
 * 1. 直接就是值，由用户直接填写。
 * 2. 选择字段，让用户选一个字段。
 * 3. 选择一个函数，然后会参数里面的输入情况是个递归。
 * 4. 粗暴点，函数让用户自己书写。
 */

export interface ExpressionProps {
  value: ExpressionComplex;
  onChange: (value: ExpressionComplex) => void;
  valueField?: Field;
  fields?: Field[];
  funcs?: Funcs;
  allowedTypes?: Array<'value' | 'field' | 'func' | 'raw'>;
}

export class Expression extends React.Component<ExpressionProps> {}
