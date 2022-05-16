"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var factory_1 = require("../factory");
var Button_1 = (0, tslib_1.__importDefault)(require("../components/Button"));
var list_1 = require("../store/list");
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var tpl_1 = require("../utils/tpl");
var icons_1 = require("../components/icons");
var Cards = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Cards, _super);
    function Cards(props) {
        var _this = _super.call(this, props) || this;
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.handleCheckAll = _this.handleCheckAll.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.handleSaveOrder = _this.handleSaveOrder.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.dragTipRef = _this.dragTipRef.bind(_this);
        _this.bodyRef = _this.bodyRef.bind(_this);
        _this.affixDetect = _this.affixDetect.bind(_this);
        _this.itemsRef = _this.itemsRef.bind(_this);
        _this.renderToolbar = _this.renderToolbar.bind(_this);
        // this.fixAlignmentLazy = debounce(this.fixAlignment.bind(this), 250, {
        //     trailing: true,
        //     leading: false
        // })
        var store = props.store, selectable = props.selectable, draggable = props.draggable, orderBy = props.orderBy, orderDir = props.orderDir, multiple = props.multiple, hideCheckToggler = props.hideCheckToggler, itemCheckableOn = props.itemCheckableOn, itemDraggableOn = props.itemDraggableOn;
        store.update({
            selectable: selectable,
            draggable: draggable,
            orderBy: orderBy,
            orderDir: orderDir,
            multiple: multiple,
            hideCheckToggler: hideCheckToggler,
            itemCheckableOn: itemCheckableOn,
            itemDraggableOn: itemDraggableOn
        });
        Cards.syncItems(store, _this.props) && _this.syncSelected();
        return _this;
    }
    Cards.syncItems = function (store, props, prevProps) {
        var source = props.source;
        var value = props.value || props.items;
        var items = [];
        var updateItems = false;
        if (Array.isArray(value) &&
            (!prevProps || (prevProps.value || prevProps.items) !== value)) {
            items = value;
            updateItems = true;
        }
        else if (typeof source === 'string') {
            var resolved = (0, tpl_builtin_1.resolveVariableAndFilter)(source, props.data, '| raw');
            var prev = prevProps
                ? (0, tpl_builtin_1.resolveVariableAndFilter)(source, prevProps.data, '| raw')
                : null;
            if (prev && prev === resolved) {
                updateItems = false;
            }
            else if (Array.isArray(resolved)) {
                items = resolved;
                updateItems = true;
            }
        }
        updateItems && store.initItems(items);
        typeof props.selected !== 'undefined' &&
            store.updateSelected(props.selected, props.valueField);
        return updateItems;
    };
    Cards.prototype.componentDidMount = function () {
        var parent = (0, helper_1.getScrollParent)((0, react_dom_1.findDOMNode)(this));
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        this.affixDetect();
        parent.addEventListener('scroll', this.affixDetect);
        window.addEventListener('resize', this.affixDetect);
    };
    Cards.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var store = props.store;
        if ((0, helper_1.anyChanged)([
            'selectable',
            'draggable',
            'orderBy',
            'orderDir',
            'multiple',
            'hideCheckToggler',
            'itemCheckableOn',
            'itemDraggableOn'
        ], prevProps, props)) {
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
        if ((0, helper_1.anyChanged)(['source', 'value', 'items'], prevProps, props) ||
            (!props.value &&
                !props.items &&
                (props.data !== prevProps.data ||
                    (typeof props.source === 'string' && (0, tpl_builtin_1.isPureVariable)(props.source))))) {
            Cards.syncItems(store, props, prevProps) && this.syncSelected();
        }
        else if (prevProps.selected !== props.selected) {
            store.updateSelected(props.selected || [], props.valueField);
        }
    };
    Cards.prototype.componentWillUnmount = function () {
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        window.removeEventListener('resize', this.affixDetect);
    };
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
    Cards.prototype.bodyRef = function (ref) {
        this.body = ref;
    };
    Cards.prototype.itemsRef = function (ref) {
        if (ref) {
            // this.unSensor = resizeSensor(ref.parentNode as HTMLElement, this.fixAlignmentLazy);
        }
        else {
            this.unSensor && this.unSensor();
            // @ts-ignore;
            delete this.unSensor;
        }
    };
    Cards.prototype.affixDetect = function () {
        var _a, _b;
        if (!this.props.affixHeader || !this.body) {
            return;
        }
        var ns = this.props.classPrefix;
        var dom = (0, react_dom_1.findDOMNode)(this);
        var clip = this.body.getBoundingClientRect();
        var offsetY = (_b = (_a = this.props.affixOffsetTop) !== null && _a !== void 0 ? _a : this.props.env.affixOffsetTop) !== null && _b !== void 0 ? _b : 0;
        var affixed = clip.top - 10 < offsetY && clip.top + clip.height - 40 > offsetY;
        var afixedDom = dom.querySelector(".".concat(ns, "Cards-fixedTop"));
        this.body.offsetWidth &&
            (afixedDom.style.cssText = "top: ".concat(offsetY, "px;width: ").concat(this.body.offsetWidth, "px;"));
        affixed ? afixedDom.classList.add('in') : afixedDom.classList.remove('in');
        // store.markHeaderAffix(clip.top < offsetY && (clip.top + clip.height - 40) > offsetY);
    };
    Cards.prototype.handleAction = function (e, action, ctx) {
        var onAction = this.props.onAction;
        // 需要支持特殊事件吗？
        onAction(e, action, ctx);
    };
    Cards.prototype.handleCheck = function (item) {
        item.toggle();
        this.syncSelected();
    };
    Cards.prototype.handleCheckAll = function () {
        var store = this.props.store;
        store.toggleAll();
        this.syncSelected();
    };
    Cards.prototype.syncSelected = function () {
        var _a = this.props, store = _a.store, onSelect = _a.onSelect;
        onSelect &&
            onSelect(store.selectedItems.map(function (item) { return item.data; }), store.unSelectedItems.map(function (item) { return item.data; }));
    };
    Cards.prototype.handleQuickChange = function (item, values, saveImmediately, saveSilent, resetOnFailed) {
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
        var _a = this.props, onSave = _a.onSave, primaryField = _a.primaryField;
        if (!onSave) {
            return;
        }
        onSave(item.data, (0, helper_1.difference)(item.data, item.pristine, ['id', primaryField]), item.index, undefined, item.pristine, resetOnFailed);
    };
    Cards.prototype.handleSave = function () {
        var _a = this.props, store = _a.store, onSave = _a.onSave, primaryField = _a.primaryField;
        if (!onSave || !store.modifiedItems.length) {
            return;
        }
        var items = store.modifiedItems.map(function (item) { return item.data; });
        var itemIndexes = store.modifiedItems.map(function (item) { return item.index; });
        var diff = store.modifiedItems.map(function (item) {
            return (0, helper_1.difference)(item.data, item.pristine, ['id', primaryField]);
        });
        var unModifiedItems = store.items
            .filter(function (item) { return !item.modified; })
            .map(function (item) { return item.data; });
        onSave(items, diff, itemIndexes, unModifiedItems, store.modifiedItems.map(function (item) { return item.pristine; }));
    };
    Cards.prototype.handleSaveOrder = function () {
        var _a = this.props, store = _a.store, onSaveOrder = _a.onSaveOrder;
        if (!onSaveOrder || !store.movedItems.length) {
            return;
        }
        onSaveOrder(store.movedItems.map(function (item) { return item.data; }), store.items.map(function (item) { return item.data; }));
    };
    Cards.prototype.reset = function () {
        var store = this.props.store;
        store.reset();
    };
    Cards.prototype.bulkUpdate = function (value, items) {
        var store = this.props.store;
        var items2 = store.items.filter(function (item) { return ~items.indexOf(item.pristine); });
        items2.forEach(function (item) { return item.change(value); });
    };
    Cards.prototype.getSelected = function () {
        var store = this.props.store;
        return store.selectedItems.map(function (item) { return item.data; });
    };
    Cards.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    Cards.prototype.initDragging = function () {
        var store = this.props.store;
        var dom = (0, react_dom_1.findDOMNode)(this);
        var ns = this.props.classPrefix;
        this.sortable = new sortablejs_1.default(dom.querySelector(".".concat(ns, "Cards-body")), {
            group: 'table',
            animation: 150,
            handle: ".".concat(ns, "Card-dragBtn"),
            ghostClass: "is-dragging",
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                var parent = e.to;
                if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                store.exchange(e.oldIndex, e.newIndex);
            }
        });
    };
    Cards.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    Cards.prototype.renderActions = function (region) {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, store = _a.store, cx = _a.classnames;
        var btn;
        actions = Array.isArray(actions) ? actions.concat() : [];
        if (!~this.renderedToolbars.indexOf('check-all') &&
            (btn = this.renderCheckAll())) {
            actions.unshift({
                type: 'button',
                children: btn
            });
        }
        if (region === 'header' &&
            !~this.renderedToolbars.indexOf('drag-toggler') &&
            (btn = this.renderDragToggler())) {
            actions.unshift({
                type: 'button',
                children: btn
            });
        }
        return Array.isArray(actions) && actions.length ? (react_1.default.createElement("div", { className: cx('Cards-actions') }, actions.map(function (action, key) {
            return render("action/".concat(key), (0, tslib_1.__assign)({ type: 'button' }, action), {
                onAction: _this.handleAction,
                key: key,
                btnDisabled: store.dragging
            });
        }))) : null;
    };
    Cards.prototype.renderHeading = function () {
        var _a = this.props, title = _a.title, store = _a.store, hideQuickSaveBtn = _a.hideQuickSaveBtn, cx = _a.classnames, data = _a.data;
        if (title || (store.modified && !hideQuickSaveBtn) || store.moved) {
            return (react_1.default.createElement("div", { className: cx('Cards-heading') }, store.modified && !hideQuickSaveBtn ? (react_1.default.createElement("span", null, "\u5F53\u524D\u6709 ".concat(store.modified, " \u6761\u8BB0\u5F55\u4FEE\u6539\u4E86\u5185\u5BB9, \u4F46\u5E76\u6CA1\u6709\u63D0\u4EA4\u3002\u8BF7\u9009\u62E9:"),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSave },
                    react_1.default.createElement(icons_1.Icon, { icon: "check", className: "icon m-r-xs" }),
                    "\u63D0\u4EA4"),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon m-r-xs" }),
                    "\u653E\u5F03"))) : store.moved ? (react_1.default.createElement("span", null, "\u5F53\u524D\u6709 ".concat(store.moved, " \u6761\u8BB0\u5F55\u4FEE\u6539\u4E86\u987A\u5E8F, \u4F46\u5E76\u6CA1\u6709\u63D0\u4EA4\u3002\u8BF7\u9009\u62E9:"),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--success m-l-sm'), onClick: this.handleSaveOrder },
                    react_1.default.createElement(icons_1.Icon, { icon: "check", className: "icon m-r-xs" }),
                    "\u63D0\u4EA4"),
                react_1.default.createElement("button", { type: "button", className: cx('Button Button--xs Button--danger m-l-sm'), onClick: this.reset },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon m-r-xs" }),
                    "\u653E\u5F03"))) : title ? ((0, tpl_1.filter)(title, data)) : ('')));
        }
        return null;
    };
    Cards.prototype.renderHeader = function () {
        var _a = this.props, header = _a.header, headerClassName = _a.headerClassName, headerToolbar = _a.headerToolbar, headerToolbarRender = _a.headerToolbarRender, showHeader = _a.showHeader, render = _a.render, store = _a.store, cx = _a.classnames, __ = _a.translate;
        if (showHeader === false) {
            return null;
        }
        var child = headerToolbarRender
            ? headerToolbarRender((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props), { selectedItems: store.selectedItems.map(function (item) { return item.data; }), items: store.items.map(function (item) { return item.data; }), unSelectedItems: store.unSelectedItems.map(function (item) { return item.data; }) }), this.renderToolbar)
            : null;
        var actions = this.renderActions('header');
        var toolbarNode = actions || child || store.dragging ? (react_1.default.createElement("div", { className: cx('Cards-toolbar'), key: "header-toolbar" },
            actions,
            child,
            store.dragging ? (react_1.default.createElement("div", { className: cx('Cards-dragTip'), ref: this.dragTipRef }, __('Card.dragTip'))) : null)) : null;
        var headerNode = header ? (react_1.default.createElement("div", { className: cx('Cards-header', headerClassName), key: "header" }, render('header', header))) : null;
        return headerNode && toolbarNode
            ? [headerNode, toolbarNode]
            : headerNode || toolbarNode || null;
    };
    Cards.prototype.renderFooter = function () {
        var _a = this.props, footer = _a.footer, footerClassName = _a.footerClassName, footerToolbar = _a.footerToolbar, footerToolbarRender = _a.footerToolbarRender, render = _a.render, showFooter = _a.showFooter, store = _a.store, cx = _a.classnames;
        if (showFooter === false) {
            return null;
        }
        var child = footerToolbarRender
            ? footerToolbarRender((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.props), { selectedItems: store.selectedItems.map(function (item) { return item.data; }), items: store.items.map(function (item) { return item.data; }), unSelectedItems: store.unSelectedItems.map(function (item) { return item.data; }) }), this.renderToolbar)
            : null;
        var actions = this.renderActions('footer');
        var toolbarNode = actions || child ? (react_1.default.createElement("div", { className: cx('Cards-toolbar'), key: "footer-toolbar" },
            actions,
            child)) : null;
        var footerNode = footer ? (react_1.default.createElement("div", { className: cx('Cards-footer', footerClassName), key: "footer" }, render('footer', footer))) : null;
        return footerNode && toolbarNode
            ? [toolbarNode, footerNode]
            : footerNode || toolbarNode || null;
    };
    Cards.prototype.renderCheckAll = function () {
        var _a = this.props, store = _a.store, multiple = _a.multiple, selectable = _a.selectable, checkAll = _a.checkAll;
        if (!store.selectable ||
            !multiple ||
            !selectable ||
            store.dragging ||
            !store.items.length ||
            !checkAll) {
            return null;
        }
        return (react_1.default.createElement(Button_1.default, { key: "checkall", tooltip: "\u5207\u6362\u5168\u9009", onClick: this.handleCheckAll, size: "sm", level: store.allChecked ? 'info' : 'default' }, "\u5168\u9009"));
    };
    Cards.prototype.renderDragToggler = function () {
        var _a = this.props, store = _a.store, multiple = _a.multiple, selectable = _a.selectable, env = _a.env, __ = _a.translate;
        if (!store.draggable || store.items.length < 2) {
            return null;
        }
        return (react_1.default.createElement(Button_1.default, { iconOnly: true, key: "dragging-toggle", tooltip: __('Card.toggleDrag'), tooltipContainer: env && env.getModalContainer ? env.getModalContainer : undefined, size: "sm", active: store.dragging, onClick: function (e) {
                e.preventDefault();
                store.toggleDragging();
                store.dragging && store.clear();
            } },
            react_1.default.createElement(icons_1.Icon, { icon: "exchange", className: "icon r90" })));
    };
    Cards.prototype.renderToolbar = function (toolbar, index) {
        var type = toolbar.type || toolbar;
        if (type === 'drag-toggler') {
            this.renderedToolbars.push(type);
            return this.renderDragToggler();
        }
        else if (type === 'check-all') {
            this.renderedToolbars.push(type);
            return this.renderCheckAll();
        }
        return void 0;
    };
    // editor中重写，请勿更改前两个参数
    Cards.prototype.renderCard = function (index, card, item, itemClassName) {
        var _a = this.props, render = _a.render, cx = _a.classnames, store = _a.store, multiple = _a.multiple, checkOnItemClick = _a.checkOnItemClick, hideCheckToggler = _a.hideCheckToggler;
        var cardProps = {
            className: cx((card && card.className) || '', {
                'is-checked': item.checked,
                'is-modified': item.modified,
                'is-moved': item.moved
            }),
            item: item,
            itemIndex: item.index,
            multiple: multiple,
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
        if ((card === null || card === void 0 ? void 0 : card.type) === 'card2') {
            cardProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, cardProps), { item: item.locals, onCheck: item.toggle });
        }
        return (react_1.default.createElement("div", { key: item.index, className: cx(itemClassName) }, render("card/".concat(index), (0, tslib_1.__assign)({ 
            // @ts-ignore
            type: card.type || 'card', hideCheckToggler: hideCheckToggler, checkOnItemClick: checkOnItemClick }, card), cardProps)));
    };
    Cards.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, store = _a.store, columnsCount = _a.columnsCount, itemClassName = _a.itemClassName, placeholder = _a.placeholder, card = _a.card, render = _a.render, affixHeader = _a.affixHeader, masonryLayout = _a.masonryLayout, itemsClassName = _a.itemsClassName, cx = _a.classnames, __ = _a.translate;
        this.renderedToolbars = []; // 用来记录哪些 toolbar 已经渲染了，已经渲染了就不重复渲染了。
        var itemFinalClassName = columnsCount
            ? "Grid-col--sm".concat(Math.round(12 / columnsCount))
            : itemClassName || '';
        var header = this.renderHeader();
        var heading = this.renderHeading();
        var footer = this.renderFooter();
        var masonryClassName = '';
        if (masonryLayout) {
            masonryClassName =
                'Cards--masonry ' +
                    itemFinalClassName
                        .split(/\s/)
                        .map(function (item) {
                        if (/^Grid-col--(xs|sm|md|lg)(\d+)/.test(item)) {
                            return "Cards--masonry".concat((0, helper_1.ucFirst)(RegExp.$1)).concat(RegExp.$2);
                        }
                        return item;
                    })
                        .join(' ');
        }
        return (react_1.default.createElement("div", { ref: this.bodyRef, className: cx('Cards', className, {
                'Cards--unsaved': !!store.modified || !!store.moved
            }) },
            affixHeader ? (react_1.default.createElement("div", { className: cx('Cards-fixedTop') },
                header,
                heading)) : null,
            header,
            heading,
            store.items.length ? (react_1.default.createElement("div", { ref: this.itemsRef, className: cx('Cards-body Grid', itemsClassName, masonryClassName) }, store.items.map(function (item, index) {
                return _this.renderCard(index, card, item, itemFinalClassName);
            }))) : (react_1.default.createElement("div", { className: cx('Cards-placeholder') }, render('placeholder', __(placeholder)))),
            footer));
    };
    Cards.propsList = [
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
    Cards.defaultProps = {
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
    return Cards;
}(react_1.default.Component));
exports.default = Cards;
var CardsRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CardsRenderer, _super);
    function CardsRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardsRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:crud\/body\/grid|cards)$/,
            name: 'cards',
            storeType: list_1.ListStore.name,
            weight: -100 // 默认的 grid 不是这样，这个只识别 crud 下面的 grid
        })
    ], CardsRenderer);
    return CardsRenderer;
}(Cards));
exports.CardsRenderer = CardsRenderer;
//# sourceMappingURL=./renderers/Cards.js.map
