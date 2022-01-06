import React from 'react';
import FormItem, {FormBaseControl, FormControlProps} from './Item';
import FormulaPicker from '../../components/formula/Picker';
import type {FuncGroup, VariableItem} from '../../components/formula/Editor';

/**
 * InputFormula 公式编辑器
 * 文档：https://baidu.gitee.io/amis/zh-CN/components/form/input-formula
 */
export interface InputFormulaControlSchema extends FormBaseControl {
  type: 'input-formula';

  /**
   * evalMode 即直接就是表达式，否则
   * 需要 ${这里面才是表达式}
   * 默认为 true
   */
  evalMode?: boolean;

  /**
   * 用于提示的变量集合，默认为空
   */
  variables: Array<VariableItem>;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tabs' | 'tree';

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions: Array<FuncGroup>;

  /**
   * 顶部标题，默认为表达式
   */
  header: string;
}

export interface InputFormulaProps
  extends FormControlProps,
    Omit<
      InputFormulaControlSchema,
      'options' | 'inputClassName' | 'className' | 'descriptionClassName'
    > {}

@FormItem({
  type: 'input-formula'
})
export class InputFormulaRenderer extends React.Component<InputFormulaProps> {
  render() {
    const {
      selectedOptions,
      disabled,
      onChange,
      evalMode,
      variables,
      variableMode,
      functions,
      header,
      label,
      value
    } = this.props;

    return (
      <FormulaPicker
        value={value}
        disabled={disabled}
        onChange={onChange}
        evalMode={evalMode}
        variables={variables}
        variableMode={variableMode}
        functions={functions}
        header={header || label || ''}
      />
    );
  }
}
