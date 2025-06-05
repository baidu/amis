import React from 'react';
import {ThemeProps, autobind, createObject, filter} from 'amis-core';
import Tabs, {Tab} from './Tabs';
import InputBox from './InputBox';
import TableCheckboxes from './TableSelection';
import Tree from './Tree';
import ChainedCheckboxes from './ChainedSelection';
import ListCheckboxes from './GroupedSelection';
import {Options, Option} from './Select';
import Transfer, {TransferProps} from './Transfer';
import {themeable} from 'amis-core';
import AssociatedCheckboxes from './AssociatedSelection';
import {localeable} from 'amis-core';
import {ItemRenderStates} from './Selection';
import {Icon} from './icons';
import debounce from 'lodash/debounce';
import {SpinnerExtraProps} from './Spinner';

export interface TabsTransferProps
  extends Omit<
      TransferProps,
      | 'selectMode'
      | 'columns'
      | 'selectRender'
      | 'statistics'
      | 'onSearch'
      | 'optionItemRender'
    >,
    SpinnerExtraProps,
    ThemeProps {
  onSearch: (
    term: string,
    option: Option,
    setCancel: (cancel: () => void) => void
  ) => Promise<Options | void>;
  optionItemRender?: (
    option: Option,
    states: ItemRenderStates,
    tab: Option
  ) => JSX.Element;
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
  onTabChange: (key: number) => void;
  activeKey: number;
  onlyChildren?: boolean;
  ctx?: Record<string, any>;
  selectMode?: 'table' | 'list' | 'tree' | 'chained' | 'associated';
  searchable?: boolean;
  /**
   * 是否默认都展开
   */
  initiallyOpen?: boolean;
}

export interface TabsTransferState {
  inputValue: string;
  searchResult: Options | null;
}

export class TabsTransfer extends React.Component<
  TabsTransferProps,
  TabsTransferState
