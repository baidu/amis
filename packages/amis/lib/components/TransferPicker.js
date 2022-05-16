"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferPicker = void 0;
var tslib_1 = require("tslib");
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var Transfer_1 = (0, tslib_1.__importDefault)(require("./Transfer"));
var uncontrollable_1 = require("uncontrollable");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var ResultBox_1 = (0, tslib_1.__importDefault)(require("./ResultBox"));
var icons_1 = require("./icons");
var PickerContainer_1 = (0, tslib_1.__importDefault)(require("./PickerContainer"));
var helper_1 = require("../utils/helper");
var TransferPicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TransferPicker, _super);
    function TransferPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.optionModified = false;
        return _this;
    }
    TransferPicker.prototype.handleConfirm = function (value) {
        var _a, _b;
        (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value, this.optionModified);
        this.optionModified = false;
    };
    TransferPicker.prototype.onFoucs = function () {
        var _a, _b;
        (_b = (_a = this.props).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    TransferPicker.prototype.onBlur = function () {
        var _a, _b;
        (_b = (_a = this.props).onBlur) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    TransferPicker.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, value = _a.value, __ = _a.translate, disabled = _a.disabled, className = _a.className, onChange = _a.onChange, size = _a.size, borderMode = _a.borderMode, rest = (0, tslib_1.__rest)(_a, ["classnames", "value", "translate", "disabled", "className", "onChange", "size", "borderMode"]);
        return (react_1.default.createElement(PickerContainer_1.default, { title: __('Select.placeholder'), onFocus: this.onFoucs, onClose: this.onBlur, bodyRender: function (_a) {
                var onClose = _a.onClose, value = _a.value, onChange = _a.onChange, setState = _a.setState, states = (0, tslib_1.__rest)(_a, ["onClose", "value", "onChange", "setState"]);
                return (react_1.default.createElement(Transfer_1.default, (0, tslib_1.__assign)({}, rest, states, { value: value, onChange: function (value, optionModified) {
                        if (optionModified) {
                            var options = (0, helper_1.mapTree)(rest.options, function (item) {
                                return (value.find(function (a) { return a.value === item.value; }) || item);
                            });
                            _this.optionModified = true;
                            setState({ options: options, value: value });
                        }
                        else {
                            onChange(value);
                        }
                    } })));
            }, value: value, onConfirm: this.handleConfirm, size: size }, function (_a) {
            var onClick = _a.onClick, isOpened = _a.isOpened;
            return (react_1.default.createElement(ResultBox_1.default, { className: cx('TransferPicker', className, isOpened ? 'is-active' : ''), allowInput: false, result: value, onResultChange: onChange, onResultClick: onClick, placeholder: __('Select.placeholder'), disabled: disabled, borderMode: borderMode },
                react_1.default.createElement("span", { className: cx('TransferPicker-icon') },
                    react_1.default.createElement(icons_1.Icon, { icon: "pencil", className: "icon" }))));
        }));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TransferPicker.prototype, "handleConfirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TransferPicker.prototype, "onFoucs", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TransferPicker.prototype, "onBlur", null);
    return TransferPicker;
}(react_1.default.Component));
exports.TransferPicker = TransferPicker;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(TransferPicker, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/TransferPicker.js.map
