import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import ColorPicker from '../../components/ColorPicker';
import {Funcs, Fields} from '../../components/condition-builder/types';
import {Config} from '../../components/condition-builder/config';
import ConditionBuilder from '../../components/condition-builder/index';

/**
 * 条件组合控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/condition-builder
 */
export interface ConditionBuilderControlSchema extends FormBaseControl {
  /**
   * 指定为
   */
  type: 'condition-builder';

  /**
   * 函数集合
   */
  funcs?: Funcs;

  /**
   * 字段集合
   */
  fields: Fields;

  /**
   * 其他配置
   */
  config?: Config;
}

export interface ConditionBuilderProps
  extends FormControlProps,
    Omit<
      ConditionBuilderControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class ConditionBuilderControl extends React.PureComponent<ConditionBuilderProps> {
  render() {
    const {className, classnames: cx, ...rest} = this.props;

    return (
      <div className={cx(`ConditionBuilderControl`, className)}>
        <ConditionBuilder {...rest} />
      </div>
    );
  }
}

@FormItem({
  type: 'condition-builder'
})
export class ConditionBuilderRenderer extends ConditionBuilderControl {}
