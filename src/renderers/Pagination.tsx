import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaClassName} from '../Schema';
import {Pagination as BasicPagination} from '../components/Pagination';

export interface PaginationSchema extends BaseSchema {
  type: 'pagination';

  className?: SchemaClassName;

  /**
   * 通过控制layout属性的顺序，调整分页结构 pager,go,perPage,total
   * @default 'pager,go,perPage,total'
   */
  layout?: string | Array<string>;

  /**
   * 最多显示多少个分页按钮。
   *
   * @default 7
   */
  maxButtons: number;

  /**
   * 模式'simple' | 'normal'，默认normal，如果只想简单显示可以配置成 `simple`。
   */
  mode: string;

  /**
   * 当前页数
   */
  activePage: number;

  /**
   * 总条数
   */
  total: number;

  /**
   * 最后一页，总页数（如果传入了total，会重新计算lastPage）
   */
  lastPage: number;

  /**
   * 每页显示条数
   * @default 10
   */
  perPage: number;

  /**
   * 是否展示分页切换，也同时受layout控制
   * @default true
   */
  showPerPage: boolean;

  /**
   * 指定每页可以显示多少条
   * @default [10, 20, 50, 100]
   */
  perPageAvailable: Array<number>;

  /**
   * 只有一页时是否隐藏分页器
   * @default false
   */
  hideOnSinglePage: boolean;

  /**
   * 是否显示快速跳转输入框
   */
  showPageInput?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  onPageChange: (page: number, perPage?: number) => void;
}

export interface PaginationProps
  extends RendererProps,
    Omit<PaginationSchema, 'type' | 'className'> {
}

export interface PaginationState {
  pageNum: string;
  perPage: number;
  activePage: number;
  lastPage: number
}

export default class Pagination extends React.Component<
  PaginationProps,
  PaginationState
> {

  render() {
    return (
      <BasicPagination {...this.props} />
    );
  }
}

@Renderer({
  type: 'pagination'
})
export class PaginationRenderer extends Pagination { }
