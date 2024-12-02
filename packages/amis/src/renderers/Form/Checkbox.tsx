import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable,
  setThemeClassName,
  CustomStyle,
  formateCheckThemeCss
} from 'amis-core';
import cx from 'classnames';
import {Checkbox} from 'amis-ui';
import {withBadge, BadgeObject} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {BaseSchema, FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import type {TestIdBuilder} from 'amis-core';

export interface SchemaMap {
  checkbox: CheckboxControlSchema;
}

/**
 * Checkbox 勾选框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/checkbox
 */
export interface CheckboxControlSchema extends FormBaseControlSchema {
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
  testIdBuilder?: TestIdBuilder;
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
    const {dispatchEvent, onChange} = this.props;
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: eventData})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(eventData);
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
      testIdBuilder,
      classPrefix: ns,
      id,
      env,
      themeCss
    } = this.props;

    const css = formateCheckThemeCss(themeCss, 'checkbox');

    return (
      <div
        className={cx(
          `${ns}CheckboxControl`,
          className,
          setThemeClassName({
            ...this.props,
            name: [
              'checkboxControlClassName',
              'checkboxControlCheckedClassName',
              'checkboxClassName',
              'checkboxCheckedClassName',
              'checkboxInnerClassName',
              'checkboxShowClassName'
            ],
            id,
            themeCss: css
          })
        )}
      >
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
          labelClassName={labelClassName}
          testIdBuilder={testIdBuilder}
          className="first last"
        >
          {option ? render('option', option) : null}
        </Checkbox>

        <CustomStyle
          {...this.props}
          config={{
            themeCss: css,
            classNames: [
              {
                key: 'checkboxControlClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.checked):not(.disabled)`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled):not(.checked)`
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled:not(.checked)`
                  }
                }
              },
              {
                key: 'checkboxControlCheckedClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox.checked:not(.disabled)`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox.checked:not(.disabled)`
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.checked.disabled`
                  }
                }
              },
              {
                key: 'checkboxClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.checked):not(.disabled) > i`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled):not(.checked)`,
                    inner: '> i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled:not(.checked) > i`
                  }
                }
              },
              {
                key: 'checkboxCheckedClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.disabled) > i`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled)`,
                    inner: '> i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled > i`
                  }
                }
              },
              {
                key: 'checkboxInnerClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox:not(.disabled) > i .icon`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox:not(.disabled)`,
                    inner: '> i .icon'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox.disabled > i .icon`
                  }
                }
              },
              {
                key: 'checkboxShowClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox > i`
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
      </div>
    );
  }
}

// @ts-ignore
@withBadge
@FormItem({
  type: 'checkbox',
  sizeMutable: false,
  thin: true
})
export class CheckboxControlRenderer extends CheckboxControl {}
