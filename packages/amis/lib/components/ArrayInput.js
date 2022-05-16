"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayInput = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var InputBox_1 = (0, tslib_1.__importDefault)(require("./InputBox"));
var icons_1 = require("./icons");
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var helper_1 = require("../utils/helper");
var uncontrollable_1 = require("uncontrollable");
var sortablejs_1 = (0, tslib_1.__importDefault)(require("sortablejs"));
var react_dom_1 = require("react-dom");
var ArrayInput = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ArrayInput, _super);
    function ArrayInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = (0, helper_1.guid)();
        return _this;
    }
    ArrayInput.prototype.handleItemOnChange = function (index, itemValue) {
        var onChange = this.props.onChange;
        var value = this.props.value;
        var newValue = Array.isArray(value) ? value.concat() : [];
        newValue.splice(index, 1, itemValue);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    ArrayInput.prototype.dragTipRef = function (ref) {
        if (!this.dragTip && ref) {
            this.initDragging();
        }
        else if (this.dragTip && !ref) {
            this.destroyDragging();
        }
        this.dragTip = ref;
    };
    ArrayInput.prototype.handleAdd = function () {
        var _a = this.props, value = _a.value, onChange = _a.onChange, itemInitalValue = _a.itemInitalValue;
        var newValue = Array.isArray(value) ? value.concat() : [];
        newValue.push(itemInitalValue);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    ArrayInput.prototype.handleRemove = function (e) {
        var indx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var _a = this.props, value = _a.value, onChange = _a.onChange, itemInitalValue = _a.itemInitalValue;
        var newValue = Array.isArray(value) ? value.concat() : [];
        newValue.splice(indx, 1);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    ArrayInput.prototype.initDragging = function () {
        var _this = this;
        var onChange = this.props.onChange;
        var ns = this.props.classPrefix;
        var dom = (0, react_dom_1.findDOMNode)(this);
        this.sortable = new sortablejs_1.default(dom.querySelector(".drag-group"), {
            group: "array-input-".concat(this.id),
            animation: 150,
            handle: ".drag-bar",
            ghostClass: "".concat(ns, "ArrayInput-item--dragging"),
            onEnd: function (e) {
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
                onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
            }
        });
    };
    ArrayInput.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    ArrayInput.prototype.renderItem = function (value, index, collection) {
        var _a = this.props, itemRender = _a.itemRender, disabled = _a.disabled, cx = _a.classnames, sortable = _a.sortable, removable = _a.removable, minLength = _a.minLength;
        return (react_1.default.createElement("div", { className: cx('ArrayInput-item'), key: index },
            sortable && collection.length > 1 && !disabled ? (react_1.default.createElement("a", { className: cx('ArrayInput-itemDrager drag-bar') },
                react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))) : null,
            itemRender({
                value: value,
                onChange: this.handleItemOnChange.bind(this, index),
                index: index,
                disabled: disabled
            }),
            removable !== false &&
                !disabled &&
                (!minLength || collection.length > minLength) ? (react_1.default.createElement("a", { "data-index": index, className: cx('ArrayInput-itemRemove'), onClick: this.handleRemove },
                react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" }))) : null));
    };
    ArrayInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, value = _a.value, placeholder = _a.placeholder, __ = _a.translate, maxLength = _a.maxLength, sortable = _a.sortable, sortTip = _a.sortTip, disabled = _a.disabled;
        return (react_1.default.createElement("div", { className: cx('ArrayInput') },
            Array.isArray(value) && value.length ? (react_1.default.createElement("div", { className: cx('ArrayInput-items drag-group') }, value.map(function (item, index) { return _this.renderItem(item, index, value); }))) : (react_1.default.createElement("div", { className: cx('ArrayInput-placeholder') }, __(placeholder))),
            react_1.default.createElement("div", { className: cx('ArrayInput-toolbar', sortable && Array.isArray(value) && value.length > 1
                    ? 'ArrayInput-toolbar--dnd'
                    : '') },
                !Array.isArray(value) || !maxLength || value.length < maxLength ? (react_1.default.createElement(Button_1.default, { className: cx('ArrayInput-addBtn'), onClick: this.handleAdd, level: "", disabled: disabled },
                    react_1.default.createElement(icons_1.Icon, { icon: "plus", className: "icon" }),
                    react_1.default.createElement("span", null, __('Combo.add')))) : null,
                sortable && Array.isArray(value) && value.length ? (react_1.default.createElement("span", { className: cx("ArrayInput-sortTip"), ref: this.dragTipRef }, Array.isArray(value) && value.length > 1 ? __(sortTip) : '')) : null)));
    };
    var _a;
    ArrayInput.defaultProps = {
        placeholder: 'empty',
        itemRender: function (_a) {
            var value = _a.value, onChange = _a.onChange;
            return react_1.default.createElement(InputBox_1.default, { value: value, onChange: onChange });
        }
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ArrayInput.prototype, "dragTipRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ArrayInput.prototype, "handleAdd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ArrayInput.prototype, "handleRemove", null);
    return ArrayInput;
}(react_1.default.Component));
exports.ArrayInput = ArrayInput;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(ArrayInput, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/ArrayInput.js.map
