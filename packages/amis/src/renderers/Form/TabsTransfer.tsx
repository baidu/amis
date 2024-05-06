import {
  OptionsControlProps,
  OptionsControl,
  resolveEventData,
  getVariable
} from 'amis-core';
import React from 'react';
import find from 'lodash/find';
import {Spinner, SpinnerExtraProps} from 'amis-ui';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import {TabsTransfer} from 'amis-ui';
import {Option, optionValueCompare} from 'amis-core';
import {
  autobind,
  string2regExp,
  filterTree,
  createObject,
  findTreeIndex,
  getTree,
  spliceTree
} from 'amis-core';
import {BaseSelection} from 'amis-ui/lib/components/Selection';
import {ActionObject, toNumber} from 'amis-core';
import type {ItemRenderStates} from 'amis-ui/lib/components/Selection';
import {supportStatic} from './StaticHoc';
import {matchSorter} from 'match-sorter';

/**
 * TabsTransfer
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/tabs-transfer
 */
export interface TabsTransferControlSchema
  extends Omit<TransferControlSchema, 'type'>,
    SpinnerExtraProps {
  type: 'tabs-transfer';
}

export interface TabsTransferProps
  extends OptionsControlProps,
    Omit<
      TabsTransferControlSchema,
      | 'type'
      | 'options'
      | 'inputClassName'
      | 'className'
      | 'descriptionClassName'
    >,
    SpinnerExtraProps {}

interface BaseTransferState {
  activeKey: number;
}

export class BaseTabsTransferRenderer<
  T extends OptionsControlProps = TabsTransferProps
> extends BaseTransferRenderer<T> {
  state: BaseTransferState = {
    activeKey: 0
  };

  @autobind
  async onTabChange(key: number) {
    const {dispatchEvent} = this.props;
    const rendererEvent = await dispatchEvent('tab-change', {key});
    if (rendererEvent?.prevented) {
      return;
    }
    this.setState({
      activeKey: key
    });
  }

  @autobind
  async handleTabSearch(
    term: string,
    option: Option,
    cancelExecutor: Function
  ) {
    const {
      options,
      labelField,
      valueField,
      env,
      data,
      searchApi,
      translate: __
    } = this.props;

    if (searchApi) {
      try {
        const payload = await env.fetcher(
          searchApi,
          createObject(data, {term}),
          {
            cancelExecutor
          }
        );

        if (!payload.ok) {
          throw new Error(__(payload.msg || 'networkError'));
        }

        const result =
          payload.data.options || payload.data.items || payload.data;
        if (!Array.isArray(result)) {
          throw new Error(__('CRUD.invalidArray'));
        }

        return result.map(item => {
          let resolved: any = null;
          const value = item[valueField || 'value'];

          // 只有 value 值有意义的时候，再去找；否则直接返回
          if (Array.isArray(options) && value !== null && value !== undefined) {
            resolved = find(options, optionValueCompare(value, valueField));
          }

          return resolved || item;
        });
      } catch (e) {
        if (!env.isCancel(e)) {
          !searchApi.silent && env.notify('error', e.message);
        }

        return [];
      }
    } else if (term) {
      return filterTree(
        option.children || options,
        (option: Option, key: number, level: number, paths: Array<Option>) => {
          return !!(
            (Array.isArray(option.children) && option.children.length) ||
            !!matchSorter([option].concat(paths), term, {
              keys: [labelField || 'label', valueField || 'value'],
              threshold: matchSorter.rankings.CONTAINS
            }).length
          );
        },
        0,
        true
      );
    } else {
      return options;
    }
  }

  @autobind
  async handleChange(value: Array<Option> | Option, optionModified?: boolean) {
    const {
      onChange,
      joinValues,
      delimiter,
      valueField,
      extractValue,
      options,
      dispatchEvent,
      setOptions,
      translate: __
    } = this.props;
    let newValue: any = value;
    let newOptions = options.concat();
    const UN_MATCH_RESULT = 'UN_MATCH_RESULT';

    if (Array.isArray(value)) {
      newValue = value.map(item => {
        const indexes = findTreeIndex(
          options,
          optionValueCompare(
            item[(valueField as string) || 'value'],
            (valueField as string) || 'value'
          )
        );

        // 这里主要是把查询出来的没有匹配的搜索的结果（一般是DEFFER时）聚合在一个分类下
        if (!indexes) {
          const searchIndexes = findTreeIndex(
            newOptions,
            item => item.value === UN_MATCH_RESULT
          );
          if (!searchIndexes) {
            newOptions.push({
              label: __('searchResult'),
              value: UN_MATCH_RESULT,
              visible: false,
              children: [item]
            });
          } else {
            const origin = getTree(newOptions, searchIndexes);
            if (origin?.children) {
              origin.children.push(item);
              newOptions = spliceTree(newOptions, searchIndexes, 1, {
                ...origin,
                ...item
              });
            }
          }
        } else if (optionModified) {
          const origin = getTree(newOptions, indexes);
          newOptions = spliceTree(newOptions, indexes, 1, {
            ...origin,
            ...item
          });
        }

        return joinValues || extractValue
          ? item[(valueField as string) || 'value']
          : item;
      });

      if (joinValues) {
        newValue = newValue.join(delimiter || ',');
      }
    } else if (value) {
      newValue =
        joinValues || extractValue
          ? value[(valueField as string) || 'value']
          : value;
    }

    (newOptions.length > options.length || optionModified) &&
      setOptions(newOptions, true);

    // 触发渲染器事件
    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value: newValue,
        options,
        items: options // 为了保持名字统一
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    onChange(newValue);
  }
}

