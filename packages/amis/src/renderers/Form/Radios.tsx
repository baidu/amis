import React from 'react';
import cx from 'classnames';
import {Radios} from 'amis-ui';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl,
  resolveEventData,
  TestIdBuilder,
  getVariable,
  setThemeClassName,
  CustomStyle
} from 'amis-core';
import {autobind, isEmpty, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';
import {filter} from 'amis-core';

/**
 * Radio 单选框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/radios
 */
export interface RadiosControlSchema extends FormOptionsSchema {
  type: 'radios';

  /**
   * 每行显示多少个
   */
  columnsCount?: number;
}

export interface RadiosProps extends OptionsControlProps {
  placeholder?: any;
  columnsCount?: number;
  labelField?: string;
  /**
   * @deprecated 和checkbox的labelClassName有冲突，请用optionClassName代替
   */
  labelClassName?: string;
  /** 选项CSS类名 */
  optionClassName?: string;
  testIdBuilder?: TestIdBuilder;
}

export default class RadiosControl extends React.Component<RadiosProps, any> {
  static defaultProps: Partial<RadiosProps> = {
    columnsCount: 1
  };

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange?.(pristineVal ?? '');
    }
  }

  @autobind
  async handleChange(option: Option) {
    const {
      joinValues,
      extractValue,
      valueField,
      onChange,
      dispatchEvent,
      options,
      selectedOptions
    } = this.props;
    let value = option;

    if (option && (joinValues || extractValue)) {
      value = option[valueField || 'value'];
    }

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value,
        options,
        items: options, // 为了保持名字统一
        selectedItems: option
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(value);
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  @autobind
  renderLabel(option: Option, {labelField}: any) {
    const {data} = this.props;
    const label = option[labelField || 'label'];
    return <>{typeof label === 'string' ? filter(label, data) : `${label}`}</>;
  }

  formateThemeCss(themeCss: any) {
    if (!themeCss) {
      return {};
    }
    const {radiosClassName = {}} = themeCss;
    const defaultThemeCss: any = {};
    const checkedThemeCss: any = {};
    Object.keys(radiosClassName).forEach(key => {
      if (key.includes('checked-')) {
        const newKey = key.replace('checked-', '');
        checkedThemeCss[newKey] = radiosClassName[key];
      } else if (key.includes('radios-')) {
        const newKey = key.replace('radios-', '');
        defaultThemeCss[newKey] = radiosClassName[key];
      }
    });

    return {
      ...themeCss,
      radiosClassName: defaultThemeCss,
      radiosCheckedClassName: checkedThemeCss
    };
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      classPrefix: ns,
      value,
      onChange,
      disabled,
      joinValues,
      extractValue,
      delimiter,
      placeholder,
      options,
      inline = true,
      formMode,
      columnsCount,
      classPrefix,
      itemClassName,
      labelClassName,
      optionClassName,
      labelField,
      valueField,
      data,
      translate: __,
      optionType,
      level,
      testIdBuilder,
      themeCss,
      id,
      env
    } = this.props;

    const css = this.formateThemeCss(themeCss);

    return (
      <>
        <Radios
          inline={inline || formMode === 'inline'}
          className={cx(
            `${ns}RadiosControl`,
            className,
            setThemeClassName({
              ...this.props,
              name: 'radiosClassName',
              id,
              themeCss: css
            }),
            setThemeClassName({
              ...this.props,
              name: 'radiosCheckedInnerClassName',
              id,
              themeCss: css
            }),
            setThemeClassName({
              ...this.props,
              name: 'radiosCheckedClassName',
              id,
              themeCss: css
            }),
            setThemeClassName({
              ...this.props,
              name: 'radiosLabelClassName',
              id,
              themeCss: css
            })
          )}
          value={typeof value === 'undefined' || value === null ? '' : value}
          disabled={disabled}
          onChange={this.handleChange}
          joinValues={joinValues}
          extractValue={extractValue!}
          delimiter={delimiter!}
          /** 兼容一下错误的用法 */
          labelClassName={optionClassName ?? labelClassName}
          labelField={labelField}
          valueField={valueField}
          placeholder={__(placeholder)}
          options={options}
          renderLabel={this.renderLabel}
          columnsCount={columnsCount}
          classPrefix={classPrefix}
          itemClassName={itemClassName}
          optionType={optionType}
          level={level}
          testIdBuilder={testIdBuilder}
        />
        <CustomStyle
          {...this.props}
          config={{
            themeCss: this.formateThemeCss(themeCss),
            classNames: [
              {
                key: 'radiosClassName',
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
                    inner: `.${ns}Checkbox--radio input[disabled] + i`
                  }
                }
              },
              {
                key: 'radiosCheckedClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox--radio input:checked + i`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox--radio`,
                    inner: 'input:checked + i'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox--radio input:checked[disabled] + i`
                  }
                }
              },
              {
                key: 'radiosCheckedInnerClassName',
                weights: {
                  default: {
                    inner: `.${ns}Checkbox--radio input:checked + i:before`
                  },
                  hover: {
                    suf: ` .${ns}Checkbox--radio`,
                    inner: 'input:checked + i:before'
                  },
                  disabled: {
                    inner: `.${ns}Checkbox--radio input:checked[disabled] + i:before`
                  }
                }
              },
              {
                key: 'radiosLabelClassName',
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
                    inner: `.${ns}Checkbox--radio input[disabled] + i + span`
                  }
                }
              }
            ],
            id: id
          }}
          env={env}
        />
      </>
    );
  }
}

@OptionsControl({
  type: 'radios',
  sizeMutable: false,
  thin: true
})
export class RadiosControlRenderer extends RadiosControl {
  static defaultProps = {
    multiple: false,
    inline: true
  };
}
