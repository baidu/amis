"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultList = void 0;
var tslib_1 = require("tslib");
/**
 * 用来显示选择结果，垂直显示。支持移出、排序等操作。
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var icons_1 = require("./icons");
var helper_1 = require("../utils/helper");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var react_dom_1 = require("react-dom");
var locale_1 = require("../locale");
var ResultList = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ResultList, _super);
    function ResultList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = (0, helper_1.guid)();
        return _this;
    }
    ResultList.itemRender = function (option) {
        return react_1.default.createElement("span", null, "".concat(option.scopeLabel || '').concat(option.label));
    };
    ResultList.prototype.componentDidMount = function () {
        this.props.sortable && this.initSortable();
    };
    ResultList.prototype.componentDidUpdate = function () {
        if (this.props.sortable) {
            this.sortable || this.initSortable();
        }
        else {
            this.desposeSortable();
        }
    };
    ResultList.prototype.componentWillUnmount = function () {
        this.desposeSortable();
    };
    ResultList.prototype.handleRemove = function (e) {
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var _a = this.props, value = _a.value, onChange = _a.onChange;
        if (!Array.isArray(value)) {
            return;
        }
        var newValue = value.concat();
        newValue.splice(index, 1);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    ResultList.prototype.initSortable = function () {
        var _this = this;
        var ns = this.props.classPrefix;
        var dom = (0, react_dom_1.findDOMNode)(this);
        var container = dom.querySelector(".".concat(ns, "Selections-items"));
        if (!container) {
            return;
        }
        this.sortable = new sortablejs_1.default(container, {
            group: "selections-".concat(this.id),
            animation: 150,
            handle: ".".concat(ns, "Selections-dragbar"),
            ghostClass: "".concat(ns, "Selections-item--dragging"),
            onEnd: function (e) {
                var _a, _b;
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                // 换回来
                var parent = e.to;
                if (e.newIndex < e.oldIndex &&
                    e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
                }
                else if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                var value = _this.props.value;
                if (!Array.isArray(value)) {
                    return;
                }
                var newValue = value.concat();
                newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
                (_b = (_a = _this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, newValue);
            }
        });
    };
    ResultList.prototype.desposeSortable = function () {
        var _a;
        (_a = this.sortable) === null || _a === void 0 ? void 0 : _a.destroy();
        delete this.sortable;
    };
    ResultList.prototype.handleValueChange = function (index, value, name) {
        var _a;
        if (typeof name !== 'string') {
            return;
        }
        var _b = this.props, list = _b.value, onChange = _b.onChange;
        var result = Array.isArray(list) ? list.concat() : [];
        if (!result[index]) {
            return;
        }
        result.splice(index, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, result[index]), (_a = {}, _a[name] = value, _a)));
        onChange === null || onChange === void 0 ? void 0 : onChange(result, true);
    };
    ResultList.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, className = _a.className, value = _a.value, placeholder = _a.placeholder, itemRender = _a.itemRender, disabled = _a.disabled, title = _a.title, itemClassName = _a.itemClassName, sortable = _a.sortable, __ = _a.translate;
        return (react_1.default.createElement("div", { className: cx('Selections', className) },
            title ? react_1.default.createElement("div", { className: cx('Selections-title') }, title) : null,
            Array.isArray(value) && value.length ? (react_1.default.createElement("div", { className: cx('Selections-items') }, value.map(function (option, index) { return (react_1.default.createElement("div", { className: cx('Selections-item', itemClassName, option === null || option === void 0 ? void 0 : option.className), key: index },
                sortable && !disabled && value.length > 1 ? (react_1.default.createElement(icons_1.Icon, { className: cx('Selections-dragbar icon'), icon: "drag-bar" })) : null,
                react_1.default.createElement("label", null, itemRender(option, {
                    index: index,
                    disabled: disabled,
                    onChange: _this.handleValueChange.bind(_this, index)
                })),
                !disabled ? (react_1.default.createElement("a", { className: cx('Selections-delBtn'), "data-index": index, onClick: _this.handleRemove },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null)); }))) : (react_1.default.createElement("div", { className: cx('Selections-placeholder') }, __(placeholder)))));
    };
    var _a;
    ResultList.defaultProps = {
        placeholder: 'placeholder.selectData',
        itemRender: ResultList.itemRender
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ResultList.prototype, "handleRemove", null);
    return ResultList;
}(react_1.default.Component));
exports.ResultList = ResultList;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(ResultList));
//# sourceMappingURL=./components/ResultList.js.map
