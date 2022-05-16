"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../../components/Checkbox"));
var Badge_1 = require("../../components/Badge");
var helper_1 = require("../../utils/helper");
var CheckboxControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxControl, _super);
    function CheckboxControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    CheckboxControl.prototype.dispatchChangeEvent = function (eventData) {
        if (eventData === void 0) { eventData = {}; }
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onChange, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onChange = _a.onChange;
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: eventData
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange && onChange(eventData);
                        return [2 /*return*/];
                }
            });
        });
    };
    CheckboxControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, value = _a.value, trueValue = _a.trueValue, falseValue = _a.falseValue, option = _a.option, onChange = _a.onChange, disabled = _a.disabled, render = _a.render, partial = _a.partial, optionType = _a.optionType, checked = _a.checked, ns = _a.classPrefix;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "CheckboxControl"), className) },
            react_1.default.createElement(Checkbox_1.default, { inline: true, value: value || '', trueValue: trueValue, falseValue: falseValue, disabled: disabled, onChange: function (value) { return _this.dispatchChangeEvent(value); }, partial: partial, optionType: optionType, checked: checked }, option ? render('option', option) : null)));
    };
    CheckboxControl.defaultProps = {
        trueValue: true,
        falseValue: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], CheckboxControl.prototype, "dispatchChangeEvent", null);
    return CheckboxControl;
}(react_1.default.Component));
exports.default = CheckboxControl;
// @ts-ignore
var CheckboxControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxControlRenderer, _super);
    function CheckboxControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxControlRenderer = (0, tslib_1.__decorate)([
        Badge_1.withBadge,
        (0, Item_1.FormItem)({
            type: 'checkbox',
            sizeMutable: false
        })
    ], CheckboxControlRenderer);
    return CheckboxControlRenderer;
}(CheckboxControl));
exports.CheckboxControlRenderer = CheckboxControlRenderer;
//# sourceMappingURL=./renderers/Form/Checkbox.js.map
