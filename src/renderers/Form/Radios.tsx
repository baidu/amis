import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import Radios from '../../components/Radios';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import {autobind, isEmpty} from '../../utils/helper';
import {dataMapping} from '../../utils/tpl-builtin';

export interface RadiosProps extends OptionsControlProps {
  placeholder?: any;
  columnsCount?: number;
  labelClassName?: string;
}

export default class RadiosControl extends React.Component<RadiosProps, any> {
  static defaultProps: Partial<RadiosProps> = {
    columnsCount: 1
  };

  @autobind
  handleChange(option: Option) {
    const {
      joinValues,
      extractValue,
      valueField,
      onChange,
      autoFill,
      onBulkChange
    } = this.props;

    const sendTo =
      autoFill && !isEmpty(autoFill) && dataMapping(autoFill, option);
    sendTo && onBulkChange && onBulkChange(sendTo);

    if (option && (joinValues || extractValue)) {
      option = option[valueField || 'value'];
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
      inline,
      formMode,
      columnsCount,
      classPrefix,
      itemClassName,
      labelClassName
    } = this.props;

    return (
      <Radios
        inline={inline || formMode === 'inline'}
        className={cx(`${ns}RadiosControl`, className)}
        value={typeof value === 'undefined' || value === null ? '' : value}
        disabled={disabled}
        onChange={this.handleChange}
        joinValues={joinValues}
        extractValue={extractValue}
        delimiter={delimiter}
        labelClassName={labelClassName}
        placeholder={placeholder}
        options={options}
        columnsCount={columnsCount}
        classPrefix={classPrefix}
        itemClassName={itemClassName}
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
    multiple: false
  };
}
