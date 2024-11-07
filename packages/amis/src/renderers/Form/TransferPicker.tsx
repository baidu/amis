import {
  OptionsControlProps,
  OptionsControl,
  resolveEventData,
  evalExpression,
  getVariable
} from 'amis-core';
import React from 'react';
import {Spinner, SpinnerExtraProps} from 'amis-ui';
import {BaseTransferRenderer, TransferControlSchema} from './Transfer';
import {TransferPicker} from 'amis-ui';
import {autobind, createObject} from 'amis-core';
import {ActionObject, toNumber} from 'amis-core';
import {supportStatic} from './StaticHoc';
import {isMobile} from 'amis-core';
import pick from 'lodash/pick';

/**
 * TransferPicker 穿梭器的弹框形态
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/transfer-picker
 */
export interface TransferPickerControlSchema
  extends Omit<TransferControlSchema, 'type'>,
    SpinnerExtraProps {
  type: 'transfer-picker';
  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 弹窗大小
   */
  pickerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  onlyChildren?: boolean;
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
    dispatchEvent(name, resolveEventData(this.props, {value}));
  }

  @autobind
  // 增加点击选项事件函数
  async onItemClick(item: Object) {
    // 触发渲染器事件
    const {dispatchEvent} = this.props;
    const rendererEvent = await dispatchEvent(
      'itemClick',
      resolveEventData(this.props, {item})
    );
    if (rendererEvent?.prevented) {
      return;
    }
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
      borderMode,
      itemHeight,
      virtualThreshold,
      loadingConfig,
      labelField = 'label',
      valueField = 'value',
      deferField = 'defer',
      menuTpl,
      valueTpl,
      mobileUI,
      env,
      maxTagCount,
      overflowTagPopover,
      pagination,
      formItem,
      data,
      popOverContainer,
      placeholder,
      onlyChildren,
      autoCheckChildren = true,
      initiallyOpen = true
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
          placeholder={placeholder}
          borderMode={borderMode}
          selectMode={selectMode}
          onlyChildren={onlyChildren}
          value={selectedOptions}
          disabled={disabled}
          options={options}
          onItemClick={this.onItemClick}
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
          optionItemRender={menuTpl ? this.optionItemRender : undefined}
          resultItemRender={valueTpl ? this.resultItemRender : undefined}
          onFocus={() => this.dispatchEvent('focus')}
          onBlur={() => this.dispatchEvent('blur')}
          labelField={labelField}
          valueField={valueField}
          deferField={deferField}
          itemHeight={
            toNumber(itemHeight) > 0 ? toNumber(itemHeight) : undefined
          }
          virtualThreshold={virtualThreshold}
          mobileUI={mobileUI}
          popOverContainer={env?.getModalContainer}
          maxTagCount={maxTagCount}
          overflowTagPopover={overflowTagPopover}
          pagination={{
            ...pick(pagination, [
              'layout',
              'perPageAvailable',
              'popOverContainerSelector'
            ]),
            className: pagination?.className as any,
            enable:
              (pagination && pagination.enable !== undefined
                ? !!(typeof pagination.enable === 'string'
                    ? evalExpression(pagination.enable, data)
                    : pagination.enable)
                : !!formItem?.enableSourcePagination) &&
              (!selectMode ||
                selectMode === 'list' ||
                selectMode === 'table') &&
              options.length > 0,
            maxButtons: Number.isInteger(pagination?.maxButtons)
              ? pagination?.maxButtons
              : 5,
            page: formItem?.sourcePageNum,
            perPage: formItem?.sourcePerPageNum,
            total: formItem?.sourceTotalNum,
            popOverContainer: popOverContainer ?? env?.getModalContainer
          }}
          onPageChange={this.handlePageChange}
          autoCheckChildren={autoCheckChildren}
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
