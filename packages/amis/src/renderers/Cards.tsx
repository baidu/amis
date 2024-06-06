import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  Renderer,
  RendererProps,
  ScopedContext,
  buildStyle,
  getMatchedEventTargets,
  getPropValue
} from 'amis-core';
import {SchemaNode, Schema, ActionObject} from 'amis-core';
import {Button, Spinner, SpinnerExtraProps} from 'amis-ui';
import {ListStore, IListStore} from 'amis-core';
import {Action} from '../types';
import {
  anyChanged,
  getScrollParent,
  difference,
  ucFirst,
  autobind,
  createObject,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {
  isPureVariable,
  resolveVariableAndFilter,
  filterClassNameObject
} from 'amis-core';
import Sortable from 'sortablejs';
import {filter} from 'amis-core';
import {Icon} from 'amis-ui';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaExpression,
  SchemaTpl,
  SchemaTokenizeableString
} from '../Schema';
import {CardProps, CardSchema} from './Card';
import {Card2Props, Card2Schema} from './Card2';
import type {IItem, IScopedContext} from 'amis-core';
import find from 'lodash/find';

/**
 * Cards 卡片集合渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/card
 */
export interface CardsSchema extends BaseSchema, SpinnerExtraProps {
  /**
   * 指定为 cards 类型
   */
  type: 'cards';

  card?: Partial<CardSchema> | Card2Schema;

  /**
   * 头部 CSS 类名
   */
  headerClassName?: SchemaClassName;

  /**
   * 底部 CSS 类名
   */
  footerClassName?: SchemaClassName;

  /**
   * 卡片 CSS 类名
   *
   * @default Grid-col--sm6 Grid-col--md4 Grid-col--lg3
   */
  itemClassName?: SchemaClassName;

  /**
   * 无数据提示
   *
   * @default 暂无数据
   */
  placeholder?: SchemaTpl;

  /**
   * 是否显示底部
   */
  showFooter?: boolean;

  /**
   * 是否显示头部
   */
  showHeader?: boolean;

  /**
   * 数据源: 绑定当前环境变量
   *
   * @default ${items}
   */
  source?: SchemaTokenizeableString;

  /**
   * 标题
   */
  title?: SchemaTpl;

  /**
   * 是否隐藏勾选框
   */
  hideCheckToggler?: boolean;

  /**
   * 是否固顶
   */
  affixHeader?: boolean;

  /**
   * 是否固底
   */
  affixFooter?: boolean;

  /**
   * 顶部区域
   */
  header?: SchemaCollection;

  /**
   * 底部区域
   */
  footer?: SchemaCollection;

  /**
   * 配置某项是否可以点选
   */
  itemCheckableOn?: SchemaExpression;

  /**
   * 配置某项是否可拖拽排序，前提是要开启拖拽功能
   */
  itemDraggableOn?: SchemaExpression;

  /**
   * 点击卡片的时候是否勾选卡片。
   */
  checkOnItemClick?: boolean;

  /**
   * 是否为瀑布流布局？
   */
  masonryLayout?: boolean;

  /**
   * 可以用来作为值的字段
   */
  valueField?: string;
}

export interface Column {
  type: string;
  [propName: string]: any;
}
// 如果这里的事件调整，对应CRUD里的事件配置也需要同步修改
export type CardsRendererEvent = 'selected';
export type CardsRendererAction = 'toggleSelectAll' | 'selectAll' | 'clearAll';

export interface GridProps
  extends RendererProps,
    Omit<CardsSchema, 'className' | 'itemClassName'> {
  store: IListStore;
  selectable?: boolean;
  selected?: Array<any>;
  checkAll?: boolean;
  multiple?: boolean;
  valueField?: string;
  draggable?: boolean;
  dragIcon?: SVGAElement;
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
  onQuery: (values: object) => any;
}

export default class Cards extends React.Component<GridProps, object> {
  static propsList: Array<string> = [
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
    'masonryLayout',
    'items',
    'valueField'
  ];
  static defaultProps: Partial<GridProps> = {
    className: '',
    placeholder: 'placeholder.noData',
    source: '$items',
    selectable: false,
    headerClassName: '',
    footerClassName: '',
    itemClassName: 'Grid-col--sm6 Grid-col--md4 Grid-col--lg3',
    hideCheckToggler: false,
    masonryLayout: false,
    affixHeader: true,
    itemsClassName: '',
    checkAll: true
  };

  dragTip?: HTMLElement;
  sortable?: Sortable;

  body?: any;
  unSensor: Function;
  renderedToolbars: Array<string>;

