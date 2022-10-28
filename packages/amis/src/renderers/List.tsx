import React from 'react';
import {findDOMNode} from 'react-dom';
import Sortable from 'sortablejs';
import omit from 'lodash/omit';
import {Button, Spinner, Checkbox, Icon} from 'amis-ui';
import {
  ListStore,
  IListStore,
  isPureVariable,
  resolveVariable,
  resolveVariableAndFilter,
  Renderer,
  RendererProps,
  SchemaNode,
  Schema,
  ActionObject,
  filter,
  autobind,
  createObject,
  anyChanged,
  getScrollParent,
  difference,
  isVisible,
  isDisabled,
  noop,
  isClickOnInput
} from 'amis-core';

import QuickEdit, {SchemaQuickEdit} from './QuickEdit';
import PopOver, {SchemaPopOver} from './PopOver';
import {TableCell} from './Table';
import Copyable, {SchemaCopyable} from './Copyable';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaExpression,
  SchemaObject,
  SchemaTokenizeableString,
  SchemaTpl,
  SchemaUrlPath
} from '../Schema';
import {ActionSchema} from './Action';
import {SchemaRemark} from './Remark';
import type {IItem} from 'amis-core/lib/store/list';
import type {OnEventProps} from 'amis-core/lib/utils/renderer-event';

/**
 * 不指定类型默认就是文本
 */
export type ListBodyFieldObject = {
  /**
   * 列标题
   */
  label?: string;

  /**
   * label 类名
   */
  labelClassName?: SchemaClassName;

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
   * 配置点击复制功能
   */
  copyable?: SchemaCopyable;
};

export type ListBodyField = SchemaObject & ListBodyFieldObject;

export interface ListItemSchema extends Omit<BaseSchema, 'type'> {
  actions?: Array<ActionSchema>;

  /**
   * 操作位置，默认在右侧，可以设置成左侧。
   */
  actionsPosition?: 'left' | 'right';

  /**
   * 图片地址
   */
  avatar?: SchemaUrlPath;

  /**
   * 内容区域
   */
  body?: Array<ListBodyField | ListBodyFieldObject>;

  /**
   * 描述
   */
  desc?: SchemaTpl;

  /**
   * tooltip 说明
   */
  remark?: SchemaRemark;

  /**
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 副标题
   */
  subTitle?: SchemaTpl;
}

/**
 * List 列表展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface ListSchema extends BaseSchema {
  /**
   * 指定为 List 列表展示控件。
   */
  type: 'list' | 'static-list';

  /**
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 底部区域
   */
  footer?: SchemaCollection;

  /**
   * 底部区域类名
   */
  footerClassName?: SchemaClassName;

  /**
   * 顶部区域
   */
  header?: SchemaCollection;

  /**
   * 顶部区域类名
   */
  headerClassName?: SchemaClassName;

  /**
   * 单条数据展示内容配置
   */
  listItem?: ListItemSchema;

  /**
   * 数据源: 绑定当前环境变量
   *
   * @default ${items}
   */
  source?: SchemaTokenizeableString;

  /**
   * 是否显示底部
   */
  showFooter?: boolean;

  /**
   * 是否显示头部
   */
  showHeader?: boolean;

  /**
   * 无数据提示
   *
   * @default 暂无数据
   */
  placeholder?: SchemaTpl;

  /**
   * 是否隐藏勾选框
   */
  hideCheckToggler?: boolean;

  /**
   * 是否固顶
   */
  affixHeader?: boolean;

  /**
   * 配置某项是否可以点选
   */
  itemCheckableOn?: SchemaExpression;

  /**
   * 配置某项是否可拖拽排序，前提是要开启拖拽功能
   */
  itemDraggableOn?: SchemaExpression;

  /**
   * 点击列表单行时，是否选择
   */
  checkOnItemClick?: boolean;

  /**
   * 可以用来作为值的字段
   */
  valueField?: string;

  /**
   * 大小
   */
  size?: 'sm' | 'base';

  /**
   * 点击列表项的行为
   */
  itemAction?: ActionSchema;
}

export interface Column {
  type: string;
  [propName: string]: any;
}

