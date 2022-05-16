"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file Picker
 * @description 移动端列滚动选择器
 */
var react_1 = tslib_1.__importStar(require("react"));
var uncontrollable_1 = require("uncontrollable");
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var PickerColumn_1 = (0, tslib_1.__importDefault)(require("./PickerColumn"));
function fixToArray(data) {
    if (!Array.isArray(data)) {
        return [data];
    }
    return data;
}
var Picker = (0, react_1.memo)(function (props) {
    var title = props.title, labelField = props.labelField, valueField = props.valueField, _a = props.visibleItemCount, visibleItemCount = _a === void 0 ? 5 : _a, _b = props.value, value = _b === void 0 ? [] : _b, _c = props.swipeDuration, swipeDuration = _c === void 0 ? 1000 : _c, _d = props.columns, columns = _d === void 0 ? [] : _d, _e = props.itemHeight, itemHeight = _e === void 0 ? 48 : _e, _f = props.showToolbar, showToolbar = _f === void 0 ? true : _f, _g = props.className, className = _g === void 0 ? '' : _g, cx = props.classnames, ns = props.classPrefix, __ = props.translate;
    var _columns = fixToArray(columns);
    var _h = (0, react_1.useState)(fixToArray(props.value === undefined ? props.defaultValue || [] : value)), innerValue = _h[0], setInnerValue = _h[1];
    (0, react_1.useEffect)(function () {
        if (value === innerValue)
            return;
        setInnerValue(fixToArray(value));
    }, [value]);
    var close = function () {
        if (props.onClose) {
            props.onClose(innerValue);
        }
    };
    var confirm = function () {
        if (props.onConfirm) {
            props.onConfirm(innerValue);
        }
    };
    var onChange = function (itemValue, columnIndex, confirm) {
        var nextInnerValue = (0, tslib_1.__spreadArray)([], innerValue, true);
        nextInnerValue[columnIndex] = itemValue;
        setInnerValue(nextInnerValue);
        if (props.onChange) {
            props.onChange(nextInnerValue, columnIndex, confirm);
        }
    };
    var renderColumnItem = function (item, index) {
        return (react_1.default.createElement(PickerColumn_1.default, (0, tslib_1.__assign)({}, item, { classnames: cx, classPrefix: ns, labelField: labelField || item.labelField, valueField: valueField || item.valueField, itemHeight: itemHeight, swipeDuration: swipeDuration, visibleItemCount: visibleItemCount, value: innerValue[index], onChange: function (val, i, confirm) {
                onChange(val, index, confirm);
            }, key: "column".concat(index) })));
    };
    var wrapHeight = itemHeight * +visibleItemCount;
    var frameStyle = { height: "".concat(itemHeight, "px") };
    var columnsStyle = { height: "".concat(wrapHeight, "px") };
    var maskStyle = {
        backgroundSize: "100% ".concat((wrapHeight - itemHeight) / 2, "px")
    };
    var hasHeader = showToolbar || title;
    return (react_1.default.createElement("div", { className: cx(className, 'PickerColumns', 'PickerColumns-popOver') },
        hasHeader && (react_1.default.createElement("div", { className: cx('PickerColumns-header') },
            showToolbar && (react_1.default.createElement(Button_1.default, { className: "PickerColumns-cancel", level: "default", onClick: close }, __('cancel'))),
            title && (react_1.default.createElement("div", { className: cx('PickerColumns-title') }, title)),
            showToolbar && (react_1.default.createElement(Button_1.default, { className: "PickerColumns-confirm", level: "primary", onClick: confirm }, __('confirm'))))),
        react_1.default.createElement("div", { className: cx('PickerColumns-columns'), style: columnsStyle },
            _columns.map(function (column, index) {
                return renderColumnItem(column, index);
            }),
            react_1.default.createElement("div", { className: cx('PickerColumns-mask'), style: maskStyle }),
            react_1.default.createElement("div", { className: cx('PickerColumns-frame'), style: frameStyle }))));
});
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(Picker, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/Picker.js.map
