import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema, SchemaCollection} from '../Schema';
import {IPaginationStore, PaginationStore} from 'amis-core';

/**
 * 分页容器功能性渲染器。详情请见：https://baidu.gitee.io/amis/docs/components/pagination-wrapper
 */
export interface PaginationWrapperSchema extends BaseSchema {
  /**
   * 指定为分页容器功能性渲染器
   */
  type: 'pagination-wrapper';

  /**
   * 是否显示快速跳转输入框
   */
  showPageInput?: boolean;

  /**
   * 最多显示多少个分页按钮。
   *
   * @default 5
   */
  maxButtons?: number;

  /**
   * 输入字段名
   *
   * @default items
   */
  inputName?: string;

  /**
   * 输出字段名
   *
   * @default items
   */
  outputName?: string;

  /**
   * 每页显示多条数据。
   * @default 10
   */
  perPage?: number;

  /**
   * 分页显示位置，如果配置为 none 则需要自己在内容区域配置 pagination 组件，否则不显示。
   */
  position?: 'top' | 'bottom' | 'none';

  /**
   * 内容区域
   */
  body?: SchemaCollection;
}

export interface PaginationWrapProps
  extends RendererProps,
    Omit<PaginationWrapperSchema, 'type' | 'className'> {
  inputName: string;
  outputName: string;
  perPage: number;
  store: IPaginationStore;
}

export class PaginationWrapper extends React.Component<PaginationWrapProps> {
  static defaultProps = {
    inputName: 'items',
    outputName: 'items',
    perPage: 10,
    position: 'top'
  };

  constructor(props: PaginationWrapProps) {
    super(props);
    props.store.syncProps(props, undefined, [
      'perPage',
      'mode',
      'inputName',
      'outputName'
    ]);
  }

  componentDidUpdate(prevProps: PaginationWrapProps) {
    const store = this.props.store;
    store.syncProps(this.props, prevProps, [
      'perPage',
      'mode',
      'inputName',
      'outputName'
    ]);
  }

  render() {
    const {
      position,
      render,
      store,
      classnames: cx,
      body,
      translate: __
    } = this.props;

    const pagination =
      position !== 'none'
        ? render(
            'pager',
            {
              type: 'pagination'
            },
            {
              activePage: store.page,
              lastPage: store.lastPage,
              mode: store.mode,
              onPageChange: store.switchTo,
              className: 'PaginationWrapper-pager'
            }
          )
        : null;

    return (
      <div className={cx('PaginationWrapper')}>
        {position === 'top' ? pagination : null}
        {body ? (
          render('body', body, {
            data: store.locals
          })
        ) : (
          <span>{__('PaginationWrapper.placeholder')}</span>
        )}
        {position === 'bottom' ? pagination : null}
      </div>
    );
  }
}

@Renderer({
  type: 'pagination-wrapper',
  storeType: PaginationStore.name
})
export class PaginationWrapperRenderer extends PaginationWrapper {}
