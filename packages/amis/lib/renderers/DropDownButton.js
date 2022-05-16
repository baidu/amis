"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropDownButtonRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Overlay_1 = (0, tslib_1.__importDefault)(require("../components/Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../components/PopOver"));
var TooltipWrapper_1 = (0, tslib_1.__importDefault)(require("../components/TooltipWrapper"));
var helper_1 = require("../utils/helper");
var tpl_1 = require("../utils/tpl");
var icons_1 = require("../components/icons");
var RootClose_1 = require("../utils/RootClose");
var icon_1 = require("../utils/icon");
var DropDownButton = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DropDownButton, _super);
    function DropDownButton(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false
        };
        _this.open = _this.open.bind(_this);
        _this.close = _this.close.bind(_this);
        _this.toogle = _this.toogle.bind(_this);
        _this.keepOpen = _this.keepOpen.bind(_this);
        _this.domRef = _this.domRef.bind(_this);
        return _this;
    }
    DropDownButton.prototype.componentDidMount = function () {
        if (this.props.defaultIsOpened) {
            this.setState({
                isOpened: true
            });
        }
    };
    DropDownButton.prototype.domRef = function (ref) {
        this.target = ref;
    };
    DropDownButton.prototype.toogle = function (e) {
        e.preventDefault();
        this.setState({
            isOpened: !this.state.isOpened
        });
    };
    DropDownButton.prototype.open = function () {
        this.setState({
            isOpened: true
        });
    };
    DropDownButton.prototype.close = function () {
        var _this = this;
        this.timer = setTimeout(function () {
            _this.setState({
                isOpened: false
            });
        }, 200);
    };
    DropDownButton.prototype.keepOpen = function () {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    };
    DropDownButton.prototype.renderButton = function (button, index) {
        var _a;
        var _this = this;
        var _b = this.props, render = _b.render, cx = _b.classnames, data = _b.data;
        index = typeof index === 'number' ? index.toString() : index;
        if (typeof button !== 'string' && Array.isArray(button === null || button === void 0 ? void 0 : button.children)) {
            return (react_1.default.createElement("div", { key: index, className: cx('DropDown-menu') },
                react_1.default.createElement("li", { key: "".concat(index, "/0"), className: cx('DropDown-groupTitle') },
                    button.icon ? (0, icon_1.generateIcon)(cx, button.icon, 'm-r-xs') : null,
                    react_1.default.createElement("span", null, button.label)),
                button.children.map(function (child, childIndex) {
                    return _this.renderButton(child, "".concat(index, "/").concat(childIndex + 1));
                })));
        }
        if (typeof button !== 'string' && !(0, helper_1.isVisible)(button, data)) {
            return null;
        }
        else if (button === 'divider' || button.type === 'divider') {
            return react_1.default.createElement("li", { key: index, className: cx('DropDown-divider') });
        }
        else {
            return (react_1.default.createElement("li", { key: index, className: cx('DropDown-button', (_a = {},
                    _a['is-disabled'] = (0, helper_1.isDisabled)(button, data),
                    _a)) }, render("button/".concat(index), (0, tslib_1.__assign)((0, tslib_1.__assign)({ type: 'button' }, button), { isMenuItem: true }))));
        }
    };
    DropDownButton.prototype.renderOuter = function () {
        var _this = this;
        var _a;
        var _b = this.props, render = _b.render, buttons = _b.buttons, data = _b.data, popOverContainer = _b.popOverContainer, cx = _b.classnames, ns = _b.classPrefix, children = _b.children, align = _b.align, closeOnClick = _b.closeOnClick, closeOnOutside = _b.closeOnOutside, menuClassName = _b.menuClassName;
        var body = (react_1.default.createElement(RootClose_1.RootClose, { disabled: !this.state.isOpened, onRootClose: closeOnOutside !== false ? this.close : helper_1.noop }, function (ref) {
            return (react_1.default.createElement("ul", { className: cx('DropDown-menu-root', 'DropDown-menu', menuClassName), onClick: closeOnClick ? _this.close : helper_1.noop, onMouseEnter: _this.keepOpen, ref: ref }, children
                ? children
                : Array.isArray(buttons)
                    ? buttons.map(function (button, index) {
                        return _this.renderButton(button, index);
                    })
                    : null));
        }));
        if (popOverContainer) {
            return (react_1.default.createElement(Overlay_1.default, { container: popOverContainer, target: function () { return _this.target; }, show: true },
                react_1.default.createElement(PopOver_1.default, { overlay: true, onHide: this.close, classPrefix: ns, className: cx('DropDown-popover', menuClassName), style: { minWidth: (_a = this.target) === null || _a === void 0 ? void 0 : _a.offsetWidth } }, body)));
        }
        return body;
    };
    DropDownButton.prototype.render = function () {
        var _a = this.props, tooltip = _a.tooltip, placement = _a.placement, tooltipContainer = _a.tooltipContainer, tooltipTrigger = _a.tooltipTrigger, tooltipRootClose = _a.tooltipRootClose, disabledTip = _a.disabledTip, block = _a.block, disabled = _a.disabled, btnDisabled = _a.btnDisabled, btnClassName = _a.btnClassName, size = _a.size, label = _a.label, level = _a.level, primary = _a.primary, className = _a.className, cx = _a.classnames, align = _a.align, iconOnly = _a.iconOnly, icon = _a.icon, rightIcon = _a.rightIcon, isActived = _a.isActived, trigger = _a.trigger, data = _a.data, hideCaret = _a.hideCaret;
        var iconElement = (0, icon_1.generateIcon)(cx, icon, 'm-r-xs');
        var rightIconElement = (0, icon_1.generateIcon)(cx, rightIcon, 'm-l-xs');
        return (react_1.default.createElement("div", { className: cx('DropDown ', {
                'DropDown--block': block,
                'DropDown--alignRight': align === 'right',
                'is-opened': this.state.isOpened,
                'is-actived': isActived
            }, className), onMouseEnter: trigger === 'hover' ? this.open : function () { }, onMouseLeave: trigger === 'hover' ? this.close : function () { }, ref: this.domRef },
            react_1.default.createElement(TooltipWrapper_1.default, { placement: placement, tooltip: disabled ? disabledTip : tooltip, container: tooltipContainer, trigger: tooltipTrigger, rootClose: tooltipRootClose },
                react_1.default.createElement("button", { onClick: this.toogle, disabled: disabled || btnDisabled, className: cx('Button', btnClassName, typeof level === 'undefined'
                        ? 'Button--default'
                        : level
                            ? "Button--".concat(level)
                            : '', {
                        'Button--block': block,
                        'Button--primary': primary,
                        'Button--iconOnly': iconOnly
                    }, size ? "Button--".concat(size) : '') },
                    iconElement,
                    typeof label === 'string' ? (0, tpl_1.filter)(label, data) : label,
                    rightIconElement,
                    !hideCaret ? (react_1.default.createElement("span", { className: cx('DropDown-caret') },
                        react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null)),
            this.state.isOpened ? this.renderOuter() : null));
    };
    DropDownButton.defaultProps = {
        placement: 'top',
        tooltipTrigger: ['hover', 'focus'],
        tooltipRootClose: false
    };
    return DropDownButton;
}(react_1.default.Component));
exports.default = DropDownButton;
var DropDownButtonRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DropDownButtonRenderer, _super);
    function DropDownButtonRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropDownButtonRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'dropdown-button'
        })
    ], DropDownButtonRenderer);
    return DropDownButtonRenderer;
}(DropDownButton));
exports.DropDownButtonRenderer = DropDownButtonRenderer;
//# sourceMappingURL=./renderers/DropDownButton.js.map