> {
  static defaultProps = {
    multiple: true,
    onlyChildren: true
  };

  state = {
    inputValue: '',
    searchResult: null
  };

  unmounted = false;
  cancelSearch?: () => void;

  componentWillUnmount() {
    this.lazySearch.cancel();
    this.unmounted = true;
  }

  @autobind
  handleSearch(text: string, option: Option) {
    // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
    if (text) {
      this.setState(
        {
          inputValue: text
        },
        () => {
          // 如果有取消搜索，先取消掉。
          this.cancelSearch && this.cancelSearch();
          this.lazySearch(text, option);
        }
      );
    } else {
      this.handleSeachCancel();
    }
  }

  @autobind
  handleSeachCancel() {
    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  lazySearch = debounce(
    (text: string, option: Option) => {
      (async (text: string) => {
        const onSearch = this.props.onSearch;
        let result = await onSearch(
          text,
          option,
          (cancelExecutor: () => void) => (this.cancelSearch = cancelExecutor)
        );

        if (this.unmounted) {
          return;
        }

        if (!Array.isArray(result)) {
          throw new Error('onSearch 需要返回数组');
        }
        this.setState({
          searchResult: result
        });
      })(text).catch(e => console.error(e));
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

  @autobind
  handleSearchKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  @autobind
  handleTabChange(key: number) {
    this.props?.onTabChange?.(key);

    this.handleSeachCancel();
  }

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
      cellRender,
      optionItemRender,
      itemHeight,
      virtualThreshold,
      onlyChildren,
      selectMode,
      loadingConfig,
      activeKey,
      options: optionsConfig,
      valueField = 'value',
      labelField = 'label',
      testIdBuilder
    } = this.props;
    const options = searchResult || [];
    const mode = searchResultMode || selectMode; // 没有配置时默认和左侧选项展示形式一致
    const searchTIB = testIdBuilder?.getChild('search-result');

    const activeTab = optionsConfig[activeKey];
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
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        testIdBuilder={searchTIB}
      />
    ) : mode === 'tree' ? (
      <Tree
        placeholder={noResultsText}
        className={cx('Transfer-checkboxes')}
        options={options}
        value={value}
        disabled={disabled}
        onChange={onChange!}
        joinValues={false}
        onlyChildren={onlyChildren}
        showIcon={false}
        multiple={true}
        cascade={true}
        autoCheckChildren={activeTab.autoCheckChildren}
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'result'
                })
            : undefined
        }
        valueField={valueField}
        labelField={labelField}
        testIdBuilder={searchTIB}
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
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'result'
                })
            : undefined
        }
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        testIdBuilder={searchTIB}
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
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'result'
                })
            : undefined
        }
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        testIdBuilder={searchTIB}
      />
    );
  }

  @autobind
  renderSelect() {
    const {
      options,
      placeholder,
      activeKey,
      classnames: cx,
      translate: __,
      ctx,
      mobileUI,
      searchable,
      testIdBuilder
    } = this.props;
    const showOptions = options.filter(item => item.visible !== false);

    if (!Array.isArray(options) || !options.length) {
      return (
        <div className={cx('TabsTransfer-placeholder')}>
          {__(placeholder || 'placeholder.noOption')}
        </div>
      );
    }

    return (
      <Tabs
        mode="line"
        className={cx('TabsTransfer-tabs')}
        onSelect={this.handleTabChange}
        activeKey={activeKey}
        testIdBuilder={testIdBuilder?.getChild('tabs')}
      >
        {showOptions.map((option, index) => (
          <Tab
            eventKey={index}
            key={index}
            title={filter(
              option.label || option.title,
              createObject(ctx, option)
            )}
            className="TabsTransfer-tab"
            testIdBuilder={testIdBuilder?.getChild(`tab-${index}`)}
          >
            {option.searchable || searchable ? (
              <div
                className={cx('TabsTransfer-search', {'is-mobile': mobileUI})}
              >
                <InputBox
                  value={this.state.inputValue}
                  onChange={(text: string) => this.handleSearch(text, option)}
                  placeholder={__('Transfer.searchKeyword')}
                  clearable={false}
                  onKeyDown={this.handleSearchKeyDown}
                >
                  {this.state.searchResult !== null ? (
                    <a onClick={this.handleSeachCancel}>
                      <Icon icon="close" className="icon" />
                    </a>
                  ) : (
                    <Icon icon="search" className="icon" />
                  )}
                </InputBox>
              </div>
            ) : null}
            {this.state.searchResult !== null
              ? this.renderSearchResult(this.state.searchResult)
              : this.renderOptions(option)}
          </Tab>
        ))}
      </Tabs>
    );
  }

  @autobind
  renderOptions(option: Option) {
    const {
      classnames: cx,
      value,
      disabled,
      multiple,
      onChange,
      option2value,
      onDeferLoad,
      onLeftDeferLoad,
      cellRender,
      translate: __,
      optionItemRender,
      itemHeight,
      virtualThreshold,
      onlyChildren,
      loadingConfig,
      initiallyOpen = true,
      valueField = 'value',
      labelField = 'label',
      deferField = 'defer',
      testIdBuilder
    } = this.props;
    const selectMode = option.selectMode || this.props.selectMode;
    const selTIB = testIdBuilder?.getChild('selection');

    return selectMode === 'table' ? (
      <TableCheckboxes
        className={cx('Transfer-checkboxes')}
        columns={option.columns as any}
        options={option.children || []}
        value={value}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        cellRender={cellRender}
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        testIdBuilder={selTIB}
      />
    ) : selectMode === 'tree' ? (
      <Tree
        loadingConfig={loadingConfig}
        className={cx('Transfer-checkboxes')}
        options={option.children || []}
        value={value}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange!}
        joinValues={false}
        showIcon={false}
        onlyChildren={option.onlyChildren ?? onlyChildren}
        cascade={true}
        onDeferLoad={onDeferLoad}
        autoCheckChildren={option.autoCheckChildren}
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'tab',
                  tag: option
                })
            : undefined
        }
        // itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        initiallyOpen={initiallyOpen}
        testIdBuilder={selTIB}
      />
    ) : selectMode === 'chained' ? (
      <ChainedCheckboxes
        className={cx('Transfer-checkboxes')}
        options={option.children || []}
        value={value}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        defaultSelectedIndex={option.defaultSelectedIndex}
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'tab',
                  tag: option
                })
            : undefined
        }
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        testIdBuilder={selTIB}
      />
    ) : selectMode === 'associated' ? (
      <AssociatedCheckboxes
        className={cx('Transfer-checkboxes')}
        options={option.children || []}
        value={value}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        onLeftDeferLoad={onLeftDeferLoad}
        leftMode={option.leftMode}
        leftOptions={option.leftOptions}
        leftDefaultValue={option.leftDefaultValue}
        loadingConfig={loadingConfig}
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'tab',
                  tag: option
                })
            : undefined
        }
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        deferField={deferField}
        testIdBuilder={selTIB}
      />
    ) : (
      <ListCheckboxes
        className={cx('Transfer-checkboxes')}
        options={option.children || []}
        value={value}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        option2value={option2value}
        onDeferLoad={onDeferLoad}
        itemRender={
          optionItemRender
            ? (item: Option, states: ItemRenderStates) =>
                optionItemRender(item, states, {
                  panel: 'tab',
                  tag: option
                })
            : undefined
        }
        itemHeight={itemHeight}
        virtualThreshold={virtualThreshold}
        valueField={valueField}
        labelField={labelField}
        testIdBuilder={selTIB}
      />
    );
  }

  render() {
    const {
      className,
      classnames: cx,
      optionItemRender,
      onSearch,
      mobileUI,
      ...reset
    } = this.props;

    return (
      <Transfer
        {...reset}
        mobileUI={mobileUI}
        statistics={false}
        classnames={cx}
        className={cx('TabsTransfer', className)}
        selectRender={this.renderSelect}
      />
    );
  }
}

export default themeable(localeable(TabsTransfer));
