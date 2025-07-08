import React from 'react';
import {findDOMNode} from 'react-dom';
import {reaction} from 'mobx';
import {isAlive} from 'mobx-state-tree';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import intersection from 'lodash/intersection';

import {
  ScopedContext,
  IScopedContext,
  Renderer,
  RendererProps,
  ActionObject,
  isObject,
  anyChanged,
  difference,
  createObject,
  autobind,
  resolveVariableAndFilter,
  isPureVariable,
  resolveVariable,
  evalExpression,
  filter,
  isEffectiveApi,
  TableStore2,
  ITableStore2,
  IRow2,
  ClassNamesFn,
  isArrayChildrenModified,
  filterTarget,
  changedEffect,
  evalExpressionWithConditionBuilderAsync,
  normalizeApi,
  getPropValue,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {Icon, Table, BadgeObject, SpinnerExtraProps} from 'amis-ui';
import type {
  SortProps,
  ColumnProps,
  OnRowProps,
  SummaryProps,
  RowSelectionProps,
  ExpandableProps,
  AutoFillHeightObject
} from 'amis-ui/lib/components/table/index';
import {
  BaseSchema,
  SchemaObject,
  SchemaTokenizeableString,
  SchemaApi,
  SchemaMessage
} from '../../Schema';
import {ActionSchema} from '../Action';
import HeadCellSearchDropDown from './HeadCellSearchDropdown';
import './TableCell';
import './ColumnToggler';
import {SchemaQuickEdit} from '../QuickEdit';

import type {TestIdBuilder} from 'amis-core';

/**
 * Table 表格2渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/table2
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
  name: string;

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
   * 兼容table快速排序
   */
  sortable?: boolean;

  /**
   * 兼容table列筛选
   */
  filterable?: {
    source?: string;
    options?: Array<any>;
  };

  /**
   * 内容居左、居中、居右
   */
  align?: string;

  /**
   * 标题内容居左、居中、居右
   */
  headerAlign?: 'left' | 'center' | 'right';

  /**
   * 列垂直对齐方式
   */
  vAlign?: 'top' | 'middle' | 'bottom';

  /**
   * 是否固定在左侧/右侧
   */
  fixed?: boolean | string;

  /**
   * 当前列是否展示
   */
  toggled?: boolean;

  /**
   * 列样式
   */
  className?: string;

  /**
   * 表头单元格样式
   */
  titleClassName?: string;

  /**
   * 单元格样式
   */
  classNameExpr?: string;

  /**
   * 配置快速编辑功能
   */
  quickEdit?: SchemaQuickEdit;

  width?: string | number;

  /**
   * 表格列单元格是否可以获取父级数据域值，默认为true，该配置对当前列内单元格生效
   */
  canAccessSuperData?: boolean;
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
  selectedRowKeysExpr?: string;

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
   * 对应渲染器类型
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

  /**
   * 已展开的key值
   */
  expandedRowKeys: Array<string | number>;

  /**
   * 已展开的key值表达式
   */
  expandedRowKeysExpr: string;
}

export interface TableSchema2 extends BaseSchema {
  /**
   * 指定为表格类型
   */
  type: 'table2';

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
  columnsTogglable?: 'auto' | boolean | SchemaObject;

  /**
   * 表格列配置
   */
  columns: Array<ColumnSchema>;

  /**
   * 表格可选择配置
   */
  rowSelection?: RowSelectionSchema | boolean;

  /**
   * 表格行可展开配置
   */
  expandable?: ExpandableSchema;

  /**
   * 粘性头部
   */
  sticky?: boolean;

  /**
   * 加载中
   */
  loading?: boolean | string | SchemaObject;

  /**
   * 行角标内容
   */
  itemBadge?: BadgeObject;

  /**
   * 是否展示行角标
   */
  showBadge?: boolean;

  /**
   * 指定挂载dom
   */
  popOverContainer?: any;

  /**
   * 多选、嵌套展开记录的ID字段名 默认id
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
   * 指定表尾
   */
  footer?: string | SchemaObject | Array<SchemaObject>;

  /**
   * 快速编辑后用来批量保存的 API
   */
  quickSaveApi?: SchemaApi;

  /**
   * 快速编辑配置成及时保存时使用的 API
   */
  quickSaveItemApi?: SchemaApi;

  /**
   * 接口报错信息配置
   */
  messages?: SchemaMessage;

  /**
   * 重新加载的组件名称
   */
  reload?: string;

  /**
   * 操作列配置
   */
  actions?: Array<ActionSchema>;

  /**
   * 批量操作最大限制数
   */
  maxKeepItemSelectionLength?: number;

  /**
   * 翻页是否保存数据
   */
  keepItemSelectionOnPageChange?: boolean;

  /**
   * 是否可选择 作用同rowSelection 兼容原CRUD属性 默认多选
   */
  selectable?: boolean;

  /**
   * 是否可多选 作用同rowSelection.type 兼容原CRUD属性 不设置认为是多选 仅设置selectable才起作用
   */
  multiple?: boolean;

  /**
   * 设置ID字段名 作用同keyFiled 兼容原CURD属性
   */
  primaryField?: string;

  tableLayout?: 'fixed' | 'auto';

  /**
   * 表格自动计算高度
   */
  autoFillHeight?: boolean | AutoFillHeightObject;

  /**
   * 表格是否可以获取父级数据域值，默认为false
   */
  canAccessSuperData?: boolean;

  /**
   * 当一次性渲染太多列上有用，默认为 100，可以用来提升表格渲染性能
   * @default 100
   */
  lazyRenderAfter?: number;
}

// 事件调整 对应CRUD2里的事件配置也需要同步修改
export type Table2RendererEvent =
  | 'selectedChange'
  | 'columnSort'
  | 'columnFilter'
  | 'columnSearch'
  | 'columnToggled'
  | 'orderChange'
  | 'rowClick'
  | 'rowDbClick'
  | 'rowMouseEnter'
  | 'rowMouseLeave';

