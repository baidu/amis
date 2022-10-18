import {OptionsControlProps, OptionsControl, resolveEventData} from 'amis-core';
import React from 'react';
import {Spinner} from 'amis-ui';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import {TransferPicker} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';

/**
 * TransferPicker 穿梭器的弹框形态
 * 文档：https://baidu.gitee.io/amis/docs/components/form/transfer-picker
 */
export interface TransferPickerControlSchema
  extends Omit<TransferControlSchema, 'type'> {
  type: 'transfer-picker';
  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 弹窗大小
   */
  pickerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface TabsTransferProps
  extends OptionsControlProps,
    Omit<
      TransferPickerControlSchema,
      | 'type'
      | 'options'
      | 'inputClassName'
      | 'className'
      | 'descriptionClassName'
    > {}

@OptionsControl({
  type: 'transfer-picker'
})
export class TransferPickerRenderer extends BaseTransferRenderer<TabsTransferProps> {
  @autobind
  dispatchEvent(name: string) {
    const {dispatchEvent, value} = this.props;
    dispatchEvent(name, resolveEventData(this.props, {value}, 'value'));
  }

  // 动作
  doAction(action: ActionObject) {
    const {resetValue, onChange} = this.props;
    switch (action.actionType) {
      case 'clear':
        onChange?.('');
        break;
      case 'reset':
        onChange?.(resetValue ?? '');
        break;
    }
  }

  render() {
    const {
      className,
      classnames: cx,
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
      columns,
      leftMode,
      selectMode,
      borderMode
    } = this.props;

    // 目前 LeftOptions 没有接口可以动态加载
    // 为了方便可以快速实现动态化，让选项的第一个成员携带
    // LeftOptions 信息
    let {options, leftOptions, leftDefaultValue} = this.props;
    if (
      selectMode === 'associated' &&
      options &&
      options.length &&
      options[0].leftOptions &&
      Array.isArray(options[0].children)
    ) {
      leftOptions = options[0].leftOptions;
      leftDefaultValue = options[0].leftDefaultValue ?? leftDefaultValue;
      options = options[0].children;
    }

    return (
      <div className={cx('TransferControl', className)}>
        <TransferPicker
          borderMode={borderMode}
          selectMode={selectMode}
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
          columns={columns}
          leftMode={leftMode}
          leftOptions={leftOptions}
          optionItemRender={this.optionItemRender}
          resultItemRender={this.resultItemRender}
          onFocus={() => this.dispatchEvent('focus')}
          onBlur={() => this.dispatchEvent('blur')}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
