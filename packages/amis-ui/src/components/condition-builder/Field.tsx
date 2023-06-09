import React from 'react';
import {ThemeProps, themeable, localeable, LocaleProps} from 'amis-core';
import {SpinnerExtraProps} from '../Spinner';
import DropDownSelection from '../DropDownSelection';
import ChainedDropdownSelection from '../ChainedDropdownSelection';

export interface ConditionFieldProps
  extends ThemeProps,
    LocaleProps,
    SpinnerExtraProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  fieldClassName?: string;
  searchable?: boolean;
  popOverContainer?: any;
  selectMode?: 'list' | 'tree' | 'chained';
}

export interface FieldState {
  searchText: string;
}

const option2value = (item: any) => item.name;

export class ConditionField extends React.Component<
  ConditionFieldProps,
  FieldState
> {
  render() {
    const {
      onChange,
      value,
      classnames: cx,
      disabled,
      translate,
      searchable,
      selectMode = 'list',
      options,
      loadingConfig
    } = this.props;

    return selectMode === 'chained' ? (
      <ChainedDropdownSelection
        multiple={false}
        classnames={cx}
        translate={translate}
        options={options}
        value={value}
        valueField="name"
        option2value={option2value}
        searchable={searchable}
        disabled={disabled}
        onChange={(value: any) => {
          onChange(Array.isArray(value) ? value[0] : value);
        }}
      />
    ) : selectMode === 'tree' ? (
      <DropDownSelection
        className={'is-scrollable'}
        classnames={cx}
        translate={translate}
        multiple={false}
        option2value={option2value}
        searchable={searchable}
        disabled={disabled}
        valueField={'name'}
        mode={'tree'}
        options={options}
        value={value}
        loadingConfig={loadingConfig}
        onChange={(value: any) => {
          onChange(value);
        }}
      />
    ) : (
      <DropDownSelection
        classnames={cx}
        translate={translate}
        options={options}
        value={value}
        valueField={'name'}
        option2value={option2value}
        searchable={searchable}
        disabled={disabled}
        onChange={(value: any) =>
          onChange(Array.isArray(value) ? value[0] : value)
        }
      />
    );
  }
}

export default themeable(localeable(ConditionField));
