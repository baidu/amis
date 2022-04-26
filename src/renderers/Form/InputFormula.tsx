import React from 'react';

import ResultBox from '../../components/ResultBox';
import Spinner from '../../components/Spinner';
import {SchemaApi, SchemaTokenizeableString} from '../../Schema';
import FormItem, {FormBaseControl, FormControlProps} from './Item';
import FormulaPicker from '../../components/formula/Picker';
import {autobind} from '../../utils/helper';

import type {FuncGroup, VariableItem} from '../../components/formula/Editor';
import type {SchemaIcon} from '../../Schema';

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
   * 编辑器标题
   */
  title?: string;

  /**
   * 顶部标题，默认为表达式
   */
  header: string;

  /**
   * 控件模式
   */
  inputMode?: 'button' | 'input-button';

  /**
   * 外层input是否允许输入，否需要点击fx在弹窗中输入
   */
  allowInput?: boolean;

  /**
   * 按钮图标
   */
  icon?: SchemaIcon;

  /**
   * 按钮Label，inputMode为button时生效
   */
  btnLabel?: string;

  /**
   * 按钮样式
   */
  level?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'link'
    | 'primary'
    | 'dark'
    | 'light';

  /**
   * 按钮大小
   */
  btnSize?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 输入框占位符
   */
  placeholder?: string;

  /**
   * 变量面板CSS样式类名
   */
  variableClassName?: string;

  /**
   * 函数面板CSS样式类名
   */
  functionClassName?: string;
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
  static defaultProps: Pick<
    InputFormulaControlSchema,
    'inputMode' | 'borderMode'
  > = {
    inputMode: 'input-button',
    borderMode: 'full'
  };

  render() {
    let {
      selectedOptions,
      disabled,
      onChange,
      evalMode,
      variables,
      variableMode,
      functions,
      header,
      label,
      value,
      clearable,
      className,
      classPrefix: ns,
      classnames: cx,
      allowInput = true,
      borderMode,
      placeholder,
      inputMode,
      btnLabel,
      level,
      btnSize,
      icon,
      title,
      variableClassName,
      functionClassName,
      data,
      onPickerOpen
    } = this.props;
    return (
      <FormulaPicker
        className={className}
        value={value}
        disabled={disabled}
        allowInput={allowInput}
        onChange={onChange}
        evalMode={evalMode}
        variables={variables}
        variableMode={variableMode}
        functions={functions}
        header={header || label || ''}
        borderMode={borderMode}
        placeholder={placeholder}
        mode={inputMode}
        btnLabel={btnLabel}
        level={level}
        btnSize={btnSize}
        icon={icon}
        title={title}
        clearable={clearable}
        variableClassName={variableClassName}
        functionClassName={functionClassName}
        data={data}
        onPickerOpen={onPickerOpen}
      />
    );
  }
}
