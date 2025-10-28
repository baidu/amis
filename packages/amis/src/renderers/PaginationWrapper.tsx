import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {IPaginationStore, PaginationStore} from 'amis-core';
import {AMISSchemaBase, AMISSchemaCollection} from 'amis-core';

/**
 * 分页容器功能性渲染器。详情请见：https://aisuda.bce.baidu.com/amis/zh-CN/components/pagination-wrapper
 */
/**
 * 分页包装器组件，为子组件提供分页能力。支持外部数据源。
 */
export interface AMISPaginationWrapperSchema extends AMISSchemaBase {
  /**
   * 指定为 pagination-wrapper 组件
   */
  type: 'pagination-wrapper';

  /**
   * 是否显示快速跳转输入框
   */
  showPageInput?: boolean;

  /**
   * 最多显示多少个分页按钮
   */
  maxButtons?: number;

  /**
   * 输入字段名
   */
  inputName?: string;

  /**
   * 输出字段名
   */
  outputName?: string;

  /**
   * 每页显示多条数据
   */
  perPage?: number;

  /**
   * 分页显示位置，如果配置为 none 则需要自己在内容区域配置 pagination 组件，否则不显示
   */
  position?: 'top' | 'bottom' | 'none';

  /**
   * 内容区域
   */
  body?: AMISSchemaCollection;
}

export interface PaginationWrapProps
  extends RendererProps,
    Omit<AMISPaginationWrapperSchema, 'type' | 'className'> {
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
      'ellipsisPageGap',
      'inputName',
      'outputName'
    ]);
  }

  componentDidUpdate(prevProps: PaginationWrapProps) {
    const store = this.props.store;
    store.syncProps(this.props, prevProps, [
      'perPage',
      'mode',
      'ellipsisPageGap',
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
      style,
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
              ellipsisPageGap: store.ellipsisPageGap,
              onPageChange: store.switchTo,
              perPage: store.perPage,
              className: 'PaginationWrapper-pager'
            }
          )
        : null;

    return (
      <div className={cx('PaginationWrapper')} style={style}>
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
