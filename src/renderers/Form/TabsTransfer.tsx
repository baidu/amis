import {OptionsControlProps, OptionsControl} from './Options';
import React from 'react';
import Transfer from '../../components/Transfer';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import {TransferRenderer} from './Transfer';
import {autobind} from '../../utils/helper';
import Tabs, {Tab} from '../../components/Tabs';
import {Icon} from '../../components/icons';
import TableCheckboxes from '../../components/TableCheckboxes';
import TreeCheckboxes from '../../components/TreeCheckboxes';
import ListCheckboxes from '../../components/ListCheckboxes';
import SearchBox from '../../components/SearchBox';
import {Options} from '../../components/Select';
import NestedCheckboxes from '../../components/NestedCheckboxes';

export interface TabsTransferProps extends OptionsControlProps {
  sortable?: boolean;
  searchable?: boolean;
  searchApi?: Api;
  searchResultMode?: 'table' | 'list' | 'tree' | 'nested';
}

@OptionsControl({
  type: 'tabs-transfer'
})
export class TabsTransferRenderer extends TransferRenderer<TabsTransferProps> {
  renderSearchResult(searchResult: Options | null) {
    const {
      searchResultMode,
      selectMode,
      noResultsText,
      searchResultColumns,
      classnames: cx,
      value,
      onChange,
      option2value
    } = this.props;
    const options = searchResult || [];
    const mode = searchResultMode || selectMode;

    return mode === 'table' ? (
      <TableCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        columns={searchResultColumns!}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : mode === 'tree' ? (
      <TreeCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : mode === 'nested' ? (
      <NestedCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        onChange={onChange}
        option2value={option2value}
      />
    ) : (
      <ListCheckboxes
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
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
      labelField,
      selectedOptions,
      searchable
    } = this.props;

    if (!Array.isArray(options) || !options.length) {
      return <div>{placeholder || '暂无可选项'}</div>;
    }

    return (
      <Tabs
        mode="card"
        className={cx('Transfer-tabs')}
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
              <Tab title="搜索结果" key={0} eventKey={0}>
                {this.renderSearchResult(searchResult)}
              </Tab>
            ]
          : options.map((option, index) => (
              <Tab
                eventKey={index}
                key={index}
                title={option[labelField || 'label'] || option.title}
              >
                {option.selectMode === 'table' ? (
                  <TableCheckboxes
                    className={cx('Transfer-checkboxes')}
                    columns={option.columns as any}
                    options={option.children || []}
                    value={selectedOptions}
                    onChange={this.handleChange}
                    option2value={this.option2value}
                  />
                ) : option.selectMode === 'tree' ? (
                  <TreeCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={selectedOptions}
                    onChange={this.handleChange}
                    option2value={this.option2value}
                  />
                ) : option.selectMode === 'nested' ? (
                  <NestedCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={selectedOptions}
                    onChange={this.handleChange}
                    option2value={this.option2value}
                  />
                ) : (
                  <ListCheckboxes
                    className={cx('Transfer-checkboxes')}
                    options={option.children || []}
                    value={selectedOptions}
                    onChange={this.handleChange}
                    option2value={this.option2value}
                  />
                )}
              </Tab>
            ))}
      </Tabs>
    );
  }

  render() {
    const {
      className,
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      selectMode,
      columns,
      loading,
      searchable,
      searchResultMode
    } = this.props;

    return (
      <div className={cx('TabsTransferControl', className)}>
        <Transfer
          statistics={false}
          className="TabsTransfer"
          selectRender={this.renderSelect}
          value={selectedOptions}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          selectMode={selectMode}
          searchResultMode={searchResultMode}
          columns={columns}
          onSearch={searchable ? this.handleSearch : undefined}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
