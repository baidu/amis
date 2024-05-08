import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable
} from 'amis-core';
import cx from 'classnames';
import {Checkbox} from 'amis-ui';
import {withBadge, BadgeObject} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {BaseSchema, FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * Radio 单选框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/radios
 */
export interface RadioControlSchema extends FormBaseControlSchema {
  /**
   * 指定为多行文本输入框
   */
  type: 'radio';

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
}

export interface RadioProps
  extends FormControlProps,
    Omit<
      RadioControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  checked?: boolean;
  onRadioChange?: (value: any, ctx: any) => any;
}

export default class RadioControl extends React.Component<RadioProps, any> {
  static defaultProps: Partial<RadioProps> = {
    trueValue: true,
    falseValue: false
  };

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange(pristineVal ?? '');
    }
  }

  @autobind
  async dispatchChangeEvent(eventData: any = {}) {
    const {dispatchEvent, onChange, submitOnChange, onRadioChange} = this.props;
    const ctx = resolveEventData(this.props, {value: eventData});

    if (onRadioChange?.(ctx, this.props) === false) {
      return;
    }

    const rendererEvent = await dispatchEvent('change', ctx);

    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(eventData, submitOnChange, true);
  }

  renderStatic() {
    const {
      value,
      trueValue,
      falseValue,
      option,
      render,
      partial,
      optionType,
      checked,
      labelClassName
    } = this.props;

    return (
      <Checkbox
        type="radio"
        inline
        value={value || ''}
        trueValue={trueValue}
        falseValue={falseValue}
        disabled={true}
        partial={partial}
        optionType={optionType}
        checked={checked}
        labelClassName={labelClassName}
      >
        {option ? render('option', option) : null}
      </Checkbox>
    );
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
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
      labelClassName,
      classPrefix: ns
    } = this.props;

    return (
      <div className={cx(`${ns}CheckboxControl`, className)}>
        <Checkbox
          type="radio"
          inline
          value={value || ''}
          trueValue={trueValue}
          falseValue={falseValue}
          disabled={disabled}
          onChange={(value: any) => this.dispatchChangeEvent(value)}
          partial={partial}
          optionType={optionType}
          checked={checked}
          labelClassName={labelClassName}
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
  type: 'radio',
  sizeMutable: false
})
export class RadioControlRenderer extends RadioControl {}
