import React from 'react';
import {findDOMNode} from 'react-dom';
import {Renderer, RendererProps} from '../../factory';
import {SchemaNode, Action, Schema} from '../../types';
import forEach from 'lodash/forEach';
import {filter} from '../../utils/tpl';
import DropDownButton from '../DropDownButton';
import './ColumnToggler';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import {TableStore, ITableStore, IColumn, IRow} from '../../store/table';
import {
  anyChanged,
  getScrollParent,
  difference,
  noop,
  autobind,
  isArrayChildrenModified,
  getVariable,
  removeHTMLTag,
  eachTree,
  isObject
} from '../../utils/helper';
import {
  isPureVariable,
  resolveVariable,
  resolveVariableAndFilter
} from '../../utils/tpl-builtin';
import debounce from 'lodash/debounce';
import Sortable from 'sortablejs';
import {resizeSensor} from '../../utils/resize-sensor';
import find from 'lodash/find';
import {Icon} from '../../components/icons';
import {TableCell} from './TableCell';
import {TableRow} from './TableRow';
import {HeadCellFilterDropDown} from './HeadCellFilterDropdown';
import {HeadCellSearchDropDown} from './HeadCellSearchDropdown';
import {TableContent} from './TableContent';
import {
  BaseSchema,
  SchemaApi,
  SchemaClassName,
  SchemaObject,
  SchemaTokenizeableString,
  SchemaType
} from '../../Schema';
import {SchemaPopOver} from '../PopOver';
import {SchemaQuickEdit} from '../QuickEdit';
import {SchemaCopyable} from '../Copyable';
import {SchemaRemark} from '../Remark';
import {toDataURL, getImageDimensions} from '../../utils/image';
import {TableBody} from './TableBody';
import {TplSchema} from '../Tpl';
import {MappingSchema} from '../Mapping';
import {isAlive, getSnapshot} from 'mobx-state-tree';
import ItemActionsWrapper from './ItemActionsWrapper';
import ColumnToggler from './ColumnToggler';
import {BadgeSchema} from '../../components/Badge';

/**
 * 表格列，不指定类型时默认为文本类型。
 */
export type TableColumnObject = {
  /**
   * 列标题
   */
  label: string;

  /**
   * 配置是否固定当前列
   */
  fixed?: 'left' | 'right' | 'none';

  /**
   * 绑定字段名
   */
  name?: string;

  /**
   * 配置查看详情功能
   */
  popOver?: SchemaPopOver;

  /**
   * 配置快速编辑功能
   */
  quickEdit?: SchemaQuickEdit;

  /**
   * 作为表单项时，可以单独配置编辑时的快速编辑面板。
   */
  quickEditOnUpdate?: SchemaQuickEdit;

  /**
   * 配置点击复制功能
   */
  copyable?: SchemaCopyable;

  /**
   * 配置是否可以排序
   */
  sortable?: boolean;

  /**
   * 是否可快速搜索
   */
  searchable?: boolean | SchemaObject;

  /**
   * 配置是否默认展示
   */
  toggled?: boolean;

  /**
   * 列宽度
   */
  width?: number | string;

  /**
   * 列对齐方式
   */
  align?: 'left' | 'right' | 'center' | 'justify';

  /**
   * 列样式表
   */
  className?: string;

  /**
   * 单元格样式表达式
   */
  classNameExpr?: string;

  /**
   * 列头样式表
   */
  labelClassName?: string;

  /**
   * todo
   */
  filterable?:
    | boolean
    | {
        source?: string;
        options?: Array<any>;
      };

  /**
   * 结合表格的 footable 一起使用。
   * 填写 *、xs、sm、md、lg指定 footable 的触发条件，可以填写多个用空格隔开
   */
  breakpoint?: '*' | 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 提示信息
   */
  remark?: SchemaRemark;

  /**
   * 默认值, 只有在 inputTable 里面才有用
   */
  value?: any;

  /**
   * 是否唯一, 只有在 inputTable 里面才有用
   */
  unique?: boolean;
};

export type TableColumnWithType = SchemaObject & TableColumnObject;
export type TableColumn = TableColumnWithType | TableColumnObject;

/**
 * Table 表格渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/table
 */
export interface TableSchema extends BaseSchema {
  /**
   * 指定为表格渲染器。
   */
  type: 'table' | 'static-table';

  /**
   * 是否固定表头
   */
  affixHeader?: boolean;

  /**
   * 表格的列信息
   */
  columns?: Array<TableColumn>;

  /**
   * 展示列显示开关，自动即：列数量大于或等于5个时自动开启
   */
  columnsTogglable?: boolean | 'auto';

  /**
   * 是否开启底部展示功能，适合移动端展示
   */
  footable?:
    | boolean
    | {
        expand?: 'first' | 'all' | 'none';

        /**
         * 是否为手风琴模式
         */
        accordion?: boolean;
      };

  /**
   * 底部外层 CSS 类名
   */
  footerClassName?: SchemaClassName;

  /**
   * 顶部外层 CSS 类名
   */
  headerClassName?: SchemaClassName;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否显示底部
   */
  showFooter?: boolean;

  /**
   * 是否显示头部
   */
  showHeader?: boolean;

  /**
   * 数据源：绑定当前环境变量
   */
  source?: SchemaTokenizeableString;

  /**
   * 表格 CSS 类名
   */
  tableClassName?: SchemaClassName;

  /**
   * 标题
   */
  title?: string;

  /**
   * 工具栏 CSS 类名
   */
  toolbarClassName?: SchemaClassName;

  /**
   * 合并单元格配置，配置数字表示从左到右的多少列自动合并单元格。
   */
  combineNum?: number;

  /**
   * 合并单元格配置，配置从第几列开始合并。
   */
  combineFromIndex?: number;

  /**
   * 顶部总结行
   */
  prefixRow?: Array<SchemaObject>;

  /**
   * 底部总结行
   */
  affixRow?: Array<SchemaObject>;

  /**
   * 是否可调整列宽
   */
  resizable?: boolean;

  /**
   * 行样式表表达式
   */
  rowClassNameExpr?: string;

  /**
   * 行角标
   */
  itemBadge?: BadgeSchema;

  /**
   * 开启查询区域，会根据列元素的searchable属性值，自动生成查询条件表单
   */
  autoGenerateFilter?: boolean;
}

export interface TableProps extends RendererProps {
  title?: string; // 标题
  header?: SchemaNode;
  footer?: SchemaNode;
  actions?: Action[];
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  store: ITableStore;
  columns?: Array<any>;
  headingClassName?: string;
  toolbarClassName?: string;
  headerToolbarClassName?: string;
  footerToolbarClassName?: string;
  tableClassName?: string;
  source?: string;
  selectable?: boolean;
  selected?: Array<any>;
  maxKeepItemSelectionLength?: number;
  valueField?: string;
  draggable?: boolean;
  columnsTogglable?: boolean | 'auto';
  affixHeader?: boolean;
  affixColumns?: boolean;
  combineNum?: number | string;
  combineFromIndex?: number;
  footable?:
    | boolean
    | {
        expand?: 'first' | 'all' | 'none';
        expandAll?: boolean;
        accordion?: boolean;
      };
  expandConfig?: {
    expand?: 'first' | 'all' | 'none';
    expandAll?: boolean;
    accordion?: boolean;
  };
  itemCheckableOn?: string;
  itemDraggableOn?: string;
  itemActions?: Array<Action>;
  onSelect: (
    selectedItems: Array<object>,
    unSelectedItems: Array<object>
  ) => void;
  onPristineChange?: (data: object, rowIndexe: string) => void;
  onSave?: (
    items: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<string> | string,
    unModifiedItems?: Array<object>,
    rowOrigins?: Array<object> | object,
    resetOnFailed?: boolean
  ) => void;
  onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
  onQuery: (values: object) => void;
  onImageEnlarge?: (data: any, target: any) => void;
  buildItemProps?: (item: any, index: number) => any;
  checkOnItemClick?: boolean;
  hideCheckToggler?: boolean;
  rowClassName?: string;
  rowClassNameExpr?: string;
  popOverContainer?: any;
  canAccessSuperData?: boolean;
  reUseRow?: boolean;
  itemBadge?: BadgeSchema;
}

