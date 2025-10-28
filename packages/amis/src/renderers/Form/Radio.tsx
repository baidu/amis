import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable,
  AMISFormItem
} from 'amis-core';
import cx from 'classnames';
import {Checkbox} from 'amis-ui';
import {withBadge, BadgeObject} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {BaseSchema, FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * 单选框组件，用于单选场景。支持多个选项中的唯一选择。
 */
export interface AMISRadioSchema extends AMISFormItem {
  /**
   * 指定为 radio 组件
   */
  type: 'radio';

  /**
   * 选中时的值
   */
  trueValue?: boolean | string | number;

  /**
   * 未选中时的值
   */
  falseValue?: boolean | string | number;

  /**
   * 选项说明
   */
  option?: string;

  /**
   * 角标配置
   */
  badge?: BadgeObject;

  /**
   * 是否支持部分选中
   */
  partial?: boolean;

  /**
   * 选项类型
   */
  optionType?: 'default' | 'button';
}

export interface RadioProps
  extends FormControlProps,
    Omit<
      AMISRadioSchema,
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
      labelClassName,
      classnames: cx
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
        labelClassName={cx(labelClassName)}
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
      classPrefix: ns,
      classnames: cx
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
          labelClassName={cx(labelClassName)}
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
  sizeMutable: false,
  thin: true
})
export class RadioControlRenderer extends RadioControl {}
