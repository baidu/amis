import * as React from 'react';
import {
    findDOMNode
} from 'react-dom';
import {
    Renderer,
    RendererProps
} from '../factory';
import {
    SchemaNode,
    Schema,
    Action
} from '../types';
import {
    filter
} from '../utils/tpl';
import * as cx from 'classnames';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import { ListStore, IListStore, IItem} from '../store/list';
import { observer } from 'mobx-react';
import { anyChanged, getScrollParent, difference, isVisible, isDisabled, noop } from '../utils/helper';
import { resolveVariable } from '../utils/tpl-builtin';
import QuickEdit from './QuickEdit';
import PopOver from './PopOver';
import Sortable = require('sortablejs');
import { TableCell } from './Table';
import Copyable from './Copyable';

export interface Column {
    type: string;
    [propName:string]: any;
};

export interface ListProps extends RendererProps {
    title?: string; // 标题
    header?: SchemaNode;
    body?: SchemaNode;
    footer?: SchemaNode;
    store: IListStore;
    className?: string;
    headerClassName?: string;
    footerClassName?: string;
    listItem?: any;
    source?:string;
    selectable?: boolean;
    selected?: Array<any>;
    valueField?: string;
    draggable?:boolean;
    onSelect: (selectedItems:Array<object>, unSelectedItems:Array<object>) => void;
    onSave?: (items:Array<object> | object, diff: Array<object> | object, rowIndexes: Array<number> | number, unModifiedItems?:Array<object>) => void;
    onSaveOrder?: (moved: Array<object>, items:Array<object>) => void;
    onQuery: (values:object) => void;
    hideCheckToggler?: boolean;
    itemCheckableOn?: string;
    itemDraggableOn?: string;
    size?: 'sm' | 'base'
}