type ExportExcelToolbar = SchemaNode & {
  api?: SchemaApi;
  columns?: string[];
  filename?: string;
};

/**
 * 将 url 转成绝对地址
 */
const getAbsoluteUrl = (function () {
  let link: HTMLAnchorElement;
  return function (url: string) {
    if (!link) link = document.createElement('a');
    link.href = url;
    return link.href;
  };
})();

export default class Table extends React.Component<TableProps, object> {
  static propsList: Array<string> = [
    'header',
    'headerToolbarRender',
    'footer',
    'footerToolbarRender',
    'footable',
    'expandConfig',
    'placeholder',
    'tableClassName',
    'headingClassName',
    'source',
    'selectable',
    'columnsTogglable',
    'affixHeader',
    'affixColumns',
    'headerClassName',
    'footerClassName',
    'selected',
    'multiple',
    'primaryField',
    'hideQuickSaveBtn',
    'itemCheckableOn',
    'itemDraggableOn',
    'checkOnItemClick',
    'hideCheckToggler',
    'itemAction',
    'itemActions',
    'combineNum',
    'combineFromIndex',
    'items',
    'columns',
    'valueField',
    'saveImmediately',
    'rowClassName',
    'rowClassNameExpr',
    'popOverContainer',
    'headerToolbarClassName',
    'toolbarClassName',
    'footerToolbarClassName',
    'itemBadge'
  ];
  static defaultProps: Partial<TableProps> = {
    className: '',
    placeholder: 'placeholder.noData',
    tableClassName: '',
    source: '$items',
    selectable: false,
    columnsTogglable: 'auto',
    affixHeader: true,
    headerClassName: '',
    footerClassName: '',
    toolbarClassName: '',
    headerToolbarClassName: '',
    footerToolbarClassName: '',
    primaryField: 'id',
    itemCheckableOn: '',
    itemDraggableOn: '',
    hideCheckToggler: false,
    canAccessSuperData: false,
    resizable: true
  };

  table?: HTMLTableElement;
  sortable?: Sortable;
  dragTip?: HTMLElement;
  affixedTable?: HTMLTableElement;
  parentNode?: HTMLElement | Window;
  lastScrollLeft: number = -1;
  totalWidth: number = 0;
  totalHeight: number = 0;
  outterWidth: number = 0;
  outterHeight: number = 0;
  unSensor?: Function;
  updateTableInfoLazy: () => void;
  widths: {
    [propName: string]: number;
  } = {};
  widths2: {
    [propName: string]: number;
  } = {};
  heights: {
    [propName: string]: number;
  } = {};
  renderedToolbars: Array<string> = [];
  subForms: any = {};

  constructor(props: TableProps) {
    super(props);

    this.handleOutterScroll = this.handleOutterScroll.bind(this);
    this.affixDetect = this.affixDetect.bind(this);
    this.updateTableInfoLazy = debounce(this.updateTableInfo.bind(this), 250, {
      trailing: true,
      leading: true
    });
    this.tableRef = this.tableRef.bind(this);
    this.affixedTableRef = this.affixedTableRef.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveOrder = this.handleSaveOrder.bind(this);
    this.reset = this.reset.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.renderHeadCell = this.renderHeadCell.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
    this.renderAutoFilterForm = this.renderAutoFilterForm.bind(this);

    const {
      store,
      columns,
      selectable,
      columnsTogglable,
      draggable,
      orderBy,
      orderDir,
      multiple,
      footable,
      primaryField,
      itemCheckableOn,
      itemDraggableOn,
      hideCheckToggler,
      combineFromIndex,
      expandConfig,
      formItem,
      keepItemSelectionOnPageChange,
      maxKeepItemSelectionLength
    } = props;

    let combineNum = props.combineNum;
    if (typeof combineNum === 'string') {
      combineNum = parseInt(
        resolveVariableAndFilter(combineNum, props.data, '| raw'),
        10
      );
    }

    store.update({
      selectable,
      draggable,
      columns,
      columnsTogglable,
      orderBy,
      orderDir,
      multiple,
      footable,
      expandConfig,
      primaryField,
      itemCheckableOn,
      itemDraggableOn,
      hideCheckToggler,
      combineNum,
      combineFromIndex,
      keepItemSelectionOnPageChange,
      maxKeepItemSelectionLength
    });

    formItem && isAlive(formItem) && formItem.setSubStore(store);
    Table.syncRows(store, this.props, undefined) && this.syncSelected();
  }

  static syncRows(
    store: ITableStore,
    props: TableProps,
    prevProps?: TableProps
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

    updateRows && store.initRows(rows, props.getEntryId, props.reUseRow);
    typeof props.selected !== 'undefined' &&
      store.updateSelected(props.selected, props.valueField);
    return updateRows;
  }

  componentDidMount() {
    let parent: HTMLElement | Window | null = getScrollParent(
      findDOMNode(this) as HTMLElement
    );

    if (!parent || parent === document.body) {
      parent = window;
    }

    this.parentNode = parent;
    this.updateTableInfo();

    const dom = findDOMNode(this) as HTMLElement;
    if (dom.closest('.modal-body')) {
      return;
    }

    this.affixDetect();
    parent.addEventListener('scroll', this.affixDetect);
    window.addEventListener('resize', this.affixDetect);
  }

  componentDidUpdate(prevProps: TableProps) {
    const props = this.props;
    const store = props.store;

    if (
      anyChanged(
        [
          'selectable',
          'columnsTogglable',
          'draggable',
          'orderBy',
          'orderDir',
          'multiple',
          'footable',
          'primaryField',
          'itemCheckableOn',
          'itemDraggableOn',
          'hideCheckToggler',
          'combineNum',
          'combineFromIndex',
          'expandConfig'
        ],
        prevProps,
        props
      )
    ) {
      let combineNum = props.combineNum;
      if (typeof combineNum === 'string') {
        combineNum = parseInt(
          resolveVariableAndFilter(combineNum, props.data, '| raw'),
          10
        );
      }
      store.update({
        selectable: props.selectable,
        columnsTogglable: props.columnsTogglable,
        draggable: props.draggable,
        orderBy: props.orderBy,
        orderDir: props.orderDir,
        multiple: props.multiple,
        primaryField: props.primaryField,
        footable: props.footable,
        itemCheckableOn: props.itemCheckableOn,
        itemDraggableOn: props.itemDraggableOn,
        hideCheckToggler: props.hideCheckToggler,
        combineNum: combineNum,
        combineFromIndex: props.combineFromIndex,
        expandConfig: props.expandConfig
      });
    }

    if (prevProps.columns !== props.columns) {
      store.update({
        columns: props.columns
      });
    }

    if (
      anyChanged(['source', 'value', 'items'], prevProps, props) ||
      (!props.value &&
        !props.items &&
        (props.data !== prevProps.data ||
          (typeof props.source === 'string' && isPureVariable(props.source))))
    ) {
      Table.syncRows(store, props, prevProps) && this.syncSelected();
    } else if (isArrayChildrenModified(prevProps.selected!, props.selected!)) {
      const prevSelectedRows = store.selectedRows
        .map(item => item.id)
        .join(',');
      store.updateSelected(props.selected || [], props.valueField);
      const selectedRows = store.selectedRows.map(item => item.id).join(',');
      prevSelectedRows !== selectedRows && this.syncSelected();
    }

    this.updateTableInfoLazy();
  }

  componentWillUnmount() {
    const {formItem} = this.props;

    const parent = this.parentNode;
    parent && parent.removeEventListener('scroll', this.affixDetect);
    window.removeEventListener('resize', this.affixDetect);
    (this.updateTableInfoLazy as any).cancel();
    this.unSensor && this.unSensor();

    formItem && isAlive(formItem) && formItem.setSubStore(null);
  }

