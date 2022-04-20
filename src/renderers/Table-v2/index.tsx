import React from 'react';
import {findDOMNode} from 'react-dom';
import {isAlive} from 'mobx-state-tree';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import {IScopedContext} from '../../Scoped';
import {Renderer, RendererProps} from '../../factory';
import {Action} from '../../types';
import Table from '../../components/table';
import {BaseSchema, SchemaObject, SchemaTokenizeableString} from '../../Schema';
import {
  isObject,
  anyChanged,
  difference,
  createObject
} from '../../utils/helper';
import {
  resolveVariableAndFilter,
  isPureVariable,
  resolveVariable
} from '../../utils/tpl-builtin';
import {evalExpression, filter} from '../../utils/tpl';
import {isEffectiveApi} from '../../utils/api';
import Checkbox from '../../components/Checkbox';
import {BadgeSchema} from '../../components/Badge';
import {TableStoreV2, ITableStore, IColumn, IRow} from '../../store/table-v2';

import ColumnToggler, {ColumnTogglerProps} from '../Table/ColumnToggler';
import {HeadCellSearchDropDown} from './HeadCellSearchDropdown';
import './TableCell';

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
  children?: Array<ColumnSchema>;

  /**
   * 可复制
   */
  copyable?: boolean;

  /**
   * 列表头提示
   */
  remark?: string;

  /**
   * 快速搜索
   */
  searchable?: boolean | SchemaObject;

  /**
   * 快速排序
   */
  sorter?: boolean;

  /**
   * 内容居左、居中、居右
   */
  align?: string;

  /**
   * 是否固定在左侧/右侧
   */
  fixed?: boolean | string;

  /**
   * 当前列是否展示
   */
  toggled?: boolean;
}

export interface RowSelectionOptionsSchema {
  /**
   * 选择类型 选择全部
   */
  key: string; // 选择类型 目前只支持all、invert、none、odd、even

  /**
   * 选项显示文本
   */
  text: string;
}

export interface RowSelectionSchema {
  /**
   * 选择类型 单选/多选
   */
  type: string;

  /**
   * 对应数据源的key值
   */
  keyField?: string;

  /**
   * 行是否禁用表达式
   */
  disableOn?: string;

  /**
   * 自定义选择菜单
   */
  selections?: Array<RowSelectionOptionsSchema>;

  /**
   * 已选择的key值
   */
  selectedRowKeys?: Array<string | number>;

  /**
   * 已选择的key值表达式
   */
  selectedRowKeysExpr: string;

  /**
   * 已选择的key值表达式
   */
  columnWidth?: number;

  /**
   * 是否点击行触发选中或取消选中
   */
  rowClick?: boolean;
}

export interface ExpandableSchema {
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

  /**
   * 已展开的key值
   */
  expandedRowKeys: Array<string | number>;

  /**
   * 已展开的key值表达式
   */
  expandedRowKeysExpr: string;
}

export interface TableSchemaV2 extends BaseSchema {
  /**
   * 指定为表格类型
   */
  type: 'table-v2';

  /**
   * 表格标题
   */
  title?: string | SchemaObject | Array<SchemaObject>;

  /**
   * 表格数据源
   */
  source: SchemaTokenizeableString;

  /**
   * 表格可自定义列
   */
  columnsTogglable: boolean;

  /**
   * 表格可自定义列的一些配置
   */
  columnsToggler: any;
  // columnsToggler: ColumnTogglerProps;

  /**
   * 表格列配置
   */
  columns: Array<ColumnSchema>;

  /**
   * 表格可选择配置
   */
  rowSelection?: RowSelectionSchema;

  /**
   * 表格行可展开配置
   */
  expandable?: ExpandableSchema;

  /**
   * 表格行可展开内容配置
   */
  expandableBody?: Array<SchemaObject>;

  /**
   * 粘性头部
   */
  sticky?: boolean;