export default class List extends React.Component<ListProps, object> {
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
        'actions',
        "items",
        "valueField"
    ];
    static defaultProps:Partial<ListProps>= {
        className: '',
        placeholder: '没有数据',
        source: '$items',
        selectable: false,
        headerClassName: '',
        footerClassName: '',
        affixHeader: true,
    };

    dragTip?: HTMLElement;
    sortable?: Sortable;
    parentNode?: any;
    body?: any;
    constructor(props:ListProps) {
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
    }

    static syncItems(store:IListStore, props:ListProps, prevProps?:ListProps) {
        const source = props.source;
        const value = props.value || props.items;
        let items:Array<object> = [];
        let updateItems = true;

        if (Array.isArray(value)) {
            items = value;
        } else if (typeof source === 'string') {
            const resolved = resolveVariable(source, props.data);
            const prev = prevProps ? resolveVariable(source, prevProps.data) : null;

            if (prev && prev === resolved) {
                updateItems = false;
            } else if (Array.isArray(resolved)) {
                items = resolved;
            }
        }

        updateItems && store.initItems(items);
        Array.isArray(props.selected) && store.updateSelected(props.selected, props.valueField);
    }

    componentWillMount() {
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
        } = this.props;

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

        List.syncItems(store, this.props);
        this.syncSelected();

    }

    componentDidMount() {
        let parent:HTMLElement | Window | null = getScrollParent(findDOMNode(this) as HTMLElement);
        if (!parent || parent === document.body) {
            parent = window;
        }

        this.parentNode = parent;
        this.affixDetect();
        parent.addEventListener('scroll', this.affixDetect);
        window.addEventListener('resize', this.affixDetect);
    }

    componentWillReceiveProps(nextProps:ListProps) {
        const props = this.props;
        const store = nextProps.store;

        if (anyChanged([
            'selectable',
            'draggable',
            'orderBy',
            'orderDir',
            'multiple',
            'hideCheckToggler',
            'itemCheckableOn',
            'itemDraggableOn'
        ], props, nextProps)) {
            store.update({
                multiple: nextProps.multiple,
                selectable: nextProps.selectable,
                draggable: nextProps.draggable,
                orderBy: nextProps.orderBy,
                orderDir: nextProps.orderDir,
                hideCheckToggler: nextProps.hideCheckToggler,
                itemCheckableOn: nextProps.itemCheckableOn,
                itemDraggableOn: nextProps.itemDraggableOn
            })
        }

        if (anyChanged([
            'source',
            'value',
            'items'
        ], props, nextProps) || !nextProps.value && !nextProps.items && nextProps.data !== props.data) {
            List.syncItems(store, nextProps, props);
            this.syncSelected();
        } else if (props.selected !== nextProps.selected) {
            store.updateSelected(nextProps.selected || [], nextProps.valueField);
        }
    }

    componentWillUnmount() {
        const parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        window.removeEventListener('resize', this.affixDetect);
    }

    bodyRef(ref:HTMLDivElement) {
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
        const offsetY = this.props.env.affixOffsetTop || 0;
        const affixed = clip.top < offsetY && (clip.top + clip.height - 40) > offsetY;
        
        this.body.offsetWidth && (afixedDom.style.cssText = `top: ${offsetY}px;width: ${this.body.offsetWidth}px;`);
        affixed ? afixedDom.classList.add('in') : afixedDom.classList.remove('in');
        // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
    }

    getPopOverContainer() {
        return findDOMNode(this);
    }

    handleAction(e:React.UIEvent<any>, action: Action, ctx: object) {
        const {
            onAction
        } = this.props;

        // todo
        onAction(e, action, ctx);
    }

    handleCheck(item:IItem) {
        item.toggle();
        this.syncSelected();
    }

    handleCheckAll() {
        const {
            store,
        } = this.props;

        store.toggleAll();
        this.syncSelected();
    }

    syncSelected() {
        const {
            store,
            onSelect
        } = this.props;
        
        onSelect && onSelect(store.selectedItems.map(item => item.data), store.unSelectedItems.map(item => item.data));
    }

    handleQuickChange(item: IItem, values:object, saveImmediately?: boolean | any, saveSilent?: boolean) {
        item.change(values, saveSilent);

        if (!saveImmediately || saveSilent) {
            return;
        }

        if (saveImmediately && saveImmediately.api) {
            this.props.onAction(null, {
                actionType: 'ajax',
                api: saveImmediately.api
            }, values);
            return;
        }

        const {
            onSave
        } = this.props;

        if (!onSave) {
            return;
        }

        onSave(item.data, difference(item.data, item.pristine), item.index);
    }

    handleSave() {
        const {
            store,
            onSave
        } = this.props;

        if (!onSave || !store.modifiedItems.length) {
            return;
        }

        const items = store.modifiedItems.map(item => item.data);
        const itemIndexes = store.modifiedItems.map(item => item.index);
        const diff = store.modifiedItems.map(item => difference(item.data, item.pristine));
        const unModifiedItems = store.items.filter(item => !item.modified).map(item => item.data);
        onSave(items, diff, itemIndexes, unModifiedItems);
    }

    handleSaveOrder() {
        const {
            store,
            onSaveOrder
        } = this.props;

        if (!onSaveOrder || !store.movedItems.length) {
            return;
        }

        onSaveOrder(store.movedItems.map(item => item.data), store.items.map(item => item.data));
    }

    reset() {
        const {
            store
        } = this.props;

        store.reset();
    }

    bulkUpdate(value:object, items:Array<object>) {
        const {
            store
        } = this.props;

        const items2 = store.items.filter(item => ~items.indexOf(item.pristine));
        items2.forEach(item => item.change(value));
    }

    getSelected() {
        const {
            store
        } = this.props;

        return store.selectedItems.map(item => item.data);
    }

    dragTipRef(ref:any) {
        if (!this.dragTip && ref) {
            this.initDragging();
        } else if (this.dragTip && !ref) {
            this.destroyDragging()
        }

        this.dragTip = ref;
    }


    initDragging() {
        const store = this.props.store;
        const dom = findDOMNode(this) as HTMLElement;
        const ns = this.props.classPrefix;
        this.sortable = new Sortable(dom.querySelector(`.${ns}List-items`) as HTMLElement, {
            group: 'table',
            handle: `.${ns}ListItem-dragBtn`,
            ghostClass: 'is-dragging',
            onEnd: (e:any) => {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }

                const parent = e.to as HTMLElement;
                if (e.oldIndex < parent.childNodes.length -1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                } else {
                    parent.appendChild(e.item);
                }

                store.exchange(e.oldIndex, e.newIndex);
            }
        });
    }

    destroyDragging() {
        this.sortable && this.sortable.destroy();
    }

    renderActions(region:string) {
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

        actions = Array.isArray(actions) ? actions.concat() : [];

        if (store.selectable && multiple && selectable && !store.dragging && store.items.length) {
            actions.unshift({
                type: 'button',
                children: (
                    <Button 
                        className={cx("List-checkAllBtn")}
                        classPrefix={ns}
                        tooltip="切换全选" 
                        tooltipContainer={env && env.getModalContainer ? env.getModalContainer() : undefined}
                        onClick={this.handleCheckAll} 
                        size="sm"
                        active={store.allChecked}
                    >全选</Button>
                )
            });
        }

        if (store.draggable && region === 'header' && store.items.length > 1) {
            actions.unshift({
                type: 'button',
                children: (
                    <Button
                        iconOnly
                        classPrefix={ns}
                        tooltip="对列表进行排序操作"
                        tooltipContainer={env && env.getModalContainer ? env.getModalContainer() : undefined}
                        key="dragging-toggle"
                        disabled={!!store.modified}
                        active={store.dragging}
                        size="sm"
                        className={cx("List-dragBtn")}
                        onClick={(e:React.MouseEvent<any>) => {
                            e.preventDefault();
                            store.toggleDragging();
                            store.dragging && store.clear();
                        }}
                    >
                        <i className="glyphicon glyphicon-sort" />
                    </Button>
                )
            });
        }

        return Array.isArray(actions) && actions.length ? (
            <div className={cx("List-actions")}>
                {actions.map((action, key) => render(`action/${key}`, {
                    type: 'button',
                    ...action
                }, {
                    onAction: this.handleAction,
                    key,
                    btnDisabled: store.dragging
                }))}
            </div>
        ) : null;
    }

    renderHeading() {
        let {
            title,
            store,
            hideQuickSaveBtn,
            classnames: cx,
            data
        } = this.props;

        if (title || store.modified && !hideQuickSaveBtn || store.moved) {
            return (
                <div className={cx("List-heading")}>
                    {store.modified && !hideQuickSaveBtn ? (
                        <span>
                            {`当前有 ${store.modified} 条记录修改了内容, 但并没有提交。请选择:`}
                            <button type="button" className={cx("Button Button--xs Button--success m-l-sm")} onClick={this.handleSave}>
                                <i className="fa fa-check m-r-xs" />
                                提交
                            </button>
                            <button type="button" className={cx("Button Button--xs Button--danger m-l-sm")}  onClick={this.reset}>
                                <i className="fa fa-times m-r-xs" />
                                放弃
                            </button>
                        </span>
                    ) : store.moved ?  (
                        <span>
                            {`当前有 ${store.moved} 条记录修改了顺序, 但并没有提交。请选择:`}
                            <button type="button" className={cx("Button Button--xs Button--success m-l-sm")} onClick={this.handleSaveOrder}>
                                <i className="fa fa-check m-r-xs" />
                                提交
                            </button>
                            <button type="button" className={cx("Button Button--xs Button--danger m-l-sm")}  onClick={this.reset}>
                                <i className="fa fa-times m-r-xs" />
                                放弃
                            </button>
                        </span>
                    ) : title ? filter(title, data) : ''}
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
        }  = this.props;

        if (showHeader === false) {
            return null;
        }

        const actions = this.renderActions('header');
        const child = headerToolbarRender ? headerToolbarRender({
            ...this.props,
            selectedItems: store.selectedItems.map(item => item.data),
            items: store.items.map(item => item.data),
            unSelectedItems: store.unSelectedItems.map(item => item.data),
        }) : null;
        const toolbarNode = actions || child || store.dragging ? (
            <div className={cx('List-toolbar', headerClassName)} key="header-toolbar">
                {actions}
                {child}
                {store.dragging ? <div className={cx("List-dragTip")} ref={this.dragTipRef}>请拖动左边的按钮进行排序</div> : null}
            </div>
        ) : null;
        const headerNode = header && (!Array.isArray(header) || header.length) ? (
            <div className={cx('List-header', headerClassName)} key="header">
                {render('header', header)}
            </div>
        ) : null;
        return headerNode && toolbarNode ? [headerNode, toolbarNode] : (headerNode || toolbarNode || null);
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
        }  = this.props;

        if (showFooter === false) {
            return null;
        }

        const actions = this.renderActions('footer');
        const child = footerToolbarRender ? footerToolbarRender({
            ...this.props,
            selectedItems: store.selectedItems.map(item => item.data),
            items: store.items.map(item => item.data),
            unSelectedItems: store.unSelectedItems.map(item => item.data),
        }) : null;

        const toolbarNode = actions || child ? (
            <div className={cx('List-toolbar', footerClassName)} key="footer-toolbar">
                {actions}
                {child}
            </div>
        ) : null;
        const footerNode = footer && (!Array.isArray(footer) || footer.length) ? (
            <div className={cx('List-footer', footerClassName)} key="footer">
                {render('footer', footer)}
            </div>
        ) : null;
        return footerNode && toolbarNode ? [toolbarNode, footerNode] : (footerNode || toolbarNode || null);
    }

    render() {
        const {
            className,
            store,
            placeholder,
            render,
            multiple,
            listItem,
            onAction,
            hideCheckToggler,
            checkOnItemClick,
            affixHeader,
            classnames: cx,
            size
        } = this.props;

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
                    <div
                        className={cx("List-fixedTop")}
                    >   
                        {heading}
                        {header}
                    </div>
                ) : null}
                {heading}
                {header}

                {store.items.length ? (
                    <div className={cx("List-items")}>
                        {store.items.map((item, index) => render(`${index}`, {
                            type: 'list-item',
                            ...listItem
                        }, {
                            key: item.index,
                            className: cx({
                                'is-checked': item.checked,
                                'is-modified': item.modified,
                                'is-moved': item.moved,
                            }),
                            selectable: store.selectable,
                            checkable: item.checkable,
                            multiple,
                            item,
                            hideCheckToggler,
                            checkOnItemClick,
                            selected: item.checked,
                            onCheck: this.handleCheck,
                            dragging: store.dragging,
                            onAction,
                            data: item.locals,
                            onQuickChange: store.dragging ? null : this.handleQuickChange,
                            popOverContainer: this.getPopOverContainer
                        }))}
                    </div>
                ) : (
                    <div className={cx("List-placeholder")}>{placeholder}</div>
                )}

                {this.renderFooter()}
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)(?:list|list-group)$/,
    storeType: ListStore.name,
    name: 'list'
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
    actions?: Array<Action>;
    onCheck: (item:IItem) => void;
};

