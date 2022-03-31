import React, {Fragment} from 'react';
import {findDOMNode} from 'react-dom';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Schema, Action} from '../types';
import Button from '../components/Button';
import {ListStore, IListStore, IItem} from '../store/list';
import {observer} from 'mobx-react';
import {
  anyChanged,
  getScrollParent,
  difference,
  ucFirst,
  noop
} from '../utils/helper';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';
import Sortable from 'sortablejs';
import {filter} from '../utils/tpl';
import {Icon} from '../components/icons';
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

/**
 * Cards 卡片集合渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/card
 */
export interface CardsSchema extends BaseSchema {
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

export type CardsRendererEvent = 'change';
export type CardsRendererAction = 'check-all';

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
    resetOnFailed?: boolean
  ) => void;
  onSaveOrder?: (moved: Array<object>, items: Array<object>) => void;
  onQuery: (values: object) => void;
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
    'fixAlignment',
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
    // fixAlignment: false,
    hideCheckToggler: false,
    masonryLayout: false,
    affixHeader: true,
    itemsClassName: '',
    checkAll: true
  };

  dragTip?: HTMLElement;
  sortable?: Sortable;
  parentNode?: any;
  body?: any;
  // fixAlignmentLazy: Function;
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
    this.affixDetect = this.affixDetect.bind(this);
    this.itemsRef = this.itemsRef.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    // this.fixAlignmentLazy = debounce(this.fixAlignment.bind(this), 250, {
    //     trailing: true,
    //     leading: false
    // })

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
    typeof props.selected !== 'undefined' &&
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

  componentWillUnmount() {
    const parent = this.parentNode;
    parent && parent.removeEventListener('scroll', this.affixDetect);
    window.removeEventListener('resize', this.affixDetect);
  }

  // fixAlignment() {
  //     if (!this.props.fixAlignment || this.props.masonryLayout) {
  //         return;
  //     }

  //     const dom = this.body as HTMLElement;
  //     const ns = this.props.classPrefix;
  //     const cards = [].slice.apply(dom.querySelectorAll(`.${ns}Cards-body > div`));

  //     if (!cards.length) {
  //         return;
  //     }

  //     let maxHeight = cards.reduce((maxHeight:number, item:HTMLElement) => Math.max(item.offsetHeight, maxHeight), 0);
  //     cards.forEach((item: HTMLElement) => item.style.cssText += `min-height: ${maxHeight}px;`);
  // }

  bodyRef(ref: HTMLDivElement) {
    this.body = ref;
  }

  itemsRef(ref: HTMLDivElement) {
    if (ref) {
      // this.unSensor = resizeSensor(ref.parentNode as HTMLElement, this.fixAlignmentLazy);
    } else {
      this.unSensor && this.unSensor();

      // @ts-ignore;
      delete this.unSensor;
    }
  }

  affixDetect() {
    if (!this.props.affixHeader || !this.body) {
      return;
    }

    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;
    const clip = (this.body as HTMLElement).getBoundingClientRect();
    const offsetY =
      this.props.affixOffsetTop ?? this.props.env.affixOffsetTop ?? 0;
    const affixed =
      clip.top - 10 < offsetY && clip.top + clip.height - 40 > offsetY;
    const afixedDom = dom.querySelector(`.${ns}Cards-fixedTop`) as HTMLElement;

    this.body.offsetWidth &&
      (afixedDom.style.cssText = `top: ${offsetY}px;width: ${this.body.offsetWidth}px;`);
    affixed ? afixedDom.classList.add('in') : afixedDom.classList.remove('in');
    // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
  }

  handleAction(e: React.UIEvent<any>, action: Action, ctx: object) {
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
    saveSilent?: boolean,
    resetOnFailed?: boolean
  ) {
    item.change(values, saveSilent);

    if (!saveImmediately || saveSilent) {
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
      resetOnFailed
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
        <div className={cx('Cards-toolbar')} key="footer-toolbar">
          {actions}
          {child}
        </div>
      ) : null;
    const footerNode = footer ? (
      <div className={cx('Cards-footer', footerClassName)} key="footer">
        {render('footer', footer)}
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
    const {store, multiple, selectable, env, translate: __} = this.props;

    if (!store.draggable || store.items.length < 2) {
      return null;
    }

    return (
      <Button
        iconOnly
        key="dragging-toggle"
        tooltip={__('Card.toggleDrag')}
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

  // editor中重写，请勿更改前两个参数
  renderCard(index: number, card: any, item: IItem, itemClassName: string) {
    const {
      render,
      classnames: cx,
      store,
      multiple,
      checkOnItemClick,
      hideCheckToggler
    } = this.props;

    let cardProps: Partial<CardProps | Card2Props> = {
      className: cx((card && card.className) || '', {
        'is-checked': item.checked,
        'is-modified': item.modified,
        'is-moved': item.moved
      }),
      item,
      itemIndex: item.index,
      multiple,
      selectable: store.selectable,
      checkable: item.checkable,
      draggable: item.draggable,
      selected: item.checked,
      onSelect: item.toggle,
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
        onCheck: item.toggle
      };
    }

    return (
      <div key={item.index} className={cx(itemClassName)}>
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
      store,
      columnsCount,
      itemClassName,
      placeholder,
      card,
      render,
      affixHeader,
      masonryLayout,
      itemsClassName,
      classnames: cx,
      translate: __
    } = this.props;

    this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
    const itemFinalClassName: string = cx(itemClassName, {
      [`Grid-col--sm${Math.round(12 / columnsCount)}`]: columnsCount
    });

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

    return (
      <div
        ref={this.bodyRef}
        className={cx('Cards', className, {
          'Cards--unsaved': !!store.modified || !!store.moved
        })}
      >
        {affixHeader ? (
          <div className={cx('Cards-fixedTop')}>
            {header}
            {heading}
          </div>
        ) : null}
        {header}
        {heading}
        {store.items.length ? (
          <div
            ref={this.itemsRef}
            className={cx('Cards-body Grid', itemsClassName, masonryClassName)}
          >
            {store.items.map((item, index) =>
              this.renderCard(index, card, item, itemFinalClassName)
            )}
          </div>
        ) : (
          <div className={cx('Cards-placeholder')}>
            {render('placeholder', __(placeholder))}
          </div>
        )}

        {footer}
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
  actions?: Array<Action>;
}
