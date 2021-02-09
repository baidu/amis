import {Renderer, RendererProps} from '../../factory';
import Grid, {
  ColumnNode,
  GridColumn,
  ColProps,
  ColumnArray,
  GridSchema,
  GridColumnObject
} from '../Grid';
import {Schema} from '../../types';

import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  FormControlSchema
} from './Item';
import pick from 'lodash/pick';
import React from 'react';
import cx from 'classnames';
import {IIRendererStore} from '../../store/iRenderer';

/**
 * Grid 格子布局
 * 文档：https://baidu.gitee.io/amis/docs/components/form/grid
 */
export interface GridControlSchema
  extends FormBaseControl,
    Omit<GridSchema, 'columns'> {
  type: 'grid';

  columns: Array<
    GridColumnObject & {
      /**
       * 表单项集合
       */
      controls?: Array<FormControlSchema>;

      /**
       * @deprecated 请用类型 tabs
       */
      tabs?: any;

      /**
       * @deprecated 请用类型 fieldSet
       */
      fieldSet?: any;
    }
  >;
}

export interface GridProps
  extends FormControlProps,
    Omit<
      GridControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  store: IIRendererStore;
}
const defaultHorizontal = {
  left: 'col-sm-4',
  right: 'col-sm-8',
  offset: 'col-sm-offset-4'
};

@FormItem({
  type: 'grid',
  strictMode: false,
  sizeMutable: false
})
export class GridRenderer extends Grid<GridProps> {
  static propsList: Array<string> = ['columns', 'onChange'];
  static defaultProps = {};

  renderChild(region: string, node: Schema, key: number, length: number) {
    const {
      render,
      renderFormItems,
      classnames: cx,
      $path,
      itemRender,
      store
    } = this.props;

    if (node && !node.type && (node.controls || node.tabs || node.feildSet)) {
      return (
        <div className={cx(`Grid-form Form--${node.mode || 'normal'}`)}>
          {renderFormItems(
            node as any,
            ($path as string).replace(/^.*form\//, ''),
            {
              mode: node.mode || 'normal',
              horizontal: node.horizontal || defaultHorizontal,
              store,
              data: store.data,
              render
            }
          )}
        </div>
      );
    }

    return itemRender
      ? itemRender(node, key, length, this.props)
      : render(region, node.body || node);
  }
}
