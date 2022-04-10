import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import Radios from '../../components/Radios';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import {autobind, isEmpty, createObject} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';
import {Action} from '../../types';

/**
 * Radio 单选框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/radios
 */
export interface RadiosControlSchema extends FormOptionsControl {
  type: 'radios';

  /**
   * 每行显示多少个
   */
  columnsCount?: number;
}

export interface RadiosProps extends OptionsControlProps {
  placeholder?: any;
  columnsCount?: number;
  labelClassName?: string;
  labelField?: string;
}

export default class RadiosControl extends React.Component<RadiosProps, any> {
  static defaultProps: Partial<RadiosProps> = {
    columnsCount: 1
  };

  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (!!~['clear', 'reset'].indexOf(actionType)) {
      onChange(resetValue ?? '');
    }
  }

  @autobind
  async handleChange(option: Option) {
    const {joinValues, extractValue, valueField, onChange, dispatchEvent, options, data} = this.props;

    if (option && (joinValues || extractValue)) {
      option = option[valueField || 'value'];
    }

    const rendererEvent = await dispatchEvent('change',
      createObject(data, {
        value: option,
        options,
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(option);
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  render() {
    const {
      className,
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
      labelField,
      valueField,
      translate: __,
      optionType,
      level
    } = this.props;

    return (
      <Radios
        inline={inline || formMode === 'inline'}
        className={cx(`${ns}RadiosControl`, className)}
        value={typeof value === 'undefined' || value === null ? '' : value}
        disabled={disabled}
        onChange={this.handleChange}
        joinValues={joinValues}
        extractValue={extractValue!}
        delimiter={delimiter!}
        labelClassName={labelClassName}
        labelField={labelField}
        valueField={valueField}
        placeholder={__(placeholder)}
        options={options}
        columnsCount={columnsCount}
        classPrefix={classPrefix}
        itemClassName={itemClassName}
        optionType={optionType}
        level={level}
      />
    );
  }
}

@OptionsControl({
  type: 'radios',
  sizeMutable: false
})
export class RadiosControlRenderer extends RadiosControl {
  static defaultProps = {
    multiple: false,
    inline: true
  };
}
