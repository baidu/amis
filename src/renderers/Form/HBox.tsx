import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import {
  FormItem,
  FormControlProps,
  FormControlSchema,
  FormBaseControl
} from './Item';
import HBox, {HBoxColumnObject, HBoxSchema} from '../HBox';
import {Schema} from '../../types';
import cx from 'classnames';
import {isVisible} from '../../utils/helper';
import {IIRendererStore} from '../../store/iRenderer';

/**
 * HBox 水平布局控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/hbox
 */
export interface HBoxControlSchema
  extends FormBaseControl,
    Omit<HBoxSchema, 'columns'> {
  type: 'hbox';

  columns: Array<
    HBoxColumnObject & {
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

interface HBoxProps extends FormControlProps, HBoxControlSchema {
  store: IIRendererStore;
}

@FormItem({
  type: 'hbox',
  strictMode: false,
  sizeMutable: false
})
export class HBoxRenderer extends React.Component<HBoxProps, any> {
  static propsList: Array<string> = ['columns', 'onChange'];
  static defaultProps: Partial<HBoxProps> = {};

  renderColumn(column: any, key: number, length: number) {
    const {itemRender, data, classPrefix: ns} = this.props;

    if (!isVisible(column, data)) {
      return null;
    }

    let style = {
      width: column.width,
      height: column.height,
      ...column.style
    };

    return (
      <div
        key={key}
        style={style}
        className={cx(
          `${ns}Hbox-col`,
          `${ns}Form--${column.mode || 'normal'}`,
          column.columnClassName
        )}
      >
        {itemRender
          ? itemRender(column, key, length, this.props)
          : this.renderChild(`column/${key}`, column, key)}
      </div>
    );
  }

  renderChild(region: string, node: Schema, index: number) {
    const {render, renderFormItems, formMode, store, $path} = this.props;

    if (node && !node.type && (node.controls || node.tabs || node.feildSet)) {
      return renderFormItems(
        node as any,
        ($path as string).replace(/^.*form\//, ''),
        {
          mode: node.mode || 'normal',
          horizontal: node.horizontal || {
            left: 4,
            right: 8,
            offset: 4
          },
          store,
          data: store.data,
          render
        }
      );
    }

    return render(region, node.body || node);
  }

  render() {
    const {className, columns, gap, classPrefix: ns} = this.props;

    return (
      <div
        className={cx(
          `${ns}FormHbox`,
          gap ? `${ns}Hbox--${gap}` : '',
          className
        )}
      >
        <div className={`${ns}Hbox`}>
          {columns.map((column: any, key: number) =>
            this.renderColumn(column, key, columns.length)
          )}
        </div>
      </div>
    );
  }
}
