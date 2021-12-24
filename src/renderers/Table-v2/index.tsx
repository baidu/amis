import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import {Renderer, RendererProps} from '../../factory';
import {SchemaNode, Schema} from '../../types';
import Table, {ColumnProps} from '../../components/table';
import {
  BaseSchema,
  SchemaObject,
  SchemaTokenizeableString
} from '../../Schema';
import {isObject} from '../../utils/helper';
import {
  resolveVariableAndFilter
} from '../../utils/tpl-builtin';
import {evalExpression, filter} from '../../utils/tpl';
import {Icon} from '../../components/icons';
import Checkbox from '../../components/Checkbox';
import {TableStoreV2, ITableStore, IColumn} from '../../store/table-v2';
import ColumnToggler from '../Table/ColumnToggler';

/**
 * Table 表格v2渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/table-v2
 */

export interface CellSpan {
  colIndex: number;
  rowIndex: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface RenderProps {
  colSpan?: number;
  rowSpan?: number;
}

export interface ColumnSchema {
  /**
   * 指定列唯一标识
   */
  key: string;

  /**
   * 指定列标题
   */
  title: string | SchemaObject;

  /**
   * 指定列内容渲染器
   */
  type?: string;

  /**
   * 指定行合并表达式
   */
  rowSpanExpr?: string;

  /**
   * 指定列合并表达式
   */
  colSpanExpr?: string;

  /**
   * 表头分组
   */
  children?: Array<ColumnSchema>
}

export interface RowSelectionSchema {
  /**
   * 选择类型 单选/多选
   */
  type: string;

  /**
   * 对应数据源的key值
   */
  keyField: string;

  /**
   * 行是否禁用表达式
   */
  disableOn: string;
}

export interface ExpandableSchema {
  /**
   * 渲染器类型
   */
  type: string;

  /**
   * 对应数据源的key值
   */
  keyField: string;

  /**
   * 行是否可展开表达式
   */
  expandableOn: string;

  /**
   * 展开行自定义样式表达式
   */
  expandedRowClassNameExpr: string;
}

export interface TableSchema extends BaseSchema {
  /**
   * 指定为表格类型
   */
  type: 'table-v2';

  /**
  * 表格标题
  */
  title: string | SchemaObject;

  /**
  * 表格数据源
  */
  source: SchemaTokenizeableString;

  /**
  * 表格可自定义列
  */
  columnsToggable: boolean;

  /**
  * 表格列配置
  */
  columns: Array<ColumnSchema>;

  /**
  * 表格可选择配置
  */
  rowSelection: RowSelectionSchema;

  /**
  * 表格行可展开配置
  */
  expandable: ExpandableSchema;
}

export interface TableV2Props extends RendererProps {
  title?: string;
  source?: string;
  store: ITableStore;
  togglable: boolean;
}

@Renderer({
  type: 'table-v2',
  storeType: TableStoreV2.name,
  name: 'table-v2'
})
export class TableRenderer extends React.Component<TableV2Props, object> {
  renderedToolbars: Array<string> = [];

  constructor(props: TableV2Props) {
    super(props);

    this.handleColumnToggle = this.handleColumnToggle.bind(this);

    const {store, columnsToggable, columns} = props;

    store.update({columnsToggable, columns});
  }

  renderSchema(schema: any, props: any) {
    const {render} = this.props;
    // Table Header、Footer SchemaObject转化成ReactNode
    if (schema && isObject(schema)) {
      return render('field', schema, props);
    }
    return schema;
  }

  getColumns(columns: Array<ColumnSchema>) {
    const cols: Array<ColumnProps> = [];
    const rowSpans: Array<CellSpan> = [];
    const colSpans: Array<CellSpan> = [];
    columns.forEach((column, col) => {
      const clone = {...column} as ColumnProps;
      if (isObject(column.title)) {
        const title = cloneDeep(column.title);
        Object.assign(clone, {
          title: () => this.renderSchema(title, {})
        });
      } else if (typeof column.title === 'string') {
        Object.assign(clone, {
          title: () => this.renderSchema({type: 'plain'}, {value: column.title})
        });
      }

      if (column.type) {
        Object.assign(clone, {
          render: (text: string, record: any, rowIndex: number, colIndex: number) => {
            const props: RenderProps = {};
            const obj = {
              children: this.renderSchema(column, {
                  data: record,
                  value: record[column.key]
              }),
              props
            };
            if (column.rowSpanExpr) {
              const rowSpan = +filter(column.rowSpanExpr, {record, rowIndex, colIndex});
              if (rowSpan) {
                obj.props.rowSpan = rowSpan;
                rowSpans.push({colIndex, rowIndex, rowSpan})
              }
            }

            if (column.colSpanExpr) {
              const colSpan = +filter(column.colSpanExpr, {record, rowIndex, colIndex});
              if (colSpan) {
                obj.props.colSpan = colSpan;
                colSpans.push({colIndex, rowIndex, colSpan});
              }
            }

            rowSpans.forEach(item => {
              if (colIndex === item.colIndex
                && rowIndex > item.rowIndex
                && rowIndex < item.rowIndex + (item.rowSpan || 0)) {
                obj.props.rowSpan = 0;
              }
            });

            colSpans.forEach(item => {
              if (rowIndex === item.rowIndex
                && colIndex > item.colIndex
                && colIndex < item.colIndex + (item.colSpan || 0)) {
                obj.props.colSpan = 0;
              }
            });

            return obj;
          }
        }); 
      }

      if (column.children) {
        clone.children = this.getColumns(column.children);
      }

      cols.push(clone);
    });
    return cols;
  }

