"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var react_dom_1 = require("react-dom");
var resize_sensor_1 = require("../utils/resize-sensor");
var Panel = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Panel, _super);
    function Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.affixDom = react_1.default.createRef();
        _this.footerDom = react_1.default.createRef();
        return _this;
    }
    Panel.prototype.componentDidMount = function () {
        var dom = (0, react_dom_1.findDOMNode)(this);
        var parent = dom ? (0, helper_1.getScrollParent)(dom) : null;
        if (!parent || parent === document.body) {
            parent = window;
        }
        this.parentNode = parent;
        parent.addEventListener('scroll', this.affixDetect);
        this.unSensor = (0, resize_sensor_1.resizeSensor)(dom, this.affixDetect);
        this.affixDetect();
    };
    Panel.prototype.componentWillUnmount = function () {
        var parent = this.parentNode;
        parent && parent.removeEventListener('scroll', this.affixDetect);
        this.unSensor && this.unSensor();
        clearTimeout(this.timer);
    };
    Panel.prototype.affixDetect = function () {
        var _a, _b;
        if (!this.props.affixFooter ||
            !this.affixDom.current ||
            !this.footerDom.current) {
            return;
        }
        var affixDom = this.affixDom.current;
        var footerDom = this.footerDom.current;
        var offsetBottom = (_b = (_a = this.props.affixOffsetBottom) !== null && _a !== void 0 ? _a : this.props.env.affixOffsetBottom) !== null && _b !== void 0 ? _b : 0;
        var affixed = false;
        if (footerDom.offsetWidth) {
            affixDom.style.cssText = "bottom: ".concat(offsetBottom, "px;width: ").concat(footerDom.offsetWidth, "px");
        }
        else {
            this.timer = setTimeout(this.affixDetect, 250);
            return;
        }
        if (this.props.affixFooter === 'always') {
            affixed = true;
            footerDom.classList.add('invisible2');
        }
        else {
            var clip = footerDom.getBoundingClientRect();
            var clientHeight = window.innerHeight;
            // affixed = clip.top + clip.height / 2 > clientHeight;
            affixed = clip.bottom > clientHeight - offsetBottom;
        }
        affixed ? affixDom.classList.add('in') : affixDom.classList.remove('in');
    };
    Panel.prototype.renderBody = function () {
        var _a = this.props, type = _a.type, className = _a.className, data = _a.data, header = _a.header, body = _a.body, render = _a.render, bodyClassName = _a.bodyClassName, headerClassName = _a.headerClassName, actionsClassName = _a.actionsClassName, footerClassName = _a.footerClassName, children = _a.children, title = _a.title, actions = _a.actions, footer = _a.footer, ns = _a.classPrefix, formMode = _a.formMode, formHorizontal = _a.formHorizontal, subFormMode = _a.subFormMode, subFormHorizontal = _a.subFormHorizontal, rest = (0, tslib_1.__rest)(_a, ["type", "className", "data", "header", "body", "render", "bodyClassName", "headerClassName", "actionsClassName", "footerClassName", "children", "title", "actions", "footer", "classPrefix", "formMode", "formHorizontal", "subFormMode", "subFormHorizontal"]);
        var subProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({ data: data }, rest), { formMode: subFormMode || formMode, formHorizontal: subFormHorizontal || formHorizontal });
        return children
            ? typeof children === 'function'
                ? children(this.props)
                : children
            : body
                ? render('body', body, subProps)
                : null;
    };
    Panel.prototype.renderActions = function () {
        var _a = this.props, actions = _a.actions, render = _a.render;
        if (Array.isArray(actions) && actions.length) {
            return actions.map(function (action, key) {
                return render('action', action, {
                    type: action.type || 'button',
                    key: key
                });
            });
        }
        return null;
    };
    Panel.prototype.render = function () {
        var _a = this.props, type = _a.type, className = _a.className, data = _a.data, header = _a.header, body = _a.body, render = _a.render, bodyClassName = _a.bodyClassName, headerClassName = _a.headerClassName, actionsClassName = _a.actionsClassName, footerClassName = _a.footerClassName, footerWrapClassName = _a.footerWrapClassName, children = _a.children, title = _a.title, footer = _a.footer, affixFooter = _a.affixFooter, ns = _a.classPrefix, cx = _a.classnames, rest = (0, tslib_1.__rest)(_a, ["type", "className", "data", "header", "body", "render", "bodyClassName", "headerClassName", "actionsClassName", "footerClassName", "footerWrapClassName", "children", "title", "footer", "affixFooter", "classPrefix", "classnames"]);
        var subProps = (0, tslib_1.__assign)({ data: data }, rest);
        var footerDoms = [];
        var actions = this.renderActions();
        actions &&
            footerDoms.push(react_1.default.createElement("div", { key: "actions", className: cx("Panel-btnToolbar", actionsClassName || "Panel-footer") }, actions));
        footer &&
            footerDoms.push(react_1.default.createElement("div", { key: "footer", className: cx(footerClassName || "Panel-footer") }, render('footer', footer, subProps)));
        var footerDom = footerDoms.length ? (react_1.default.createElement("div", { className: cx('Panel-footerWrap', footerWrapClassName), ref: this.footerDom }, footerDoms)) : null;
        return (react_1.default.createElement("div", { className: cx("Panel", className || "Panel--default") },
            header ? (react_1.default.createElement("div", { className: cx(headerClassName || "Panel-heading") }, render('header', header, subProps))) : title ? (react_1.default.createElement("div", { className: cx(headerClassName || "Panel-heading") },
                react_1.default.createElement("h3", { className: cx("Panel-title") }, render('title', title, subProps)))) : null,
            react_1.default.createElement("div", { className: bodyClassName || "".concat(ns, "Panel-body") }, this.renderBody()),
            footerDom,
            affixFooter && footerDoms.length ? (react_1.default.createElement("div", { ref: this.affixDom, className: cx('Panel-fixedBottom Panel-footerWrap', footerWrapClassName) }, footerDoms)) : null));
    };
    Panel.propsList = [
        'header',
        'actions',
        'children',
        'headerClassName',
        'footerClassName',
        'footerWrapClassName',
        'actionsClassName',
        'bodyClassName'
    ];
    Panel.defaultProps = {
    // className: 'Panel--default',
    // headerClassName: 'Panel-heading',
    // footerClassName: 'Panel-footer bg-light lter Wrapper',
    // actionsClassName: 'Panel-footer',
    // bodyClassName: 'Panel-body'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Panel.prototype, "affixDetect", null);
    return Panel;
}(react_1.default.Component));
exports.default = Panel;
var PanelRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PanelRenderer, _super);
    function PanelRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PanelRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'panel'
        })
    ], PanelRenderer);
    return PanelRenderer;
}(Panel));
exports.PanelRenderer = PanelRenderer;
//# sourceMappingURL=./renderers/Panel.js.map
