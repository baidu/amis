import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable,
  setThemeClassName,
  CustomStyle
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

  formateThemeCss(themeCss: any) {
    if (!themeCss) {
      return {};
    }
    const {checkboxClassName = {}} = themeCss;
    const defaultThemeCss: any = {};
    const checkedThemeCss: any = {};
    Object.keys(checkboxClassName).forEach(key => {
      if (key.includes('checked-')) {
        const newKey = key.replace('checked-', '');
        checkedThemeCss[newKey] = checkboxClassName[key];
      } else if (key.includes('checkbox-')) {
        const newKey = key.replace('checkbox-', '');
        defaultThemeCss[newKey] = checkboxClassName[key];
      }
    });
    return {
      ...themeCss,
      checkboxClassName: defaultThemeCss,
      checkboxCheckedClassName: checkedThemeCss
    };
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

    const css = this.formateThemeCss(themeCss);

    return (
      <div
        className={cx(
          `${ns}CheckboxControl`,
          className,
          setThemeClassName({
            ...this.props,
            name: 'checkboxClassName',
            id,
            themeCss: css
          }),
          setThemeClassName({
            ...this.props,
            name: 'checkboxCheckedClassName',
            id,
            themeCss: css
          }),
          setThemeClassName({
            ...this.props,
            name: 'checkboxLabelClassName',
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
        >
          {option ? render('option', option) : null}
        </Checkbox>

        <CustomStyle
          {...this.props}
          config={{
            themeCss: this.formateThemeCss(themeCss),
            classNames: [
              {
                key: 'checkboxClassName',
                weights: {
                  default: {
                    suf: ' label',
                    inner: 'i'
                  },
                  hover: {
                    suf: ' label',
                    inner: 'i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox--checkbox input[disabled] + i`
                  }
                }
              },
              {
                key: 'checkboxCheckedClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox--checkbox input:checked + i`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox--checkbox`,
                    inner: 'input:checked + i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox--checkbox input:checked[disabled] + i`
                  }
                }
              },
              {
                key: 'checkboxLabelClassName',
                weights: {
                  default: {
                    suf: ' label',
                    inner: 'span'
                  },
                  hover: {
                    suf: ' label',
                    inner: 'span'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox--checkbox input[disabled] + i + span`
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
