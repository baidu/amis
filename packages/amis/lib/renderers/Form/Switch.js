"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var Switch_1 = (0, tslib_1.__importDefault)(require("../../components/Switch"));
var helper_1 = require("../../utils/helper");
var icon_1 = require("../../utils/icon");
var SwitchControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SwitchControl, _super);
    function SwitchControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchControl.prototype.handleChange = function (checked) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, dispatchEvent, data, onChange, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data, onChange = _a.onChange;
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: checked,
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange && onChange(checked);
                        return [2 /*return*/];
                }
            });
        });
    };
    SwitchControl.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, cx = _a.classnames, value = _a.value, trueValue = _a.trueValue, falseValue = _a.falseValue, onText = _a.onText, offText = _a.offText, option = _a.option, onChange = _a.onChange, disabled = _a.disabled, optionAtLeft = _a.optionAtLeft;
        var on = (0, helper_1.isObject)(onText) ? (0, icon_1.generateIcon)(cx, onText.icon, 'Switch-icon') : onText;
        var off = (0, helper_1.isObject)(offText) ? (0, icon_1.generateIcon)(cx, offText.icon, 'Switch-icon') : offText;
        return (react_1.default.createElement("div", { className: cx("SwitchControl", className) },
            optionAtLeft ? (react_1.default.createElement("span", { className: cx('Switch-option') }, option)) : null,
            react_1.default.createElement(Switch_1.default, { classPrefix: ns, value: value, trueValue: trueValue, falseValue: falseValue, onText: on, offText: off, disabled: disabled, onChange: this.handleChange }),
            optionAtLeft ? null : (react_1.default.createElement("span", { className: cx('Switch-option') }, option))));
    };
    SwitchControl.defaultProps = {
        trueValue: true,
        falseValue: false,
        optionAtLeft: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], SwitchControl.prototype, "handleChange", null);
    return SwitchControl;
}(react_1.default.Component));
exports.default = SwitchControl;
var SwitchControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SwitchControlRenderer, _super);
    function SwitchControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'switch',
            sizeMutable: false
        })
    ], SwitchControlRenderer);
    return SwitchControlRenderer;
}(SwitchControl));
exports.SwitchControlRenderer = SwitchControlRenderer;
//# sourceMappingURL=./renderers/Form/Switch.js.map