export type Table2RendererAction =
  | 'selectAll'
  | 'clearAll'
  | 'select'
  | 'expand';

export interface Table2Props extends RendererProps, SpinnerExtraProps {
  title?: string;
  columns: Array<ColumnSchema | ColumnProps>;
  onSelect?: Function;
  reUseRow?: boolean;
  getEntryId?: (entry: any, index: number) => string;
  store: ITableStore2;
  rowSelection?: RowSelectionSchema;
  expandable?: ExpandableSchema;
  classnames: ClassNamesFn;
  onSave?: Function;
  onSaveOrder?: Function;
  onPristineChange?: Function;
  onAction?: Function;
  onSort?: (payload: {orderBy: string; orderDir: string}) => void;
  onSearch?: Function;
  onRow?: OnRowProps;
  placeholder?: string | SchemaObject;
  itemActions?: Array<ActionObject>;
  headSummary?: Array<SummaryProps | Array<SummaryProps>>;
  footSummary?: Array<SummaryProps | Array<SummaryProps>>;
  headingClassName?: string;
  keepItemSelectionOnPageChange?: boolean;
  maxKeepItemSelectionLength?: number;
  canAccessSuperData?: boolean;
}

export default class Table2 extends React.Component<Table2Props, object> {
  static contextType = ScopedContext;

  static propsList: Array<string> = [
    'source',
    'columnsTogglable',
    'columns',
    'items',
    'rowSelection',
    'expandable',
    'sticky',
    'itemBadge',
    'popOverContainer',
    'keyField',
    'childrenColumnName',
    'rowClassNameExpr',
    'lineHeight',
    'bordered',
    'footer',
    'maxKeepItemSelectionLength',
    'keepItemSelectionOnPageChange',
    'itemActions',
    'headingClassName',
    'footSummary',
    'headSummary',
    'saveImmediately',
    'selectable',
    'multiple',
    'primaryField',
    'hideQuickSaveBtn',
    'selected',
    'placeholder',
    'autoFillHeight'
  ];

  renderedToolbars: Array<string> = [];
  tableRef?: any;
  subForms: any = {};
  columns: Array<ColumnProps> = [];
  rowSelection: RowSelectionProps;
  expandable: ExpandableProps;
  reactions: Array<any> = [];

  static defaultProps: Partial<Table2Props> = {
    keyField: 'id',
    canAccessSuperData: false,
    lazyRenderAfter: 100
  };

  constructor(props: Table2Props, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);

    const {
      store,
      columnsTogglable,
      columns,
      rowSelection,
      keyField,
      primaryField,
      canAccessSuperData,
      persistKey
    } = props;

    store.update({
      columnsTogglable,
      columns,
      canAccessSuperData,
      rowSelectionKeyField: primaryField || rowSelection?.keyField || keyField,
      persistKey
    });
    Table2.syncRows(store, props, undefined) && this.syncSelected();

