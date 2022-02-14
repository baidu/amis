import {
  OptionsControlProps,
  OptionsControl,
  FormOptionsControl
} from './Options';
import React from 'react';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import TabsTransfer from '../../components/TabsTransfer';
import {SchemaApi, SchemaObject} from '../../Schema';
import {autobind, createObject} from '../../utils/helper';
import {BaseSelection, ItemRenderStates} from '../../components/Selection';

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

@OptionsControl({
  type: 'tabs-transfer'
})
export class TabsTransferRenderer extends BaseTransferRenderer<TabsTransferProps> {
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

  render() {
    const {
      className,
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      loading,
      searchable,
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
          value={selectedOptions}
          disabled={disabled}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          searchResultMode={searchResultMode}
          onSearch={searchable ? this.handleSearch : undefined}
          showArrow={showArrow}
          onDeferLoad={deferLoad}
          onLeftDeferLoad={leftDeferLoad}
          selectTitle={selectTitle}
          resultTitle={resultTitle}
          optionItemRender={this.optionItemRender}
          resultItemRender={this.resultItemRender}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
