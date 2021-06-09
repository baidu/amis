import {
  OptionsControlProps,
  OptionsControl,
  FormOptionsControl
} from './Options';
import React from 'react';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import {BaseTransferRenderer} from './Transfer';
import TabsTransfer from '../../components/TabsTransfer';
import {SchemaApi} from '../../Schema';

/**
 * TabsTransfer
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tabs-transfer
 */
export interface TabsTransferControlSchema extends FormOptionsControl {
  type: 'tabs-transfer';

  /**
   * 是否显示剪头
   */
  showArrow?: boolean;

  /**
   * 可排序？
   */
  sortable?: boolean;

  /**
   * 搜索结果展示模式
   */
  searchResultMode?: 'table' | 'list' | 'tree' | 'chained';

  /**
   * 可搜索？
   */
  searchable?: boolean;

  /**
   * 搜索 API
   */
  searchApi?: SchemaApi;

  /**
   * 左侧的标题文字
   */
  selectTitle?: string;

  /**
   * 右侧结果的标题文字
   */
  resultTitle?: string;
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
          selectTitle={selectTitle}
          resultTitle={resultTitle}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