export interface ListProps
  extends RendererProps,
    Omit<ListSchema, 'type' | 'className'> {
  store: IListStore;
  selectable?: boolean;
  selected?: Array<any>;
  draggable?: boolean;
  onSelect: (
    selectedItems: Array<object>,
    unSelectedItems: Array<object>
  ) => void;
  onSave?: (
    items: Array<object> | object,
    diff: Array<object> | object,
    rowIndexes: Array<number> | number,
    unModifiedItems?: Array<object>,
    rowOrigins?: Array<object> | object,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) => void;
  onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
  onQuery: (values: object) => void;
}

export default class List extends React.Component<ListProps, object> {
  static propsList: Array<keyof ListProps> = [
    'header',
    'headerToolbarRender',
    'footer',
    'footerToolbarRender',
    'placeholder',
    'source',
    'selectable',
    'headerClassName',
    'footerClassName',
    'hideQuickSaveBtn',
    'hideCheckToggler',
    'itemCheckableOn',
    'itemDraggableOn',
    'actions',
    'items',
    'valueField'
  ];
  static defaultProps: Partial<ListProps> = {
    className: '',
    placeholder: 'placeholder.noData',
    source: '$items',
    selectable: false,
    headerClassName: '',
    footerClassName: '',
    affixHeader: true
  };

  dragTip?: HTMLElement;
  sortable?: Sortable;
  parentNode?: any;
  body?: any;
  renderedToolbars: Array<string>;

  constructor(props: ListProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveOrder = this.handleSaveOrder.bind(this);
    this.reset = this.reset.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
    this.affixDetect = this.affixDetect.bind(this);
    this.bodyRef = this.bodyRef.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);

    const {
      store,
      selectable,
      draggable,
      orderBy,
      orderDir,
      multiple,
      hideCheckToggler,
      itemCheckableOn,
      itemDraggableOn
    } = props;

    store.update({
      multiple,
      selectable,
      draggable,
      orderBy,
      orderDir,
      hideCheckToggler,
      itemCheckableOn,
      itemDraggableOn
    });

