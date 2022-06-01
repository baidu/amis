import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import {evalJS, filter} from 'amis-core';
import {autobind, isObjectShallowModified, setVariable} from 'amis-core';

/**
 * 公式功能控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/formula
 */
export interface FormulaControlSchema extends FormBaseControl {
  /**
   * 指定为公式功能控件。
   */
  type: 'formula';

  /**
   * 当某个按钮的目标指定为此值后，会触发一次公式应用。这个机制可以在 autoSet 为 false 时用来手动触发
   */
  id?: string;

  /**
   * 触发公式的作用条件，如 data.xxx == \"a\" 或者 ${xx}
   */
  condition?: string;

  /**
   * 是否自动应用
   */
  autoSet?: boolean;

  /**
   * 公式
   */
  formula?: string;

  /**
   * 是否初始应用
   */
  initSet?: boolean;

  /**
   * 字段名，公式结果将作用到此处指定的变量中去
   */
  name?: string;
}

export interface FormulaProps
  extends FormControlProps,
    Omit<
      FormulaControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class FormulaControl extends React.Component<
  FormControlProps,
  any
> {
  inited = false;
  unHook?: () => void;

  componentDidMount() {
    const {formInited, initSet, addHook} = this.props;

    this.unHook = addHook ? addHook(this.handleFormInit, 'init') : undefined;

    // 如果在表单中，还是等初始化数据过来才算
    if (formInited === false) {
      return;
    }

    this.inited = true;
    initSet === false || this.initSet();
  }

  componentDidUpdate(prevProps: FormControlProps) {
    const {formInited, initSet, autoSet} = this.props;

    if (this.inited) {
      autoSet === false || this.autoSet(prevProps);
    } else if (typeof formInited === 'undefined') {
      this.inited = true;
      initSet === false || this.initSet();
    }
  }

  componentWillUnmount() {
    this.unHook?.();
  }

  @autobind
  handleFormInit(data: any) {
    this.inited = true;
    const {name, initSet} = this.props;

    if (initSet === false) {
      return;
    }

    const result = this.initSet();

    if (typeof name === 'string' && typeof result !== 'undefined') {
      setVariable(data, name, result);
    }
  }

  initSet() {
    const {formula, data, setPrinstineValue, initSet, condition} = this.props;

    if (!formula) {
      return;
    } else if (
      condition &&
      !~condition.indexOf('$') &&
      !~condition.indexOf('<%') &&
      !evalJS(condition, data as object)
    ) {
      return;
    }

    const result: any = evalJS(formula, data as object);
    result !== null && setPrinstineValue?.(result);
    return result;
  }

  autoSet(prevProps: FormControlProps) {
    const props = this.props;
    const {formula, data, onChange, value, condition} = prevProps;

    if (
      formula &&
      props.formula &&
      isObjectShallowModified(data, props.data, false) &&
      value === props.value
    ) {
      const nextResult: any = evalJS(props.formula, props.data as object);

      if (condition && props.condition) {
        if (!!~condition.indexOf('$') || !!~condition.indexOf('<%')) {
          // 使用${xxx}，来监听某个变量的变化
          if (filter(condition, data) !== filter(props.condition, props.data)) {
            onChange(nextResult);
          }
        } else if (evalJS(props.condition, props.data as object)) {
          // 使用 data.xxx == 'a' 表达式形式来判断
          onChange(nextResult);
        }
      } else {
        const prevResult: any = evalJS(formula, data as object);
        if (JSON.stringify(prevResult) !== JSON.stringify(nextResult)) {
          onChange(nextResult ?? '');
        }
      }
    }
  }

  doAction() {
    // 不细化具体是啥动作了，先重新计算，并把值运用上。

    const {formula, data, onChange, autoSet, value} = this.props;

    const result: any = evalJS(formula, data as object);
    onChange(result);
  }

  render() {
    return null;
  }
}

@FormItem({
  type: 'formula',
  wrap: false,
  strictMode: false,
  sizeMutable: false
})
export class FormulaControlRenderer extends FormulaControl {}