  subFormRef(form: any, x: number, y: number) {
    const {quickEditFormRef} = this.props;

    quickEditFormRef && quickEditFormRef(form, x, y);
    this.subForms[`${x}-${y}`] = form;
    form && this.props.store.addForm(form.props.store, y);
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: object) {
    const {onAction} = this.props;

    // todo
    onAction(e, action, ctx);
  }

  handleCheck(item: IRow, value: boolean, shift?: boolean) {
    const {store} = this.props;
    if (shift) {
      store.toggleShift(item);
    } else {
      item.toggle();
    }

    this.syncSelected();
  }

  handleCheckAll() {
    const {store} = this.props;

    store.toggleAll();
    this.syncSelected();
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

    const {
      onSave,
      onPristineChange,
      saveImmediately: propsSaveImmediately,
      primaryField
    } = this.props;

    item.change(values, savePristine);

    // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
    item.modified && this.syncSelected();

    if (savePristine) {
      onPristineChange?.(item.data, item.path);
      return;
    } else if (!saveImmediately && !propsSaveImmediately) {
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

    if (!onSave) {
      return;
    }

    onSave(
      item.data,
      difference(item.data, item.pristine, ['id', primaryField]),
      item.path,
      undefined,
      item.pristine,
      resetOnFailed
    );
  }

  async handleSave() {
    const {store, onSave, primaryField} = this.props;

    if (!onSave || !store.modifiedRows.length) {
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
      difference(item.data, item.pristine, ['id', primaryField])
    );
    const unModifiedRows = store.rows
      .filter(item => !item.modified)
      .map(item => item.data);
    onSave(
      rows,
      diff,
      rowIndexes,
      unModifiedRows,
      store.modifiedRows.map(item => item.pristine)
    );
  }

  handleSaveOrder() {
    const {store, onSaveOrder} = this.props;

    if (!onSaveOrder || !store.movedRows.length) {
      return;
    }

    onSaveOrder(
      store.movedRows.map(item => item.data),
      store.rows.map(item => item.getDataWithModifiedChilden())
    );
  }

  syncSelected() {
    const {store, onSelect} = this.props;

    onSelect &&
      onSelect(
        store.selectedRows.map(item => item.data),
        store.unSelectedRows.map(item => item.data)
      );
  }

  reset() {
    const {store} = this.props;

    store.reset();

    const subForms: Array<any> = [];
    Object.keys(this.subForms).forEach(
      key => this.subForms[key] && subForms.push(this.subForms[key])
    );
    subForms.forEach(item => item.clearErrors());
  }

  bulkUpdate(value: any, items: Array<object>) {
    const {store, primaryField} = this.props;

    if (primaryField && value.ids) {
      const ids = value.ids.split(',');
      const rows = store.rows.filter(item =>
        find(ids, (id: any) => id && id == item.data[primaryField])
      );
      const newValue = {...value, ids: undefined};
      rows.forEach(row => row.change(newValue));
    } else {
      const rows = store.rows.filter(item => ~items.indexOf(item.pristine));
      rows.forEach(row => row.change(value));
    }
  }

  getSelected() {
    const {store} = this.props;

    return store.selectedRows.map(item => item.data);
  }

  affixDetect() {
    if (!this.props.affixHeader || !this.table) {
      return;
    }

    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;
    const clip = (this.table as HTMLElement).getBoundingClientRect();
    const offsetY =
      this.props.affixOffsetTop ?? this.props.env.affixOffsetTop ?? 0;
    const headingHeight =
      dom.querySelector(`.${ns}Table-heading`)?.getBoundingClientRect()
        .height || 0;
    const headerHeight =
      dom.querySelector(`.${ns}Table-headToolbar`)?.getBoundingClientRect()
        .height || 0;

    const affixed =
      clip.top - headerHeight - headingHeight < offsetY &&
      clip.top + clip.height - 40 > offsetY;
    const affixedDom = dom.querySelector(`.${ns}Table-fixedTop`) as HTMLElement;

    affixedDom.style.cssText += `top: ${offsetY}px;width: ${
      (this.table.parentNode as HTMLElement).offsetWidth
    }px`;
    affixed
      ? affixedDom.classList.add('in')
      : affixedDom.classList.remove('in');
    // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
  }

  updateTableInfo() {
    if (!this.table) {
      return;
    }

    const table = this.table;
    const outter = table.parentNode as HTMLElement;
    const affixHeader = this.props.affixHeader;
    const ns = this.props.classPrefix;

    // 完成宽高都没有变化就直接跳过了。
    // if (this.totalWidth === table.scrollWidth && this.totalHeight === table.scrollHeight) {
    //     return;
    // }

    this.totalWidth = table.scrollWidth;
    this.totalHeight = table.scrollHeight;
    this.outterWidth = outter.offsetWidth;
    this.outterHeight = outter.offsetHeight;

    let widths: {
      [propName: string]: number;
    } = (this.widths = {});
    let widths2: {
      [propName: string]: number;
    } = (this.widths2 = {});
    let heights: {
      [propName: string]: number;
    } = (this.heights = {});

    heights.header = table
      .querySelector('thead>tr:last-child')!
      .getBoundingClientRect().height;
    heights.header2 = table
      .querySelector('thead>tr:first-child')!
      .getBoundingClientRect().height;

    forEach(
      table.querySelectorAll('thead>tr:last-child>th'),
      (item: HTMLElement) => {
        widths[item.getAttribute('data-index') as string] =
          item.getBoundingClientRect().width;
      }
    );

    forEach(
      table.querySelectorAll('thead>tr:first-child>th'),
      (item: HTMLElement) => {
        widths2[item.getAttribute('data-index') as string] =
          item.getBoundingClientRect().width;
      }
    );

    forEach(
      table.querySelectorAll('tbody>tr>*:last-child'),
      (item: HTMLElement, index: number) =>
        (heights[index] = item.getBoundingClientRect().height)
    );

    // 让 react 去更新非常慢，还是手动更新吧。
    const dom = findDOMNode(this) as HTMLElement;

    forEach(
      // 折叠 footTable 不需要改变
      dom.querySelectorAll(
        `.${ns}Table-fixedTop table, .${ns}Table-fixedLeft>table, .${ns}Table-fixedRight>table`
      ),
      (table: HTMLTableElement) => {
        let totalWidth = 0;
        let totalWidth2 = 0;
        forEach(
          table.querySelectorAll('thead>tr:last-child>th'),
          (item: HTMLElement) => {
            const width = widths[item.getAttribute('data-index') as string];
            item.style.cssText += `width: ${width}px; height: ${heights.header}px`;
            totalWidth += width;
          }
        );
        forEach(
          table.querySelectorAll('thead>tr:first-child>th'),
          (item: HTMLElement) => {
            const width = widths2[item.getAttribute('data-index') as string];
            item.style.cssText += `width: ${width}px; height: ${heights.header2}px`;
            totalWidth2 += width;
          }
        );

        forEach(table.querySelectorAll('colgroup>col'), (item: HTMLElement) => {
          const width = widths[item.getAttribute('data-index') as string];
          item.setAttribute('width', `${width}`);
        });

        forEach(
          table.querySelectorAll('tbody>tr'),
          (item: HTMLElement, index) => {
            item.style.cssText += `height: ${heights[index]}px`;
          }
        );

        table.style.cssText += `width: ${Math.max(
          totalWidth,
          totalWidth2
        )}px;table-layout: auto;`;
      }
    );

    if (affixHeader) {
      (
        dom.querySelector(
          `.${ns}Table-fixedTop>.${ns}Table-wrapper`
        ) as HTMLElement
      ).style.cssText += `width: ${this.outterWidth}px`;
    }

    this.lastScrollLeft = -1;
    this.handleOutterScroll();
  }

  handleOutterScroll() {
    const outter = (this.table as HTMLElement).parentNode as HTMLElement;
    const scrollLeft = outter.scrollLeft;

    if (scrollLeft === this.lastScrollLeft) {
      return;
    }

    this.lastScrollLeft = scrollLeft;
    let leading = scrollLeft === 0;
    let trailing = Math.ceil(scrollLeft) + this.outterWidth >= this.totalWidth;
    // console.log(scrollLeft, store.outterWidth, store.totalWidth, (scrollLeft + store.outterWidth) === store.totalWidth);
    // store.setLeading(leading);
    // store.setTrailing(trailing);

    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;

    const fixedLeft = dom.querySelectorAll(`.${ns}Table-fixedLeft`);
    if (fixedLeft && fixedLeft.length) {
      for (let i = 0, len = fixedLeft.length; i < len; i++) {
        let node = fixedLeft[i];
        leading ? node.classList.remove('in') : node.classList.add('in');
      }
    }

    const fixedRight = dom.querySelectorAll(`.${ns}Table-fixedRight`);
    if (fixedRight && fixedRight.length) {
      for (let i = 0, len = fixedRight.length; i < len; i++) {
        let node = fixedRight[i];
        trailing ? node.classList.remove('in') : node.classList.add('in');
      }
    }
    const table = this.affixedTable;
    if (table) {
      table.style.cssText += `transform: translateX(-${scrollLeft}px)`;
    }
  }

  tableRef(ref: HTMLTableElement) {
    this.table = ref;

    if (ref) {
      this.unSensor = resizeSensor(
        ref.parentNode as HTMLElement,
        this.updateTableInfoLazy
      );
    } else {
      this.unSensor && this.unSensor();
      delete this.unSensor;
    }
  }

  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  affixedTableRef(ref: HTMLTableElement) {
    this.affixedTable = ref;
  }

  initDragging() {
    const store = this.props.store;
    const ns = this.props.classPrefix;
    this.sortable = new Sortable(
      (this.table as HTMLElement).querySelector('tbody') as HTMLElement,
      {
        group: 'table',
        animation: 150,
        handle: `.${ns}Table-dragCell`,
        ghostClass: 'is-dragging',
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          store.exchange(e.oldIndex, e.newIndex);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  handleMouseMove(e: React.MouseEvent<any>) {
    const tr: HTMLElement = (e.target as HTMLElement).closest(
      'tr[data-id]'
    ) as HTMLElement;

    if (!tr) {
      return;
    }

    const {store, affixColumns, itemActions} = this.props;

    if (
      (affixColumns === false ||
        (store.leftFixedColumns.length === 0 &&
          store.rightFixedColumns.length === 0)) &&
      (!itemActions || !itemActions.filter(item => !item.hiddenOnHover).length)
    ) {
      return;
    }

    const id = tr.getAttribute('data-id') as string;
    const row = store.hoverRow;

    if (row?.id === id) {
      return;
    }
    eachTree<IRow>(store.rows, (item: IRow) => item.setIsHover(item.id === id));
  }

  handleMouseLeave() {
    const store = this.props.store;
    const row = store.hoverRow;

    row?.setIsHover(false);
  }

  draggingTr: HTMLTableRowElement;
  originIndex: number;
  draggingSibling: Array<HTMLTableRowElement>;

  @autobind
  handleDragStart(e: React.DragEvent) {
    const store = this.props.store;
    const target = e.currentTarget;
    const tr = (this.draggingTr = target.closest('tr')!);
    const id = tr.getAttribute('data-id')!;
    const tbody = tr.parentNode!;
    this.originIndex = Array.prototype.indexOf.call(tbody.childNodes, tr);

    tr.classList.add('is-dragging');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);

    e.dataTransfer.setDragImage(tr, 0, 0);
    const item = store.getRowById(id)!;
    store.collapseAllAtDepth(item.depth);

    let siblings: Array<IRow> = store.rows;
    if (item.parentId) {
      const parent = store.getRowById(item.parentId)!;
      siblings = parent.children as any;
    }
    siblings = siblings.filter(sibling => sibling !== item);

    tbody.addEventListener('dragover', this.handleDragOver);
    tbody.addEventListener('drop', this.handleDrop);

    this.draggingSibling = siblings.map(item => {
      let tr: HTMLTableRowElement = tbody.querySelector(
        `tr[data-id="${item.id}"]`
      ) as HTMLTableRowElement;

      tr.classList.add('is-drop-allowed');

      return tr;
    });
    tr.addEventListener('dragend', this.handleDragEnd);
  }

  @autobind
  handleDragOver(e: any) {
    if (!e.target) {
      return;
    }
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';

    const overTr: HTMLElement = (e.target as HTMLElement).closest('tr')!;
    if (
      !overTr ||
      !~overTr.className.indexOf('is-drop-allowed') ||
      overTr === this.draggingTr
    ) {
      return;
    }

    const tbody = overTr.parentElement!;
    const dRect = this.draggingTr.getBoundingClientRect();
    const tRect = overTr.getBoundingClientRect();
    let ratio = dRect.top < tRect.top ? 0.1 : 0.9;

    const next = (e.clientY - tRect.top) / (tRect.bottom - tRect.top) > ratio;
    tbody.insertBefore(this.draggingTr, (next && overTr.nextSibling) || overTr);
  }

  @autobind
  handleDrop() {
    const store = this.props.store;
    const tr = this.draggingTr;
    const tbody = tr.parentElement!;
    const index = Array.prototype.indexOf.call(tbody.childNodes, tr);
    const item: IRow = store.getRowById(tr.getAttribute('data-id')!) as any;

    // destroy
    this.handleDragEnd();

    store.exchange(this.originIndex, index, item);
  }

  @autobind
  handleDragEnd() {
    const tr = this.draggingTr;
    const tbody = tr.parentElement!;
    const index = Array.prototype.indexOf.call(tbody.childNodes, tr);
    tbody.insertBefore(
      tr,
      tbody.childNodes[
        index < this.originIndex ? this.originIndex + 1 : this.originIndex
      ]
    );

    tr.classList.remove('is-dragging');
    tr.removeEventListener('dragend', this.handleDragEnd);
    tbody.removeEventListener('dragover', this.handleDragOver);
    tbody.removeEventListener('drop', this.handleDrop);
    this.draggingSibling.forEach(item =>
      item.classList.remove('is-drop-allowed')
    );
  }

  @autobind
  handleImageEnlarge(info: any, target: {rowIndex: number; colIndex: number}) {
    const onImageEnlarge = this.props.onImageEnlarge;

    // 如果已经是多张了，直接跳过
    if (Array.isArray(info.list)) {
      return onImageEnlarge && onImageEnlarge(info, target);
    }

    // 从列表中收集所有图片，然后作为一个图片集合派送出去。
    const store = this.props.store;
    const column = store.columns[target.colIndex].pristine;

    let index = target.rowIndex;
    const list: Array<any> = [];
    store.rows.forEach((row, i) => {
      const src = resolveVariable(column.name, row.data);

      if (!src) {
        if (i < target.rowIndex) {
          index--;
        }
        return;
      }

      list.push({
        src,
        originalSrc: column.originalSrc
          ? filter(column.originalSrc, row.data)
          : src,
        title: column.enlargeTitle
          ? filter(column.enlargeTitle, row.data)
          : column.title
          ? filter(column.title, row.data)
          : undefined,
        caption: column.enlargeCaption
          ? filter(column.enlargeCaption, row.data)
          : column.caption
          ? filter(column.caption, row.data)
          : undefined
      });
    });

    if (list.length > 1) {
      onImageEnlarge &&
        onImageEnlarge(
          {
            ...info,
            list,
            index
          },
          target
        );
    } else {
      onImageEnlarge && onImageEnlarge(info, target);
    }
  }

  // 以下变量都是用于列宽度调整拖拽
  resizeLine: HTMLElement;
  resizeLineLeft: number;
  targetTh: HTMLElement;
  targetThWidth: number;
  lineStartX: number;

  // 开始列宽度调整
  @autobind
  handleColResizeMouseDown(e: React.MouseEvent<HTMLElement>) {
    this.lineStartX = e.clientX;
    const currentTarget = e.currentTarget;
    this.resizeLine = currentTarget;
    this.resizeLineLeft = parseInt(
      getComputedStyle(this.resizeLine).getPropertyValue('left'),
      10
    );
    this.targetTh = this.resizeLine.parentElement! as HTMLElement;
    this.targetThWidth = this.targetTh.getBoundingClientRect().width;
    document.addEventListener('mousemove', this.handleColResizeMouseMove);
    document.addEventListener('mouseup', this.handleColResizeMouseUp);
  }

  // 垂直线拖拽移动
  @autobind
  handleColResizeMouseMove(e: MouseEvent) {
    const moveX = e.clientX - this.lineStartX;
    this.resizeLine.style.left = this.resizeLineLeft + moveX + 'px';
    this.targetTh.style.width = this.targetThWidth + moveX + 'px';
  }

  // 垂直线拖拽结束
  @autobind
  handleColResizeMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', this.handleColResizeMouseMove);
    document.removeEventListener('mouseup', this.handleColResizeMouseUp);
  }

  handleColumnToggle(columns: Array<IColumn>) {
    const {store} = this.props;

    store.update({columns});
  }

  renderAutoFilterForm(): React.ReactNode {
    const {
      render,
      store,
      onSearchableFromReset,
      onSearchableFromSubmit,
      onSearchableFromInit,
      classnames: cx,
      translate: __
    } = this.props;
    const searchableColumns = store.searchableColumns;
    const activedSearchableColumns = store.activedSearchableColumns;

    if (!searchableColumns.length) {
      return null;
    }

    const groupedSearchableColumns: Array<Record<string, any>> = [
      {body: [], md: 4},
      {body: [], md: 4},
      {body: [], md: 4}
    ];

    activedSearchableColumns.forEach((column, index) => {
      groupedSearchableColumns[index % 3].body.push({
        ...column.searchable,
        name: column.searchable?.name ?? column.name,
        label: column.searchable?.label ?? column.label,
        mode: 'horizontal'
      });
    });

    return render(
      'searchable-form',
      {
        type: 'form',
        api: null,
        title: '',
        mode: 'normal',
        submitText: __('search'),
        body: [
          {
            type: 'grid',
            columns: groupedSearchableColumns
          }
        ],
        actions: [
          {
            type: 'dropdown-button',
            label: __('Table.searchFields'),
            className: cx('Table-searchableForm-dropdown', 'mr-2'),
            level: 'link',
            trigger: 'click',
            size: 'sm',
            align: 'right',
            buttons: searchableColumns.map(column => {
              return {
                type: 'checkbox',
                className: cx('Table-searchableForm-checkbox'),
                name: `__search_${column.searchable?.name ?? column.name}`,
                option: column.searchable?.label ?? column.label,
                value: column.enableSearch,
                badge: {
                  offset: [-10, 5],
                  visibleOn: `${
                    column.toggable && !column.toggled && column.enableSearch
                  }`
                },
                onChange: (value: boolean) => {
                  column.setEnableSearch(value);
                }
              };
            })
          },
          {
            type: 'submit',
            label: __('search'),
            level: 'primary',
            className: 'w-18'
          },
          {
            type: 'reset',
            label: __('reset'),
            className: 'w-18'
          }
        ]
      },
      {
        key: 'searchable-form',
        panelClassName: cx('Table-searchableForm'),
        actionsClassName: cx('Table-searchableForm-footer'),
        onReset: onSearchableFromReset,
        onSubmit: onSearchableFromSubmit,
        onInit: onSearchableFromInit,
        formStore: undefined
      }
    );
  }

  renderHeading() {
    let {
      title,
      store,
      hideQuickSaveBtn,
      data,
      classnames: cx,
      saveImmediately,
      headingClassName,
      quickSaveApi,
      translate: __
    } = this.props;

    if (
      title ||
      (quickSaveApi &&
        !saveImmediately &&
        store.modified &&
        !hideQuickSaveBtn) ||
      store.moved
    ) {
      return (
        <div className={cx('Table-heading', headingClassName)} key="heading">
          {!saveImmediately && store.modified && !hideQuickSaveBtn ? (
            <span>
              {__('Table.modified', {
                modified: store.modified
              })}
              <button
                type="button"
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSave}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('Form.submit')}
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
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
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSaveOrder}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('Form.submit')}
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('Table.discard')}
              </button>
            </span>
          ) : title ? (
            filter(title, data)
          ) : (
            ''
          )}
        </div>
      );
    }

    return null;
  }

  renderHeadCell(column: IColumn, props?: any) {
    const {
      store,
      query,
      onQuery,
      multiple,
      env,
      render,
      classPrefix: ns,
      resizable,
      classnames: cx,
      autoGenerateFilter
    } = this.props;

    if (column.type === '__checkme') {
      return (
        <th {...props} className={cx(column.pristine.className)}>
          {store.rows.length && multiple ? (
            <Checkbox
              classPrefix={ns}
              partial={!store.allChecked}
              checked={store.someChecked}
              disabled={store.disabledHeadCheckbox}
              onChange={this.handleCheckAll}
            />
          ) : (
            '\u00A0'
          )}
        </th>
      );
    } else if (column.type === '__dragme') {
      return <th {...props} className={cx(column.pristine.className)} />;
    } else if (column.type === '__expandme') {
      return (
        <th {...props} className={cx(column.pristine.className)}>
          {(store.footable &&
            (store.footable.expandAll === false || store.footable.accordion)) ||
          (store.expandConfig &&
            (store.expandConfig.expandAll === false ||
              store.expandConfig.accordion)) ? null : (
            <a
              className={cx(
                'Table-expandBtn',
                store.allExpanded ? 'is-active' : ''
              )}
              // data-tooltip="展开/收起全部"
              // data-position="top"
              onClick={store.toggleExpandAll}
            >
              <Icon icon="right-arrow-bold" className="icon" />
            </a>
          )}
        </th>
      );
    }

    let affix = null;

    if (column.searchable && column.name && !autoGenerateFilter) {
      affix = (
        <HeadCellSearchDropDown
          {...this.props}
          onQuery={onQuery}
          name={column.name}
          searchable={column.searchable}
          sortable={column.sortable}
          type={column.type}
          data={query}
          orderBy={store.orderBy}
          orderDir={store.orderDir}
          popOverContainer={this.getPopOverContainer}
        />
      );
    } else if (column.sortable && column.name) {
      affix = (
        <span
          className={cx('TableCell-sortBtn')}
          onClick={() => {
            if (column.name === store.orderBy) {
              if (store.orderDir === 'desc') {
                // 降序之后取消排序
                store.setOrderByInfo('', 'asc');
              } else {
                // 升序之后降序
                store.setOrderByInfo(column.name, 'desc');
              }
            } else {
              store.setOrderByInfo(column.name as string, 'asc');
            }

            onQuery &&
              onQuery({
                orderBy: store.orderBy,
                orderDir: store.orderDir
              });
          }}
        >
          <i
            className={cx(
              'TableCell-sortBtn--down',
              store.orderBy === column.name && store.orderDir === 'desc'
                ? 'is-active'
                : ''
            )}
          >
            <Icon icon="sort-desc" className="icon" />
          </i>
          <i
            className={cx(
              'TableCell-sortBtn--up',
              store.orderBy === column.name && store.orderDir === 'asc'
                ? 'is-active'
                : ''
            )}
          >
            <Icon icon="sort-asc" className="icon" />
          </i>
          <i
            className={cx(
              'TableCell-sortBtn--default',
              store.orderBy === column.name ? '' : 'is-active'
            )}
          >
            <Icon icon="sort-default" className="icon" />
          </i>
        </span>
      );
    } else if (column.filterable && column.name) {
      affix = (
        <HeadCellFilterDropDown
          {...this.props}
          onQuery={onQuery}
          name={column.name}
          type={column.type}
          data={query}
          filterable={column.filterable}
          popOverContainer={this.getPopOverContainer}
        />
      );
    }

    if (column.pristine.width) {
      props.style = props.style || {};
      props.style.width = column.pristine.width;
    }

    if (column.pristine.align) {
      props.style = props.style || {};
      props.style.textAlign = column.pristine.align;
    }

    const resizeLine = (
      <div
        className={cx('Table-content-colDragLine')}
        key={`resize-${column.index}`}
        onMouseDown={this.handleColResizeMouseDown}
      ></div>
    );

    return (
      <th
        {...props}
        className={cx(props ? (props as any).className : '', {
          'TableCell--sortable': column.sortable,
          'TableCell--searchable': column.searchable,
          'TableCell--filterable': column.filterable,
          'Table-operationCell': column.type === 'operation'
        })}
      >
        <div
          className={cx(
            `${ns}TableCell--title`,
            column.pristine.className,
            column.pristine.labelClassName
          )}
        >
          {column.label ? render('tpl', column.label) : null}

          {column.remark
            ? render('remark', {
                type: 'remark',
                tooltip: column.remark,
                container:
                  env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
              })
            : null}
        </div>

        {affix}
        {resizable === false ? null : resizeLine}
      </th>
    );
  }

  renderCell(
    region: string,
    column: IColumn,
    item: IRow,
    props: any,
    ignoreDrag = false
  ) {
    const {
      render,
      store,
      multiple,
      classPrefix: ns,
      classnames: cx,
      checkOnItemClick,
      popOverContainer,
      canAccessSuperData,
      itemBadge
    } = this.props;

    if (column.name && item.rowSpans[column.name] === 0) {
      return null;
    }

    if (column.type === '__checkme') {
      return (
        <td key={props.key} className={cx(column.pristine.className)}>
          <Checkbox
            classPrefix={ns}
            type={multiple ? 'checkbox' : 'radio'}
            checked={item.checked}
            disabled={item.checkdisable}
            onChange={
              checkOnItemClick ? noop : this.handleCheck.bind(this, item)
            }
          />
        </td>
      );
    } else if (column.type === '__dragme') {
      return (
        <td key={props.key} className={cx(column.pristine.className)}>
          {item.draggable ? <Icon icon="drag-bar" className="icon" /> : null}
        </td>
      );
    } else if (column.type === '__expandme') {
      return (
        <td key={props.key} className={cx(column.pristine.className)}>
          {item.depth > 2
            ? Array.from({length: item.depth - 2}).map((_, index) => (
                <i key={index} className={cx('Table-divider-' + (index + 1))} />
              ))
            : null}

          {item.expandable ? (
            <a
              className={cx(
                'Table-expandBtn',
                item.expanded ? 'is-active' : ''
              )}
              // data-tooltip="展开/收起"
              // data-position="top"
              onClick={item.toggleExpanded}
            >
              <Icon icon="right-arrow-bold" className="icon" />
            </a>
          ) : null}
        </td>
      );
    }

    let prefix: React.ReactNode = null;

    if (
      !ignoreDrag &&
      column.isPrimary &&
      store.isNested &&
      store.draggable &&
      item.draggable
    ) {
      prefix = (
        <a
          draggable
          onDragStart={this.handleDragStart}
          className={cx('Table-dragBtn')}
        >
          <Icon icon="drag-bar" className="icon" />
        </a>
      );
    }

    const subProps: any = {
      ...props,
      btnDisabled: store.dragging,
      data: item.locals,
      value: column.name
        ? resolveVariable(
            column.name,
            canAccessSuperData ? item.locals : item.data
          )
        : column.value,
      popOverContainer: popOverContainer || this.getPopOverContainer,
      rowSpan: item.rowSpans[column.name as string],
      quickEditFormRef: this.subFormRef,
      prefix,
      onImageEnlarge: this.handleImageEnlarge,
      canAccessSuperData,
      row: item,
      itemBadge,
      showBadge:
        !props.isHead &&
        itemBadge &&
        store.firstToggledColumnIndex === props.colIndex
    };
    delete subProps.label;

    return render(
      region,
      {
        ...column.pristine,
        column: column.pristine,
        type: 'cell'
      },
      subProps
    );
  }

  renderAffixHeader(tableClassName: string) {
    const {store, affixHeader, render, classnames: cx} = this.props;
    const hideHeader = store.filteredColumns.every(column => !column.label);
    const columnsGroup = store.columnGroup;

    return affixHeader ? (
      <div
        className={cx('Table-fixedTop', {
          'is-fakeHide': hideHeader
        })}
      >
        {this.renderHeader(false)}
        {this.renderHeading()}
        <div className={cx('Table-fixedLeft')}>
          {store.leftFixedColumns.length
            ? this.renderFixedColumns(
                store.rows,
                store.leftFixedColumns,
                true,
                tableClassName
              )
            : null}
        </div>
        <div className={cx('Table-fixedRight')}>
          {store.rightFixedColumns.length
            ? this.renderFixedColumns(
                store.rows,
                store.rightFixedColumns,
                true,
                tableClassName
              )
            : null}
        </div>
        <div className={cx('Table-wrapper')}>
          <table ref={this.affixedTableRef} className={tableClassName}>
            <colgroup>
              {store.filteredColumns.map(column => (
                <col key={column.index} data-index={column.index} />
              ))}
            </colgroup>
            <thead>
              {columnsGroup.length ? (
                <tr>
                  {columnsGroup.map((item, index) => (
                    <th
                      key={index}
                      data-index={item.index}
                      colSpan={item.colSpan}
                      rowSpan={item.rowSpan}
                    >
                      {item.label ? render('tpl', item.label) : null}
                    </th>
                  ))}
                </tr>
              ) : null}
              <tr>
                {store.filteredColumns.map(column =>
                  columnsGroup.find(group => ~group.has.indexOf(column))
                    ?.rowSpan === 2
                    ? null
                    : this.renderHeadCell(column, {
                        'key': column.index,
                        'data-index': column.index
                      })
                )}
              </tr>
            </thead>
          </table>
        </div>
      </div>
    ) : null;
  }

  renderFixedColumns(
    rows: Array<any>,
    columns: Array<IColumn>,
    headerOnly: boolean = false,
    tableClassName: string = ''
  ) {
    const {
      placeholder,
      store,
      classnames: cx,
      render,
      data,
      translate,
      locale,
      checkOnItemClick,
      buildItemProps,
      rowClassNameExpr,
      rowClassName,
      itemAction
    } = this.props;
    const hideHeader = store.filteredColumns.every(column => !column.label);
    const columnsGroup = store.columnGroup;
    return (
      <table
        className={cx(
          'Table-table',
          store.combineNum > 0 ? 'Table-table--withCombine' : '',
          tableClassName
        )}
      >
        <thead>
          {columnsGroup.length ? (
            <tr>
              {columnsGroup.map((item, index) => {
                const renderColumns = columns.filter(a => ~item.has.indexOf(a));

                return renderColumns.length ? (
                  <th
                    key={index}
                    data-index={item.index}
                    colSpan={renderColumns.length}
                    rowSpan={item.rowSpan}
                  >
                    {item.label}
                  </th>
                ) : null;
              })}
            </tr>
          ) : null}
          <tr className={hideHeader ? 'fake-hide' : ''}>
            {columns.map(column =>
              columnsGroup.find(group => ~group.has.indexOf(column))
                ?.rowSpan === 2
                ? null
                : this.renderHeadCell(column, {
                    'key': column.index,
                    'data-index': column.index
                  })
            )}
          </tr>
        </thead>

        {headerOnly ? null : !rows.length ? (
          <tbody>
            <tr className={cx('Table-placeholder')}>
              <td colSpan={columns.length}>
                {render(
                  'placeholder',
                  translate(placeholder || 'placeholder.noData')
                )}
              </td>
            </tr>
          </tbody>
        ) : (
          <TableBody
            tableClassName={cx(
              store.combineNum > 0 ? 'Table-table--withCombine' : '',
              tableClassName
            )}
            itemAction={itemAction}
            classnames={cx}
            render={render}
            renderCell={this.renderCell}
            onCheck={this.handleCheck}
            onQuickChange={store.dragging ? undefined : this.handleQuickChange}
            footable={store.footable}
            ignoreFootableContent
            footableColumns={store.footableColumns}
            checkOnItemClick={checkOnItemClick}
            buildItemProps={buildItemProps}
            onAction={this.handleAction}
            rowClassNameExpr={rowClassNameExpr}
            rowClassName={rowClassName}
            columns={columns}
            rows={rows}
            locale={locale}
            translate={translate}
            rowsProps={{
              regionPrefix: 'fixed/',
              renderCell: (
                region: string,
                column: IColumn,
                item: IRow,
                props: any
              ) => this.renderCell(region, column, item, props, true)
            }}
          />
        )}
      </table>
    );
  }

  renderToolbar(toolbar: SchemaNode) {
    const type = (toolbar as Schema).type || (toolbar as string);

    if (type === 'columns-toggler') {
      this.renderedToolbars.push(type);
      return this.renderColumnsToggler(toolbar as any);
    } else if (type === 'drag-toggler') {
      this.renderedToolbars.push(type);
      return this.renderDragToggler();
    } else if (type === 'export-excel') {
      this.renderedToolbars.push(type);
      return this.renderExportExcel(toolbar);
    }

    return void 0;
  }

  renderColumnsToggler(config?: any) {
    const {
      className,
      store,
      classPrefix: ns,
      classnames: cx,
      ...rest
    } = this.props;
    const __ = rest.translate;
    const env = rest.env;

    const render = this.props.render;

    if (!store.columnsTogglable) {
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
            <Checkbox size="sm" classPrefix={ns} checked={column.toggled}>
              {column.label ? render('tpl', column.label) : null}
            </Checkbox>
          </li>
        ))}
      </ColumnToggler>
    );
  }

  renderDragToggler() {
    const {store, env, draggable, classPrefix: ns, translate: __} = this.props;

    if (!draggable || store.isNested) {
      return null;
    }

    return (
      <Button
        disabled={!!store.modified}
        classPrefix={ns}
        key="dragging-toggle"
        tooltip={__('Table.startSort')}
        tooltipContainer={
          env && env.getModalContainer ? env.getModalContainer : undefined
        }
        size="sm"
        active={store.dragging}
        onClick={(e: React.MouseEvent<any>) => {
          e.preventDefault();
          store.toggleDragging();
          store.dragging && store.clear();
        }}
        iconOnly
      >
        <Icon icon="exchange" className="icon" />
      </Button>
    );
  }

  renderExportExcel(toolbar: ExportExcelToolbar) {
    const {
      store,
      env,
      classPrefix: ns,
      classnames: cx,
      translate: __,
      columns,
      data
    } = this.props;

    if (!columns) {
      return null;
    }

    return (
      <Button
        classPrefix={ns}
        onClick={() => {
          import('exceljs').then(async (ExcelJS: any) => {
            let rows = [];
            let tmpStore;
            let filename = 'data';
            // 支持配置 api 远程获取
            if (typeof toolbar === 'object' && toolbar.api) {
              const res = await env.fetcher(toolbar.api, data);
              if (!res.data) {
                env.notify('warning', __('placeholder.noData'));
                return;
              }
              if (Array.isArray(res.data)) {
                rows = res.data;
              } else {
                rows = res.data.rows || res.data.items;
              }
              // 因为很多方法是 store 里的，所以需要构建 store 来处理
              tmpStore = TableStore.create(getSnapshot(store));
              tmpStore.initRows(rows);
              rows = tmpStore.rows;
            } else {
              rows = store.rows;
            }

            if (typeof toolbar === 'object' && toolbar.filename) {
              filename = filter(toolbar.filename, data, '| raw');
            }

            if (rows.length === 0) {
              env.notify('warning', __('placeholder.noData'));
              return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('sheet', {
              properties: {defaultColWidth: 15}
            });
            worksheet.views = [{state: 'frozen', xSplit: 0, ySplit: 1}];

            const filteredColumns = toolbar.columns
              ? columns.filter(column => {
                  const filterColumnsNames = toolbar.columns!;
                  if (filterColumnsNames.indexOf(column.name) !== -1) {
                    return true;
                  }
                  return false;
                })
              : columns;

            const firstRowLabels = filteredColumns.map(column => {
              return column.label;
            });
            const firstRow = worksheet.getRow(1);
            firstRow.values = firstRowLabels;
            worksheet.autoFilter = {
              from: {
                row: 1,
                column: 1
              },
              to: {
                row: 1,
                column: firstRowLabels.length
              }
            };
            // 用于 mapping source 的情况
            const remoteMappingCache: any = {};
            // 数据从第二行开始
            let rowIndex = 1;
            for (const row of rows) {
              rowIndex += 1;
              const sheetRow = worksheet.getRow(rowIndex);
              let columIndex = 0;
              for (const column of filteredColumns) {
                columIndex += 1;
                const name = column.name!;
                const value = getVariable(row.data, name);
                if (
                  typeof value === 'undefined' &&
                  !(column as TplSchema).tpl
                ) {
                  continue;
                }
                // 处理合并单元格
                if (name in row.rowSpans) {
                  if (row.rowSpans[name] === 0) {
                    continue;
                  } else {
                    // start row, start column, end row, end column
                    worksheet.mergeCells(
                      rowIndex,
                      columIndex,
                      rowIndex + row.rowSpans[name] - 1,
                      columIndex
                    );
                  }
                }

                const type = (column as BaseSchema).type || 'plain';
                if (type === 'image' && value) {
                  try {
                    const imageData = await toDataURL(value);
                    const imageDimensions = await getImageDimensions(imageData);
                    let imageWidth = imageDimensions.width;
                    let imageHeight = imageDimensions.height;
                    // 限制一下图片高宽
                    const imageMaxSize = 100;
                    if (imageWidth > imageHeight) {
                      if (imageWidth > imageMaxSize) {
                        imageHeight = (imageMaxSize * imageHeight) / imageWidth;
                        imageWidth = imageMaxSize;
                      }
                    } else {
                      if (imageHeight > imageMaxSize) {
                        imageWidth = (imageMaxSize * imageWidth) / imageHeight;
                        imageHeight = imageMaxSize;
                      }
                    }
                    const imageMatch = imageData.match(/data:image\/(.*);/);
                    let imageExt = 'png';
                    if (imageMatch) {
                      imageExt = imageMatch[1];
                    }
                    // 目前 excel 只支持这些格式，所以其它格式直接输出 url
                    if (
                      imageExt != 'png' &&
                      imageExt != 'jpeg' &&
                      imageExt != 'gif'
                    ) {
                      sheetRow.getCell(columIndex).value = value;
                      continue;
                    }
                    const imageId = workbook.addImage({
                      base64: imageData,
                      extension: imageExt
                    });
                    const linkURL = getAbsoluteUrl(value);
                    worksheet.addImage(imageId, {
                      // 这里坐标位置是从 0 开始的，所以要减一
                      tl: {col: columIndex - 1, row: rowIndex - 1},
                      ext: {
                        width: imageWidth,
                        height: imageHeight
                      },
                      hyperlinks: {
                        tooltip: linkURL
                      }
                    });
                  } catch (e) {
                    console.warn(e.stack);
                  }
                } else if (type == 'link') {
                  const linkURL = getAbsoluteUrl(value);
                  sheetRow.getCell(columIndex).value = {
                    text: value,
                    hyperlink: linkURL
                  };
                } else if (type === 'mapping') {
                  // 拷贝自 Mapping.tsx
                  let map = (column as MappingSchema).map;
                  const source = (column as MappingSchema).source;
                  if (source) {
                    let sourceValue = source;
                    if (isPureVariable(source)) {
                      sourceValue = resolveVariableAndFilter(
                        source as string,
                        data,
                        '| raw'
                      );
                    }

                    const mapKey = JSON.stringify(source);
                    if (mapKey in remoteMappingCache) {
                      map = remoteMappingCache[mapKey];
                    } else {
                      const res = await env.fetcher(sourceValue, data);
                      if (res.data) {
                        remoteMappingCache[mapKey] = res.data;
                        map = res.data;
                      }
                    }
                  }

                  if (
                    typeof value !== 'undefined' &&
                    map &&
                    (map[value] ?? map['*'])
                  ) {
                    const viewValue =
                      map[value] ??
                      (value === true && map['1']
                        ? map['1']
                        : value === false && map['0']
                        ? map['0']
                        : map['*']); // 兼容平台旧用法：即 value 为 true 时映射 1 ，为 false 时映射 0
                    sheetRow.getCell(columIndex).value =
                      removeHTMLTag(viewValue);
                  } else {
                    sheetRow.getCell(columIndex).value = removeHTMLTag(value);
                  }
                } else {
                  if ((column as TplSchema).tpl) {
                    sheetRow.getCell(columIndex).value = removeHTMLTag(
                      filter((column as TplSchema).tpl, row.data)
                    );
                  } else {
                    sheetRow.getCell(columIndex).value = value;
                  }
                }
              }
            }

            const buffer = await workbook.xlsx.writeBuffer();

            if (buffer) {
              var blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              saveAs(blob, filename + '.xlsx');
            }
          });
        }}
        size="sm"
      >
        {(toolbar as Schema).label || __('CRUD.exportExcel')}
      </Button>
    );
  }

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

    if (
      store.draggable &&
      !store.isNested &&
      region === 'header' &&
      store.rows.length > 1 &&
      !~this.renderedToolbars.indexOf('drag-toggler')
    ) {
      actions.push({
        type: 'button',
        children: this.renderDragToggler()
      });
    }

    return Array.isArray(actions) && actions.length ? (
      <div className={cx('Table-actions')}>
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

  renderHeader(editable?: boolean) {
    const {
      header,
      headerClassName,
      toolbarClassName,
      headerToolbarClassName,
      headerToolbarRender,
      render,
      showHeader,
      store,
      classnames: cx,
      data,
      translate: __
    } = this.props;

    if (showHeader === false) {
      return null;
    }

    const otherProps: any = {};
    // editable === false && (otherProps.$$editable = false);

    const child = headerToolbarRender
      ? headerToolbarRender(
          {
            ...this.props,
            selectedItems: store.selectedRows.map(item => item.data),
            items: store.rows.map(item => item.data),
            unSelectedItems: store.unSelectedRows.map(item => item.data),
            ...otherProps
          },
          this.renderToolbar
        )
      : null;
    const actions = this.renderActions('header');

    const toolbarNode =
      actions || child || store.dragging ? (
        <div
          className={cx(
            'Table-toolbar Table-headToolbar',
            toolbarClassName,
            headerToolbarClassName
          )}
          key="header-toolbar"
        >
          {actions}
          {child}
          {store.dragging ? (
            <div className={cx('Table-dragTip')} ref={this.dragTipRef}>
              {__('Table.dragTip')}
            </div>
          ) : null}
        </div>
      ) : null;
    const headerNode =
      header && (!Array.isArray(header) || header.length) ? (
        <div className={cx('Table-header', headerClassName)} key="header">
          {render('header', header, {
            ...(editable === false ? otherProps : null),
            data: store.getData(data)
          })}
        </div>
      ) : null;

    return headerNode && toolbarNode
      ? [headerNode, toolbarNode]
      : headerNode || toolbarNode || null;
  }

  renderFooter() {
    const {
      footer,
      toolbarClassName,
      footerToolbarClassName,
      footerClassName,
      footerToolbarRender,
      render,
      showFooter,
      store,
      data,
      classnames: cx
    } = this.props;

    if (showFooter === false) {
      return null;
    }

    const child = footerToolbarRender
      ? footerToolbarRender(
          {
            ...this.props,
            selectedItems: store.selectedRows.map(item => item.data),
            items: store.rows.map(item => item.data)
          },
          this.renderToolbar
        )
      : null;
    const actions = this.renderActions('footer');

    const toolbarNode =
      actions || child ? (
        <div
          className={cx(
            'Table-toolbar Table-footToolbar',
            toolbarClassName,
            footerToolbarClassName
          )}
          key="footer-toolbar"
        >
          {actions}
          {child}
        </div>
      ) : null;
    const footerNode =
      footer && (!Array.isArray(footer) || footer.length) ? (
        <div className={cx('Table-footer', footerClassName)} key="footer">
          {render('footer', footer, {
            data: store.getData(data)
          })}
        </div>
      ) : null;
    return footerNode && toolbarNode
      ? [toolbarNode, footerNode]
      : footerNode || toolbarNode || null;
  }

  renderItemActions() {
    const {itemActions, render, store, classnames: cx} = this.props;
    const finalActions = Array.isArray(itemActions)
      ? itemActions.filter(action => !action.hiddenOnHover)
      : [];

    if (!finalActions.length) {
      return null;
    }

    return (
      <ItemActionsWrapper store={store} classnames={cx}>
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
                item: store.hoverRow,
                data: store.hoverRow!.locals,
                rowIndex: store.hoverRow!.index
              }
            )
          )}
        </div>
      </ItemActionsWrapper>
    );
  }

  renderTableContent() {
    const {
      classnames: cx,
      tableClassName,
      store,
      placeholder,
      render,
      checkOnItemClick,
      buildItemProps,
      rowClassNameExpr,
      rowClassName,
      prefixRow,
      locale,
      affixRow,
      translate,
      itemAction
    } = this.props;

    // 理论上来说 store.rows 应该也行啊
    // 不过目前看来只有这样写它才会重新更新视图
    store.rows.length;

    return (
      <TableContent
        tableClassName={cx(
          store.combineNum > 0 ? 'Table-table--withCombine' : '',
          tableClassName
        )}
        itemAction={itemAction}
        classnames={cx}
        columns={store.filteredColumns}
        columnsGroup={store.columnGroup}
        rows={store.rows}
        placeholder={placeholder}
        render={render}
        onMouseMove={this.handleMouseMove}
        onScroll={this.handleOutterScroll}
        tableRef={this.tableRef}
        renderHeadCell={this.renderHeadCell}
        renderCell={this.renderCell}
        onCheck={this.handleCheck}
        onQuickChange={store.dragging ? undefined : this.handleQuickChange}
        footable={store.footable}
        footableColumns={store.footableColumns}
        checkOnItemClick={checkOnItemClick}
        buildItemProps={buildItemProps}
        onAction={this.handleAction}
        rowClassNameExpr={rowClassNameExpr}
        rowClassName={rowClassName}
        data={store.data}
        prefixRow={prefixRow}
        affixRow={affixRow}
        locale={locale}
        translate={translate}
      />
    );
  }

  render() {
    const {
      className,
      store,
      classnames: cx,
      affixColumns,
      autoGenerateFilter
    } = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
    const heading = this.renderHeading();
    const header = this.renderHeader();
    const footer = this.renderFooter();
    const tableClassName = cx(
      'Table-table',
      store.combineNum > 0 ? 'Table-table--withCombine' : '',
      this.props.tableClassName
    );

    return (
      <div
        className={cx('Table', className, {
          'Table--unsaved': !!store.modified || !!store.moved
        })}
      >
        {autoGenerateFilter ? this.renderAutoFilterForm() : null}
        {header}
        {heading}
        <div
          className={cx('Table-contentWrap')}
          onMouseLeave={this.handleMouseLeave}
        >
          <div
            className={cx('Table-fixedLeft')}
            onMouseMove={this.handleMouseMove}
          >
            {affixColumns !== false && store.leftFixedColumns.length
              ? this.renderFixedColumns(
                  store.rows,
                  store.leftFixedColumns,
                  false,
                  tableClassName
                )
              : null}
          </div>
          <div
            className={cx('Table-fixedRight')}
            onMouseMove={this.handleMouseMove}
          >
            {affixColumns !== false && store.rightFixedColumns.length
              ? this.renderFixedColumns(
                  store.rows,
                  store.rightFixedColumns,
                  false,
                  tableClassName
                )
              : null}
          </div>
          {this.renderTableContent()}
          {store.hoverRow ? this.renderItemActions() : null}
        </div>
        {this.renderAffixHeader(tableClassName)}
        {footer}
      </div>
    );
  }
}

@Renderer({
  type: 'table',
  storeType: TableStore.name,
  name: 'table'
})
export class TableRenderer extends Table {}

export {TableCell};
