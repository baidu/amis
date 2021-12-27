import {
  OptionsControlProps,
  OptionsControl,
  FormOptionsControl
} from './Options';
import React from 'react';
import Spinner from '../../components/Spinner';
import {BaseTransferRenderer} from './Transfer';
import {SchemaApi, SchemaObject} from '../../Schema';
import TabsTransferPicker from '../../components/TabsTransferPicker';
import {TabsTransferControlSchema} from './TabsTransfer';
import {autobind, createObject} from '../../utils/helper';
import {BaseSelection, ItemRenderStates} from '../../components/Selection';

/**
 * TabsTransferPicker 穿梭器的弹框形态
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs-transfer-picker
 */
export interface TabsTransferPickerControlSchema
  extends Omit<TabsTransferControlSchema, 'type'> {
  type: 'tabs-transfer-picker';
}

export interface TabsTransferProps
  extends OptionsControlProps,
    Omit<
      TabsTransferPickerControlSchema,
      | 'type'
      | 'options'
      | 'inputClassName'
      | 'className'
      | 'descriptionClassName'
    > {}

@OptionsControl({
  type: 'tabs-transfer-picker'
})
export class TabsTransferPickerRenderer extends BaseTransferRenderer<TabsTransferProps> {
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
      disabled,
      selectTitle,
      resultTitle,
      pickerSize,
      leftMode,
      leftOptions
    } = this.props;

    return (
      <div className={cx('TabsTransferControl', className)}>
        <TabsTransferPicker
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
          selectTitle={selectTitle}
          resultTitle={resultTitle}
          size={pickerSize}
          leftMode={leftMode}
          leftOptions={leftOptions}
          optionItemRender={this.optionItemRender}
          resultItemRender={this.resultItemRender}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
