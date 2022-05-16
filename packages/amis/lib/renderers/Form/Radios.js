"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiosControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Radios_1 = (0, tslib_1.__importDefault)(require("../../components/Radios"));
var Options_1 = require("./Options");
var helper_1 = require("../../utils/helper");
var RadiosControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RadiosControl, _super);
    function RadiosControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RadiosControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    RadiosControl.prototype.handleChange = function (option) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, joinValues, extractValue, valueField, onChange, dispatchEvent, options, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, joinValues = _a.joinValues, extractValue = _a.extractValue, valueField = _a.valueField, onChange = _a.onChange, dispatchEvent = _a.dispatchEvent, options = _a.options, data = _a.data;
                        if (option && (joinValues || extractValue)) {
                            option = option[valueField || 'value'];
                        }
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: option,
                                options: options
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange && onChange(option);
                        return [2 /*return*/];
                }
            });
        });
    };
    RadiosControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    RadiosControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, value = _a.value, onChange = _a.onChange, disabled = _a.disabled, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter, placeholder = _a.placeholder, options = _a.options, _b = _a.inline, inline = _b === void 0 ? true : _b, formMode = _a.formMode, columnsCount = _a.columnsCount, classPrefix = _a.classPrefix, itemClassName = _a.itemClassName, labelClassName = _a.labelClassName, labelField = _a.labelField, valueField = _a.valueField, __ = _a.translate, optionType = _a.optionType, level = _a.level;
        return (react_1.default.createElement(Radios_1.default, { inline: inline || formMode === 'inline', className: (0, classnames_1.default)("".concat(ns, "RadiosControl"), className), value: typeof value === 'undefined' || value === null ? '' : value, disabled: disabled, onChange: this.handleChange, joinValues: joinValues, extractValue: extractValue, delimiter: delimiter, labelClassName: labelClassName, labelField: labelField, valueField: valueField, placeholder: __(placeholder), options: options, columnsCount: columnsCount, classPrefix: classPrefix, itemClassName: itemClassName, optionType: optionType, level: level }));
    };
    var _a;
    RadiosControl.defaultProps = {
        columnsCount: 1
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], RadiosControl.prototype, "handleChange", null);
    return RadiosControl;
}(react_1.default.Component));
exports.default = RadiosControl;
var RadiosControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RadiosControlRenderer, _super);
    function RadiosControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RadiosControlRenderer.defaultProps = {
        multiple: false,
        inline: true
    };
    RadiosControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'radios',
            sizeMutable: false
        })
    ], RadiosControlRenderer);
    return RadiosControlRenderer;
}(RadiosControl));
exports.RadiosControlRenderer = RadiosControlRenderer;
//# sourceMappingURL=./renderers/Form/Radios.js.map
