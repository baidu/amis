import React from 'react';
import {autobind} from '../utils/helper';
import Tabs, {Tab} from './Tabs';
import SearchBox from './SearchBox';
import TableCheckboxes from './TableSelection';
import TreeCheckboxes from './TreeSelection';
import ChainedCheckboxes from './ChainedSelection';
import ListCheckboxes from './GroupedSelection';
import {Options, Option} from './Select';
import Transfer, {TransferProps} from './Transfer';
import {themeable} from '../theme';
import AssociatedCheckboxes from './AssociatedSelection';
import {localeable} from '../locale';

export interface TabsTransferProps
  extends Omit<
    TransferProps,
    'selectMode' | 'columns' | 'selectRender' | 'statistics'
  > {
  cellRender?: (
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

export class TabsTransfer extends React.Component<TabsTransferProps> {
  static defaultProps = {
    itemRender: (option: Option) => <span>{option.label}</span>
  };

  renderSearchResult(searchResult: Options | null) {
    const {
      searchResultMode,
      noResultsText,
      searchResultColumns,
      classnames: cx,
      value,
      disabled,
      onChange,
      option2value,
      cellRender
    } = this.props;
    const options = searchResult || [];
    const mode = searchResultMode;

    return mode === 'table' ? (
      <TableCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        columns={searchResultColumns!}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        cellRender={cellRender}
      />
    ) : mode === 'tree' ? (
      <TreeCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
      />
    ) : mode === 'chained' ? (
      <ChainedCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
      />
    ) : (
      <ListCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
      />
    );
  }

  @autobind
  renderSelect({onSearch, onSearchCancel, searchResult}: any) {
    const {
      options,
      placeholder,
      classnames: cx,
      value,
      disabled,
      onChange,
      onSearch: searchable,
      option2value,
      onDeferLoad,
      cellRender,
      translate: __
    } = this.props;

    if (!Array.isArray(options) || !options.length) {
      return (
        <div className={cx('TabsTransfer-placeholder')}>
          {__(placeholder || 'placeholder.noOption')}
        </div>
      );
    }

    return (
      <Tabs
        mode="card"
        className={cx('TabsTransfer-tabs')}
        activeKey={searchResult !== null ? 0 : undefined}
        toolbar={
          searchable ? (
            <>
              <span className={cx('TabsTransfer-tabsMid')}></span>
              <SearchBox onSearch={onSearch} onCancel={onSearchCancel} />
            </>
          ) : null
        }
      >
        {searchResult !== null
          ? [
              <Tab
                className="TabsTransfer-tab"
                title={__('searchResult')}
                key={0}
                eventKey={0}
              >
                {this.renderSearchResult(searchResult)}
              </Tab>
            ]
          : options.map((option, index) => (
              <Tab
                eventKey={index}
                key={index}
                title={option.label || option.title}
                className="TabsTransfer-tab"
              >
                {option.selectMode === 'table' ? (
                  <TableCheckboxes
                    className={cx('Transfer-checkboxes')}
                    columns={option.columns as any}
                    options={option.children || []}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    option2value={option2value}
                    onDeferLoad={onDeferLoad}
                    cellRender={cellRender}
                  />
                ) : option.selectMode === 'tree' ? (
                  <TreeCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    option2value={option2value}
                    onDeferLoad={onDeferLoad}
                  />
                ) : option.selectMode === 'chained' ? (
                  <ChainedCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    option2value={option2value}
                    onDeferLoad={onDeferLoad}
                    defaultSelectedIndex={option.defaultSelectedIndex}
                  />
                ) : option.selectMode === 'associated' ? (
                  <AssociatedCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    option2value={option2value}
                    onDeferLoad={onDeferLoad}
                    leftMode={option.leftMode}
                    leftOptions={option.leftOptions}
                    leftDefaultValue={option.leftDefaultValue}
                  />
                ) : (
                  <ListCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    option2value={option2value}
                    onDeferLoad={onDeferLoad}
                  />
                )}
              </Tab>
            ))}
      </Tabs>
    );
  }

  render() {
    const {className, classnames: cx} = this.props;

    return (
      <Transfer
        {...this.props}
        statistics={false}
        className={cx('TabsTransfer', className)}
        selectRender={this.renderSelect}
      />
    );
  }
}

export default themeable(localeable(TabsTransfer));
