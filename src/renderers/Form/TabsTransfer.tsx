import {OptionsControlProps, OptionsControl} from './Options';
import React from 'react';
import find from 'lodash/find';
import Spinner from '../../components/Spinner';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import TabsTransfer from '../../components/TabsTransfer';
import {Option, optionValueCompare} from '../../components/Select';
import {
  autobind,
  string2regExp,
  filterTree,
  createObject,
  findTreeIndex,
  getTree,
  spliceTree
} from '../../utils/helper';
import {BaseSelection, ItemRenderStates} from '../../components/Selection';
import {Action} from '../../types';

/**
 * TabsTransfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs-transfer
 */
export interface TabsTransferControlSchema
  extends Omit<TransferControlSchema, 'type'> {
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
    > {}
  
interface BaseTransferState {
  activeKey: number
}

export class BaseTabsTransferRenderer<
  T extends OptionsControlProps = TabsTransferProps
> extends BaseTransferRenderer<T> {

  state: BaseTransferState = {
    activeKey: 0
  }


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
    const {options, labelField, valueField, env, data} = this.props;
    const {searchApi} = option;

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
          throw new Error(payload.msg || '搜索请求异常');
        }

        const result =
          payload.data.options || payload.data.items || payload.data;
        if (!Array.isArray(result)) {
          throw new Error('CRUD.invalidArray');
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
          env.notify('error', e.message);
        }

        return [];
      }
    } else if (term) {
      const regexp = string2regExp(term);

      return filterTree(
        options,
        (option: Option) => {
          return !!(
            (Array.isArray(option.children) && option.children.length) ||
            (option[(valueField as string) || 'value'] &&
              (regexp.test(option[(labelField as string) || 'label']) ||
                regexp.test(option[(valueField as string) || 'value'])))
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
    const rendererEvent = await dispatchEvent('change', {
      value: newValue,
      options
    });
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
  @autobind
  optionItemRender(option: any, states: ItemRenderStates) {
    const {menuTpl, render, data} = this.props;
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

    return BaseSelection.itemRender(option, states);
  }

  // 动作
  doAction(action: Action) {
    const {resetValue, onChange} = this.props;
    const activeKey = action?.activeKey as number;
    switch (action.actionType) {
      case 'clear':
        onChange('');
        break;
      case 'reset':
        onChange(resetValue);
        break;
      case 'changeTabKey':
        this.setState({
          activeKey
        });
        break;
    }
  }

  render() {
    const {
      className,
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      loading,
      searchResultMode,
      showArrow,
      deferLoad,
      leftDeferLoad,
      disabled,
      selectTitle,
      resultTitle
    } = this.props;

    return (
      <div className={cx('TabsTransferControl', className)}>
        <TabsTransfer
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
          optionItemRender={this.optionItemRender}
          resultItemRender={this.resultItemRender}
          onTabChange={this.onTabChange}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
