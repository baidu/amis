import {Renderer, RendererProps} from '../../factory';
import Grid, {ColumnNode, GridColumn, ColProps, ColumnArray} from '../Grid';
import {Schema} from '../../types';

import {FormItem, FormControlProps} from './Item';
import pick from 'lodash/pick';
import React from 'react';
import cx from 'classnames';
import {IIRendererStore} from '../../store/iRenderer';

export interface GridProps extends FormControlProps {
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
