import React from 'react';
import {
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

export interface PaginationSchema extends BaseSchema {
  type: 'pagination';

  /**
   * 通过控制layout属性的顺序，调整分页结构 total,perPage,pager,go
   * @default 'pager'
   */
  layout?: string | Array<string>;

  /**
   * 最多显示多少个分页按钮。
   *
   * @default 5
   */
  maxButtons?: number;

  /**
   * 模式，默认normal，如果只想简单显示可以配置成 `simple`。
   * @default 'normal'
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
   * @default 10
   */
  perPage?: number;

  /**
   * 是否展示分页切换，也同时受layout控制
   * @default false
   */
  showPerPage?: boolean;

  /**
   * 指定每页可以显示多少条
   * @default [10, 20, 50, 100]
   */
  perPageAvailable?: Array<number>;

  /**
   * 是否显示快速跳转输入框
   * @default false
   */
  showPageInput?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  hasNext?: boolean;

  /**
   * 弹层挂载节点
   * @default false
   */
  popOverContainerSelector?: string;
}

export interface PaginationProps
  extends RendererProps,
    Omit<PaginationSchema, 'type' | 'className'> {}

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