  /**
   * 加载中
   */
  loading?: boolean | string | SchemaObject;

  /**
   * 行角标
   */
  itemBadge?: BadgeSchema;

  /**
   * 指定挂载dom
   */
  popOverContainer?: any;

  /**
   * 嵌套展开记录的唯一标识
   */
  keyField?: string;

  /**
   * 数据源嵌套自定义字段名
   */
  childrenColumnName?: string;

  /**
   * 自定义行样式
   */
  rowClassNameExpr?: string;

  /**
   * 是否固定内容行高度
   */
  lineHeight?: string;

  /**
   * 是否展示边框
   */
  bordered?: boolean;

  /**
   * 是否展示表头
   */
  showHeader?: boolean;

  /**
   * 自定义表格样式
   */
  className?: string;

  /**
   * 指定表尾
   */
  footer?: string | SchemaObject | Array<SchemaObject>;
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
  control: any;

  constructor(props: TableV2Props) {
    super(props);

    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.controlRef = this.controlRef.bind(this);

    const {store, columnsTogglable, columns} = props;

    store.update({columnsTogglable, columns});
    TableRenderer.syncRows(store, props, undefined) && this.syncSelected();
  }

  controlRef(control: any) {
    // 因为 control 有可能被 n 层 hoc 包裹。
    while (control && control.getWrappedInstance) {
      control = control.getWrappedInstance();
    }

    this.control = control;
  }

  syncSelected() {
    const {store, rowSelection} = this.props;

    rowSelection &&
      rowSelection.onSelect &&
      rowSelection.onSelectonSelect(
        store.selectedRowKeys.map(item => item),
        store.selectedRows.map(item => item.data)
      );
  }

  static syncRows(
    store: ITableStore,
    props: TableV2Props,
    prevProps?: TableV2Props
  ) {
    const source = props.source;
    const value = props.value || props.items;
    let rows: Array<object> = [];
    let updateRows = false;

    if (
      Array.isArray(value) &&
      (!prevProps || (prevProps.value || prevProps.items) !== value)
    ) {
      updateRows = true;
      rows = value;
    } else if (typeof source === 'string') {
      const resolved = resolveVariableAndFilter(source, props.data, '| raw');
      const prev = prevProps
        ? resolveVariableAndFilter(source, prevProps.data, '| raw')
        : null;

      if (prev && prev === resolved) {
        updateRows = false;
      } else if (Array.isArray(resolved)) {
        updateRows = true;
        rows = resolved;
      }
    }
    updateRows &&
      store.initRows(
        rows,
        props.getEntryId,
        props.reUseRow,
        props.childrenColumnName
      );

    let selectedRowKeys: Array<string | number> = [];
    // selectedRowKeysExpr比selectedRowKeys优先级高
    if (props.rowSelection && props.rowSelection.selectedRowKeysExpr) {
      rows.forEach((row: any, index: number) => {
        const flag = filter(props.rowSelection.selectedRowKeysExpr, {
          record: row,
          rowIndex: index
        });
        if (flag === 'true') {
          selectedRowKeys.push(row[props?.rowSelection?.keyField || 'key']);
        }
      });
    } else if (props.rowSelection && props.rowSelection.selectedRowKeys) {
      selectedRowKeys = [...props.rowSelection.selectedRowKeys];
    }

    if (updateRows && selectedRowKeys.length > 0) {
      store.updateSelected(selectedRowKeys, props.rowSelection.keyField);
    }

    let expandedRowKeys: Array<string | number> = [];
    if (props.expandable && props.expandable.expandedRowKeysExpr) {
      rows.forEach((row: any, index: number) => {
        const flag = filter(props.expandable.expandedRowKeysExpr, {
          record: row,
          rowIndex: index
        });
        if (flag === 'true') {
          expandedRowKeys.push(row[props?.expandable?.keyField || 'key']);
        }
      });
    } else if (props.expandable && props.expandable.expandedRowKeys) {
      expandedRowKeys = [...props.expandable.expandedRowKeys];
    }

    if (updateRows && expandedRowKeys.length > 0) {
      store.updateExpanded(expandedRowKeys, props.expandable.keyField);
    }

    return updateRows;
  }

