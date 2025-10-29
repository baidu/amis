import React from 'react';
import {
  AMISSchemaBase,
  Renderer,
  RendererProps,
  autobind,
  createObject,
  isPureVariable,
  resolveEventData,
  resolveVariableAndFilter
} from 'amis-core';
import {BaseSchema} from '../Schema';
import {Pagination as BasicPagination} from 'amis-ui';
import type {MODE_TYPE} from 'amis-ui/lib/components/Pagination';

/**
 * 分页组件，用于数据分页跳转。支持页码、页大小与快速跳转。
 */
export interface AMISPaginationSchema extends AMISSchemaBase {
  type: 'pagination';

  /**
   * 通过控制layout属性的顺序，调整分页结构
   */
  layout?: string | Array<string>;

  /**
   * 最多显示多少个分页按钮
   */
  maxButtons?: number;

  /**
   * 模式，默认normal，如果只想简单显示配置成 simple
   */
  mode?: MODE_TYPE;

  /**
   * 当前页数
   */
  activePage: number;

  /**
   * 总条数
   */
  total?: number;

  /**
   * 最后一页，总页数（如果传入了total，会重新计算lastPage）
   */
  // lastPage?: number;

  /**
   * 每页显示条数
   */
  perPage?: number;

  /**
   * 是否展示分页切换，也同时受layout控制
   */
  showPerPage?: boolean;

  /**
   * 指定每页可以显示多少条
   */
  perPageAvailable?: Array<number>;

  /**
   * 是否显示快速跳转输入框
   */
  showPageInput?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  hasNext?: boolean;

  /**
   * 弹层挂载节点
   */
  popOverContainerSelector?: string;
}

export interface PaginationProps
  extends RendererProps,
    Omit<AMISPaginationSchema, 'type' | 'className'> {}

export default class Pagination extends React.Component<PaginationProps> {
  formatNumber(num: number | string | undefined, defaultValue?: number) {
    let result: number | undefined = undefined;
    if (typeof num === 'string') {
      num = isPureVariable(num)
        ? resolveVariableAndFilter(num, this.props.data)
        : num;
      result = typeof num === 'string' ? parseInt(num, 10) : num;
    } else if (typeof num === 'number') {
      result = num;
    }
    return typeof result === 'number' && !isNaN(result) ? result : defaultValue;
  }

  @autobind
  async onPageChange(page: number, perPage?: number, dir?: string) {
    const {onPageChange, dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent?.(
      'change',
      createObject(data, {
        page: page,
        perPage: perPage
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onPageChange?.(page, perPage, dir);
  }

  render() {
    const {maxButtons, activePage, total, perPage} = this.props;

    return (
      <BasicPagination
        {...this.props}
        onPageChange={this.onPageChange}
        maxButtons={this.formatNumber(maxButtons)}
        activePage={this.formatNumber(activePage)}
        total={this.formatNumber(total)}
        perPage={this.formatNumber(perPage)}
      />
    );
  }
}

@Renderer({
  type: 'pagination',
  alias: ['pager'],
  name: 'pagination'
})
export class PaginationRenderer extends Pagination {}
