"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var cloneDeep_1 = (0, tslib_1.__importDefault)(require("lodash/cloneDeep"));
var Overlay_1 = (0, tslib_1.__importDefault)(require("../../components/Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../../components/PopOver"));
var Modal_1 = (0, tslib_1.__importDefault)(require("../../components/Modal"));
var Button_1 = (0, tslib_1.__importDefault)(require("../../components/Button"));
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("../../components/TooltipWrapper"));
var helper_1 = require("../../utils/helper");
var tpl_1 = require("../../utils/tpl");
var icons_1 = require("../../components/icons");
var icons_2 = require("../../components/icons");
var icon_1 = require("../../utils/icon");
var RootClose_1 = require("../../utils/RootClose");
var ColumnToggler = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ColumnToggler, _super);
    function ColumnToggler(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            enableSorting: false,
            tempColumns: (0, cloneDeep_1.default)(_this.props.columns)
        };
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.toggle = _this.toggle.bind(_this);
        _this.domRef = _this.domRef.bind(_this);
        _this.dragRef = _this.dragRef.bind(_this);
        return _this;
    }
    ColumnToggler.prototype.componentDidMount = function () {
        if (this.props.defaultIsOpened) {
            this.setState({
                isOpened: true
            });
        }
    };
    ColumnToggler.prototype.componentDidUpdate = function (prevProps) {
        if ((0, helper_1.anyChanged)('activeToggaleColumns', prevProps, this.props)) {
            this.setState({ tempColumns: this.props.columns });
        }
    };
    ColumnToggler.prototype.componentWillUnmount = function () {
        this.destroyDragging();
    };
    ColumnToggler.prototype.domRef = function (ref) {
        this.target = ref;
    };
    ColumnToggler.prototype.toggle = function (e) {
        e.preventDefault();
        this.setState({
            isOpened: !this.state.isOpened
        });
    };
    ColumnToggler.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    ColumnToggler.prototype.close = function () {
        this.setState({
            isOpened: false,
            enableSorting: false,
            tempColumns: (0, cloneDeep_1.default)(this.props.columns)
        });
    };
    ColumnToggler.prototype.swapColumnPosition = function (oldIndex, newIndex) {
        var columns = this.state.tempColumns;
        columns[oldIndex] = columns.splice(newIndex, 1, columns[oldIndex])[0];
        this.setState({ tempColumns: columns });
    };
    ColumnToggler.prototype.updateToggledColumn = function (column, index, value, shift) {
        var tempColumns = this.state.tempColumns.concat();
        tempColumns.splice(index, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { toggled: value }));
        this.setState({ tempColumns: tempColumns });
    };
    ColumnToggler.prototype.dragRef = function (ref) {
        var enableSorting = this.state.enableSorting;
        var draggable = this.props.draggable;
        if (enableSorting && draggable && ref) {
            this.initDragging();
        }
    };
    ColumnToggler.prototype.initDragging = function () {
        var _this = this;
        var dom = (0, react_dom_1.findDOMNode)(this);
        var ns = this.props.classPrefix;
        this.sortable = new sortablejs_1.default(dom.querySelector(".".concat(ns, "ColumnToggler-modal-content")), {
            group: "ColumnToggler-modal-content",
            animation: 150,
            handle: ".".concat(ns, "ColumnToggler-menuItem-dragBar"),
            ghostClass: "".concat(ns, "ColumnToggler-menuItem--dragging"),
            onEnd: function (e) {
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
                _this.swapColumnPosition(e.oldIndex, e.newIndex);
            }
        });
    };
    ColumnToggler.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    ColumnToggler.prototype.onConfirm = function () {
        var tempColumns = this.state.tempColumns;
        var onColumnToggle = this.props.onColumnToggle;
        onColumnToggle && onColumnToggle((0, tslib_1.__spreadArray)([], tempColumns, true));
        this.setState({
            isOpened: false,
            enableSorting: false
        });
    };
    ColumnToggler.prototype.renderOuter = function () {
        var _this = this;
        var _a;
        var _b = this.props, popOverContainer = _b.popOverContainer, cx = _b.classnames, ns = _b.classPrefix, children = _b.children, closeOnClick = _b.closeOnClick, closeOnOutside = _b.closeOnOutside;
        var body = (react_1.default.createElement(RootClose_1.RootClose, { disabled: !this.state.isOpened, onRootClose: closeOnOutside !== false ? this.close : helper_1.noop }, function (ref) {
            return (react_1.default.createElement("ul", { className: cx('ColumnToggler-menu'), onClick: closeOnClick ? _this.close : helper_1.noop, ref: ref }, children));
        }));
        if (popOverContainer) {
            return (react_1.default.createElement(Overlay_1.default, { container: popOverContainer, target: function () { return _this.target; }, show: true },
                react_1.default.createElement(PopOver_1.default, { overlay: true, onHide: this.close, classPrefix: ns, className: cx('ColumnToggler-popover'), style: { minWidth: (_a = this.target) === null || _a === void 0 ? void 0 : _a.offsetWidth } }, body)));
        }
        return body;
    };
    ColumnToggler.prototype.renderModal = function () {
        var _this = this;
        var _a = this.props, render = _a.render, cx = _a.classnames, ns = _a.classPrefix, modalContainer = _a.modalContainer, draggable = _a.draggable, overlay = _a.overlay, __ = _a.translate, footerBtnSize = _a.footerBtnSize;
        var _b = this.state, enableSorting = _b.enableSorting, tempColumns = _b.tempColumns;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Modal_1.default, { closeOnEsc: true, onHide: this.close, show: this.state.isOpened, contentClassName: cx('ColumnToggler-modal'), container: modalContainer || this.target, overlay: typeof overlay === 'boolean' ? overlay : false },
                react_1.default.createElement("header", { className: cx('ColumnToggler-modal-header') },
                    react_1.default.createElement("span", { className: cx('ColumnToggler-modal-title') }, __('Table.columnsVisibility')),
                    react_1.default.createElement("a", { "data-tooltip": __('Dialog.close'), "data-position": "left", className: cx('Modal-close'), onClick: this.close },
                        react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))),
                react_1.default.createElement("ul", { className: cx('ColumnToggler-modal-content'), ref: this.dragRef }, Array.isArray(tempColumns)
                    ? tempColumns.map(function (column, index) { return (react_1.default.createElement(TooltipWrapper_1.default, { tooltipClassName: cx('ColumnToggler-tooltip'), placement: "top", tooltip: column.label || '', trigger: enableSorting ? [] : 'hover', key: column.index },
                        react_1.default.createElement("li", { className: cx('ColumnToggler-menuItem'), key: column.index }, enableSorting && draggable && tempColumns.length > 1 ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("a", { className: cx('ColumnToggler-menuItem-dragBar') },
                                react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: cx('icon') })),
                            react_1.default.createElement("span", { className: cx('ColumnToggler-menuItem-label') },
                                react_1.default.createElement("span", null, column.label || '-')))) : (react_1.default.createElement(Checkbox_1.default, { size: "sm", labelClassName: cx('ColumnToggler-menuItem-label'), classPrefix: ns, checked: column.toggled, disabled: !column.toggable || enableSorting, onChange: _this.updateToggledColumn.bind(_this, column, index) },
                            react_1.default.createElement("span", null, column.label || '-')))))); })
                    : null),
                react_1.default.createElement("footer", { className: cx('ColumnToggler-modal-footer') },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(Button_1.default, { className: cx("ColumnToggler-modeSelect", {
                                'is-actived': !enableSorting
                            }), onClick: function () { return _this.setState({ enableSorting: false }); }, level: "link" }, __('Table.toggleColumn')),
                        react_1.default.createElement(Button_1.default, { className: cx("ColumnToggler-modeSelect", {
                                'is-actived': enableSorting
                            }), onClick: function () {
                                return _this.setState({ enableSorting: true }, function () {
                                    return _this.state.enableSorting &&
                                        _this.props.draggable &&
                                        _this.initDragging();
                                });
                            }, level: "link", disabled: tempColumns.length < 2 }, __('sort'))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(Button_1.default, { size: footerBtnSize, className: "mr-3", onClick: this.close }, __('cancel')),
                        react_1.default.createElement(Button_1.default, { size: footerBtnSize, level: "primary", onClick: this.onConfirm }, __('confirm')))))));
    };
    ColumnToggler.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, placement = _a.placement, tooltipContainer = _a.tooltipContainer, tooltipTrigger = _a.tooltipTrigger, tooltipRootClose = _a.tooltipRootClose, disabledTip = _a.disabledTip, block = _a.block, disabled = _a.disabled, btnDisabled = _a.btnDisabled, btnClassName = _a.btnClassName, size = _a.size, label = _a.label, level = _a.level, primary = _a.primary, className = _a.className, cx = _a.classnames, align = _a.align, iconOnly = _a.iconOnly, icon = _a.icon, isActived = _a.isActived, data = _a.data, draggable = _a.draggable, hideExpandIcon = _a.hideExpandIcon;
        var button = (react_1.default.createElement("button", { onClick: this.toggle, disabled: disabled || btnDisabled, className: cx('Button', btnClassName, typeof level === 'undefined'
                ? 'Button--default'
                : level
                    ? "Button--".concat(level)
                    : '', {
                'Button--block': block,
                'Button--primary': primary,
                'Button--iconOnly': iconOnly
            }, size ? "Button--".concat(size) : '') },
            icon ? (typeof icon === 'string' ? ((0, icons_2.getIcon)(icon) ? (react_1.default.createElement(icons_1.Icon, { icon: icon, className: cx('icon', { 'm-r-xs': !!label }) })) : ((0, icon_1.generateIcon)(cx, icon, label ? 'm-r-xs' : ''))) : react_1.default.isValidElement(icon) ? (react_1.default.cloneElement(icon, {
                className: cx({ 'm-r-xs': !!label })
            })) : (react_1.default.createElement(icons_1.Icon, { icon: "columns", className: "icon m-r-none" }))) : (react_1.default.createElement(icons_1.Icon, { icon: "columns", className: "icon m-r-none" })),
            typeof label === 'string' ? (0, tpl_1.filter)(label, data) : label,
            hideExpandIcon || draggable ? null : (react_1.default.createElement("span", { className: cx('ColumnToggler-caret') },
                react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" })))));
        return (react_1.default.createElement("div", { className: cx('ColumnToggler', {
                'ColumnToggler-block': block,
                'ColumnToggler--alignRight': align === 'right',
                'is-opened': this.state.isOpened,
                'is-actived': isActived
            }, className), ref: this.domRef },
            draggable ? (button) : (react_1.default.createElement(TooltipWrapper_1.default, { placement: placement, tooltip: disabled ? disabledTip : tooltip, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose }, button)),
            this.state.isOpened
                ? draggable
                    ? this.renderModal()
                    : this.renderOuter()
                : null));
    };
    ColumnToggler.defaultProps = {
        placement: 'top',
        tooltipTrigger: ['hover', 'focus'],
        tooltipRootClose: false,
        draggable: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ColumnToggler.prototype, "dragRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ColumnToggler.prototype, "onConfirm", null);
    return ColumnToggler;
}(react_1.default.Component));
exports.default = ColumnToggler;
//# sourceMappingURL=./renderers/Table/ColumnToggler.js.map
