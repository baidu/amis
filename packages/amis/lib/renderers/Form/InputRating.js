"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var helper_1 = require("../../utils/helper");
var Rating_1 = (0, tslib_1.__importDefault)(require("../../components/Rating"));
var RatingControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RatingControl, _super);
    function RatingControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RatingControl.prototype.doAction = function (action, data, throwErrors) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    RatingControl.prototype.handleChange = function (value) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onChange, dispatchEvent, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onChange = _a.onChange, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: value
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange === null || onChange === void 0 ? void 0 : onChange(value);
                        return [2 /*return*/];
                }
            });
        });
    };
    RatingControl.prototype.render = function () {
        var _a = this.props, className = _a.className, value = _a.value, count = _a.count, half = _a.half, readOnly = _a.readOnly, disabled = _a.disabled, onHoverChange = _a.onHoverChange, allowClear = _a.allowClear, char = _a.char, inactiveColor = _a.inactiveColor, colors = _a.colors, texts = _a.texts, charClassName = _a.charClassName, textClassName = _a.textClassName, textPosition = _a.textPosition, cx = _a.classnames;
        return (react_1.default.createElement("div", { className: cx('RatingControl', className) },
            react_1.default.createElement(Rating_1.default, { classnames: cx, value: value, disabled: disabled, count: count, half: half, allowClear: allowClear, readOnly: readOnly, char: char, inactiveColor: inactiveColor, colors: colors, texts: texts, charClassName: charClassName, textClassName: textClassName, textPosition: textPosition, onChange: this.handleChange, onHoverChange: function (value) {
                    onHoverChange && onHoverChange(value);
                } })));
    };
    RatingControl.defaultProps = {
        value: 0,
        count: 5,
        half: false,
        readOnly: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], RatingControl.prototype, "handleChange", null);
    return RatingControl;
}(react_1.default.Component));
exports.default = RatingControl;
var RatingControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RatingControlRenderer, _super);
    function RatingControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RatingControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-rating',
            sizeMutable: false
        })
    ], RatingControlRenderer);
    return RatingControlRenderer;
}(RatingControl));
exports.RatingControlRenderer = RatingControlRenderer;
//# sourceMappingURL=./renderers/Form/InputRating.js.map
