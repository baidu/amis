import React from 'react';
import {findDOMNode} from 'react-dom';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Action, Schema, Api, ApiObject} from '../types';
import forEach from 'lodash/forEach';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import DropDownButton from './DropDownButton';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import {TableStore, ITableStore, IColumn, IRow} from '../store/table';
import {observer} from 'mobx-react';
import {
  anyChanged,
  getScrollParent,
  difference,
  noop,
  autobind,
  isArrayChildrenModified
} from '../utils/helper';
import {resolveVariable} from '../utils/tpl-builtin';
import {
  isEffectiveApi,
  isApiOutdated,
  buildApi,
  normalizeApi
} from '../utils/api';
import debounce from 'lodash/debounce';
import xor from 'lodash/xor';
import QuickEdit from './QuickEdit';
import PopOver from '../components/PopOver';
import Copyable from './Copyable';
import Sortable from 'sortablejs';
import flatMap from 'lodash/flatMap';
import {resizeSensor} from '../utils/resize-sensor';
import find from 'lodash/find';
import Overlay from '../components/Overlay';
import PopOverable from './PopOver';
import {Icon} from '../components/icons';

export interface Column {
  type: string;
  [propName: string]: any;
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
  columns?: Array<Column>;
  headingClassName?: string;
  toolbarClassName?: string;
  headerToolbarClassName?: string;
  footerToolbarClassName?: string;
  tableClassName?: string;
  source?: string;
  selectable?: boolean;
  selected?: Array<any>;
  valueField?: string;
  draggable?: boolean;
  columnsTogglable?: boolean | 'auto';
  affixHeader?: boolean;
  affixColumns?: boolean;
  combineNum?: number;
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
  onSave?: (
    items: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<number> | number,
    unModifiedItems?: Array<object>,
    rowOrigins?: Array<object> | object
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
}

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
    'itemActions',
    'combineNum',
    'items',
    'columns',
    'valueField',
    'saveImmediately',
    'rowClassName',
    'rowClassNameExpr',
    'popOverContainer',
    'headerToolbarClassName',
    'toolbarClassName',
    'footerToolbarClassName'
  ];
  static defaultProps: Partial<TableProps> = {
    className: '',
    placeholder: '暂无数据',
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
    hideCheckToggler: false
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
  unSensor: Function;
  updateTableInfoLazy: () => void;
  widths: {
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
    this.renderToolbar = this.renderToolbar.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.subFormRef = this.subFormRef.bind(this);
  }

  static syncRows(
    store: ITableStore,
    props: TableProps,
    prevProps?: TableProps
  ) {
    const source = props.source;
    const value = props.value || props.items;
    let rows: Array<object> = [];
    let updateRows = true;

    if (Array.isArray(value)) {
      rows = value;
    } else if (typeof source === 'string') {
      const resolved = resolveVariable(source, props.data);
      const prev = prevProps ? resolveVariable(source, prevProps.data) : null;

      if (prev && prev === resolved) {
        updateRows = false;
      } else if (Array.isArray(resolved)) {
        rows = resolved;
      }
    }

    updateRows && store.initRows(rows, props.getEntryId);
    typeof props.selected !== 'undefined' &&
      store.updateSelected(props.selected, props.valueField);
  }

  componentWillMount() {
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
      combineNum,
      expandConfig
    } = this.props;

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
      combineNum
    });

    Table.syncRows(store, this.props);
    this.syncSelected();
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

  componentWillReceiveProps(nextProps: TableProps) {
    const props = this.props;
    const store = nextProps.store;

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
          'expandConfig'
        ],
        props,
        nextProps
      )
    ) {
      store.update({
        selectable: nextProps.selectable,
        columnsTogglable: nextProps.columnsTogglable,
        draggable: nextProps.draggable,
        orderBy: nextProps.orderBy,
        orderDir: nextProps.orderDir,
        multiple: nextProps.multiple,
        primaryField: nextProps.primaryField,
        footable: nextProps.footable,
        itemCheckableOn: nextProps.itemCheckableOn,
        itemDraggableOn: nextProps.itemDraggableOn,
        hideCheckToggler: nextProps.hideCheckToggler,
        combineNum: nextProps.combineNum,
        expandConfig: nextProps.expandConfig
      });
    }

    if (props.columns !== nextProps.columns) {
      store.update({
        columns: nextProps.columns
      });
    }

    if (
      anyChanged(['source', 'value', 'items'], props, nextProps) ||
      (!nextProps.value && !nextProps.items && nextProps.data !== props.data)
    ) {
      Table.syncRows(store, nextProps, props);
      this.syncSelected();
    } else if (isArrayChildrenModified(props.selected!, nextProps.selected!)) {
      store.updateSelected(nextProps.selected || [], nextProps.valueField);
      this.syncSelected();
    }
  }

  componentDidUpdate() {
    this.updateTableInfoLazy();
  }

  componentWillUnmount() {
    const parent = this.parentNode;
    parent && parent.removeEventListener('scroll', this.affixDetect);
    window.removeEventListener('resize', this.affixDetect);
    (this.updateTableInfoLazy as any).cancel();
    this.unSensor && this.unSensor();
  }

  subFormRef(form: any, x: number, y: number) {
    const {quickEditFormRef} = this.props;

    quickEditFormRef && quickEditFormRef(form, x, y);
    this.subForms[`${x}-${y}`] = form;
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: object) {
    const {onAction} = this.props;

    // todo
    onAction(e, action, ctx);
  }

  handleCheck(item: IRow) {
    item.toggle();
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
    savePristine?: boolean
  ) {
    const {
      onSave,
      saveImmediately: propsSaveImmediately,
      primaryField
    } = this.props;

    item.change(values, savePristine);

    // 值发生变化了，需要通过 onSelect 通知到外面，否则会出现数据不同步的问题
    item.modified && this.syncSelected();

    if ((!saveImmediately && !propsSaveImmediately) || savePristine) {
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
      item.index,
      undefined,
      item.pristine
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
    const rowIndexes = store.modifiedRows.map(item => item.index);
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
      this.props.affixOffsetTop || this.props.env.affixOffsetTop || 0;
    const affixed = clip.top < offsetY && clip.top + clip.height - 40 > offsetY;
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
    let heights: {
      [propName: string]: number;
    } = (this.heights = {});

    heights.header ||
      (heights.header = table.querySelector('thead')!.offsetHeight);

    forEach(
      table.querySelectorAll('thead>tr:last-child>th'),
      (item: HTMLElement) => {
        widths[item.getAttribute('data-index') as string] = item.offsetWidth;
      }
    );
    forEach(
      table.querySelectorAll('tbody>tr>*:last-child'),
      (item: HTMLElement, index: number) => (heights[index] = item.offsetHeight)
    );

    // 让 react 去更新非常慢，还是手动更新吧。
    const dom = findDOMNode(this) as HTMLElement;

    forEach(
      dom.querySelectorAll(`.${ns}Table-fixedLeft, .${ns}Table-fixedRight`),
      (item: HTMLElement) =>
        item.parentNode === dom &&
        (item.style.cssText += `height:${this.totalHeight}px;`)
    );

    if (affixHeader) {
      (dom.querySelector(
        `.${ns}Table-fixedTop>.${ns}Table-wrapper`
      ) as HTMLElement).style.cssText += `width: ${this.outterWidth}px`;
      let affixedTable = dom.querySelector(
        `.${ns}Table-wrapper table`
      ) as HTMLElement;
      affixedTable.style.cssText += `width: ${this.totalWidth}px`;
    }

    forEach(
      dom.querySelectorAll(
        `.${ns}Table-fixedTop table, .${ns}Table-fixedLeft table, .${ns}Table-fixedRight table`
      ),
      (table: HTMLTableElement) => {
        let totalWidth = 0;

        forEach(
          table.querySelectorAll('thead>tr:last-child>th'),
          (item: HTMLElement) => {
            const width = this.widths[
              parseInt(item.getAttribute('data-index') as string, 10)
            ];

            const style = getComputedStyle(item);
            const borderWidth =
              (parseInt(style.getPropertyValue('border-left-width'), 10) || 0) +
              (parseInt(style.getPropertyValue('border-right-width'), 10) || 0);

            item.style.cssText += `width: ${width - borderWidth}px`;
            totalWidth += width;
          }
        );

        forEach(
          table.querySelectorAll('tbody>tr'),
          (item: HTMLElement, index) => {
            item.style.cssText += `height: ${this.heights[index]}px`;
          }
        );

        table.style.cssText += `width: ${totalWidth}px;table-layout: fixed;`;
      }
    );

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
    let trailing = scrollLeft + this.outterWidth === this.totalWidth;
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
      'tr[data-index]'
    ) as HTMLElement;

    if (
      !tr ||
      !this.props.itemActions ||
      !this.props.itemActions.filter(item => !item.hiddenOnHover).length
    ) {
      return;
    }

    const store = this.props.store;
    const index = parseInt(tr.getAttribute('data-index') as string, 10);
    if (store.hoverIndex !== index) {
      store.rows.forEach((item, key) => item.setIsHover(index === key));
    }
  }

  handleMouseLeave() {
    const store = this.props.store;

    if (~store.hoverIndex) {
      store.rows[store.hoverIndex].setIsHover(false);
    }
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
    const column = store.filteredColumns[target.colIndex].pristine;

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

  renderHeading() {
    let {
      title,
      store,
      hideQuickSaveBtn,
      data,
      classnames: cx,
      saveImmediately,
      headingClassName,
      translate: __
    } = this.props;

    if (
      title ||
      (!saveImmediately && store.modified && !hideQuickSaveBtn) ||
      store.moved
    ) {
      return (
        <div className={cx('Table-heading', headingClassName)} key="heading">
          {!saveImmediately && store.modified && !hideQuickSaveBtn ? (
            <span>
              {__(
                '当前有 {{modified}} 条记录修改了内容, 但并没有提交。请选择:',
                {
                  modified: store.modified
                }
              )}
              <button
                type="button"
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSave}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('提交')}
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('放弃')}
              </button>
            </span>
          ) : store.moved ? (
            <span>
              {__('当前有 {{moved}} 条记录修改了顺序, 但并没有提交。请选择:', {
                moved: store.moved
              })}
              <button
                type="button"
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSaveOrder}
              >
                <Icon icon="check" className="icon m-r-xs" />
                {__('提交')}
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                {__('放弃')}
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
      classnames: cx
    } = this.props;

    if (column.type === '__checkme') {
      return (
        <th {...props} className={cx(column.pristine.className)}>
          {store.rows.length && multiple ? (
            <Checkbox
              classPrefix={ns}
              partial={!store.allChecked}
              checked={store.someChecked}
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

    if (column.searchable && column.name) {
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

    return (
      <th
        {...props}
        className={cx(
          props ? (props as any).className : '',
          column.pristine.className,
          {
            'TableCell--sortable': column.sortable,
            'TableCell--searchable': column.searchable,
            'TableCell--filterable': column.filterable,
            'Table-operationCell': column.type === 'operation'
          }
        )}
      >
        <div className={cx(`${ns}TableCell--title`)}>
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
      env,
      classPrefix: ns,
      classnames: cx,
      checkOnItemClick,
      popOverContainer
    } = this.props;

    if (column.name && item.rowSpans[column.name] === 0) {
      return null;
    }

    if (column.type === '__checkme') {
      return (
        <td key={props.key} className={cx(column.pristine.className)}>
          {item.checkable ? (
            <Checkbox
              classPrefix={ns}
              type={multiple ? 'checkbox' : 'radio'}
              checked={item.checked}
              onChange={
                checkOnItemClick ? noop : this.handleCheck.bind(this, item)
              }
            />
          ) : null}
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
        ? resolveVariable(column.name, item.data)
        : column.value,
      popOverContainer: popOverContainer || this.getPopOverContainer,
      rowSpan: item.rowSpans[column.name as string],
      quickEditFormRef: this.subFormRef,
      prefix,
      onImageEnlarge: this.handleImageEnlarge
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

    return affixHeader ? (
      <div
        className={cx('Table-fixedTop', {
          'is-fakeHide': hideHeader
        })}
      >
        {this.renderHeading()}
        {this.renderHeader(false)}
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
            <thead>
              {store.columnGroup.length ? (
                <tr>
                  {store.columnGroup.map((item, index) => (
                    <th
                      key={index}
                      data-index={item.index}
                      colSpan={item.colSpan}
                    >
                      {item.label ? render('tpl', item.label) : null}
                    </th>
                  ))}
                </tr>
              ) : null}
              <tr>
                {store.filteredColumns.map(column =>
                  this.renderHeadCell(column, {
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
      rowClassName,
      rowClassNameExpr,
      placeholder,
      store,
      onAction,
      buildItemProps,
      classnames: cx,
      classPrefix: ns,
      checkOnItemClick,
      render,
      data
    } = this.props;
    const hideHeader = store.filteredColumns.every(column => !column.label);

    return (
      <table
        className={cx(
          'Table-table',
          store.combineNum > 0 ? 'Table-table--withCombine' : '',
          tableClassName
        )}
      >
        <thead>
          {store.columnGroup.length ? (
            <tr>
              {store.columnGroup.map((item, index) => {
                const renderColumns = columns.filter(a => ~item.has.indexOf(a));

                return renderColumns.length ? (
                  <th
                    key={index}
                    data-index={item.index}
                    colSpan={renderColumns.length}
                  >
                    {'\u00A0'}
                  </th>
                ) : null;
              })}
            </tr>
          ) : null}
          <tr className={hideHeader ? 'fake-hide' : ''}>
            {columns.map(column =>
              this.renderHeadCell(column, {
                'key': column.index,
                'data-index': column.index
              })
            )}
          </tr>
        </thead>

        {headerOnly ? null : (
          <tbody>
            {rows.length ? (
              this.renderRows(rows, columns, {
                regionPrefix: 'fixed/',
                renderCell: (
                  region: string,
                  column: IColumn,
                  item: IRow,
                  props: any
                ) => this.renderCell(region, column, item, props, true)
              })
            ) : (
              <tr className={cx('Table-placeholder')}>
                <td colSpan={columns.length}>
                  {render('placeholder', placeholder, {data})}
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
    );
  }

  renderToolbar(toolbar: SchemaNode, index: number) {
    const type = (toolbar as Schema).type || (toolbar as string);

    if (type === 'columns-toggler') {
      this.renderedToolbars.push(type);
      return this.renderColumnsToggler(toolbar as any);
    } else if (type === 'drag-toggler') {
      this.renderedToolbars.push(type);
      return this.renderDragToggler();
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

    const render = this.props.render;

    if (!store.columnsTogglable) {
      return null;
    }

    return (
      <DropDownButton
        {...rest}
        align={config ? config.align : 'left'}
        classnames={cx}
        classPrefix={ns}
        key="columns-toggable"
        size="sm"
        label={<Icon icon="columns" className="icon m-r-none" />}
      >
        {store.toggableColumns.map(column => (
          <li
            className={cx('DropDown-menuItem')}
            key={column.index}
            onClick={column.toggleToggle}
          >
            <Checkbox size="sm" classPrefix={ns} checked={column.toggled}>
              {column.label ? render('tpl', column.label) : null}
            </Checkbox>
          </li>
        ))}
      </DropDownButton>
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
        tooltip={__('点击开始排序')}
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
              {__('请拖动左边的按钮进行排序')}
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

  renderRows(
    rows: Array<any>,
    columns = this.props.store.filteredColumns,
    rowProps: any = {}
  ): any {
    const {
      store,
      rowClassName,
      rowClassNameExpr,
      onAction,
      buildItemProps,
      checkOnItemClick,
      classPrefix: ns,
      classnames: cx,
      render
    } = this.props;

    return rows.map((item: IRow, rowIndex: number) => {
      const itemProps = buildItemProps ? buildItemProps(item, rowIndex) : null;

      const doms = [
        <TableRow
          {...itemProps}
          classPrefix={ns}
          checkOnItemClick={checkOnItemClick}
          key={item.id}
          itemIndex={rowIndex}
          item={item}
          itemClassName={cx(
            rowClassNameExpr
              ? filter(rowClassNameExpr, item.data)
              : rowClassName,
            {
              'is-last': item.depth > 1 && rowIndex === rows.length - 1,
              'is-expanded': item.expanded,
              'is-expandable': item.expandable
            }
          )}
          columns={columns}
          renderCell={this.renderCell}
          render={render}
          onAction={onAction}
          onCheck={this.handleCheck}
          // todo 先注释 quickEditEnabled={item.depth === 1}
          onQuickChange={store.dragging ? null : this.handleQuickChange}
          {...rowProps}
        />
      ];

      if (item.expanded && !store.dragging) {
        if (store.footable && store.footableColumns.length) {
          if (item.depth === 1) {
            doms.push(
              <TableRow
                {...itemProps}
                classPrefix={ns}
                checkOnItemClick={checkOnItemClick}
                key={`foot-${item.id}`}
                itemIndex={rowIndex}
                item={item}
                itemClassName={cx(
                  rowClassNameExpr
                    ? filter(rowClassNameExpr, item.data)
                    : rowClassName
                )}
                columns={store.footableColumns}
                renderCell={this.renderCell}
                render={render}
                onAction={onAction}
                onCheck={this.handleCheck}
                footableMode
                footableColSpan={store.filteredColumns.length}
                onQuickChange={store.dragging ? null : this.handleQuickChange}
                {...rowProps}
              />
            );
          }
        } else if (Array.isArray(item.data.children)) {
          // 嵌套表格
          doms.push(...this.renderRows(item.children, columns, rowProps));
        }
      }
      return doms;
    });
  }

  renderItemActions() {
    const {itemActions, render, store, classnames: cx} = this.props;
    const finnalActions = Array.isArray(itemActions)
      ? itemActions.filter(action => !action.hiddenOnHover)
      : [];

    const rowIndex = store.hoverIndex;
    if (!~rowIndex || !finnalActions.length) {
      return null;
    }

    const heights = this.heights;
    let height = 40;
    let top = 0;

    if (heights && heights[rowIndex]) {
      height = heights[rowIndex];
      top += heights.header;
      for (let i = rowIndex - 1; i >= 0; i--) {
        top += heights[i];
      }
    }

    return (
      <div
        className={cx('Table-itemActions-wrap')}
        style={{
          top,
          height
        }}
      >
        <div className={cx('Table-itemActions')}>
          {finnalActions.map((action, index) =>
            render(
              `itemAction/${index}`,
              {
                ...(action as any),
                isMenuItem: true
              },
              {
                key: index,
                item: store.rows[rowIndex],
                data: store.rows[rowIndex].locals,
                rowIndex
              }
            )
          )}
        </div>
      </div>
    );
  }

  renderTableContent() {
    const {store, placeholder, classnames: cx, data, render} = this.props;

    const tableClassName = cx(
      'Table-table',
      store.combineNum > 0 ? 'Table-table--withCombine' : '',
      this.props.tableClassName
    );
    const hideHeader = store.filteredColumns.every(column => !column.label);

    return (
      <div
        onMouseMove={this.handleMouseMove}
        className={cx('Table-content')}
        onScroll={this.handleOutterScroll}
      >
        <table ref={this.tableRef} className={tableClassName}>
          <thead>
            {store.columnGroup.length ? (
              <tr>
                {store.columnGroup.map((item, index) => (
                  <th
                    key={index}
                    data-index={item.index}
                    colSpan={item.colSpan}
                  >
                    {item.label ? render('tpl', item.label) : null}
                  </th>
                ))}
              </tr>
            ) : null}
            <tr className={hideHeader ? 'fake-hide' : ''}>
              {store.filteredColumns.map(column =>
                this.renderHeadCell(column, {
                  'data-index': column.index,
                  'key': column.index
                })
              )}
            </tr>
          </thead>
          <tbody>
            {store.rows.length ? (
              this.renderRows(store.rows, store.filteredColumns)
            ) : (
              <tr className={cx('Table-placeholder')}>
                <td colSpan={store.filteredColumns.length}>
                  {render('placeholder', placeholder, {data})}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const {
      className,
      store,
      placeholder,
      classnames: cx,
      affixColumns,
      data,
      render
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
        {heading}
        {header}
        <div
          className={cx('Table-contentWrap')}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className={cx('Table-fixedLeft')}>
            {affixColumns !== false && store.leftFixedColumns.length
              ? this.renderFixedColumns(
                  store.rows,
                  store.leftFixedColumns,
                  false,
                  tableClassName
                )
              : null}
          </div>
          <div className={cx('Table-fixedRight')}>
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
          {~store.hoverIndex ? this.renderItemActions() : null}
        </div>
        {this.renderAffixHeader(tableClassName)}
        {footer}
      </div>
    );
  }
}

interface TableRowProps extends Pick<RendererProps, 'render'> {
  onCheck: (item: IRow) => void;
  classPrefix: string;
  renderCell: (
    region: string,
    column: IColumn,
    item: IRow,
    props: any
  ) => React.ReactNode;
  columns: Array<IColumn>;
  item: IRow;
  itemClassName?: string;
  itemIndex: number;
  regionPrefix?: string;
  checkOnItemClick?: boolean;
  [propName: string]: any;
}

@observer
class TableRow extends React.Component<TableRowProps> {
  constructor(props: TableRowProps) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLTableRowElement>) {
    const target: HTMLElement = e.target as HTMLElement;
    const ns = this.props.classPrefix;
    let formItem;

    if (
      !e.currentTarget.contains(target) ||
      ~['INPUT', 'TEXTAREA'].indexOf(target.tagName) ||
      ((formItem = target.closest(`button, a, .${ns}Form-item`)) &&
        e.currentTarget.contains(formItem))
    ) {
      return;
    }

    this.props.onCheck(this.props.item);
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: any) {
    const {onAction, item} = this.props;
    onAction && onAction(e, action, ctx || item.data);
  }

  handleQuickChange(
    values: object,
    saveImmediately?: boolean,
    savePristine?: boolean
  ) {
    const {onQuickChange, item} = this.props;
    onQuickChange && onQuickChange(item, values, saveImmediately, savePristine);
  }

  render() {
    const {
      itemClassName,
      itemIndex,
      item,
      columns,
      renderCell,
      children,
      footableMode,
      footableColSpan,
      regionPrefix,
      checkOnItemClick,
      classPrefix: ns,
      render,
      ...rest
    } = this.props;

    if (footableMode) {
      return (
        <tr
          data-id={item.id}
          data-index={item.newIndex}
          onClick={checkOnItemClick ? this.handleClick : undefined}
          className={cx(itemClassName, {
            'is-hovered': item.isHover,
            'is-checked': item.checked,
            'is-modified': item.modified,
            'is-moved': item.moved,
            [`${ns}Table-tr--odd`]: itemIndex % 2 === 0,
            [`${ns}Table-tr--even`]: itemIndex % 2 === 1
          })}
        >
          <td className={`${ns}Table-foot`} colSpan={footableColSpan}>
            <table className={`${ns}Table-footTable`}>
              <tbody>
                {columns.map(column => (
                  <tr key={column.index}>
                    {column.label !== false ? (
                      <th>
                        {render(
                          `${regionPrefix}${itemIndex}/${column.index}/tpl`,
                          column.label
                        )}
                      </th>
                    ) : null}

                    {renderCell(
                      `${regionPrefix}${itemIndex}/${column.index}`,
                      column,
                      item,
                      {
                        ...rest,
                        width: null,
                        rowIndex: itemIndex,
                        colIndex: column.rawIndex,
                        key: column.index,
                        onAction: this.handleAction,
                        onQuickChange: this.handleQuickChange
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      );
    }

    return (
      <tr
        onClick={checkOnItemClick ? this.handleClick : undefined}
        data-index={item.depth === 1 ? item.newIndex : undefined}
        data-id={item.id}
        className={cx(
          itemClassName,
          {
            'is-hovered': item.isHover,
            'is-checked': item.checked,
            'is-modified': item.modified,
            'is-moved': item.moved,
            [`${ns}Table-tr--odd`]: itemIndex % 2 === 0,
            [`${ns}Table-tr--even`]: itemIndex % 2 === 1
          },
          `${ns}Table-tr--${item.depth}th`
        )}
      >
        {columns.map(column =>
          renderCell(`${itemIndex}/${column.index}`, column, item, {
            ...rest,
            rowIndex: itemIndex,
            colIndex: column.rawIndex,
            key: column.index,
            onAction: this.handleAction,
            onQuickChange: this.handleQuickChange
          })
        )}
      </tr>
    );
  }
}

@Renderer({
  test: (path: string) =>
    /(^|\/)table$/.test(path) /* && !/(^|\/)table$/.test(path)*/,
  storeType: TableStore.name,
  name: 'table'
})
export class TableRenderer extends Table {}

export interface QuickSearchConfig {
  type?: string;
  controls?: any;
  tabs?: any;
  fieldSet?: any;
  [propName: string]: any;
}

export interface HeadCellSearchProps extends RendererProps {
  name: string;
  searchable: boolean | QuickSearchConfig;
  classPrefix: string;
  onQuery: (values: object) => void;
}

export class HeadCellSearchDropDown extends React.Component<
  HeadCellSearchProps,
  any
> {
  state = {
    isOpened: false
  };

  formItems: Array<string> = [];
  constructor(props: HeadCellSearchProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.close = this.close.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  buildSchema() {
    const {searchable, sortable, name, label, translate: __} = this.props;

    let schema;

    if (searchable === true) {
      schema = {
        title: '',
        controls: [
          {
            type: 'text',
            name,
            placeholder: label,
            clearable: true
          }
        ]
      };
    } else if (searchable) {
      if (searchable.controls || searchable.tabs || searchable.fieldSet) {
        schema = {
          title: '',
          ...searchable
        };
      } else {
        schema = {
          title: '',
          className: searchable.formClassName,
          controls: [
            {
              type: searchable.type || 'text',
              name: searchable.name || name,
              placeholder: label,
              ...searchable
            }
          ]
        };
      }
    }

    if (schema && schema.controls && sortable) {
      schema.controls.unshift(
        {
          type: 'hidden',
          name: 'orderBy',
          value: name
        },
        {
          type: 'button-group',
          name: 'orderDir',
          label: __('排序'),
          options: [
            {
              label: __('正序'),
              value: 'asc'
            },
            {
              label: __('降序'),
              value: 'desc'
            }
          ]
        }
      );
    }

    if (schema) {
      const formItems: Array<string> = [];
      schema.controls?.forEach(
        (item: any) =>
          item.name &&
          item.name !== 'orderBy' &&
          item.name !== 'orderDir' &&
          formItems.push(item.name)
      );
      this.formItems = formItems;
      schema = {
        ...schema,
        type: 'form',
        wrapperComponent: 'div',
        actions: [
          {
            type: 'button',
            label: __('重置'),
            actionType: 'reset'
          },

          {
            type: 'button',
            label: __('取消'),
            actionType: 'cancel'
          },

          {
            label: __('搜索'),
            type: 'submit',
            primary: true
          }
        ]
      };
    }

    return schema || 'error';
  }

  handleClickOutside() {
    this.close();
  }

  open() {
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  handleAction(e: any, action: Action, ctx: object) {
    const {onAction} = this.props;

    if (action.actionType === 'cancel' || action.actionType === 'close') {
      this.close();
      return;
    }

    if (action.actionType === 'reset') {
      this.close();
      this.handleReset();
      return;
    }

    onAction && onAction(e, action, ctx);
  }

  handleReset() {
    const {onQuery, data, name} = this.props;
    const values = {...data};
    this.formItems.forEach(key => (values[key] = undefined));

    if (values.orderBy === name) {
      values.orderBy = '';
      values.orderDir = 'asc';
    }
    onQuery(values);
  }

  handleSubmit(values: any) {
    const {onQuery, name} = this.props;

    this.close();

    if (values.orderDir) {
      values = {
        ...values,
        orderBy: name
      };
    }

    onQuery(values);
  }

  isActive() {
    const {data, name, orderBy} = this.props;

    return orderBy === name || this.formItems.some(key => data?.[key]);
  }

  render() {
    const {
      render,
      name,
      data,
      searchable,
      store,
      orderBy,
      popOverContainer,
      classPrefix: ns
    } = this.props;

    const formSchema = this.buildSchema();
    const isActive = this.isActive();

    return (
      <span
        className={cx(`${ns}TableCell-searchBtn`, isActive ? 'is-active' : '')}
      >
        <span onClick={this.open}>
          <Icon icon="search" className="icon" />
        </span>
        {this.state.isOpened ? (
          <Overlay
            container={popOverContainer || (() => findDOMNode(this))}
            placement="left-bottom-left-top right-bottom-right-top"
            target={
              popOverContainer ? () => findDOMNode(this)!.parentNode : null
            }
            show
          >
            <PopOver
              classPrefix={ns}
              onHide={this.close}
              className={cx(
                `${ns}TableCell-searchPopOver`,
                (searchable as any).className
              )}
              overlay
            >
              {
                render('quick-search-form', formSchema, {
                  data: {
                    ...data,
                    orderBy: orderBy,
                    orderDir:
                      orderBy === name ? (store as ITableStore).orderDir : ''
                  },
                  onSubmit: this.handleSubmit,
                  onAction: this.handleAction
                }) as JSX.Element
              }
            </PopOver>
          </Overlay>
        ) : null}
      </span>
    );
  }
}

export interface QuickFilterConfig {
  options: Array<any>;
  source: Api;
  multiple: boolean;
  [propName: string]: any;
}

export interface HeadCellFilterProps extends RendererProps {
  data: any;
  name: string;
  filterable: QuickFilterConfig;
  onQuery: (values: object) => void;
}

export class HeadCellFilterDropDown extends React.Component<
  HeadCellFilterProps,
  any
> {
  state = {
    isOpened: false,
    filterOptions: []
  };

  sourceInvalid: boolean = false;
  constructor(props: HeadCellFilterProps) {
    super(props);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    const {filterable} = this.props;

    if (filterable.source) {
      this.fetchOptions();
    } else if (filterable.options.length > 0) {
      this.setState({
        filterOptions: this.alterOptions(filterable.options)
      });
    }
  }

  componentWillReceiveProps(nextProps: HeadCellFilterProps) {
    const props = this.props;

    if (
      props.name !== nextProps.name ||
      props.filterable !== nextProps.filterable ||
      props.data !== nextProps.data
    ) {
      if (nextProps.filterable.source) {
        this.sourceInvalid = isApiOutdated(
          props.filterable.source,
          nextProps.filterable.source,
          props.data,
          nextProps.data
        );
      } else if (nextProps.filterable.options) {
        this.setState({
          filterOptions: this.alterOptions(nextProps.filterable.options || [])
        });
      }
    }
  }

  componentDidUpdate() {
    this.sourceInvalid && this.fetchOptions();
  }

  fetchOptions() {
    const {env, filterable, data} = this.props;

    if (!isEffectiveApi(filterable.source, data)) {
      return;
    }

    const api = normalizeApi(filterable.source);
    api.cache = 3000; // 开启 3s 缓存，因为固顶位置渲染1次会额外多次请求。

    env.fetcher(api, data).then(ret => {
      let options = (ret.data && ret.data.options) || [];
      this.setState({
        filterOptions: ret && ret.data && this.alterOptions(options)
      });
    });
  }

  alterOptions(options: Array<any>) {
    const {data, filterable, name} = this.props;
    const filterValue =
      data && typeof data[name] !== 'undefined' ? data[name] : '';

    if (filterable.multiple) {
      options = options.map(option => ({
        ...option,
        selected: filterValue.split(',').indexOf(option.value) > -1
      }));
    } else {
      options = options.map(option => ({
        ...option,
        selected: option.value === filterValue
      }));
    }
    return options;
  }

  handleClickOutside() {
    this.close();
  }

  open() {
    this.setState({
      isOpened: true
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  handleClick(value: string) {
    const {onQuery, name} = this.props;

    onQuery({
      [name]: value
    });
    this.close();
  }

  handleCheck(value: string) {
    const {data, name, onQuery} = this.props;
    let query: string;

    if (data[name] && data[name] === value) {
      query = '';
    } else {
      query =
        (data[name] && xor(data[name].split(','), [value]).join(',')) || value;
    }

    onQuery({
      [name]: query
    });
  }

  handleReset() {
    const {name, onQuery} = this.props;
    onQuery({
      [name]: undefined
    });
    this.close();
  }

  render() {
    const {isOpened, filterOptions} = this.state;
    const {
      data,
      name,
      filterable,
      popOverContainer,
      classPrefix: ns,
      classnames: cx,
      translate: __
    } = this.props;

    return (
      <span
        className={cx(
          `${ns}TableCell-filterBtn`,
          typeof data[name] !== 'undefined' ? 'is-active' : ''
        )}
      >
        <span onClick={this.open}>
          <Icon icon="column-filter" className="icon" />
        </span>
        {isOpened ? (
          <Overlay
            container={popOverContainer || (() => findDOMNode(this))}
            placement="left-bottom-left-top right-bottom-right-top"
            target={
              popOverContainer ? () => findDOMNode(this)!.parentNode : null
            }
            show
          >
            <PopOver
              classPrefix={ns}
              onHide={this.close}
              className={cx(
                `${ns}TableCell-filterPopOver`,
                (filterable as any).className
              )}
              overlay
            >
              {filterOptions && filterOptions.length > 0 ? (
                <ul className={cx('DropDown-menu')}>
                  {!filterable.multiple
                    ? filterOptions.map((option: any, index) => (
                        <li
                          key={index}
                          className={cx('DropDown-divider', {
                            'is-selected': option.selected
                          })}
                          onClick={this.handleClick.bind(this, option.value)}
                        >
                          {option.label}
                        </li>
                      ))
                    : filterOptions.map((option: any, index) => (
                        <li key={index} className={cx('DropDown-divider')}>
                          <Checkbox
                            classPrefix={ns}
                            onChange={this.handleCheck.bind(this, option.value)}
                            checked={option.selected}
                          >
                            {option.label}
                          </Checkbox>
                        </li>
                      ))}
                  <li
                    key="DropDown-menu-reset"
                    className={cx('DropDown-divider')}
                    onClick={this.handleReset.bind(this)}
                  >
                    {__('重置')}
                  </li>
                </ul>
              ) : null}
            </PopOver>
          </Overlay>
        ) : null}
      </span>
    );
  }
}

export interface TableCellProps extends RendererProps {
  wrapperComponent?: React.ReactType;
  column: object;
}
export class TableCell extends React.Component<RendererProps> {
  static defaultProps = {
    wrapperComponent: 'td'
  };

  static propsList: Array<string> = [
    'type',
    'label',
    'column',
    'body',
    'tpl',
    'rowSpan',
    'remark'
  ];

  render() {
    let {
      className,
      render,
      style,
      wrapperComponent: Component,
      column,
      value,
      data,
      children,
      width,
      innerClassName,
      label,
      tabIndex,
      onKeyUp,
      rowSpan,
      body: _body,
      tpl,
      remark,
      prefix,
      affix,
      isHead,
      ...rest
    } = this.props;

    const schema = {
      ...column,
      className: innerClassName,
      type: (column && column.type) || 'plain'
    };

    let body = children
      ? children
      : render('field', schema, {
          ...rest,
          value,
          data
        });

    if (width) {
      style = {
        ...style,
        width: (style && style.width) || width
      };

      if (!/%$/.test(String(style.width))) {
        body = (
          <div style={{width: style.width}}>
            {prefix}
            {body}
            {affix}
          </div>
        );
        prefix = null;
        affix = null;
        // delete style.width;
      }
    }

    if (!Component) {
      return body as JSX.Element;
    }

    if (isHead) {
      Component = 'th';
    }

    return (
      <Component
        rowSpan={rowSpan > 1 ? rowSpan : undefined}
        style={style}
        className={className}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
      >
        {prefix}
        {body}
        {affix}
      </Component>
    );
  }
}

@Renderer({
  test: /(^|\/)table\/(?:.*\/)?cell$/,
  name: 'table-cell'
})
@QuickEdit()
@PopOverable()
@Copyable()
@observer
export class TableCellRenderer extends TableCell {
  static propsList = [
    'quickEdit',
    'quickEditEnabledOn',
    'popOver',
    'copyable',
    'inline',
    ...TableCell.propsList
  ];
}

@Renderer({
  test: /(^|\/)field$/,
  name: 'field'
})
@PopOverable()
@Copyable()
export class FieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };
}
