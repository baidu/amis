"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card2Renderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var components_1 = require("../components");
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var style_1 = require("../utils/style");
var Card2 = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Card2, _super);
    function Card2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Card2.prototype.handleClick = function (e) {
        var _a = this.props, checkOnItemClick = _a.checkOnItemClick, selectable = _a.selectable;
        // 控制选中
        if (checkOnItemClick && selectable) {
            this.handleCheck();
        }
        // TODO 触发事件动作
    };
    Card2.prototype.handleCheck = function () {
        var _a = this.props, item = _a.item, selected = _a.selected;
        this.props.onCheck && this.props.onCheck(!selected, item);
    };
    Card2.prototype.renderCheckbox = function () {
        var _a = this.props, selectable = _a.selectable, cx = _a.classnames, multiple = _a.multiple, disabled = _a.disabled, selected = _a.selected, hideCheckToggler = _a.hideCheckToggler, checkOnItemClick = _a.checkOnItemClick, checkboxClassname = _a.checkboxClassname;
        if (!selectable || (checkOnItemClick && hideCheckToggler)) {
            return null;
        }
        return (react_1.default.createElement(components_1.Checkbox, { className: cx('Card2-checkbox', checkboxClassname), type: multiple ? 'checkbox' : 'radio', disabled: disabled, checked: selected, onChange: this.handleCheck }));
    };
    /**
     * 渲染内容区
     */
    Card2.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, render = _a.render, cx = _a.classnames, bodyClassName = _a.bodyClassName, rest = (0, tslib_1.__rest)(_a, ["body", "render", "classnames", "bodyClassName"]);
        return (react_1.default.createElement("div", { className: cx('Card2-body', bodyClassName), onClick: this.handleClick }, body ? render('body', body, rest) : null));
    };
    Card2.prototype.render = function () {
        var _a = this.props, className = _a.className, wrapperComponent = _a.wrapperComponent, cx = _a.classnames, style = _a.style, item = _a.item, selected = _a.selected, checkOnItemClick = _a.checkOnItemClick;
        var Component = wrapperComponent || 'div';
        return (react_1.default.createElement(Component, { className: cx('Card2', className, {
                'checkOnItem': checkOnItemClick,
                'is-checked': selected
            }), style: (0, style_1.buildStyle)(style, item) },
            this.renderBody(),
            this.renderCheckbox()));
    };
    var _a;
    Card2.propsList = ['body', 'className'];
    Card2.defaultProps = {
        className: ''
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Card2.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Card2.prototype, "handleCheck", null);
    return Card2;
}(react_1.default.Component));
exports.default = Card2;
var Card2Renderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Card2Renderer, _super);
    function Card2Renderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Card2Renderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'card2'
        })
    ], Card2Renderer);
    return Card2Renderer;
}(Card2));
exports.Card2Renderer = Card2Renderer;
//# sourceMappingURL=./renderers/Card2.js.map
