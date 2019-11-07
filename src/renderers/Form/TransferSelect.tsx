import React from 'react';
import {OptionsControl, OptionsControlProps, Option} from './Options';
import {xorBy, find} from 'lodash';
import Checkbox from '../../components/Checkbox';
import {closeIcon, Icon} from '../../components/icons';
import {Spinner} from '../../components';

export interface TransferSelectProps extends OptionsControlProps {
  viewMode?: 'table' | 'normal';
  labelField: string;
  valueField: string;
  searchField: string;
  searchPlaceholder: string;
  columns: Array<any>;
  allTitle: string;
  selectedTitle: string;
  searchable: boolean;
}

export interface TransferSelectState {
  filteredOptions: Array<Option>;
  keyword: string;
}

export class TransferSelect extends React.Component<
  TransferSelectProps,
  TransferSelectState
> {
  static defaultProps = {
    viewMode: 'normal',
    multiple: true,
    labelField: 'label',
    valueField: 'value',
    searchField: 'label',
    searchPlaceholder: '请输入关键字',
    allTitle: '全部',
    selectedTitle: '已选',
    columns: [],
    searchable: true
  };

  constructor(props: TransferSelectProps) {
    super(props);
    this.state = {
      filteredOptions: [],
      keyword: ''
    };
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const {options} = this.props;

    if (options && Array.isArray(options)) {
      this.setState({
        filteredOptions: options
      });
    }
  }

  componentDidUpdate(prevProps: TransferSelectProps) {
    const {options} = this.props;

    if (options && prevProps.options !== options) {
      this.setState({
        filteredOptions: options,
        keyword: ''
      });
    }
  }

  handleCheck(checkedItem: Option | any) {
    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    let newValue: any =
      selectedOptions.length === 0
        ? [checkedItem]
        : xorBy(selectedOptions.concat(), [checkedItem], valueField || 'value');

    if (joinValues) {
      newValue = newValue
        .map((item: any) => item[valueField || 'value'])
        .join(delimiter || ',');
    } else if (extractValue) {
      newValue = newValue.map((item: any) => item[valueField || 'value']);
    }

    onChange(newValue);
  }

  handleCheckAll() {
    const {filteredOptions} = this.state;

    const {
      selectedOptions,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

    let newValue;

    if (selectedOptions.length === filteredOptions.length) {
      newValue = '';
    } else {
      newValue = joinValues
        ? filteredOptions
            .map((item: any) => item[valueField || 'value'])
            .join(delimiter || '')
        : extractValue
        ? filteredOptions.map((item: any) => item[valueField || 'value'])
        : filteredOptions;
    }

    onChange(newValue);
  }

  handleClear() {
    this.props.onChange('');
  }

  handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const {viewMode, searchField, options} = this.props;

    let newOptions = [];
    const keyword = e.target.value.toLowerCase();

    if (keyword === '') {
      newOptions = options;
    } else {
      newOptions = options.filter((option: Option) => {
        return (
          (option[viewMode === 'table' ? searchField : 'label'] as string)
            .toLowerCase()
            .indexOf(keyword) > -1
        );
      });
    }
    this.setState({
      filteredOptions: newOptions,
      keyword
    });
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  renderTable() {
    const {filteredOptions} = this.state;

    const {
      classnames: cx,
      classPrefix: ns,
      selectedOptions,
      columns,
      allTitle,
      searchable,
      searchPlaceholder,
      valueField
    } = this.props;

    return (
      <div
        className={cx(
          'TransferSelect-allOptions',
          'TransferSelect-allOptions--table'
        )}
      >
        <div className={cx('TransferSelect-heading')}>
          <span>{`${allTitle}（${selectedOptions.length}/${
            filteredOptions.length
          }）`}</span>
          {searchable ? (
            <div className={cx('TransferSelect-searchWrapper')}>
              <div className={cx('TextControl-input')}>
                <input
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  value={this.state.keyword}
                  onChange={this.handleSearch}
                />
                <i className="fa fa-search" />
              </div>
            </div>
          ) : null}
        </div>
        <div className={cx('TransferSelect-body')}>
          <table className={cx('Table-table')}>
            <thead>
              <tr>
                <th className={cx('Table-checkCell')}>
                  <Checkbox
                    classPrefix={ns}
                    partial={selectedOptions.length !== filteredOptions.length}
                    checked={selectedOptions.length > 0}
                    onChange={this.handleCheckAll}
                  />
                </th>
                {columns.map((column: any, columnIndex: number) => (
                  <th key={columnIndex}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOptions.map((option, optionIndex) => (
                <tr
                  className={cx({
                    [`${ns}Table-tr--odd`]: optionIndex % 2 === 0,
                    [`${ns}Table-tr--even`]: optionIndex % 2 === 1
                  })}
                  key={optionIndex}
                >
                  <td>
                    <Checkbox
                      classPrefix={ns}
                      value={false}
                      checked={find(selectedOptions, (selectedOption: any) => {
                        return (
                          selectedOption[valueField || 'value'] ===
                          option[valueField || 'value']
                        );
                      })}
                      onChange={this.handleCheck.bind(this, option)}
                    />
                  </td>
                  {columns.map((column: any, columnIndex: number) => {
                    let text = option[column.name] + '';
                    return <td key={columnIndex}>{text}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderNormal() {
    const {filteredOptions} = this.state;

    const {
      classnames: cx,
      classPrefix: ns,
      selectedOptions,
      allTitle,
      searchable,
      searchPlaceholder,
      labelField,
      valueField
    } = this.props;

    return (
      <div
        className={cx(
          'TransferSelect-allOptions',
          'TransferSelect-allOptions--normal'
        )}
      >
        <div className={cx('TransferSelect-heading')}>
          <span>{`${allTitle}（${selectedOptions.length}/${
            filteredOptions.length
          }）`}</span>
          {selectedOptions.length < filteredOptions.length ? (
            <span
              onClick={this.handleCheckAll}
              className={cx('TransferSelect-selectAll')}
            >
              全部选择
            </span>
          ) : null}
        </div>
        <div className={cx('TransferSelect-body')}>
          {searchable ? (
            <div className={cx('TransferSelect-searchWrapper')}>
              <div className={cx('TextControl-input')}>
                <input
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  onChange={this.handleSearch}
                />
                <i className="fa fa-search" />
              </div>
            </div>
          ) : null}
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option: any, optionIndex: number) => (
                <li key={optionIndex}>
                  <Checkbox
                    classPrefix={ns}
                    checked={
                      !!find(selectedOptions, (selectedOption: any) => {
                        return (
                          selectedOption[valueField || 'value'] ===
                          option[valueField || 'value']
                        );
                      })
                    }
                    onChange={this.handleCheck.bind(this, option)}
                  >
                    {option[labelField || 'label']}
                  </Checkbox>
                </li>
              ))
            ) : (
              <li>暂无数据</li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  renderAction() {
    const {classnames: cx} = this.props;

    return (
      <div className={cx('TransferSelect-action')}>
        <span className={cx('TransferSelect-actionIcon')} />
      </div>
    );
  }

  renderTableSelectedOptions() {
    const {
      classnames: cx,
      selectedOptions,
      selectedTitle,
      labelField,
      columns
    } = this.props;

    return (
      <div
        className={cx(
          'TransferSelect-selectedOptions',
          'TransferSelect-selectedOptions--table'
        )}
      >
        <div className={cx('TransferSelect-heading')}>
          <span>{`${selectedTitle}（${selectedOptions.length}）`}</span>
          {selectedOptions.length > 0 ? (
            <span
              onClick={this.handleClear}
              className={cx('TransferSelect-clearAll')}
            >
              全部清除
            </span>
          ) : null}
        </div>
        <div className={cx('TransferSelect-body')}>
          <table className={cx('Table-table')}>
            <thead>
              <tr>
                <th>
                  {find(columns, column => column.name === labelField).label}
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedOptions.map((option: Option, optionIndex: number) => (
                <tr className={cx('Table-tr--odd')} key={optionIndex}>
                  <td>
                    {option[labelField || 'label']}
                    <a
                      onClick={this.handleCheck.bind(this, option)}
                      className={cx('TransferSelect-option-close')}
                    >
                      <Icon icon="close" className="icon" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderNormalSelectedOptions() {
    const {
      classnames: cx,
      selectedOptions,
      selectedTitle,
      labelField
    } = this.props;

    return (
      <div
        className={cx(
          'TransferSelect-selectedOptions',
          'TransferSelect-selectedOptions--normal'
        )}
      >
        <div className={cx('TransferSelect-heading')}>
          <span>{`${selectedTitle}（${selectedOptions.length}）`}</span>
          {selectedOptions.length > 0 ? (
            <span
              onClick={this.handleClear}
              className={cx('TransferSelect-clearAll')}
            >
              全部清除
            </span>
          ) : null}
        </div>
        <div className={cx('TransferSelect-body')}>
          <ul>
            {selectedOptions.map((option: any, optionIndex: number) => (
              <li key={optionIndex}>
                {option[labelField || 'label']}
                <a
                  onClick={this.handleCheck.bind(this, option)}
                  className={cx('TransferSelect-option-close')}
                >
                  {closeIcon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const {className, classnames: cx, render, viewMode, loading} = this.props;
    return (
      <div className={cx('TransferSelectControl', className)}>
        {viewMode === 'table' ? this.renderTable() : this.renderNormal()}

        {this.renderAction()}

        {viewMode === 'table'
          ? this.renderTableSelectedOptions()
          : this.renderNormalSelectedOptions()}

        <Spinner size="lg" overlay key="info" show={loading} />
      </div>
    );
  }
}

@OptionsControl({
  type: 'transfer-select'
})
export class TransferSelectControlRenderer extends TransferSelect {}