  componentDidUpdate(prevProps: TableV2Props) {
    const props = this.props;
    const store = props.store;

    if (anyChanged(['columnsTogglable'], prevProps, props)) {
      store.update({
        columnsTogglable: props.columnsTogglable
      });
    }

    if (
      anyChanged(['source', 'value', 'items'], prevProps, props) ||
      (!props.value &&
        !props.items &&
        (props.data !== prevProps.data ||
          (typeof props.source === 'string' && isPureVariable(props.source))))
    ) {
      TableRenderer.syncRows(store, props, prevProps) && this.syncSelected();
    }

    if (!isEqual(prevProps.columns, props.columns)) {
      store.update({
        columns: props.columns
      });
    }
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  renderCellSchema(schema: any, props: any) {
    const {render} = this.props;

    // Table Cell SchemaObject转化成ReactNode
    if (schema && isObject(schema)) {
      // 在TableCell里会根据width设置div的width
      // 原来的table td/th是最外层标签 设置width没问题
      // v2的拆开了 就不需要再设置div的width了
      // 否则加上padding 就超出单元格的区域了
      // children属性在schema里是一个关键字 在渲染器schema中 自定义的children没有用 去掉
      const {width, children, ...rest} = schema;
      return render(
        'cell-field',
        {
          ...rest,
          type: 'cell-field',
          column: rest,
          data: props.data,
          name: schema.key
        },
        props
      );
    }

    return schema;
  }

  renderSchema(key: string, schema: any, props?: any) {
    const {render} = this.props;

    // Header、Footer等SchemaObject转化成ReactNode
    if (schema && isObject(schema)) {
      return render(key || 'field', {...schema, data: props.data}, props);
    } else if (Array.isArray(schema)) {
      const renderers: Array<any> = [];
      schema.forEach((s, i) =>
        renderers.push(
          render(
            key || 'field',
            {
              ...s,
              data: props.data
            },
            {...props, key: i}
          )
        )
      );
      return renderers;
    }

    return schema;
  }
  // editor传来的处理过的column 还可能包含其他字段
  buildColumns(columns: Array<any>) {
    const {
      env,
      render,
      store,
      popOverContainer,
      canAccessSuperData,
      showBadge,
      itemBadge,
      classnames: cx
    } = this.props;

    const cols: Array<any> = [];
    const rowSpans: Array<CellSpan> = [];
    const colSpans: Array<CellSpan> = [];

    Array.isArray(columns) &&
      columns.forEach((column, col) => {
        const clone = {...column} as any;

        let titleSchema: any = null;
        const titleProps = {
          popOverContainer: popOverContainer || this.getPopOverContainer,
          value: column.title
        };
        if (isObject(column.title)) {
          titleSchema = cloneDeep(column.title);
        } else if (typeof column.title === 'string') {
          titleSchema = {type: 'plain'};
        }

        const titleRender = (children: any) => {
          const content = this.renderCellSchema(titleSchema, titleProps);

          let remark = null;
          if (column.remark) {
            remark = render('remark', {
              type: 'remark',
              tooltip: column.remark,
              container:
                env && env.getModalContainer ? env.getModalContainer : undefined
            });
          }

          return (
            <div className={cx('Table-head-cell-wrapper')}>
              {content}
              {remark}
              {children}
            </div>
          );
        };

        Object.assign(clone, {
          title: titleRender
        });

        // 设置了type值 就完全按渲染器处理了
        if (column.type) {
          Object.assign(clone, {
            render: (
              text: string,
              record: any,
              rowIndex: number,
              colIndex: number
            ) => {
              const props: RenderProps = {};
              const item = store.getRowByIndex(rowIndex);
              const obj = {
                children: this.renderCellSchema(column, {
                  data: item.locals,
                  value: column.key
                    ? resolveVariable(
                        column.key,
                        canAccessSuperData ? item.locals : item.data
                      )
                    : column.key,
                  popOverContainer:
                    popOverContainer || this.getPopOverContainer,
                  onQuickChange: (
                    values: object,
                    saveImmediately?: boolean,
                    savePristine?: boolean,
                    resetOnFailed?: boolean
                  ) => {
                    this.handleQuickChange(
                      item,
                      values,
                      saveImmediately,
                      savePristine,
                      resetOnFailed
                    );
                  },
                  row: item,
                  showBadge,
                  itemBadge
                }),
                props
              };
              if (column.rowSpanExpr) {
                const rowSpan = +filter(column.rowSpanExpr, {
                  record,
                  rowIndex,
                  colIndex
                });
                if (rowSpan) {
                  obj.props.rowSpan = rowSpan;
                  rowSpans.push({colIndex, rowIndex, rowSpan});
                }
              }

              if (column.colSpanExpr) {
                const colSpan = +filter(column.colSpanExpr, {
                  record,
                  rowIndex,
                  colIndex
                });
                if (colSpan) {
                  obj.props.colSpan = colSpan;
                  colSpans.push({colIndex, rowIndex, colSpan});
                }
              }

              rowSpans.forEach(item => {
                if (
                  colIndex === item.colIndex &&
                  rowIndex > item.rowIndex &&
                  rowIndex < item.rowIndex + (item.rowSpan || 0)
                ) {
                  obj.props.rowSpan = 0;
                }
              });

              colSpans.forEach(item => {
                if (
                  rowIndex === item.rowIndex &&
                  colIndex > item.colIndex &&
                  colIndex < item.colIndex + (item.colSpan || 0)
                ) {
                  obj.props.colSpan = 0;
                }
              });

              return obj;
            }
          });
        }

        // 设置了列搜索
        if (column.searchable) {
          clone.filterDropdown = (
            <HeadCellSearchDropDown
              {...this.props}
              popOverContainer={this.getPopOverContainer}
              name={column.key}
              searchable={column.searchable}
              orderBy={store.orderBy}
              orderDir={store.order}
              data={store.query}
              key={'th-search-' + col}
              store={store}
            />
          );
        }

        if (column.children) {
          clone.children = this.buildColumns(column.children);
        }

        cols.push(clone);
      });

    return cols;
  }

  buildSummary(key: string, summary: Array<any>) {
    const result: Array<any> = [];
    if (Array.isArray(summary)) {
      summary.forEach((s, index) => {
        if (isObject(s)) {
          result.push({
            colSpan: s.colSpan,
            fixed: s.fixed,
            render: (dataSouce: Array<any>) =>
              this.renderSchema(key, s, {
                data: dataSouce
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
              render: (dataSouce: Array<any>) =>
                this.renderSchema(key, d, {
                  data: dataSouce
                })
            });
          });
        }
      });
    }

    return result.length ? result : null;
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  handleSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    indexes: Array<string>,
    unModifiedItems?: Array<any>,
    rowsOrigin?: Array<object> | object,
    resetOnFailed?: boolean
  ) {
    const {
      store,
      quickSaveApi,
      quickSaveItemApi,
      primaryField,
      env,
      messages,
      reload
    } = this.props;

    if (Array.isArray(rows)) {
      if (!isEffectiveApi(quickSaveApi)) {
        env && env.alert('TableV2 quickSaveApi is required');
        return;
      }

      const data: any = createObject(store.data, {
        rows,
        rowsDiff: diff,
        indexes: indexes,
        rowsOrigin
      });

      if (rows.length && rows[0].hasOwnProperty(primaryField || 'id')) {
        data.ids = rows
          .map(item => (item as any)[primaryField || 'id'])
          .join(',');
      }

      if (unModifiedItems) {
        data.unModifiedItems = unModifiedItems;
      }

      store
        .saveRemote(quickSaveApi, data, {
          successMessage: messages && messages.saveFailed,
          errorMessage: messages && messages.saveSuccess
        })
        .then(() => {
          reload && this.reloadTarget(reload, data);
        })
        .catch(() => {});
    } else {
      if (!isEffectiveApi(quickSaveItemApi)) {
        env && env.alert('TableV2 quickSaveItemApi is required!');
        return;
      }

      const data = createObject(store.data, {
        item: rows,
        modified: diff,
        origin: rowsOrigin
      });

      const sendData = createObject(data, rows);
      store
        .saveRemote(quickSaveItemApi, sendData)
        .then(() => {
          reload && this.reloadTarget(reload, data);
        })
        .catch(() => {
          resetOnFailed && this.control.reset();
        });
    }
  }

  handleQuickChange(
    item: IRow,
    values: object,
    saveImmediately?: boolean | any,
    savePristine?: boolean,
    resetOnFailed?: boolean
  ) {
    if (!isAlive(item)) {
      return;
    }

    const {onSave, onPristineChange, primaryField, quickSaveItemApi} =
      this.props;

    item.change(values, savePristine);

    // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
    item.modified && this.syncSelected();

    if (savePristine) {
      onPristineChange?.(item.data, item.path);
      return;
    }

    if (saveImmediately && saveImmediately.api) {
      this.props.onAction(
        null,
        {
          actionType: 'ajax',
          api: saveImmediately.api
        },
        values
      );
      return;
    }

    onSave
      ? onSave(
          item.data,
          difference(item.data, item.pristine, ['id', primaryField]),
          item.path,
          undefined,
          item.pristine,
          resetOnFailed
        )
      : this.handleSave(
          quickSaveItemApi ? item.data : [item.data],
          difference(item.data, item.pristine, ['id', primaryField]),
          [item.path],
          undefined,
          item.pristine,
          resetOnFailed
        );
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
        icon={config?.icon}
        label={config?.label || ''}
        draggable={config?.draggable}
        columns={store.columnsData}
        onColumnToggle={this.handleColumnToggle}
      >
        {store.toggableColumns.map((column, index) => (
          <li
            className={cx('ColumnToggler-menuItem')}
            key={'toggable-li-' + index}
            onClick={column.toggleToggle}
          >
            <Checkbox
              key={'toggable-select' + index}
              size="sm"
              classPrefix={ns}
              checked={column.toggled}
            >
              {column.title ? render('tpl', column.title) : null}
            </Checkbox>
          </li>
        ))}
      </ColumnToggler>
    );
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: object) {
    const {onAction} = this.props;

    // todo
    onAction(e, action, ctx);
  }

