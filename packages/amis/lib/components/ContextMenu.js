"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.openContextMenus = exports.ThemedContextMenu = exports.ContextMenu = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var helper_1 = require("../utils/helper");
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var dom_1 = require("../utils/dom");
var fadeStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a[Transition_1.EXITING] = 'out',
    _a);
var ContextMenu = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ContextMenu, _super);
    function ContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            menus: [],
            x: -99999,
            y: -99999
        };
        _this.menuRef = react_1.default.createRef();
        _this.originInstance = ContextMenu.instance;
        ContextMenu.instance = _this;
        return _this;
    }
    ContextMenu.getInstance = function () {
        if (!ContextMenu.instance) {
            var container = document.body;
            var div = document.createElement('div');
            container.appendChild(div);
            (0, react_dom_1.render)(react_1.default.createElement(exports.ThemedContextMenu, null), div);
        }
        return ContextMenu.instance;
    };
    ContextMenu.prototype.componentDidMount = function () {
        document.body.addEventListener('click', this.handleOutClick, true);
        document.addEventListener('keydown', this.handleKeyDown);
    };
    ContextMenu.prototype.componentWillUnmount = function () {
        ContextMenu.instance = this.originInstance;
        document.body.removeEventListener('click', this.handleOutClick, true);
        document.removeEventListener('keydown', this.handleKeyDown);
        // @ts-ignore
        delete this.originInstance;
    };
    ContextMenu.prototype.openContextMenus = function (info, menus, onClose) {
        var _this = this;
        if (this.state.isOpened) {
            var _a = this.state, x = _a.x, y = _a.y;
            // 避免 二次触发未进行智能定位 导致遮挡问题
            this.setState({
                x: x + (info.x - (this.prevInfo && this.prevInfo.x ? this.prevInfo.x : 0)),
                y: y + (info.y - (this.prevInfo && this.prevInfo.y ? this.prevInfo.y : 0)),
                menus: menus,
                onClose: onClose
            }, function () {
                _this.handleEnter(_this.menuRef.current);
            });
        }
        else {
            this.setState({
                isOpened: true,
                x: info.x,
                y: info.y,
                menus: menus,
                onClose: onClose
            });
        }
        this.prevInfo = info;
    };
    ContextMenu.prototype.close = function () {
        var onClose = this.state.onClose;
        this.setState({
            isOpened: false,
            x: -99999,
            y: -99999,
            menus: []
        }, onClose);
    };
    ContextMenu.prototype.handleOutClick = function (e) {
        if (!e.target ||
            !this.menuRef.current ||
            this.menuRef.current.contains(e.target)) {
            return;
        }
        if (this.state.isOpened) {
            e.preventDefault();
            this.close();
        }
    };
    ContextMenu.prototype.handleClick = function (item) {
        var onClose = this.state.onClose;
        item.disabled ||
            (Array.isArray(item.children) && item.children.length) ||
            this.setState({
                isOpened: false,
                x: -99999,
                y: -99999,
                menus: []
            }, function () {
                var _a;
                (_a = item.onSelect) === null || _a === void 0 ? void 0 : _a.call(item, item.data);
                onClose === null || onClose === void 0 ? void 0 : onClose();
            });
    };
    ContextMenu.prototype.handleKeyDown = function (e) {
        if (e.keyCode === 27 && this.state.isOpened) {
            e.preventDefault();
            this.close();
        }
    };
    ContextMenu.prototype.handleMouseEnter = function (item) {
        item.disabled || !item.onHighlight || item.onHighlight(true, item.data);
    };
    ContextMenu.prototype.handleMouseLeave = function (item) {
        item.disabled || !item.onHighlight || item.onHighlight(false, item.data);
    };
    ContextMenu.prototype.handleEnter = function (menu) {
        // 智能定位，选择一个合适的对齐方式。
        var info = (0, dom_1.calculatePosition)('auto', menu.lastChild, menu.children[1], document.body);
        var align = info.positionLeft + 300 < window.innerWidth ? 'right' : 'left';
        this.setState({
            x: info.positionLeft,
            y: info.positionTop,
            align: align
        });
    };
    ContextMenu.prototype.handleSelfContextMenu = function (e) {
        e.preventDefault();
    };
    ContextMenu.prototype.renderMenus = function (menus) {
        var _this = this;
        var cx = this.props.classnames;
        return menus.map(function (item, index) {
            if (item === '|') {
                return react_1.default.createElement("li", { key: index, className: cx('ContextMenu-divider') });
            }
            var hasChildren = Array.isArray(item.children) && item.children.length;
            return (react_1.default.createElement("li", { key: "".concat(item.label, "-").concat(index), className: cx('ContextMenu-item', item.className, {
                    'has-child': hasChildren,
                    'is-disabled': item.disabled
                }) },
                react_1.default.createElement("a", { onClick: _this.handleClick.bind(_this, item), onMouseEnter: _this.handleMouseEnter.bind(_this, item), onMouseLeave: _this.handleMouseLeave.bind(_this, item) },
                    item.icon ? (react_1.default.createElement("span", { className: cx('ContextMenu-itemIcon', item.icon) })) : null,
                    item.label),
                hasChildren ? (react_1.default.createElement("ul", { className: cx('ContextMenu-subList') }, _this.renderMenus(item.children))) : null));
        });
    };
    ContextMenu.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, container = _a.container, cx = _a.classnames;
        return (react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, onEnter: this.handleEnter, in: this.state.isOpened, timeout: 500 }, function (status) { return (react_1.default.createElement("div", { ref: _this.menuRef, role: "contextmenu", className: cx('ContextMenu', {
                'ContextMenu--left': _this.state.align === 'left'
            }, className), onContextMenu: _this.handleSelfContextMenu },
            react_1.default.createElement("div", { className: cx("ContextMenu-overlay", fadeStyles[status]) }),
            react_1.default.createElement("div", { className: cx("ContextMenu-cursor"), style: { left: "".concat(_this.state.x, "px"), top: "".concat(_this.state.y, "px") } }),
            react_1.default.createElement("div", { style: { left: "".concat(_this.state.x, "px"), top: "".concat(_this.state.y, "px") }, className: cx("ContextMenu-menu", fadeStyles[status]) },
                react_1.default.createElement("ul", { className: cx('ContextMenu-list') }, _this.renderMenus(_this.state.menus))))); }));
    };
    var _b, _c, _d, _e, _f;
    ContextMenu.instance = null;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object, Function]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ContextMenu.prototype, "openContextMenus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ContextMenu.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Event !== "undefined" && Event) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ContextMenu.prototype, "handleOutClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof KeyboardEvent !== "undefined" && KeyboardEvent) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ContextMenu.prototype, "handleKeyDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ContextMenu.prototype, "handleEnter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _f : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ContextMenu.prototype, "handleSelfContextMenu", null);
    return ContextMenu;
}(react_1.default.Component));
exports.ContextMenu = ContextMenu;
exports.ThemedContextMenu = (0, theme_1.themeable)(ContextMenu);
exports.default = exports.ThemedContextMenu;
function openContextMenus(info, menus, onClose) {
    return ContextMenu.getInstance().openContextMenus(info, menus, onClose);
}
exports.openContextMenus = openContextMenus;
//# sourceMappingURL=./components/ContextMenu.js.map