  getSummary(summary: Array<any>) {
    const result: Array<any> = [];
    if (Array.isArray(summary)) {
      summary.forEach((s, index) => {
        if (isObject(s)) {
          result.push({
            colSpan: s.colSpan,
            fixed: s.fixed,
            render: () => this.renderSchema(s, {
              data: this.props.data
            })
          });
        } else if (Array.isArray(s)) {
          if (!result[index]) {
            result.push([]);
          }
          s.forEach(d => {
            result[index].push({
              colSpan: d.colSpan,
              fixed: d.fixed,
              render: () => this.renderSchema(s, {
                data: this.props.data
              })
            });
          });
        }
      })
    }

    return result.length ? result : null;
  }

  handleColumnToggle(columns: Array<IColumn>) {
    const {store} = this.props;

    store.update({columns});
  }

  renderColumnsToggler(config?: any) {
    const {
      className,
      store,
      render,
      classPrefix: ns,
      classnames: cx,
      ...rest
    } = this.props;
    const __ = rest.translate;
    const env = rest.env;

    if (!store.toggable) {
      return null;
    }

    return (
      <ColumnToggler
        {...rest}
        {...(isObject(config) ? config : {})}
        tooltip={config?.tooltip || __('Table.columnsVisibility')}
        tooltipContainer={
          env && env.getModalContainer ? env.getModalContainer : undefined
        }
        align={config?.align ?? 'left'}
        isActived={store.hasColumnHidden()}
        classnames={cx}
        classPrefix={ns}
        key="columns-toggable"
        size={config?.size || 'sm'}
        label={
          config?.label || <Icon icon="columns" className="icon m-r-none" />
        }
        draggable={config?.draggable}
        columns={store.columnsData}
        onColumnToggle={this.handleColumnToggle}
      >
        {store.toggableColumns.map(column => (
          <li
            className={cx('ColumnToggler-menuItem')}
            key={column.index}
            onClick={column.toggleToggle}
          >
            <Checkbox
              size="sm"
              classPrefix={ns}
              checked={column.toggled}>
              {column.title ? render('tpl', column.title) : null}
            </Checkbox>
          </li>
        ))}
      </ColumnToggler>
    );
  }

  renderToolbar(toolbar: SchemaNode) {
    const type = (toolbar as Schema).type || (toolbar as string);

    if (type === 'columns-toggler') {
      this.renderedToolbars.push(type);
      return this.renderColumnsToggler(toolbar as any);
    }

    return void 0;
  }

  // handleAction() {}

  renderActions(region: string) {
    let {actions, render, store, classnames: cx, data} = this.props;

    actions = Array.isArray(actions) ? actions.concat() : [];

    if (
      store.toggable &&
      region === 'header' &&
      !~this.renderedToolbars.indexOf('columns-toggler')
    ) {
      actions.push({
        type: 'button',
        children: this.renderColumnsToggler()
      });
    }

    return Array.isArray(actions) && actions.length ? (
      <div className={cx('Table-toolbar')}>
        {actions.map((action, key) =>
          render(
            `action/${key}`,
            {
              type: 'button',
              ...(action as any)
            },
            {
              // onAction: this.handleAction,
              key
              // btnDisabled: store.dragging,
              // data: store.getData(data)
            }
          )
        )}
      </div>
    ) : null;
  }

  renderTable() {
    const {
      render,
      title,
      footer,
      source,
      columns,
      rowSelection,
      expandable,
      footSummary,
      headSummary,
      classnames: cx,
      store,
      ...rest
    } = this.props;

    let sourceValue = this.props.data.items;

    if (typeof source === 'string') {
      sourceValue = resolveVariableAndFilter(source, this.props.data, '| raw');
    }

    if (expandable) {
      if (expandable.expandableOn) {
        const expandableOn = cloneDeep(expandable.expandableOn);
        expandable.rowExpandable = (record: any) => {
          return evalExpression(expandableOn, record);
        };
        delete expandable.expandableOn;
      }

      if (expandable.type) {
        expandable.expandedRowRender = (record: any, rowIndex: number) => {
          return this.renderSchema(expandable, {data: record});
        };
      }
      
      if (expandable.expandedRowClassNameExpr) {
        const expandedRowClassNameExpr = cloneDeep(expandable.expandedRowClassNameExpr);
        expandable.expandedRowClassName = (record: any, rowIndex: number) => {
          return filter(expandedRowClassNameExpr, {record, rowIndex});
        };
        delete expandable.expandedRowClassNameExpr;
      }
    }

    if (rowSelection) {
        if (rowSelection.disableOn) {
          const disableOn = cloneDeep(rowSelection.disableOn);

          rowSelection.getCheckboxProps = (record: any, rowIndex: number) => {
            return {
              disabled: evalExpression(disableOn, {record, rowIndex})
            };
          };

          delete rowSelection.disableOn;
        }
    }

    return <Table
      title={this.renderSchema(title, {data: this.props.data})}
      footer={this.renderSchema(footer, {data: this.props.data})}
      columns={this.getColumns(store.filteredColumns)}
      dataSource={sourceValue}
      rowSelection={rowSelection}
      expandable={expandable}
      footSummary={this.getSummary(footSummary)}
      headSummary={this.getSummary(headSummary)}
      {...rest}>
    </Table>;
  }

  render() {
    const {
      classnames: cx
    } = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了

    return <div className={cx('Table-wrapper')}>
      {this.renderActions('header')}
      {this.renderTable()}
    </div>;
  }
}
