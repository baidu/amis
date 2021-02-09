import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {evalJS, filter} from '../../utils/tpl';
import {isObjectShallowModified} from '../../utils/helper';

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
  componentDidMount() {
    const {formula, data, setPrinstineValue, initSet, condition} = this.props;

    if (!formula || initSet === false) {
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
    result !== null && setPrinstineValue(result);
  }

  componentWillReceiveProps(nextProps: FormControlProps) {
    const {formula, data, onChange, autoSet, value, condition} = this.props;

    if (
      autoSet !== false &&
      formula &&
      nextProps.formula &&
      isObjectShallowModified(data, nextProps.data, false) &&
      value === nextProps.value
    ) {
      const nextResult: any = evalJS(
        nextProps.formula,
        nextProps.data as object
      );

      if (condition && nextProps.condition) {
        if (!!~condition.indexOf('$') || !!~condition.indexOf('<%')) {
          // 使用${xxx}，来监听某个变量的变化
          if (
            filter(condition, data) !==
            filter(nextProps.condition, nextProps.data)
          ) {
            onChange(nextResult);
          }
        } else if (evalJS(nextProps.condition, nextProps.data as object)) {
          // 使用 data.xxx == 'a' 表达式形式来判断
          onChange(nextResult);
        }
      } else {
        const prevResult: any = evalJS(formula, data as object);
        if (JSON.stringify(prevResult) !== JSON.stringify(nextResult)) {
          onChange(nextResult || '');
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