@OptionsControl({
  type: 'tabs-transfer'
})
export class TabsTransferRenderer extends BaseTabsTransferRenderer<TabsTransferProps> {
  static defaultProps = {
    multiple: true
  };

  @autobind
  optionItemRender(option: any, states: ItemRenderStates) {
    const {menuTpl, render, data, classnames} = this.props;
    const ctx = arguments[2] || {};

    if (menuTpl) {
      return render(`item/${states.index}`, menuTpl, {
        data: createObject(
          createObject(data, {
            ...states,
            ...ctx
          }),
          option
        )
      });
    }

    return BaseSelection.itemRender(option, {...states, classnames});
  }

  // 动作
  doAction(
    action: ActionObject,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const {resetValue, onChange, formStore, store, name} = this.props;
    const activeKey = args?.activeKey as number;
    switch (action.actionType) {
      case 'clear':
        onChange?.('');
        break;
      case 'reset':
        onChange?.(
          getVariable(formStore?.pristine ?? store?.pristine, name) ??
            resetValue ??
            ''
        );
        break;
      case 'changeTabKey':
        this.setState({
          activeKey
        });
        break;
    }
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      loading,
      searchResultMode,
      selectMode,
      searchable,
      showArrow,
      deferLoad,
      leftDeferLoad,
      disabled,
      selectTitle,
      resultTitle,
      itemHeight,
      virtualThreshold,
      onlyChildren,
      loadingConfig,
      valueField = 'value',
      labelField = 'label',
      valueTpl,
      menuTpl,
      data,
      mobileUI,
      initiallyOpen = true,
      testIdBuilder
    } = this.props;

    return (
      <div className={cx('TabsTransferControl', className)}>
        <TabsTransfer
          onlyChildren={onlyChildren}
          activeKey={this.state.activeKey}
          value={selectedOptions}
          disabled={disabled}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          searchResultMode={searchResultMode}
          onSearch={this.handleTabSearch}
          showArrow={showArrow}
          onDeferLoad={deferLoad}
          onLeftDeferLoad={leftDeferLoad}
          selectTitle={selectTitle}
          resultTitle={resultTitle}
          selectMode={selectMode}
          searchable={searchable}
          optionItemRender={menuTpl ? this.optionItemRender : undefined}
          resultItemRender={valueTpl ? this.resultItemRender : undefined}
          onTabChange={this.onTabChange}
          itemHeight={
            toNumber(itemHeight) > 0 ? toNumber(itemHeight) : undefined
          }
          virtualThreshold={virtualThreshold}
          labelField={labelField}
          valueField={valueField}
          ctx={data}
          mobileUI={mobileUI}
          initiallyOpen={initiallyOpen}
          testIdBuilder={testIdBuilder}
        />

        <Spinner
          overlay
          key="info"
          show={loading}
          loadingConfig={loadingConfig}
        />
      </div>
    );
  }
}
