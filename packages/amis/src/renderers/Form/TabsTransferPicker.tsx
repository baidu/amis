import {
  OptionsControlProps,
  OptionsControl,
  resolveEventData,
  getVariable
} from 'amis-core';
import React from 'react';
import {Spinner, SpinnerExtraProps} from 'amis-ui';
import {BaseTabsTransferRenderer} from './TabsTransfer';
import {TabsTransferPicker} from 'amis-ui';
import {AMISTransferSchemaBase} from './Transfer';
import {autobind, createObject} from 'amis-core';
import {Selection as BaseSelection} from 'amis-ui';
import {ActionObject, toNumber} from 'amis-core';
import type {ItemRenderStates} from 'amis-ui/lib/components/Selection';
import {supportStatic} from './StaticHoc';
import {isMobile} from 'amis-core';

/**
 * TabsTransferPicker 穿梭器的弹框形态
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/tabs-transfer-picker
 */
export interface AMISTabsTransferPickerSchema
  extends AMISTransferSchemaBase,
    SpinnerExtraProps {
  type: 'tabs-transfer-picker';
}

export interface TabsTransferProps
  extends OptionsControlProps,
    Omit<
      AMISTabsTransferPickerSchema,
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

@OptionsControl({
  type: 'tabs-transfer-picker'
})
export class TabsTransferPickerRenderer extends BaseTabsTransferRenderer<TabsTransferProps> {
  state: BaseTransferState = {
    activeKey: 0
  };

  @autobind
  dispatchEvent(name: string) {
    const {dispatchEvent, value} = this.props;
    dispatchEvent(name, resolveEventData(this.props, {value}));
  }

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
  doAction(action: ActionObject) {
    const {resetValue, onChange, formStore, store, name} = this.props;
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
      showArrow,
      deferLoad,
      disabled,
      selectTitle,
      resultTitle,
      pickerSize,
      leftMode,
      leftOptions,
      itemHeight,
      virtualThreshold,
      loadingConfig,
      labelField = 'label',
      valueField = 'value',
      deferField = 'defer',
      mobileUI,
      env,
      maxTagCount,
      overflowTagPopover,
      placeholder,
      initiallyOpen = true
    } = this.props;

    return (
      <div className={cx('TabsTransferControl', className)}>
        <TabsTransferPicker
          activeKey={this.state.activeKey}
          onTabChange={this.onTabChange}
          placeholder={placeholder as string}
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
          selectTitle={selectTitle}
          resultTitle={resultTitle}
          size={pickerSize}
          leftMode={leftMode}
          leftOptions={leftOptions}
          optionItemRender={this.optionItemRender}
          resultItemRender={this.resultItemRender}
          onFocus={() => this.dispatchEvent('focus')}
          onBlur={() => this.dispatchEvent('blur')}
          itemHeight={
            toNumber(itemHeight) > 0 ? toNumber(itemHeight) : undefined
          }
          virtualThreshold={virtualThreshold}
          labelField={labelField}
          valueField={valueField}
          deferField={deferField}
          mobileUI={mobileUI}
          popOverContainer={env?.getModalContainer}
          maxTagCount={maxTagCount}
          overflowTagPopover={overflowTagPopover}
          initiallyOpen={initiallyOpen}
        />

        <Spinner
          loadingConfig={loadingConfig}
          overlay
          key="info"
          show={loading}
        />
      </div>
    );
  }
}