  renderActions(region: string) {
    let {
      actions,
      render,
      store,
      classnames: cx,
      data,
      columnsToggler
    } = this.props;

    actions = Array.isArray(actions) ? actions.concat() : [];

    if (
      store.toggable &&
      region === 'header' &&
      !~this.renderedToolbars.indexOf('columns-toggler')
    ) {
      actions.push({
        type: 'button',
        children: this.renderColumnsToggler(columnsToggler)
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
              onAction: this.handleAction,
              key,
              btnDisabled: store.dragging,
              data: store.getData(data)
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
      rowSelection,
      columns,
      expandable,
      expandableBody,
      footSummary,
      headSummary,
      loading,
      classnames: cx,
      placeholder,
      rowClassNameExpr,
      store,
      ...rest
    } = this.props;

    let expandableConfig: any = null;
    if (expandable) {
      const {expandedRowKeys, ...rest} = expandable;

      expandableConfig = {
        expandedRowKeys: store.currentExpandedKeys,
        ...rest
      };

      if (expandable.expandableOn) {
        expandableConfig.rowExpandable = (record: any, rowIndex: number) =>
          evalExpression(expandable.expandableOn, {record, rowIndex});
        delete expandableConfig.expandableOn;
      }

      if (expandableBody && expandableBody.length > 0) {
        expandableConfig.expandedRowRender = (record: any, rowIndex: number) =>
          this.renderSchema('expandableBody', expandableBody, {data: record});
      }

      if (expandable.expandedRowClassNameExpr) {
        expandableConfig.expandedRowClassName = (
          record: any,
          rowIndex: number
        ) => filter(expandable.expandedRowClassNameExpr, {record, rowIndex});
        delete expandableConfig.expandedRowClassNameExpr;
      }
    }

    let rowSelectionConfig: any = null;
    if (rowSelection) {
      const {selectedRowKeys, selections, ...rest} = rowSelection;
      rowSelectionConfig = {
        selectedRowKeys: store.currentSelectedRowKeys,
        ...rest
      };

      if (rowSelection.disableOn) {
        const disableOn = rowSelection.disableOn;

        rowSelectionConfig.getCheckboxProps = (
          record: any,
          rowIndex: number
        ) => ({
          disabled: evalExpression(disableOn, {record, rowIndex})
        });

        delete rowSelectionConfig.disableOn;
      }

      if (selections && Array.isArray(selections)) {
        rowSelectionConfig.selections = [];

        selections.forEach((item: RowSelectionOptionsSchema) => {
          rowSelectionConfig.selections.push({
            key: item.key,
            text: item.text,
            onSelect: (changableRowKeys: Array<string | number>) => {
              let newSelectedRowKeys = [];
              newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                if (item.key === 'all') {
                  return true;
                }
                if (item.key === 'none') {
                  return false;
                }
                if (item.key === 'invert') {
                  return !store.currentSelectedRowKeys.includes(key);
                }
                // 奇数行
                if (item.key === 'odd') {
                  if (index % 2 !== 0) {
                    return false;
                  }
                  return true;
                }
                // 偶数行
                if (item.key === 'even') {
                  if (index % 2 !== 0) {
                    return true;
                  }
                  return false;
                }
                return true;
              });
              store.updateSelected(newSelectedRowKeys, rowSelection.keyField);
            }
          });
        });
      }

      // 因为要通过原子组件Table同步store里的selectedRows
      // 因此onSelect在这里处理一下
      rowSelectionConfig.onSelect = (
        record: any,
        value: boolean,
        selectedRows: Array<any>,
        selectedRowKeys: Array<string | number>
      ) => {
        store.updateSelected(selectedRowKeys, rowSelection.keyField);

        rowSelection.onSelect &&
          rowSelection.onSelect(record, value, selectedRows, selectedRowKeys);
      };
    }

    let rowClassName = undefined;
    // 设置了行样式
    if (rowClassNameExpr) {
      rowClassName = (record: any, rowIndex: number) => {
        return filter(rowClassNameExpr, {record, rowIndex});
      };
    }

    return (
      <Table
        {...rest}
        title={this.renderSchema('title', title, {data: this.props.data})}
        footer={this.renderSchema('footer', footer, {data: this.props.data})}
        columns={this.buildColumns(store.filteredColumns)}
        dataSource={store.dataSource}
        rowSelection={rowSelectionConfig}
        rowClassName={rowClassName}
        expandable={expandableConfig}
        footSummary={this.buildSummary('footSummary', footSummary)}
        headSummary={this.buildSummary('headSummary', headSummary)}
        loading={this.renderSchema('loading', loading)}
        placeholder={this.renderSchema('placeholder', placeholder)}
      ></Table>
    );
  }

  render() {
    const {classnames: cx} = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了

    return (
      <div className={cx('Table-render-wrapper')}>
        {this.renderActions('header')}
        {this.renderTable()}
      </div>
    );
  }
}