  constructor(props: GridProps) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleQuickChange = this.handleQuickChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveOrder = this.handleSaveOrder.bind(this);
    this.reset = this.reset.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
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
      selectable,
      draggable,
      orderBy,
      orderDir,
      multiple,
      hideCheckToggler,
      itemCheckableOn,
      itemDraggableOn
    });

    Cards.syncItems(store, this.props) && this.syncSelected();
  }

  static syncItems(store: IListStore, props: GridProps, prevProps?: GridProps) {
    const source = props.source;
    const value = getPropValue(props, (props: GridProps) => props.items);
    let items: Array<object> = [];
    let updateItems = false;

    if (
      Array.isArray(value) &&
      (!prevProps ||
        getPropValue(prevProps, (props: GridProps) => props.items) !== value)
    ) {
      items = value;
      updateItems = true;
    } else if (typeof source === 'string') {
      const resolved = resolveVariableAndFilter(source, props.data, '| raw');
      const prev = prevProps
        ? resolveVariableAndFilter(source, prevProps.data, '| raw')
        : null;

      if (prev === resolved) {
        updateItems = false;
      } else {
        items = Array.isArray(resolved) ? resolved : [];
        updateItems = true;
      }
    }

    updateItems && store.initItems(items);
    Array.isArray(props.selected) &&
      store.updateSelected(props.selected, props.valueField);
    return updateItems;
  }

  componentDidUpdate(prevProps: GridProps) {
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
        selectable: props.selectable,
        draggable: props.draggable,
        orderBy: props.orderBy,
        orderDir: props.orderDir,
        multiple: props.multiple,
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
      Cards.syncItems(store, props, prevProps) && this.syncSelected();
    } else if (prevProps.selected !== props.selected) {
      store.updateSelected(props.selected || [], props.valueField);
    }
  }

  bodyRef(ref: HTMLDivElement) {
    this.body = ref;
  }

  handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object
  ) {
    const {onAction} = this.props;

    // 需要支持特殊事件吗？
    onAction(e, action, ctx);
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

  handleSelectAll() {
    const {store} = this.props;

    store.selectAll();
    this.syncSelected();
  }

  handleClearAll() {
    const {store} = this.props;

    store.clearAll();
    this.syncSelected();
  }

  syncSelected() {
    const {store, onSelect, dispatchEvent} = this.props;
    const selectItems = store.selectedItems.map(item => item.data);
    const unSelectItems = store.unSelectedItems.map(item => item.data);

    dispatchEvent(
      'selected',
      createObject(store.data, {
        selectItems,
        unSelectItems
      })
    );

    onSelect && onSelect(selectItems, unSelectItems);
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
        item.locals
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

  bulkUpdate(value: any, items: Array<object>) {
    // const {store} = this.props;

    // const items2 = store.items.filter(item => ~items.indexOf(item.pristine));
    // items2.forEach(item => item.change(value));

    const {store, primaryField} = this.props;

    if (primaryField && value.ids) {
      const ids = value.ids.split(',');
      const rows = store.items.filter(item =>
        find(ids, (id: any) => id && id == item.data[primaryField])
      );
      const newValue = {...value, ids: undefined};
      rows.forEach(item => item.change(newValue));
    } else if (Array.isArray(items)) {
      const rows = store.items.filter(item => ~items.indexOf(item.pristine));
      rows.forEach(item => item.change(value));
    }
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
    if (this.sortable) return;

    const store = this.props.store;
    const dom = findDOMNode(this) as HTMLElement;
    const ns = this.props.classPrefix;
    this.sortable = new Sortable(
      dom.querySelector(`.${ns}Cards-body`) as HTMLElement,
      {
        group: 'table',
        animation: 150,
        handle: `.${ns}Card-dragBtn`,
        ghostClass: `is-dragging`,
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
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
    this.sortable = undefined;
  }

  renderActions(region: string) {
    let {actions, render, store, classnames: cx} = this.props;
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
      <div className={cx('Cards-actions')}>
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
        <div className={cx('Cards-heading')}>
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
      showHeader,
      render,
      store,
      classnames: cx,
      translate: __
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
        <div className={cx('Cards-toolbar')} key="header-toolbar">
          {actions}
          {child}
          {store.dragging ? (
            <div className={cx('Cards-dragTip')} ref={this.dragTipRef}>
              {__('Card.dragTip')}
            </div>
          ) : null}
        </div>
      ) : null;
    const headerNode = header ? (
      <div className={cx('Cards-header', headerClassName)} key="header">
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
      classnames: cx,
      affixFooter
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

    const footerNode = footer ? (
      <div
        className={cx(
          'Cards-footer',
          footerClassName,
          affixFooter ? 'Cards-footer--affix' : ''
        )}
        key="footer"
      >
        {render('footer', footer)}
      </div>
    ) : null;

    const toolbarNode =
      actions || child ? (
        <div
          className={cx(
            'Cards-toolbar',
            !footerNode && affixFooter ? 'Cards-footToolbar--affix' : ''
          )}
          key="footer-toolbar"
        >
          {actions}
          {child}
        </div>
      ) : null;

    return footerNode && toolbarNode
      ? [toolbarNode, footerNode]
      : footerNode || toolbarNode || null;
  }

  renderCheckAll() {
    const {store, multiple, selectable, checkAll} = this.props;

    if (
      !store.selectable ||
      !multiple ||
      !selectable ||
      store.dragging ||
      !store.items.length ||
      !checkAll
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
    const {
      store,
      multiple,
      selectable,
      popOverContainer,
      env,
      translate: __,
      dragIcon
    } = this.props;

    if (!store.draggable || store.items.length < 2) {
      return null;
    }

    return (
      <Button
        iconOnly
        key="dragging-toggle"
        tooltip={__('Card.toggleDrag')}
        tooltipContainer={popOverContainer || env?.getModalContainer}
        size="sm"
        active={store.dragging}
        onClick={(e: React.MouseEvent<any>) => {
          e.preventDefault();
          store.toggleDragging();
          store.dragging && store.clear();
          store.dragging ? this.initDragging() : undefined;
        }}
      >
        {React.isValidElement(dragIcon) ? (
          dragIcon
        ) : (
          <Icon icon="exchange" className="icon r90" />
        )}
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

  // editor中重写，请勿更改前两个参数
  renderCard(
    index: number,
    card: any,
    item: IItem,
    itemClassName: string,
    style: any
  ) {
    const {
      render,
      classnames: cx,
      store,
      multiple,
      checkOnItemClick,
      hideCheckToggler
    } = this.props;

    let cardProps: Partial<CardProps | Card2Props> = {
      className: cx(
        filterClassNameObject((card && card.className) || '', item.locals),
        {
          'is-checked': item.checked,
          'is-modified': item.modified,
          'is-moved': item.moved,
          'is-dragging': store.dragging
        }
      ),
      item,
      key: index,
      itemIndex: item.index,
      multiple,
      selectable: store.selectable,
      checkable: item.checkable,
      draggable: item.draggable,
      selected: item.checked,
      dragging: store.dragging,
      data: item.locals,
      onAction: this.handleAction,
      onCheck: this.handleCheck,
      onQuickChange: store.dragging ? null : this.handleQuickChange
    };

    // card2属性与card有区别
    if (card?.type === 'card2') {
      cardProps = {
        ...cardProps,
        item: item.locals,
        onCheck: () => {
          this.handleCheck(item);
        }
      };
    }

    return (
      <div key={item.index} className={cx(itemClassName)} style={style}>
        {render(
          `card/${index}`,
          {
            // @ts-ignore
            type: card.type || 'card',
            hideCheckToggler,
            checkOnItemClick,
            ...card
          },
          cardProps
        )}
      </div>
    );
  }

  render() {
    const {
      className,
      style,
      store,
      columnsCount,
      itemClassName,
      placeholder,
      card,
      data,
      render,
      affixHeader,
      masonryLayout,
      itemsClassName,
      classnames: cx,
      translate: __,
      loading = false,
      loadingConfig,
      env,
      id,
      wrapperCustomStyle,
      themeCss,
      mobileUI
    } = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
    const itemFinalClassName: string = columnsCount
      ? `Grid-col--sm${Math.round(12 / columnsCount)}`
      : itemClassName || '';

    const header = this.renderHeader();
    const heading = this.renderHeading();
    const footer = this.renderFooter();
    let masonryClassName = '';

    if (masonryLayout) {
      masonryClassName =
        'Cards--masonry ' +
        itemFinalClassName
          .split(/\s/)
          .map(item => {
            if (/^Grid-col--(xs|sm|md|lg)(\d+)/.test(item)) {
              return `Cards--masonry${ucFirst(RegExp.$1)}${RegExp.$2}`;
            }

            return item;
          })
          .join(' ');
    }

    // 自定义行列间距
    let wrapStyles: React.CSSProperties = {};
    let itemStyles: React.CSSProperties = {};
    if (style?.gutterX >= 0) {
      wrapStyles.marginLeft = wrapStyles.marginRight =
        -(style?.gutterX / 2) + 'px';
      itemStyles.paddingLeft = itemStyles.paddingRight =
        style?.gutterX / 2 + 'px';
    }

    if (style?.gutterY >= 0) {
      itemStyles.marginBottom = style?.gutterY + 'px';
    }
    // 修正grid多列计算错误，另外移动端目前只显示一列
    if (columnsCount && !masonryLayout && !mobileUI) {
      itemStyles.flex = `0 0 ${100 / columnsCount}%`;
      itemStyles.maxWidth = `${100 / columnsCount}%`;
    }

    return (
      <div
        ref={this.bodyRef}
        className={cx(
          'Cards',
          className,
          {
            'Cards--unsaved': !!store.modified || !!store.moved
          },
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        style={buildStyle(style, data)}
      >
        {affixHeader ? (
          <div className={cx('Cards-fixedTop')}>
            {header}
            {heading}
          </div>
        ) : (
          <>
            {header}
            {heading}
          </>
        )}

        {store.items.length ? (
          <div
            className={cx('Cards-body Grid', itemsClassName, masonryClassName)}
            style={wrapStyles}
          >
            {store.items.map((item, index) =>
              this.renderCard(index, card, item, itemFinalClassName, itemStyles)
            )}
          </div>
        ) : (
          <div className={cx('Cards-placeholder')}>
            {render('placeholder', __(placeholder))}
          </div>
        )}

        {footer}
        <Spinner loadingConfig={loadingConfig} overlay show={loading} />

        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              }
            ]
          }}
          env={env}
        />
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)(?:crud\/body\/grid|cards)$/,
  name: 'cards',
  storeType: ListStore.name,
  weight: -100 // 默认的 grid 不是这样，这个只识别 crud 下面的 grid
})
export class CardsRenderer extends Cards {
  dragging: boolean;
  selectable: boolean;
  selected: boolean;
  onSelect: boolean;
  title?: string;
  subTitle?: string;
  desc?: string;
  avatar?: string;
  avatarClassName?: string;
  body?: SchemaNode;
  actions?: Array<ActionObject>;

  static contextType = ScopedContext;
  declare context: React.ContextType<typeof ScopedContext>;

  constructor(props: GridProps, scoped: IScopedContext) {
    super(props);

    scoped.registerComponent(this);
  }

  componentWillUnmount(): void {
    super.componentWillUnmount?.();
    this.context.unRegisterComponent(this);
  }

  receive(values: any, subPath?: string) {
    const scoped = this.context as IScopedContext;
    const parents = scoped?.parent?.getComponents();

    /**
     * 因为Cards在scope上注册，导致getComponentByName查询组件时会优先找到Cards，和CRUD联动的动作都会失效
     * 这里先做兼容处理，把动作交给上层的CRUD处理
     */
    if (this.props?.host) {
      // CRUD会把自己透传给Cards，这样可以保证找到CRUD
      return this.props.host.receive?.(values, subPath);
    }

    if (subPath) {
      return scoped.send(subPath, values);
    }
  }

  async reload(
    subPath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean,
    args?: any
  ) {
    const {store} = this.props;
    if (args?.index || args?.condition) {
      // 局部刷新
      // todo 后续考虑添加局部刷新
      // const targets = await getMatchedEventTargets<IItem>(
      //   store.items,
      //   ctx || this.props.data,
      //   args.index,
      //   args?.condition
      // );
      // await Promise.all(targets.map(target => this.loadDeferredRow(target)));
      return;
    }

    const scoped = this.context as IScopedContext;

    if (this.props?.host) {
      // CRUD会把自己透传给Cards，这样可以保证找到CRUD
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

    if (index !== undefined || condition !== undefined) {
      const targets = await getMatchedEventTargets<IItem>(
        store.items,
        this.props.data,
        index,
        condition
      );
      targets.forEach(target => {
        target.updateData(values);
      });
    } else {
      return store.updateData(values, undefined, replace);
    }
  }

  getData() {
    const {store, data} = this.props;
    return store.getData(data);
  }

  async doAction(
    action: ActionObject,
    ctx: any,
    throwErrors: boolean,
    args: any
  ) {
    const {store, valueField, data} = this.props;

    const actionType = action?.actionType;
    switch (actionType) {
      case 'selectAll':
        store.clear();
        store.toggleAll();
        break;
      case 'clearAll':
        store.clear();
        break;
      case 'select':
        const rows = await getMatchedEventTargets<IItem>(
          store.items,
          ctx || this.props.data,
          args.index,
          args.condition,
          args.selected
        );
        store.updateSelected(
          rows.map(item => item.data),
          valueField
        );
        break;
      case 'initDrag':
        store.startDragging();
        break;
      case 'cancelDrag':
        store.stopDragging();
        break;
      case 'submitQuickEdit':
        await this.handleSave();
        break;
      default:
        return this.handleAction(undefined, action, data);
    }
  }
}
