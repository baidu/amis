import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import cx from 'classnames';
import {Checkbox} from 'amis-ui';
import {withBadge, BadgeObject} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {Action} from 'amis-core';

export interface SchemaMap {
  checkbox: CheckboxControlSchema;
}

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
  trueValue?: boolean | string | number;

  /**
   * 未勾选值
   */
  falseValue?: boolean | string | number;

  /**
   * 选项说明
   */
  option?: string;

  /**
   * 角标
   */
  badge?: BadgeObject;
  partial?: boolean;
  optionType?: 'default' | 'button';
  checked?: boolean;
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

  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  @autobind
  async dispatchChangeEvent(eventData: any = {}) {
    const {dispatchEvent, data, onChange} = this.props;
    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value: eventData
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(eventData);
  }

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
      partial,
      optionType,
      checked,
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
          onChange={(value: any) => this.dispatchChangeEvent(value)}
          partial={partial}
          optionType={optionType}
          checked={checked}
        >
          {option ? render('option', option) : null}
        </Checkbox>
      </div>
    );
  }
}

// @ts-ignore
@withBadge
@FormItem({
  type: 'checkbox',
  sizeMutable: false
})
export class CheckboxControlRenderer extends CheckboxControl {}
