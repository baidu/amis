import React from 'react';
import {parse, Evaluator} from 'amis-formula';
import FormItem, {FormBaseControl, FormControlProps} from './Item';
import FormulaPicker from '../../components/formula/Picker';
import {autobind} from '../../utils/helper';

import type {FuncGroup, VariableItem} from '../../components/formula/Editor';
import type {SchemaIcon} from '../../Schema';
import {
  isPureVariable,
  resolveVariableAndFilter
} from '../../utils/tpl-builtin';

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
  inputMode?: 'button' | 'input-button' | 'input-group';

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

  /**
   * 当前输入项字段 name: 用于避免循环绑定自身导致无限渲染
   */
  selfVariableName?: string;
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
    'inputMode' | 'borderMode' | 'evalMode'
  > = {
    inputMode: 'input-button',
    borderMode: 'full',
    evalMode: true
  };

  ref: any;

  @autobind
  formulaRef(ref: any) {
    if (ref) {
      while (ref && ref.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }
      this.ref = ref;
    } else {
      this.ref = undefined;
    }
  }

  validate() {
    const {translate: __, value} = this.props;

    if (this.ref?.validate && value) {
      const res = this.ref.validate(value);
      if (res !== true) {
        return __('FormulaEditor.invalidData', {err: res});
      }
    }
  }

  render() {
    let {
      selectedOptions,
      disabled,
      onChange,
      evalMode,
      variableMode,
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
      onPickerOpen,
      selfVariableName
    } = this.props;
    let {variables, functions} = this.props;

    if (isPureVariable(variables)) {
      // 如果 variables 是 ${xxx} 这种形式，将其处理成实际的值
      variables = resolveVariableAndFilter(variables, this.props.data, '| raw');
    }

    if (isPureVariable(functions)) {
      // 如果 functions 是 ${xxx} 这种形式，将其处理成实际的值
      functions = resolveVariableAndFilter(functions, this.props.data, '| raw');
    }

    return (
      <FormulaPicker
        ref={this.formulaRef}
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
        selfVariableName={selfVariableName}
      />
    );
  }
}
