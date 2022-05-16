"use strict";
/**
 * @file Collapse
 * @description
 * @author fex
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collapse = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var helper_1 = require("../utils/helper");
var helper_2 = require("../utils/helper");
var collapseStyles = (_a = {},
    _a[Transition_1.EXITED] = 'out',
    _a[Transition_1.EXITING] = 'out',
    _a[Transition_1.ENTERING] = 'in',
    _a);
var Collapse = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Collapse, _super);
    function Collapse(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            collapsed: false
        };
        _this.contentRef = function (ref) { return (_this.contentDom = ref); };
        _this.toggleCollapsed = _this.toggleCollapsed.bind(_this);
        _this.state.collapsed = props.collapsable ? !!props.collapsed : false;
        return _this;
    }
    Collapse.getDerivedStateFromProps = function (nextProps, preState) {
        if (nextProps.propsUpdate && nextProps.collapsed !== preState.collapsed) {
            return {
                collapsed: !!nextProps.collapsed
            };
        }
        return null;
    };
    Collapse.prototype.toggleCollapsed = function (e) {
        if ((0, helper_2.isClickOnInput)(e)) {
            return;
        }
        var props = this.props;
        if (props.disabled || props.collapsable === false) {
            return;
        }
        props.onCollapse && props.onCollapse(props, !this.state.collapsed);
        this.setState({
            collapsed: !this.state.collapsed
        });
    };
    Collapse.prototype.handleEnter = function (elem) {
        elem.style['height'] = '';
    };
    Collapse.prototype.handleEntering = function (elem) {
        elem.style['height'] = "".concat(elem['scrollHeight'], "px");
    };
    Collapse.prototype.handleEntered = function (elem) {
        elem.style['height'] = '';
    };
    Collapse.prototype.handleExit = function (elem) {
        var offsetHeight = elem['offsetHeight'];
        var height = offsetHeight +
            parseInt(getComputedStyle(elem).getPropertyValue('margin-top'), 10) +
            parseInt(getComputedStyle(elem).getPropertyValue('margin-bottom'), 10);
        elem.style['height'] = "".concat(height, "px");
        // trigger browser reflow
        elem.offsetHeight;
    };
    Collapse.prototype.handleExiting = function (elem) {
        elem.style['height'] = '';
    };
    Collapse.prototype.render = function () {
        var _a;
        var _this = this;
        var _b;
        var _c = this.props, cx = _c.classnames, mountOnEnter = _c.mountOnEnter, unmountOnExit = _c.unmountOnExit, ns = _c.classPrefix, size = _c.size, WrapperComponent = _c.wrapperComponent, HeadingComponent = _c.headingComponent, className = _c.className, headingClassName = _c.headingClassName, headerPosition = _c.headerPosition, collapseHeader = _c.collapseHeader, header = _c.header, body = _c.body, bodyClassName = _c.bodyClassName, collapsable = _c.collapsable, __ = _c.translate, showArrow = _c.showArrow, expandIcon = _c.expandIcon, disabled = _c.disabled, children = _c.children;
        var finalHeader = this.state.collapsed
            ? header
            : collapseHeader || header;
        var dom = [
            finalHeader ? (react_1.default.createElement(HeadingComponent, { key: "header", onClick: this.toggleCollapsed, className: cx("Collapse-header", headingClassName) },
                showArrow && collapsable ? (expandIcon ? (react_1.default.cloneElement(expandIcon, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, expandIcon.props), { className: cx('Collapse-icon-tranform', (_b = expandIcon.props) === null || _b === void 0 ? void 0 : _b.className) }))) : (react_1.default.createElement("span", { className: cx('Collapse-arrow') }))) : (''),
                finalHeader)) : null,
            react_1.default.createElement(Transition_1.default, { key: "body", mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit, in: !this.state.collapsed, timeout: 300, onEnter: this.handleEnter, onEntering: this.handleEntering, onEntered: this.handleEntered, onExit: this.handleExit, onExiting: this.handleExiting }, function (status) {
                if (status === Transition_1.ENTERING) {
                    _this.contentDom.offsetWidth;
                }
                return (react_1.default.createElement("div", { className: cx('Collapse-contentWrapper', collapseStyles[status]), ref: _this.contentRef },
                    react_1.default.createElement("div", { className: cx('Collapse-body', bodyClassName) },
                        react_1.default.createElement("div", { className: cx('Collapse-content') }, body || children))));
            })
        ];
        if (headerPosition === 'bottom') {
            dom.reverse();
        }
        return (react_1.default.createElement(WrapperComponent, { className: cx("Collapse", (_a = {
                    'is-active': !this.state.collapsed
                },
                _a["Collapse--".concat(size)] = size,
                _a['Collapse--disabled'] = disabled,
                _a['Collapse--title-bottom'] = headerPosition === 'bottom',
                _a), className) }, dom));
    };
    var _b, _c, _d, _e, _f;
    Collapse.defaultProps = {
        mountOnEnter: false,
        unmountOnExit: false,
        headerPosition: 'top',
        wrapperComponent: 'div',
        headingComponent: 'div',
        className: '',
        headingClassName: '',
        bodyClassName: '',
        collapsable: true,
        disabled: false,
        showArrow: true,
        propsUpdate: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Collapse.prototype, "handleEnter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Collapse.prototype, "handleEntering", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Collapse.prototype, "handleEntered", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Collapse.prototype, "handleExit", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_f = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _f : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Collapse.prototype, "handleExiting", null);
    return Collapse;
}(react_1.default.Component));
exports.Collapse = Collapse;
exports.default = (0, theme_1.themeable)(Collapse);
//# sourceMappingURL=./components/Collapse.js.map