    this.columns = this.buildColumns(store.filteredColumns, [], []);
    this.rowSelection = this.buildRowSelection();
    this.expandable = this.buildExpandable();
    this.reactions.push(
      reaction(
        () => store.currentSelectedRowKeys.join(','),
        () => {
          this.rowSelection = this.buildRowSelection();
          this.forceUpdate();
        }
      )
    );
    this.reactions.push(
      reaction(
        () => store.currentExpandedKeys.join(','),
        () => {
          this.expandable = this.buildExpandable();
          this.forceUpdate();
        }
      )
    );
    this.reactions.push(
      reaction(
        () => store.filteredColumns,
        () => {
          this.columns = this.buildColumns(store.filteredColumns, [], []);
          this.forceUpdate();
        }
      )
    );
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    this.reactions && this.reactions.forEach(reaction => reaction());
  }

  syncSelected() {
    const {store, onSelect} = this.props;

    onSelect &&
      onSelect(
        store.selectedRows.map((item: IRow2) => item.data),
        store.unSelectedRows.map((item: IRow2) => item.data)
      );
  }

  static syncRows(
    store: ITableStore2,
    props: Table2Props,
    prevProps?: Table2Props
  ) {
    const source = props.source;
    const value = getPropValue(props, (props: Table2Props) => props.items);
    let rows: Array<object> = [];
    let updateRows = false;

    if (Array.isArray(value)) {
      if (
        !prevProps ||
        getPropValue(prevProps, (props: Table2Props) => props.items) !== value
      ) {
        updateRows = true;
        rows = value;
      }
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
    const keyField = store.keyField;
    // selectedRowKeysExpr比selectedRowKeys优先级高
    if (Array.isArray(props.selected)) {
      selectedRowKeys = props.selected.map((item: any) => item[keyField]) || [];
    } else {
      if (props.rowSelection && props.rowSelection.selectedRowKeysExpr) {
        rows.forEach((row: any, index: number) => {
          const flag = evalExpression(
            props.rowSelection?.selectedRowKeysExpr || '',
            {
              record: row,
              rowIndex: index
            }
          );
          if (flag) {
            selectedRowKeys.push(row[keyField]);
          }
        });
      } else if (props.rowSelection && props.rowSelection.selectedRowKeys) {
        selectedRowKeys = [...props.rowSelection.selectedRowKeys];
      }
    }
    if (updateRows && selectedRowKeys.length > 0) {
      store.updateSelected(selectedRowKeys);
    }

    let expandedRowKeys: Array<string | number> = [];
    const expandableKeyField =
      props.primaryField || props.expandable?.keyField || props.keyField;
    if (props.expandable && props.expandable.expandedRowKeysExpr) {
      rows.forEach((row: any, index: number) => {
        const flag = evalExpression(
          props.expandable?.expandedRowKeysExpr || '',
          {
            record: row,
            rowIndex: index
          }
        );
        if (flag) {
          expandedRowKeys.push(row[expandableKeyField]);
        }
      });
    } else if (props.expandable && props.expandable.expandedRowKeys) {
      expandedRowKeys = [...props.expandable.expandedRowKeys];
    }

    if (updateRows && expandedRowKeys.length > 0) {
      store.updateExpanded(expandedRowKeys, expandableKeyField);
    }

    return updateRows;
  }

  componentDidUpdate(prevProps: Table2Props) {
    const props = this.props;
    const store = props.store;

    changedEffect(
      ['orderBy', 'columnsTogglable', 'canAccessSuperData', 'persistKey'],
      prevProps,
      props,
      changes => {
        if (changes.orderBy && !props.onQuery) {
          delete changes.orderBy;
        }
        store.update(changes as any, {
          resolveDefinitions: props.resolveDefinitions
        });
      }
    );

    if (
      anyChanged(['source', 'value', 'items'], prevProps, props) ||
      (!props.value &&
        !props.items &&
        (props.data !== prevProps.data ||
          (typeof props.source === 'string' && isPureVariable(props.source))))
    ) {
      Table2.syncRows(store, props, prevProps) && this.syncSelected();
    } else if (isArrayChildrenModified(prevProps.selected!, props.selected!)) {
      const keyField = store.keyField;
      const prevSelectedRows = store.selectedRows
        .map((item: any) => item[keyField])
        .join(',');
      store.updateSelected(
        props.selected.map((item: any) => item[keyField]) || []
      );
      const selectedRows = store.selectedRows
        .map((item: any) => item[keyField])
        .join(',');
      prevSelectedRows !== selectedRows && this.syncSelected();
    }

    if (anyChanged(['columns'], prevProps, props)) {
      store.update({
        columns: props.columns
      });
    }

    if (
      anyChanged(
        [
          'rowSelection',
          'selectable',
          'multiple',
          'maxKeepItemSelectionLength'
        ],
        prevProps,
        props
      )
    ) {
      this.rowSelection = this.buildRowSelection();
    }

    if (anyChanged(['query', 'pageField', 'perPageField'], prevProps, props)) {
      store.updateQuery(
        props.query,
        undefined,
        props.pageField,
        props.perPageField,
        true
      );
    }

    if (
      !isEqual(
        prevProps?.rowSelection?.keyField,
        props.rowSelection?.keyField
      ) ||
      !isEqual(prevProps.keyField, props.keyField)
    ) {
      store.update({
        rowSelectionKeyField:
          props.primaryField || props.rowSelection?.keyField || props.keyField
      });
    }
  }

  @autobind
  getPopOverContainer() {
    return findDOMNode(this);
  }

  @autobind
  subFormRef(form: any, x: number, y: number) {
    const {quickEditFormRef} = this.props;

    quickEditFormRef && quickEditFormRef(form, x, y);
    this.subForms[`${x}-${y}`] = form;
    form && this.props.store.addForm(form.props.store, y);
  }

  @autobind
  reset() {
    const {store} = this.props;

    store.reset();

    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    subForms.forEach(item => item.clearErrors());
  }

  renderCellSchema(schema: any, props: any) {
    const {render, store} = this.props;

    // Table Cell SchemaObject转化成ReactNode
    if (schema && isObject(schema)) {
      // 在TableCell里会根据width设置div的width
      // 原来的table td/th是最外层标签 设置width没问题
      // table2的拆开了 就不需要再设置div的width了
      // 否则加上padding 就超出单元格的区域了
      // children属性在schema里是一个关键字 在渲染器schema中 自定义的children没有用 去掉

      // title 不应该传递到 cell-field 的 column 中，否则部分组件会将其渲染出来
      // 但是 cell-field 需要这个字段，展示列的名称
      const {width, children, wrapperComponent, title, ...rest} = schema;

      return render(
        'cell-field',
        {
          ...rest,
          // 空字符串/null 被认为是正常的值，导致 defaultProps 不生效
          wrapperComponent: wrapperComponent || undefined,
          title: title || rest.label,
          type: 'cell-field',
          column: rest,
          data: props.data,
          name: schema.name
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
      return render(key || 'field', {...schema, data: props?.data}, props);
    } else if (Array.isArray(schema)) {
      const renderers: Array<any> = [];
      schema.forEach((s, i) =>
        renderers.push(
          render(
            key || 'field',
            {
              ...s,
              data: props?.data
            },
            {...props, key: i}
          )
        )
      );
      return renderers;
    }
    if (typeof schema === 'string') {
      return filter(schema, props?.data);
    }
    return schema;
  }
  // editor传来的处理过的column 还可能包含其他字段
  buildColumns(
    columns: Array<any>,
    rowSpans: Array<CellSpan>,
    colSpans: Array<CellSpan>
  ) {
    const {
      render,
      store,
      popOverContainer,
      canAccessSuperData,
      showBadge,
      itemBadge,
      data,
      classnames: cx,
      env,
      testIdBuilder
    } = this.props;

    const cols: Array<any> = [];
    rowSpans = rowSpans;
    colSpans = colSpans;

    Array.isArray(columns) &&
      columns.forEach(async (column, col) => {
        const clone = {...column} as any;

        let titleSchema: any = null;
        const title = clone.title || clone.label;
        const titleProps = {
          ...data,
          popOverContainer: popOverContainer || this.getPopOverContainer
        };
        if (isObject(column.title)) {
          titleSchema = cloneDeep(column.title);
        } else if (typeof title === 'string') {
          titleSchema = {type: 'plain', tpl: title};
        }

        if (column.headerAlign || column.align) {
          titleSchema.align = column.headerAlign || column.align;
          titleSchema.className = 'flex-1';
        }

        const titleRender = (children: any) => {
          const content = this.renderCellSchema(titleSchema, titleProps);

          let remark = null;
          if (column.remark) {
            remark = render('remark', {
              type: 'remark',
              tooltip: column.remark,
              container: this.getPopOverContainer
            });
          }

          return (
            <div
              key={col}
              className={cx('Table-head-cell-wrapper', {
                [`${column.className}`]: !!column.className,
                [`${column.titleClassName}`]: !!column.titleClassName
              })}
              style={{
                justifyContent:
                  (
                    {
                      right: 'flex-end',
                      center: 'center'
                    } as any
                  )[column.align] || 'flex-start'
              }}
            >
              {content}
              {remark}
              {children}
            </div>
          );
        };

        Object.assign(clone, {
          title: titleRender
        });

        const isGroupColumn = !!column.children?.length;
        const finalCanAccessSuperData =
          column.canAccessSuperData ?? canAccessSuperData;
        // 设置了type值 就完全按渲染器处理了
        if (column.type) {
          Object.assign(clone, {
            render: (
              text: string,
              record: any,
              rowIndex: number,
              colIndex: number,
              levels?: Array<number>
            ) => {
              const props: RenderProps = {};

              const item =
                store.getRowByIndex(rowIndex, [...(levels || [])]) || {};
              const itemIDBuilder = testIdBuilder?.getChild(
                `row-${rowIndex}-cell-${colIndex}`
              );

              const obj = {
                children: this.renderCellSchema(column, {
                  data: item.locals,
                  // 不要下发 value，组件基本上都会自己取
                  // 如果下发了表单项会认为是 controlled value
                  // 就不会去跑 extraName 之类的逻辑了
                  // value: column.name
                  //   ? resolveVariable(
                  //       column.name,
                  //       finalCanAccessSuperData ? item.locals : item.data
                  //     )
                  //   : column.name,
                  btnDisabled: store.dragging,
                  popOverContainer:
                    popOverContainer || this.getPopOverContainer,
                  quickEditFormRef: this.subFormRef,
                  onQuickChange: (
                    values: object,
                    saveImmediately?: boolean | any,
                    savePristine?: boolean,
                    options?: {
                      resetOnFailed?: boolean;
                      reload?: string;
                    }
                  ) => {
                    this.handleQuickChange(
                      item,
                      values,
                      saveImmediately,
                      savePristine,
                      options
                    );
                  },
                  row: item,
                  showBadge: showBadge && col === 0,
                  itemBadge,
                  testIdBuilder: itemIDBuilder
                }),
                props
              };

              // 分组表头配置了合并行或者列也不生效
              if (!isGroupColumn && column.rowSpanExpr) {
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

              if (!isGroupColumn && column.colSpanExpr) {
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
              name={column.name}
              searchable={column.searchable}
              onSearch={this.handleSearch}
              key={'th-search-' + col}
              testIdBuilder={testIdBuilder?.getChild(`head-search-${col}`)}
            />
          );
        }

        // 设置了列排序
        if (column.sortable) {
          clone.sorter = true;
        }

        // 设置了列筛选
        if (column.filterable) {
          if (column.filterable.options) {
            clone.filters = column.filterable.options.map(
              (option: {label: string; value: string | number} | string) => {
                if (typeof option === 'string') {
                  return {
                    text: option,
                    value: option
                  };
                }
                return {
                  text: option.label,
                  value: option.value
                };
              }
            );
          } else if (column.filterable.source) {
            const source = column.filterable.source;
            if (isPureVariable(source)) {
              const datasource = resolveVariableAndFilter(
                source,
                data,
                '| raw'
              );
              clone.filters = datasource;
            } else if (isEffectiveApi(source, data)) {
              const api = normalizeApi(source);
              api.cache = 3000; // 开启 3s 缓存，因为固顶位置渲染1次会额外多次请求。

              const ret = await env.fetcher(api, data);
              const options = (ret.data && ret.data.options) || [];
              clone.filters = options;
            }
          }
        }

        if (isGroupColumn) {
          clone.children = this.buildColumns(
            column.children,
            rowSpans,
            colSpans
          );
        }

        cols.push(clone);
      });
    return cols;
  }

  buildSummary(key: string, summary?: Array<any>) {
    const result: Array<any> = [];
    if (Array.isArray(summary)) {
      summary.forEach((s, index) => {
        if (isObject(s)) {
          result.push({
            colSpan: s.colSpan,
            fixed: s.fixed,
            cellClassName: s.cellClassName,
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
              cellClassName: d.cellClassName,
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

  @autobind
  rowClassName(record: any, rowIndex: number) {
    const {rowClassNameExpr, store, themeCss, id, rowClassName} = this.props;

    const classnames = [];
    if (rowClassName) {
      classnames.push(rowClassName);
    }
    if (rowClassNameExpr) {
      classnames.push(filter(rowClassNameExpr, {...record, rowIndex}));
    }
    // row可能不存在
    // 比如初始化给了10条数据，异步接口又替换成4条
    const row = store.getRowByIndex(rowIndex);
    if (row?.modified) {
      classnames.push('is-modified');
    }
    if (row?.moved) {
      classnames.push('is-moved');
    }
    classnames.push(
      setThemeClassName({
        ...this.props,
        name: 'tableRowClassname',
        id,
        themeCss
      })
    );
    return classnames.join(' ');
  }

  buildRowSelection() {
    const {
      selectable,
      multiple,
      maxKeepItemSelectionLength,
      rowSelection,
      store
    } = this.props;

    let rowSelectionConfig: any = null;
    if (selectable) {
      rowSelectionConfig = {
        type: multiple === false ? 'radio' : '', // rowSelection.type不设置 默认为多选
        selectedRowKeys: store.currentSelectedRowKeys,
        maxSelectedLength: maxKeepItemSelectionLength
      };
    } else if (rowSelection) {
      const {selectedRowKeys, selections, ...rest} = rowSelection;
      rowSelectionConfig = {
        selectedRowKeys: store.currentSelectedRowKeys,
        maxSelectedLength: maxKeepItemSelectionLength,
        ...rest
      };

      rowSelectionConfig.getCheckboxProps = (record: any, rowIndex: number) => {
        const {rowSelection, maxKeepItemSelectionLength, store} = this.props;
        const disableOn = rowSelection?.disableOn;

        return {
          disabled:
            (disableOn
              ? evalExpression(disableOn, {record, rowIndex})
              : false) ||
            (maxKeepItemSelectionLength &&
              store.currentSelectedRowKeys.length >=
                maxKeepItemSelectionLength &&
              !store.currentSelectedRowKeys.includes(record[store.keyField]))
        };
      };

      rowSelection.disableOn && delete rowSelectionConfig.disableOn;

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
              store.updateSelected(newSelectedRowKeys);
            }
          });
        });
      }
    }

    return rowSelectionConfig;
  }

  @autobind
  expandedRowClassName(record: any, rowIndex: number) {
    const {expandable} = this.props;
    return filter(expandable?.expandedRowClassNameExpr, {record, rowIndex});
  }

  @autobind
  expandedRowRender(record: any, rowIndex: number) {
    const {expandable} = this.props;

    return this.renderSchema(
      'expandableBody',
      {...expandable},
      {
        data: {
          ...this.props.data,
          ...record,
          rowIndex
        }
      }
    );
  }

  @autobind
  rowExpandable(record: any, rowIndex: number, rowIndexes: number[]) {
    const {expandable} = this.props;
    if (expandable?.expandableOn) {
      return evalExpression(expandable.expandableOn, {record, rowIndex});
    }
    return false;
  }

  buildExpandable() {
    const {expandable, store} = this.props;

    let expandableConfig: any = null;
    if (expandable) {
      const {expandedRowKeys, ...rest} = expandable;

      expandableConfig = {
        expandedRowKeys: store.currentExpandedKeys,
        ...rest
      };

      if (expandable.expandableOn) {
        expandableConfig.rowExpandable = this.rowExpandable;
        delete expandableConfig.expandableOn;
      }

      if (expandable && expandable.type) {
        expandableConfig.expandedRowRender = this.expandedRowRender;
      }

      if (expandable.expandedRowClassNameExpr) {
        expandableConfig.expandedRowClassName = this.expandedRowClassName;
        delete expandableConfig.expandedRowClassNameExpr;
      }
    }

    return expandableConfig;
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  @autobind
  async handleSave() {
    const {store, onSave, primaryField, keyField} = this.props;

    if (!store.modifiedRows.length) {
      return;
    }

    // 验证所有表单项，没有错误才继续
    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    if (subForms.length) {
      const result = await Promise.all(subForms.map(item => item.validate()));
      if (~result.indexOf(false)) {
        return;
      }
    }

    const rows = store.modifiedRows.map(item => item.data);
    const rowIndexes = store.modifiedRows.map(item => item.path);
    const diff = store.modifiedRows.map(item =>
      difference(item.data, item.pristine, [keyField, primaryField!])
    );
    const unModifiedRows = store.rows
      .filter(item => !item.modified)
      .map(item => item.data);
    if (!onSave) {
      this.handleQuickSave(
        rows,
        diff,
        rowIndexes,
        unModifiedRows,
        store.modifiedRows.map(item => item.pristine)
      );
      return;
    }
    onSave(
      rows,
      diff,
      rowIndexes,
      unModifiedRows,
      store.modifiedRows.map(item => item.pristine)
    );
  }

  // 方法同CRUD2里的handleSave
  // 目的是为了让table2不依赖crud2可以支持快速编辑
  @autobind
  handleQuickSave(
    rows: Array<object> | object,
    diff: Array<object> | object,
    indexes: Array<string>,
    unModifiedItems?: Array<any>,
    rowsOrigin?: Array<object> | object,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    const {
      store,
      quickSaveApi,
      quickSaveItemApi,
      primaryField,
      keyField,
      env,
      messages,
      reload,
      dispatchEvent
    } = this.props;

    if (Array.isArray(rows)) {
      if (!isEffectiveApi(quickSaveApi)) {
        env && env.alert('Table2 quickSaveApi is required');
        return;
      }
      const key = primaryField || keyField;
      const data: any = createObject(store.data, {
        rows,
        rowsDiff: diff,
        indexes: indexes,
        rowsOrigin
      });

      if (rows.length && rows[0].hasOwnProperty(key)) {
        data.ids = rows.map(item => (item as any)[key]).join(',');
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
          dispatchEvent('quickSaveSubmitted', data);
          reload && this.reloadTarget(filterTarget(reload, data), data);
        })
        .catch(() => {});
    } else {
      if (!isEffectiveApi(quickSaveItemApi)) {
        env && env.alert('Table2 quickSaveItemApi is required!');
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
          dispatchEvent('quickSaveSubmitted', sendData);
          reload && this.reloadTarget(filterTarget(reload, data), data);
        })
        .catch(() => {
          options?.resetOnFailed && this.reset();
        });
    }
  }

  @autobind
  handleQuickChange(
    item: IRow2,
    values: object,
    saveImmediately?: boolean | any,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    if (!isAlive(item)) {
      return;
    }

    const {
      onSave,
      onPristineChange,
      saveImmediately: propsSaveImmediately,
      primaryField,
      keyField,
      quickSaveItemApi
    } = this.props;

    item.change(values, savePristine);

    // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
    item.modified && this.syncSelected();

    if (savePristine) {
      onPristineChange?.(item.data, item.path);
      return;
    }
    if (!saveImmediately && !propsSaveImmediately) {
      return;
    }

    if (saveImmediately && saveImmediately.api) {
      this.props.onAction &&
        this.props.onAction(
          null,
          {
            actionType: 'ajax',
            api: saveImmediately.api,
            reload: options?.reload
          },
          item.locals
        );
      return;
    }

    if (!onSave) {
      this.handleQuickSave(
        quickSaveItemApi ? item.data : [item.data],
        difference(item.data, item.pristine, [keyField, primaryField!]),
        [item.path],
        undefined,
        item.pristine,
        options
      );
      return;
    }

    onSave(
      item.data,
      difference(item.data, item.pristine, [keyField, primaryField!]),
      item.path,
      undefined,
      item.pristine,
      options
    );
  }

  @autobind
  handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object
  ) {
    const {onAction} = this.props;

    // todo
    return onAction?.(e, action, ctx);
  }

  renderActions(region: string) {
    let {
      actions,
      render,
      store,
      classnames: cx,
      data,
      columnsTogglable,
      dispatchEvent
    } = this.props;
    actions = Array.isArray(actions) ? actions.concat() : [];
    const config = isObject(columnsTogglable)
      ? columnsTogglable
      : {
          align: 'left'
        };

    // 现在默认从crud里传进来的columnsTogglable是boolean类型
    // table单独配置的是SchemaNode类型
    // 如果是在crud里 配置了columnsTogglable相关配置 那么还是在这里渲染
    // 用户也可以在crud2的grid里配置 那么crud2里就不要再写了 否则就重复了
    if (
      store.toggable &&
      region === 'header' &&
      !~this.renderedToolbars.indexOf('columns-toggler')
    ) {
      actions.push({
        type: 'button',
        children: render(
          'column-toggler',
          {
            ...config,
            type: 'column-toggler'
          },
          {
            cols: store.columnsData,
            toggleAllColumns: () => {
              store.toggleAllColumns();
              dispatchEvent(
                'columnToggled',
                createObject(data, {
                  columns: store.columnsData.filter(column => column.toggled)
                })
              );
            },
            toggleToggle: (index: number) => {
              const column = store.columnsData[index];
              column.toggleToggle();

              dispatchEvent(
                'columnToggled',
                createObject(data, {
                  columns: store.columnsData.filter(column => column.toggled)
                })
              );
            }
          }
        )
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

  @autobind
  async handleSelected(
    selectedRows: Array<any>,
    selectedRowKeys: Array<string | number>,
    unSelectedRows: Array<string | number>
  ): Promise<any> {
    const {dispatchEvent, data, store} = this.props;

    store.updateSelected(selectedRowKeys);
    this.syncSelected();

    await dispatchEvent(
      'selectedChange',
      createObject(data, {
        selectedItems: selectedRows,
        unSelectedItems: unSelectedRows
      })
    );
  }

  @autobind
  async handleSort(payload: SortProps): Promise<any> {
    const {dispatchEvent, data, onSort} = this.props;
    const rendererEvent = await dispatchEvent(
      'columnSort',
      createObject(data, {
        orderBy: payload.orderBy,
        orderDir: payload.orderDir
      })
    );

    if (rendererEvent?.prevented) {
      return rendererEvent?.prevented;
    }

    onSort && onSort(payload);
  }

  @autobind
  async handleFilter(payload: {
    filterName: string;
    filterValue: string;
  }): Promise<any> {
    const {dispatchEvent, data, onSearch} = this.props;

    const rendererEvent = await dispatchEvent(
      'columnFilter',
      createObject(data, payload)
    );

    if (rendererEvent?.prevented) {
      return rendererEvent?.prevented;
    }

    onSearch && onSearch(payload);
  }

  @autobind
  async handleSearch(name: string, values: any) {
    const {data, dispatchEvent, store, onSearch} = this.props;

    const rendererEvent = await dispatchEvent(
      'columnSearch',
      createObject(data, {
        searchName: name,
        searchValue: values
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    store.updateQuery(values);

    onSearch && onSearch({[name]: values[name]});
  }

  @autobind
  async handleRowClick(
    event: React.ChangeEvent<any>,
    rowItem: any,
    rowIndex?: number
  ) {
    const {dispatchEvent, data, onRow} = this.props;

    const rendererEvent = await dispatchEvent(
      'rowClick',
      createObject(data, {item: rowItem, index: rowIndex})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (rowItem && onRow) {
      onRow.onRowClick && onRow.onRowClick(event, rowItem, rowIndex);
    }
  }

  @autobind
  async handleRowDbClick(
    event: React.ChangeEvent<any>,
    rowItem: any,
    rowIndex?: number
  ) {
    const {dispatchEvent, data, onRow} = this.props;

    const rendererEvent = await dispatchEvent(
      'rowDbClick',
      createObject(data, {item: rowItem, index: rowIndex})
    );

    if (rendererEvent?.prevented) {
      return false;
    }

    if (rowItem && onRow) {
      onRow.onRowDbClick && onRow.onRowDbClick(event, rowItem, rowIndex);
    }
    return true;
  }

  @autobind
  async handleRowMouseEnter(
    event: React.MouseEvent<HTMLTableRowElement>,
    rowItem: any,
    rowIndex?: number
  ) {
    event?.persist?.();
    const {dispatchEvent, data, onRow} = this.props;

    const rendererEvent = await dispatchEvent(
      'rowMouseEnter',
      createObject(data, {item: rowItem, index: rowIndex})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (rowItem && onRow) {
      onRow.onRowMouseEnter && onRow.onRowMouseEnter(event, rowItem, rowIndex);
    }
  }

  @autobind
  async handleRowMouseLeave(
    event: React.MouseEvent<HTMLTableRowElement>,
    rowItem: any,
    rowIndex?: number
  ) {
    event?.persist?.();
    const {dispatchEvent, data, onRow} = this.props;

    const rendererEvent = await dispatchEvent(
      'rowMouseLeave',
      createObject(data, {item: rowItem, index: rowIndex})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (rowItem && onRow) {
      onRow.onRowMouseLeave && onRow.onRowMouseLeave(event, rowItem, rowIndex);
    }
  }

  @autobind
  async handleOrderChange(
    oldIndex: number,
    newIndex: number,
    levels: Array<number>
  ) {
    const {store} = this.props;
    const rowItem = store.getRowByIndex(oldIndex, levels);

    store.exchange(oldIndex, newIndex, rowItem);
  }

  @autobind
  async handleSaveOrder() {
    const {store, onSaveOrder, data, dispatchEvent} = this.props;

    const movedItems = store.movedRows.map((item: IRow2) => item.data);
    const items = store.rows.map((item: IRow2) =>
      item.getDataWithModifiedChilden()
    );

    const rendererEvent = await dispatchEvent(
      'orderChange',
      createObject(data, {movedItems})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    if (!onSaveOrder || !store.movedRows.length) {
      return;
    }

    onSaveOrder(movedItems, items);
  }

  doAction(
    action: ActionObject,
    ctx: any,
    throwErrors: boolean = false,
    args?: any
  ): any {
    const {store, data, keyField: key, expandable, primaryField} = this.props;

    const actionType = action?.actionType as string;
    const keyField = store.keyField;
    const dataSource = store.getData(data).items || [];

    switch (actionType) {
      case 'selectAll':
        store.updateSelectedAll();
        break;
      case 'clearAll':
        store.updateSelected([]);
        break;
      case 'select':
        const selected: Array<any> = [];
        dataSource.forEach((item: any, rowIndex: number) => {
          const flag = evalExpression(
            args?.selected || args?.selectedRowKeysExpr,
            {
              record: item,
              rowIndex
            }
          );
          if (flag) {
            selected.push(item[keyField]);
          }
        });
        store.updateSelected(selected);
        break;
      case 'expand':
        const expandableKey = primaryField || expandable?.keyField || key;
        const expanded: Array<any> = [];
        const collapse: Array<any> = [];
        // value值控制展开1个
        if (args?.value) {
          const rowIndex = dataSource.findIndex(
            (d: any) => d[expandableKey] === args.value
          );
          const item = dataSource[rowIndex];
          if (this.tableRef && this.tableRef.isExpandableRow(item, rowIndex)) {
            if (this.tableRef.isExpanded(item)) {
              collapse.push(item);
            } else {
              expanded.push(item);
            }
          }
        } else if (args?.expandedRowsExpr) {
          dataSource.forEach((item: any, rowIndex: number) => {
            const flag = evalExpression(args?.expandedRowsExpr, {
              record: item,
              rowIndex
            });
            if (
              flag &&
              this.tableRef &&
              this.tableRef.isExpandableRow(item, rowIndex)
            ) {
              if (this.tableRef.isExpanded(item)) {
                collapse.push(item);
              } else {
                expanded.push(item);
              }
            }
          });
        }
        if (expanded.length > 0) {
          this.tableRef && this.tableRef.onExpandRows(expanded);
        }
        if (collapse.length > 0) {
          this.tableRef && this.tableRef.onCollapseRows(collapse);
        }
        break;
      default:
        this.handleAction(undefined, action, data);
        break;
    }
  }

  @autobind
  getRef(ref: any) {
    this.tableRef = ref;
  }

  renderTable() {
    const {
      render,
      title,
      footer,
      rowSelection,
      selectable,
      multiple,
      columns,
      expandable,
      footSummary,
      headSummary,
      loading,
      classnames: cx,
      placeholder,
      rowClassNameExpr,
      itemActions,
      keyField,
      primaryField,
      maxKeepItemSelectionLength,
      onRow,
      store,
      id,
      themeCss,
      ...rest
    } = this.props;

    let itemActionsConfig = undefined;
    if (itemActions) {
      const finalActions = Array.isArray(itemActions)
        ? itemActions.filter(action => !action.hiddenOnHover)
        : [];

      if (!finalActions.length) {
        return null;
      }

      itemActionsConfig = (record: any, rowIndex: number) => {
        return (
          <div className={cx('Table-itemActions')}>
            {finalActions.map((action, index) =>
              render(
                `itemAction/${index}`,
                {
                  ...(action as any),
                  isMenuItem: true
                },
                {
                  key: index,
                  item: record,
                  data: record,
                  rowIndex
                }
              )
            )}
          </div>
        );
      };
    }

    const schemaProps = {data: this.props.data};

    return (
      <Table
        {...rest}
        headerClassName={setThemeClassName({
          ...this.props,
          name: 'tableHeadClassname',
          id,
          themeCss
        })}
        bodyClassname={setThemeClassName({
          ...this.props,
          name: 'tableBodyClassname',
          id,
          themeCss
        })}
        onRef={this.getRef}
        title={this.renderSchema('title', title, schemaProps)}
        footer={this.renderSchema('footer', footer, schemaProps)}
        columns={this.columns}
        dataSource={store.dataSource}
        rowSelection={this.rowSelection}
        rowClassName={this.rowClassName}
        expandable={this.expandable}
        footSummary={this.buildSummary('footSummary', footSummary)}
        headSummary={this.buildSummary('headSummary', headSummary)}
        loading={this.renderSchema('loading', loading, schemaProps)}
        placeholder={this.renderSchema('placeholder', placeholder, schemaProps)}
        onSelect={this.handleSelected}
        onSelectAll={this.handleSelected}
        onSort={this.handleSort}
        onFilter={this.handleFilter}
        onDrag={this.handleOrderChange}
        itemActions={itemActionsConfig}
        keyField={primaryField || keyField}
        onRow={{
          ...onRow,
          onRowClick: this.handleRowClick,
          onRowDbClick: this.handleRowDbClick,
          onRowMouseEnter: this.handleRowMouseEnter,
          onRowMouseLeave: this.handleRowMouseLeave
        }}
      ></Table>
    );
  }

  renderHeading() {
    let {
      store,
      hideQuickSaveBtn,
      classnames: cx,
      headingClassName,
      saveImmediately,
      quickSaveApi,
      translate: __,
      columns
    } = this.props;

    // 当被修改列的 column 开启 quickEdit.saveImmediately 时，不展示提交、放弃按钮
    let isModifiedColumnSaveImmediately = false;
    if (store.modifiedRows.length === 1) {
      const saveImmediatelyColumnNames: string[] =
        columns
          ?.map((column: any) =>
            column?.quickEdit?.saveImmediately ? column?.name : ''
          )
          .filter(a => a) || [];

      const item = store.modifiedRows[0];
      const diff = difference(item.data, item.pristine);
      if (intersection(saveImmediatelyColumnNames, Object.keys(diff)).length) {
        isModifiedColumnSaveImmediately = true;
      }
    }

    if (
      (quickSaveApi &&
        !saveImmediately &&
        !isModifiedColumnSaveImmediately &&
        store.modified &&
        !hideQuickSaveBtn) ||
      store.moved
    ) {
      return (
        <div className={cx('Table-heading', headingClassName)} key="heading">
          {!saveImmediately &&
          store.modified &&
          !hideQuickSaveBtn &&
          !isModifiedColumnSaveImmediately ? (
            <span>
              {__('Table.modified', {
                modified: store.modified
              })}
              <button
                type="button"
                className={cx('Button Button--size-xs Button--success m-l-sm')}
                onClick={this.handleSave}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('Form.submit')}
              </button>
              <button
                type="button"
                className={cx('Button Button--size-xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('Table.discard')}
              </button>
            </span>
          ) : store.moved ? (
            <span>
              {__('Table.moved', {
                moved: store.moved
              })}
              <button
                type="button"
                className={cx('Button Button--size-xs Button--success m-l-sm')}
                onClick={this.handleSaveOrder}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('Form.submit')}
              </button>
              <button
                type="button"
                className={cx('Button Button--size-xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('Table.discard')}
              </button>
            </span>
          ) : (
            ''
          )}
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      classnames: cx,
      style,
      store,
      themeCss,
      wrapperCustomStyle,
      id,
      env
    } = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了

    const heading = this.renderHeading();

    return (
      <div
        className={cx(
          'Table-render-wrapper',
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          }),
          {
            'Table--unsaved': !!store.modified || !!store.moved
          }
        )}
        style={style}
      >
        {this.renderActions('header')}
        {heading}
        {this.renderTable()}
        <CustomStyle
          {...this.props}
          config={{
            themeCss,
            classNames: [
              {
                key: 'tableHeadClassname',
                weights: {
                  default: {
                    inner: `.${cx('Table-table')} > thead > tr > th`,
                    important: true
                  }
                }
              },
              {
                key: 'tableHeadClassname',
                weights: {
                  default: {
                    inner: `> tr > th`,
                    important: true
                  }
                }
              },
              {
                key: 'tableBodyClassname',
                weights: {
                  default: {
                    inner: `> tbody.${cx('Table-tbody')} > tr  td`
                  },
                  hover: {
                    suf: '> tbody > tr',
                    inner: `td`,
                    important: true
                  }
                }
              },
              {
                key: 'tableRowClassname',
                weights: {
                  default: {
                    parent: `.${cx('Table-table')} > tbody.${cx(
                      'Table-tbody'
                    )}`,
                    inner: `td.${cx('Table-cell')}`
                  },
                  hover: {
                    parent: `.${cx('Table-table')} > tbody.${cx(
                      'Table-tbody'
                    )}`,
                    inner: `td.${cx('Table-cell')}`
                  }
                }
              }
            ],
            wrapperCustomStyle,
            id
          }}
          env={env}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'table2',
  storeType: TableStore2.name,
  name: 'table2',
  isolateScope: true
})
export class TableRenderer extends Table2 {
  receive(values: any, subPath?: string) {
    const scoped = this.context as IScopedContext;

    /**
     * 因为Table在scope上注册，导致getComponentByName查询组件时会优先找到Table，和CRUD联动的动作都会失效
     * 这里先做兼容处理，把动作交给上层的CRUD处理
     */
    if (this.props?.host) {
      // CRUD会把自己透传给Table，这样可以保证找到CRUD
      return this.props.host.receive?.(values, subPath);
    }

    if (subPath) {
      return scoped.send(subPath, values);
    }
  }

  reload(subPath?: string, query?: any, ctx?: any) {
    const scoped = this.context as IScopedContext;
    const parents = scoped?.parent?.getComponents();

    if (this.props?.host) {
      // CRUD会把自己透传给Table，这样可以保证找到CRUD
      return this.props.host.reload?.(subPath, query, ctx);
    }

    if (subPath) {
      return scoped.reload(subPath, ctx);
    }
  }

  async setData(
    values: any,
    replace?: boolean,
    index?: number | string,
    condition?: any
  ) {
    const {store} = this.props;
    const len = store.data.rows.length;

    if (index !== undefined) {
      let items = [...store.data.rows];
      const indexs = String(index).split(',');
      indexs.forEach(i => {
        const intIndex = Number(i);
        items.splice(intIndex, 1, values);
      });
      // 更新指定行记录，只需要提供行记录即可
      return store.updateData({rows: items}, undefined, replace);
    } else if (condition !== undefined) {
      let items = [...store.data.rows];
      for (let i = 0; i < len; i++) {
        const item = items[i];
        const isUpdate = await evalExpressionWithConditionBuilderAsync(
          condition,
          item
        );

        if (isUpdate) {
          items.splice(i, 1, values);
        }
      }

      // 更新指定行记录，只需要提供行记录即可
      return store.updateData({rows: items}, undefined, replace);
    } else {
      const data = {
        ...values,
        rows: values.rows ?? values.items // 做个兼容
      };
      return store.updateData(data, undefined, replace);
    }
  }

  getData() {
    const {store, data} = this.props;
    return store.getData(data);
  }
}