    List.syncItems(store, this.props) && this.syncSelected();
  }

  static syncItems(store: IListStore, props: ListProps, prevProps?: ListProps) {
    const source = props.source;
    const value = props.value || props.items;
    let items: Array<object> = [];
    let updateItems = false;

    if (
      Array.isArray(value) &&
      (!prevProps || (prevProps.value || prevProps.items) !== value)
    ) {
      items = value;
      updateItems = true;
    } else if (typeof source === 'string') {
      const resolved = resolveVariableAndFilter(source, props.data, '| raw');
      const prev = prevProps
        ? resolveVariableAndFilter(source, prevProps.data, '| raw')
        : null;

      if (prev && prev === resolved) {
        updateItems = false;
      } else if (Array.isArray(resolved)) {
        items = resolved;
        updateItems = true;
      }
    }

    updateItems && store.initItems(items);
    Array.isArray(props.selected) &&
      store.updateSelected(props.selected, props.valueField);
    return updateItems;
  }

  componentDidMount() {
    let parent: HTMLElement | Window | null = getScrollParent(
      findDOMNode(this) as HTMLElement
    );
    if (!parent || parent === document.body) {
      parent = window;
    }

    this.parentNode = parent;
    this.affixDetect();
    parent.addEventListener('scroll', this.affixDetect);
    window.addEventListener('resize', this.affixDetect);
  }

  componentDidUpdate(prevProps: ListProps) {
    const props = this.props;
    const store = props.store;

    if (
      anyChanged(
        [
          'selectable',
          'draggable',
          'orderBy',
          'orderDir',
          'multiple',
          'hideCheckToggler',
          'itemCheckableOn',
          'itemDraggableOn'
        ],
        prevProps,
        props
      )
    ) {
      store.update({
        multiple: props.multiple,
        selectable: props.selectable,
        draggable: props.draggable,
        orderBy: props.orderBy,
        orderDir: props.orderDir,
        hideCheckToggler: props.hideCheckToggler,
        itemCheckableOn: props.itemCheckableOn,
        itemDraggableOn: props.itemDraggableOn
      });
    }

    if (
      anyChanged(['source', 'value', 'items'], prevProps, props) ||
      (!props.value &&
        !props.items &&
        (props.data !== prevProps.data ||
          (typeof props.source === 'string' && isPureVariable(props.source))))
    ) {
      List.syncItems(store, props, prevProps) && this.syncSelected();
    } else if (prevProps.selected !== props.selected) {
      store.updateSelected(props.selected || [], props.valueField);
    }
  }

  componentWillUnmount() {
    const parent = this.parentNode;
    parent && parent.removeEventListener('scroll', this.affixDetect);
    window.removeEventListener('resize', this.affixDetect);
  }

  bodyRef(ref: HTMLDivElement) {
    this.body = ref;
  }

  affixDetect() {
    if (!this.props.affixHeader || !this.body) {
      return;
    }

    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;
    const afixedDom = dom.querySelector(`.${ns}List-fixedTop`) as HTMLElement;

    if (!afixedDom) {
      return;
    }

    const clip = (this.body as HTMLElement).getBoundingClientRect();
    const offsetY =
      this.props.affixOffsetTop ?? this.props.env.affixOffsetTop ?? 0;
    const affixed = clip.top < offsetY && clip.top + clip.height - 40 > offsetY;

    this.body.offsetWidth &&
      (afixedDom.style.cssText = `top: ${offsetY}px;width: ${this.body.offsetWidth}px;`);
    affixed ? afixedDom.classList.add('in') : afixedDom.classList.remove('in');
    // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
  }

  getPopOverContainer() {
    return findDOMNode(this);
  }

  handleAction(e: React.UIEvent<any>, action: ActionObject, ctx: object) {
    const {data, dispatchEvent, onAction, onEvent} = this.props;
    const hasClickActions =
      onEvent &&
      Array.isArray(onEvent?.itemClick?.actions) &&
      onEvent.itemClick.actions.length > 0;

    if (hasClickActions) {
      dispatchEvent(
        'itemClick',
        createObject(data, {
          item: ctx
        })
      );
    } else {
      onAction?.(e, action, ctx);
    }
  }

  handleCheck(item: IItem) {
    item.toggle();
    this.syncSelected();
  }

  handleCheckAll() {
    const {store} = this.props;

    store.toggleAll();
    this.syncSelected();
  }

  syncSelected() {
    const {store, onSelect} = this.props;

    onSelect &&
      onSelect(
        store.selectedItems.map(item => item.data),
        store.unSelectedItems.map(item => item.data)
      );
  }

  handleQuickChange(
    item: IItem,
    values: object,
    saveImmediately?: boolean | any,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    item.change(values, savePristine);

    if (!saveImmediately || savePristine) {
      return;
    }

    if (saveImmediately && saveImmediately.api) {
      this.props.onAction(
        null,
        {
          actionType: 'ajax',
          api: saveImmediately.api,
          reload: options?.reload
        },
        values
      );
      return;
    }

    const {onSave, primaryField} = this.props;

    if (!onSave) {
      return;
    }

    onSave(
      item.data,
      difference(item.data, item.pristine, ['id', primaryField]),
      item.index,
      undefined,
      item.pristine,
      options
    );
  }

  handleSave() {
    const {store, onSave, primaryField} = this.props;

    if (!onSave || !store.modifiedItems.length) {
      return;
    }

    const items = store.modifiedItems.map(item => item.data);
    const itemIndexes = store.modifiedItems.map(item => item.index);
    const diff = store.modifiedItems.map(item =>
      difference(item.data, item.pristine, ['id', primaryField])
    );
    const unModifiedItems = store.items
      .filter(item => !item.modified)
      .map(item => item.data);
    onSave(
      items,
      diff,
      itemIndexes,
      unModifiedItems,
      store.modifiedItems.map(item => item.pristine)
    );
  }

  handleSaveOrder() {
    const {store, onSaveOrder} = this.props;

    if (!onSaveOrder || !store.movedItems.length) {
      return;
    }

    onSaveOrder(
      store.movedItems.map(item => item.data),
      store.items.map(item => item.data)
    );
  }

  reset() {
    const {store} = this.props;

    store.reset();
  }

  bulkUpdate(value: object, items: Array<object>) {
    const {store} = this.props;

    const items2 = store.items.filter(item => ~items.indexOf(item.pristine));
    items2.forEach(item => item.change(value));
  }

  getSelected() {
    const {store} = this.props;

    return store.selectedItems.map(item => item.data);
  }

  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  initDragging() {
    const store = this.props.store;
    const dom = findDOMNode(this) as HTMLElement;
    const ns = this.props.classPrefix;
    this.sortable = new Sortable(
      dom.querySelector(`.${ns}List-items`) as HTMLElement,
      {
        group: 'table',
        animation: 150,
        handle: `.${ns}ListItem-dragBtn`,
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

  renderActions(region: string) {
    let {
      actions,
      render,
      store,
      multiple,
      selectable,
      env,
      classPrefix: ns,
      classnames: cx
    } = this.props;

    let btn;
    actions = Array.isArray(actions) ? actions.concat() : [];

    if (
      !~this.renderedToolbars.indexOf('check-all') &&
      (btn = this.renderCheckAll())
    ) {
      actions.unshift({
        type: 'button',
        children: btn
      });
    }

    if (
      region === 'header' &&
      !~this.renderedToolbars.indexOf('drag-toggler') &&
      (btn = this.renderDragToggler())
    ) {
      actions.unshift({
        type: 'button',
        children: btn
      });
    }

    return Array.isArray(actions) && actions.length ? (
      <div className={cx('List-actions')}>
        {actions.map((action, key) =>
          render(
            `action/${key}`,
            {
              type: 'button',
              ...action
            },
            {
              onAction: this.handleAction,
              key,
              btnDisabled: store.dragging
            }
          )
        )}
      </div>
    ) : null;
  }

  renderHeading() {
    let {title, store, hideQuickSaveBtn, classnames: cx, data} = this.props;

    if (title || (store.modified && !hideQuickSaveBtn) || store.moved) {
      return (
        <div className={cx('List-heading')}>
          {store.modified && !hideQuickSaveBtn ? (
            <span>
              {`当前有 ${store.modified} 条记录修改了内容, 但并没有提交。请选择:`}
              <button
                type="button"
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSave}
              >
                <Icon icon="check" className="icon m-r-xs" />
                提交
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                放弃
              </button>
            </span>
          ) : store.moved ? (
            <span>
              {`当前有 ${store.moved} 条记录修改了顺序, 但并没有提交。请选择:`}
              <button
                type="button"
                className={cx('Button Button--xs Button--success m-l-sm')}
                onClick={this.handleSaveOrder}
              >
                <Icon icon="check" className="icon m-r-xs" />
                提交
              </button>
              <button
                type="button"
                className={cx('Button Button--xs Button--danger m-l-sm')}
                onClick={this.reset}
              >
                <Icon icon="close" className="icon m-r-xs" />
                放弃
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

  renderHeader() {
    const {
      header,
      headerClassName,
      headerToolbar,
      headerToolbarRender,
      render,
      showHeader,
      store,
      classnames: cx
    } = this.props;

    if (showHeader === false) {
      return null;
    }

    const child = headerToolbarRender
      ? headerToolbarRender(
          {
            ...this.props,
            selectedItems: store.selectedItems.map(item => item.data),
            items: store.items.map(item => item.data),
            unSelectedItems: store.unSelectedItems.map(item => item.data)
          },
          this.renderToolbar
        )
      : null;
    const actions = this.renderActions('header');
    const toolbarNode =
      actions || child || store.dragging ? (
        <div
          className={cx('List-toolbar', headerClassName)}
          key="header-toolbar"
        >
          {actions}
          {child}
          {store.dragging ? (
            <div className={cx('List-dragTip')} ref={this.dragTipRef}>
              请拖动左边的按钮进行排序
            </div>
          ) : null}
        </div>
      ) : null;
    const headerNode =
      header && (!Array.isArray(header) || header.length) ? (
        <div className={cx('List-header', headerClassName)} key="header">
          {render('header', header)}
        </div>
      ) : null;
    return headerNode && toolbarNode
      ? [headerNode, toolbarNode]
      : headerNode || toolbarNode || null;
  }

  renderFooter() {
    const {
      footer,
      footerClassName,
      footerToolbar,
      footerToolbarRender,
      render,
      showFooter,
      store,
      classnames: cx
    } = this.props;

    if (showFooter === false) {
      return null;
    }

    const child = footerToolbarRender
      ? footerToolbarRender(
          {
            ...this.props,
            selectedItems: store.selectedItems.map(item => item.data),
            items: store.items.map(item => item.data),
            unSelectedItems: store.unSelectedItems.map(item => item.data)
          },
          this.renderToolbar
        )
      : null;
    const actions = this.renderActions('footer');

    const toolbarNode =
      actions || child ? (
        <div
          className={cx('List-toolbar', footerClassName)}
          key="footer-toolbar"
        >
          {actions}
          {child}
        </div>
      ) : null;
    const footerNode =
      footer && (!Array.isArray(footer) || footer.length) ? (
        <div className={cx('List-footer', footerClassName)} key="footer">
          {render('footer', footer)}
        </div>
      ) : null;
    return footerNode && toolbarNode
      ? [toolbarNode, footerNode]
      : footerNode || toolbarNode || null;
  }

  renderCheckAll() {
    const {store, multiple, selectable} = this.props;

    if (
      !store.selectable ||
      !multiple ||
      !selectable ||
      store.dragging ||
      !store.items.length
    ) {
      return null;
    }

    return (
      <Button
        key="checkall"
        tooltip="切换全选"
        onClick={this.handleCheckAll}
        size="sm"
        level={store.allChecked ? 'info' : 'default'}
      >
        全选
      </Button>
    );
  }

  renderDragToggler() {
    const {store, multiple, selectable, env} = this.props;

    if (!store.draggable || store.items.length < 2) {
      return null;
    }

    return (
      <Button
        iconOnly
        key="dragging-toggle"
        tooltip="对列表进行排序操作"
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
      >
        <Icon icon="exchange" className="icon r90" />
      </Button>
    );
  }

  renderToolbar(toolbar: SchemaNode, index: number) {
    const type = (toolbar as Schema).type || (toolbar as string);

    if (type === 'drag-toggler') {
      this.renderedToolbars.push(type);
      return this.renderDragToggler();
    } else if (type === 'check-all') {
      this.renderedToolbars.push(type);
      return this.renderCheckAll();
    }

    return void 0;
  }

  // editor重写该方法，不要改名或参数
  renderListItem(
    index: number,
    template: ListItemSchema | undefined,
    item: IItem,
    itemClassName: string
  ) {
    const {
      render,
      multiple,
      store,
      onAction,
      onEvent,
      hideCheckToggler,
      checkOnItemClick,
      itemAction,
      classnames: cx,
      translate: __
    } = this.props;
    const hasClickActions =
      onEvent &&
      Array.isArray(onEvent?.itemClick?.actions) &&
      onEvent.itemClick.actions.length > 0;

    return render(
      `${index}`,
      {
        type: 'list-item',
        ...template
      },
      {
        key: item.index,
        className: cx(itemClassName, {
          'is-checked': item.checked,
          'is-modified': item.modified,
          'is-moved': item.moved
        }),
        selectable: store.selectable,
        checkable: item.checkable,
        multiple,
        item,
        itemIndex: item.index,
        hideCheckToggler,
        checkOnItemClick,
        itemAction,
        hasClickActions,
        selected: item.checked,
        onCheck: this.handleCheck,
        onAction: this.handleAction,
        dragging: store.dragging,
        data: item.locals,
        onQuickChange: store.dragging ? null : this.handleQuickChange,
        popOverContainer: this.getPopOverContainer
      }
    );
  }

  render() {
    const {
      className,
      itemClassName,
      store,
      placeholder,
      render,
      multiple,
      listItem,
      onAction,
      hideCheckToggler,
      checkOnItemClick,
      itemAction,
      affixHeader,
      classnames: cx,
      size,
      translate: __,
      loading = false
    } = this.props;

    this.renderedToolbars = [];
    const heading = this.renderHeading();
    const header = this.renderHeader();

    return (
      <div
        className={cx('List', className, {
          [`List--${size}`]: size,
          'List--unsaved': !!store.modified || !!store.moved
        })}
        ref={this.bodyRef}
      >
        {affixHeader && heading && header ? (
          <div className={cx('List-fixedTop')}>
            {header}
            {heading}
          </div>
        ) : null}

        {header}
        {heading}
        {store.items.length ? (
          <div className={cx('List-items')}>
            {store.items.map((item, index) =>
              this.renderListItem(index, listItem, item, itemClassName)
            )}
          </div>
        ) : (
          <div className={cx('List-placeholder')}>
            {render('placeholder', __(placeholder))}
          </div>
        )}

        {this.renderFooter()}
        <Spinner overlay show={loading} />
      </div>
    );
  }
}

@Renderer({
  type: 'list',
  storeType: ListStore.name
})
export class ListRenderer extends List {
  dragging: boolean;
  selectable: boolean;
  selected: boolean;
  title?: string;
  subTitle?: string;
  desc?: string;
  avatar?: string;
  avatarClassName?: string;
  body?: SchemaNode;
  actions?: Array<ActionObject>;
  onCheck: (item: IItem) => void;
}

export interface ListItemProps
  extends RendererProps,
    Omit<ListItemSchema, 'type' | 'className'> {
  hideCheckToggler?: boolean;
  item: IItem;
  itemIndex?: number;
  checkable?: boolean;
  checkOnItemClick?: boolean;
  itemAction?: ActionSchema;
  onEvent?: OnEventProps['onEvent'];
  hasClickActions?: boolean;
}
export class ListItem extends React.Component<ListItemProps> {
  static defaultProps: Partial<ListItemProps> = {
    avatarClassName: 'thumb-sm avatar m-r',
    titleClassName: 'h5'
  };

  static propsList: Array<string> = [
    'avatarClassName',
    'titleClassName',
    'itemAction'
  ];

  constructor(props: ListItemProps) {
    super(props);
    this.itemRender = this.itemRender.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isClickOnInput(e)) {
      return;
    }

    const {
      checkable,
      checkOnItemClick,
      itemAction,
      onAction,
      item,
      onCheck,
      hasClickActions
    } = this.props;

    // itemAction和itemClick事件统一交给List处理，itemClick事件会覆盖itemAction
    onAction?.(
      e,
      hasClickActions ? undefined : itemAction,
      hasClickActions ? item : item?.data
    );

    // itemAction, itemClick事件和checkOnItemClick为互斥关系
    if (checkable && checkOnItemClick && !hasClickActions && !itemAction) {
      onCheck?.(item);
    }
  }

  handleCheck() {
    const {onCheck, item} = this.props;

    onCheck?.(item);
  }

  handleAction(e: React.UIEvent<any>, action: ActionObject, ctx: object) {
    const {onAction, item} = this.props;
    onAction && onAction(e, action, ctx || item.data);
  }

  handleQuickChange(
    values: object,
    saveImmediately?: boolean,
    savePristine?: boolean,
    options?: {
      resetOnFailed?: boolean;
      reload?: string;
    }
  ) {
    const {onQuickChange, item} = this.props;
    onQuickChange &&
      onQuickChange(item, values, saveImmediately, savePristine, options);
  }

  renderLeft() {
    const {
      dragging,
      selectable,
      selected,
      checkable,
      multiple,
      hideCheckToggler,
      checkOnItemClick,
      classnames: cx,
      classPrefix: ns
    } = this.props;

    if (dragging) {
      return (
        <div className={cx('ListItem-dragBtn')}>
          <Icon icon="drag-bar" className="icon" />
        </div>
      );
    } else if (selectable && !hideCheckToggler) {
      return (
        <div className={cx('ListItem-checkBtn')}>
          <Checkbox
            classPrefix={ns}
            type={multiple ? 'checkbox' : 'radio'}
            disabled={!checkable}
            checked={selected}
            onChange={checkOnItemClick ? noop : this.handleCheck}
            inline
          />
        </div>
      );
    }

    return null;
  }

  renderRight() {
    const {actions, render, data, dragging, classnames: cx} = this.props;

    if (Array.isArray(actions)) {
      return (
        <div className={cx('ListItem-actions')}>
          {actions.map((action, index) => {
            if (!isVisible(action, data)) {
              return null;
            }

            return render(
              `action/${index}`,
              {
                size: 'sm',
                level: 'link',
                type: 'button',
                ...(action as any) // todo 等后面修复了干掉 https://github.com/microsoft/TypeScript/pull/38577
              },
              {
                key: index,
                disabled: dragging || isDisabled(action, data),
                onAction: this.handleAction
              }
            );
          })}
        </div>
      );
    }

    return null;
  }

  renderChild(
    node: SchemaNode,
    region: string = 'body',
    key: any = 0
  ): React.ReactNode {
    const {render} = this.props;

    /*if (Array.isArray(node)) {
            return (
                <div className="hbox" key={key}>
                    {node.map((item, index) => (
                        <div key={index} className="col">{this.renderChild(item, `${region}/${index}`)}</div>
                    ))}
                </div>
            );
        } else */ if (typeof node === 'string' || typeof node === 'number') {
      return render(region, node, {key}) as JSX.Element;
    }

    const childNode: Schema = node as Schema;

    if (childNode.type === 'hbox' || childNode.type === 'grid') {
      return render(region, node, {
        key,
        itemRender: this.itemRender
      }) as JSX.Element;
    }

    return this.renderFeild(region, childNode, key, this.props);
  }

  itemRender(field: any, index: number, props: any) {
    return this.renderFeild(`column/${index}`, field, index, props);
  }

  renderFeild(region: string, field: any, key: any, props: any) {
    const render = props?.render || this.props.render;
    const data = this.props.data;
    const cx = this.props.classnames;
    const itemIndex = this.props.itemIndex;

    const $$id = field.$$id ? `${field.$$id}-field` : '';

    if (!isVisible(field, data)) {
      return null;
    }

    return (
      <div key={key} className={cx('ListItem-field')}>
        {field && field.label ? (
          <label className={cx('ListItem-fieldLabel', field.labelClassName)}>
            {field.label}
          </label>
        ) : null}

        {
          render(
            region,
            {
              ...field,
              field: field,
              $$id,
              type: 'list-item-field'
            },
            {
              rowIndex: itemIndex,
              colIndex: key,
              className: cx('ListItem-fieldValue', field.className),
              value: field.name ? resolveVariable(field.name, data) : undefined,
              onAction: this.handleAction,
              onQuickChange: this.handleQuickChange
            }
          ) as JSX.Element
        }
      </div>
    );
  }

  renderBody() {
    const {body} = this.props;

    if (!body) {
      return null;
    } else if (Array.isArray(body)) {
      return body.map((child, index) =>
        this.renderChild(
          {
            type: 'plain',
            ...(typeof child === 'string' ? {type: 'tpl', tpl: child} : child)
          },
          `body/${index}`,
          index
        )
      );
    }

    return this.renderChild(body, 'body');
  }

  render() {
    const {
      className,
      data,
      avatar: avatarTpl,
      title: titleTpl,
      titleClassName,
      subTitle: subTitleTpl,
      desc: descTpl,
      avatarClassName,
      render,
      classnames: cx,
      actionsPosition,
      itemAction,
      onEvent,
      hasClickActions
    } = this.props;
    const avatar = filter(avatarTpl, data);
    const title = filter(titleTpl, data);
    const subTitle = filter(subTitleTpl, data);
    const desc = filter(descTpl, data);

    return (
      <div
        onClick={this.handleClick}
        className={cx(
          `ListItem ListItem--actions-at-${actionsPosition || 'right'}`,
          {
            'ListItem--hasItemAction': itemAction || hasClickActions
          },
          className
        )}
      >
        {this.renderLeft()}
        {this.renderRight()}
        {avatar ? (
          <span className={cx('ListItem-avatar', avatarClassName)}>
            <img src={avatar} alt="..." />
          </span>
        ) : null}
        <div className={cx('ListItem-content')}>
          {title ? (
            <p className={cx('ListItem-title', titleClassName)}>{title}</p>
          ) : null}
          {subTitle ? (
            <div>
              <small className={cx('ListItem-subtitle')}>{subTitle}</small>
            </div>
          ) : null}
          {desc ? render('description', desc) : null}
          {this.renderBody()}
        </div>
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)(?:list|list-group)\/(?:.*\/)?list-item$/,
  name: 'list-item'
})
export class ListItemRenderer extends ListItem {
  static propsList = ['multiple', ...ListItem.propsList];
}

@Renderer({
  type: 'list-item-field'
})
@QuickEdit()
@PopOver()
@Copyable()
export class ListItemFieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };
  static propsList = [
    'quickEdit',
    'quickEditEnabledOn',
    'popOver',
    'copyable',
    'inline',
    ...TableCell.propsList
  ];

  render() {
    let {
      className,
      render,
      style,
      wrapperComponent: Component,
      labelClassName,
      value,
      data,
      children,
      width,
      innerClassName,
      label,
      tabIndex,
      onKeyUp,
      field,
      ...rest
    } = this.props;

    const schema = {
      ...field,
      className: innerClassName,
      type: (field && field.type) || 'plain'
    };

    let body = children
      ? children
      : render('field', schema, {
          ...omit(rest, Object.keys(schema)),
          value,
          data
        });

    if (width) {
      style = style || {};
      style.width = style.width || width;
      body = (
        <div style={{width: !/%/.test(String(width)) ? width : ''}}>{body}</div>
      );
    }

    if (!Component) {
      return body as JSX.Element;
    }

    return (
      <Component
        style={style}
        className={className}
        tabIndex={tabIndex}
        onKeyUp={onKeyUp}
      >
        {body}
      </Component>
    );
  }
}
