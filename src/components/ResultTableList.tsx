/**
 * 结果表格(暂时不支持结果排序)
 */

import React from 'react';

import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from '../theme';
import {Option, Options} from './Select';
import {resolveVariable} from '../utils/tpl-builtin';
import {localeable} from '../locale';
import {autobind} from '../utils/helper';
import TransferSearch from './TransferSearch';

import {CloseIcon} from './icons';
import TableSelection from './TableSelection';

export interface ResultTableSelectionProps extends BaseSelectionProps {
  title?: string;
  placeholder?: string;
  searchable?: boolean;
  onSearch?: Function;
  columns: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
  cellRender: (
    column: {
      name: string;
      label: string;
      [propName: string]: any;
    },
    option: Option,
    colIndex: number,
    rowIndex: number
  ) => JSX.Element;
}

export interface ResultTableSelectionState {
  tableOptions: Options;
  searching: Boolean;
  searchTableOptions: Options;
}

export class BaseResultTableSelection extends BaseSelection<ResultTableSelectionProps, ResultTableSelectionState> {
  static defaultProps = {
    ...BaseSelection.defaultProps,
    cellRender: (
      column: {
        name: string;
        label: string;
        [propName: string]: any;
      },
      option: Option,
      colIndex: number,
      rowIndex: number
    ) => <span>{resolveVariable(column.name, option)}</span>,
  };

  state: ResultTableSelectionState = {
    tableOptions: [],
    searching: false,
    searchTableOptions: []
  }

  static getDerivedStateFromProps(props: ResultTableSelectionProps) {
    const {
      options,
      value,
      option2value,
    } = props;
    const valueArray = BaseSelection.value2array(value, options, option2value);
    return {
      tableOptions: valueArray
    }
  }

  @autobind
  handleCloseItem(option: Option) {
    const {value, onChange, option2value, options, disabled} = this.props;

    const {searching, searchTableOptions} = this.state;

    if (disabled || option.disabled) {
      return;
    }

    // 删除普通值
    let valueArray = BaseSelection.value2array(value, options, option2value);

    let idx = valueArray.indexOf(option);
    valueArray.splice(idx, 1);
    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;
    onChange && onChange(newValue);

    if (searching) {
      const searchArray = BaseSelection.value2array(
        searchTableOptions,
        options,
        option2value
      );
      const searchIdx = searchArray.indexOf(option);
      searchTableOptions.splice(searchIdx, 1);
      this.setState({searchTableOptions});
    }
  }

  @autobind
  search(inputValue: string) {
    // 结果为空，直接清空
    if (!inputValue) {
      this.clearSearch();
      return;
    }

    const {value, onSearch} = this.props;
    const searchOptions = ((value || []) as Options)
      .filter(item => onSearch?.(inputValue, item));

    this.setState({
      searching: true,
      searchTableOptions: searchOptions
    });
  }
  
  @autobind
  clearSearch() {
    this.setState({
      searching: false,
      searchTableOptions: []
    });
  }

  renderTable() {
    const {
      classnames: cx,
      className,
      columns,
      cellRender,
      value,
      disabled,
      option2value,
      onChange,
      translate: __,
      placeholder
    } = this.props;

    const {searching, tableOptions, searchTableOptions} = this.state;

    return (
      <div className={cx('ResultTableList', className)}>
        {
          Array.isArray(value) && value.length ?
          (
          <TableSelection
            columns={columns}
            options={!searching ? tableOptions : searchTableOptions}
            value={value}
            disabled={disabled}
            option2value={option2value}
            onChange={onChange}
            multiple={false}
            cellRender={(
              column: {
                name: string;
                label: string;
                [propName: string]: any;
              },
              option: Option,
              colIndex: number,
              rowIndex: number
            ) => {
              const raw = cellRender(column, option, colIndex, rowIndex);
              if (colIndex === columns.length - 1) {
                return (
                <>
                  {raw}
                  {
                    <span
                      className={cx('ResultTableList-close-btn')}
                      onClick={(e: React.SyntheticEvent<HTMLElement>) => {
                        e.stopPropagation();
                        this.handleCloseItem(option);
                      }}
                    >
                      <CloseIcon />
                    </span>
                  }
                </>)
              }
              return raw;
            }}
          />
          )
          : (<div className={cx('Selections-placeholder')}>{__(placeholder)}</div>)
        }
      </div>
    );
  }

  render() {
    const {
      classnames: cx,
      className,
      title,
      searchable,
      translate: __,
      placeholder = __('Transfer.searchKeyword')
    } = this.props;


    return (
      <div className={cx('Selections', className)}>
        {title ? <div className={cx('Selections-title')}>{title}</div> : null}
        {searchable ? (
          <TransferSearch
            placeholder={placeholder}
            onSearch={this.search}
            onCancelSearch={this.clearSearch}
          />
        ) : null}
        {this.renderTable()}
      </div>
    );
  }
}

export default themeable(localeable(BaseResultTableSelection));
