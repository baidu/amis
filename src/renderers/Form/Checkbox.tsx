import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import Checkbox from '../../components/Checkbox';
import {withBadge, BadgeSchema} from '../../components/Badge';

/**
 * Checkbox 勾选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/checkbox
 */
export interface CheckboxControlSchema extends FormBaseControl {
  /**
   * 指定为多行文本输入框
   */
  type: 'checkbox';

  /**
   * 勾选值
   */
  trueValue?: any;

  /**
   * 未勾选值
   */
  falseValue?: any;

  /**
   * 选项说明
   */
  option?: string;

  /**
   * 角标
   */
  badge?: BadgeSchema;
}

export interface CheckboxProps
  extends FormControlProps,
    Omit<
      CheckboxControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class CheckboxControl extends React.Component<
  CheckboxProps,
  any
> {
  static defaultProps: Partial<CheckboxProps> = {
    trueValue: true,
    falseValue: false
  };
  render() {
    const {
      className,
      value,
      trueValue,
      falseValue,
      option,
      onChange,
      disabled,
      render,
      classPrefix: ns
    } = this.props;

    return (
      <div className={cx(`${ns}CheckboxControl`, className)}>
        <Checkbox
          inline
          value={value || ''}
          trueValue={trueValue}
          falseValue={falseValue}
          disabled={disabled}
          onChange={(value: any) => onChange(value)}
        >
          {option ? render('option', option) : null}
        </Checkbox>
      </div>
    );
  }
}

@FormItem({
  type: 'checkbox',
  sizeMutable: false
})
// @ts-ignore
@withBadge
export class CheckboxControlRenderer extends CheckboxControl {}