export interface ListItemProps extends RendererProps {
    hideCheckToggler?: boolean;
    item: IItem;
    checkable?: boolean;
    checkOnItemClick?: boolean;
}
export class ListItem extends React.Component<ListItemProps> {

    static defaultProps:Partial<ListItemProps> = {
        avatarClassName: 'thumb-sm avatar m-r',
        titleClassName: 'h5'
    };

    static propsList:Array<string> = [
        'avatarClassName',
        'titleClassName'
    ];

    constructor(props:ListItemProps) {
        super(props);
        this.itemRender = this.itemRender.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.handleQuickChange = this.handleQuickChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleClick(e:React.MouseEvent<HTMLDivElement>) {
        const target:HTMLElement = e.target as HTMLElement;
        const ns = this.props.classPrefix;

        if (
            !e.currentTarget.contains(target) 
            || ~['INPUT', 'TEXTAREA'].indexOf(target.tagName) 
            || target.closest(`button, a, .${ns}Form-item`)
        ) {
            return;
        }

        const item = this.props.item;
        this.props.onCheck && this.props.onCheck(item);
    }

    handleCheck() {
        const item = this.props.item;
        this.props.onCheck && this.props.onCheck(item);
    }

    handleAction(e:React.UIEvent<any>, action: Action, ctx: object) {
        const {onAction, item} = this.props;
        onAction && onAction(e, action, ctx || item.data);
    }

    handleQuickChange(values:object, saveImmediately?: boolean, saveSilent?: boolean) {
        const {onQuickChange, item} = this.props;
        onQuickChange && onQuickChange(item, values, saveImmediately, saveSilent);
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
                <div className={cx("ListItem-dragBtn")}>
                    <i className="glyphicon glyphicon-sort" />
                </div>
            );
        } else if (selectable && !hideCheckToggler) {
            return (
                <div className={cx("ListItem-checkBtn")}>
                    <Checkbox 
                        classPrefix={ns} type={multiple ? 'checkbox' : 'radio'} 
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
        const {
            actions,
            render,
            data,
            dragging,
            classnames: cx
        } = this.props;

        if (Array.isArray(actions)) {
            return (
                <div className={cx("ListItem-actions")}>
                    {actions.map((action, index) => {
                        if (!isVisible(action, data)) {
                            return null;
                        }

                        return render(`action/${index}`, {
                            size: 'sm',
                            level: 'link',
                            type: 'button',
                            ...action
                        }, {
                            key: index,
                            disabled: dragging || isDisabled(action, data),
                            onAction: this.handleAction,
                        });
                    })}
                </div>
            );
        }

        return null;
    }

    renderChild(node:SchemaNode, region: string = 'body', key:any = 0): JSX.Element {
        const {
            render        } = this.props;

        /*if (Array.isArray(node)) {
            return (
                <div className="hbox" key={key}>
                    {node.map((item, index) => (
                        <div key={index} className="col">{this.renderChild(item, `${region}/${index}`)}</div>
                    ))}
                </div>
            );
        } else */if (typeof node === 'string' || typeof node === 'number') {
            return render(region, node, {key}) as JSX.Element;
        }

        const childNode:Schema = node as Schema;

        if (childNode.type === 'hbox' || childNode.type === 'grid') {
            return render(region, node, {
                key,
                itemRender: this.itemRender
            }) as JSX.Element;
        }

        return this.renderFeild(region,childNode, key, this.props);
    }

    itemRender(field:any, index:number, props:any) {
        return this.renderFeild(`column/${index}`, field, index, props);
    }

    renderFeild(region:string, field:any, key:any, props:any) {
        const render = props.render || this.props.render;
        const data = this.props.data;
        const cx = this.props.classnames;

        const $$id = field.$$id ? `${field.$$id}-field` : '';
        return (
            <div key={key} className={cx('ListItem-field')}>
                {field && field.label ? (
                    <label className={cx('ListItem-fieldLabel', field.labelClassName)}>{field.label}</label>
                ) : null}

                {render(region, {
                    ...field,
                    field: field,
                    $$id,
                    type: 'list-item-field',
                }, {
                    className: cx("ListItem-fieldValue", field.className),
                    value: field.name ? resolveVariable(field.name, data) : `-`,
                    onAction: this.handleAction,
                    onQuickChange: this.handleQuickChange
                }) as JSX.Element}
            </div>
        );
    }

    renderBody() {
        const {
            body
        } = this.props;

        if (!body) {
            return null;
        } else if (Array.isArray(body)) {
            return body.map((child, index) => this.renderChild(child, `body/${index}`, index))
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
            checkOnItemClick,
            render,
            checkable,
            classnames: cx
        } = this.props;

        const avatar = filter(avatarTpl, data);
        const title = filter(titleTpl, data);
        const subTitle = filter(subTitleTpl, data);
        const desc = filter(descTpl, data);

        return (
            <div onClick={checkOnItemClick && checkable ?  this.handleClick : undefined}  className={cx('ListItem', className)}>
                {this.renderLeft()}
                {this.renderRight()}
                {avatar ? (
                    <span className={cx('ListItem-avatar', avatarClassName)}><img src={avatar} alt="..." /></span>
                ) : null}
                <div className={cx("ListItem-content")}>
                    {title ? (<p className={cx("ListItem-title", titleClassName)}>{title}</p>) : null}
                    {subTitle ? (<div><small className={cx("ListItem-subtitle")}>{subTitle}</small></div>) : null}
                    {desc ? render('description', desc) : null}
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)(?:list|list-group)\/(?:.*\/)?list-item$/,
    name: "list-item"
})
export class ListItemRenderer extends ListItem {
};


@Renderer({
    test: /(^|\/)list-item-field$/,
    name: 'list-item-field'
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
        'popOver',
        'copyable',
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
            type: field && field.type || 'plain',
        };

        let body = children ? children : render('field', schema, {
            ...rest,
            value,
            data
        });

        if (width) {
            style = style || {};
            style.width = style.width || width;
            body = (
                <div style={{width: !/%/.test(String(width)) ? width : ''}}>
                    {body}
                </div>
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
        )
    }
};
