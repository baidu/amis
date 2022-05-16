"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAreaControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var Textarea_1 = (0, tslib_1.__importDefault)(require("../../components/Textarea"));
var helper_1 = require("../../utils/helper");
var Decorators_1 = require("../../actions/Decorators");
var TextAreaControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TextAreaControl, _super);
    function TextAreaControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inputRef = react_1.default.createRef();
        return _this;
    }
    TextAreaControl.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var onChange = this.props.onChange;
        if (!!~['clear', 'reset'].indexOf(actionType)) {
            onChange === null || onChange === void 0 ? void 0 : onChange(this.props.resetValue);
            this.focus();
        }
        else if (actionType === 'focus') {
            this.focus();
        }
    };
    TextAreaControl.prototype.focus = function () {
        var _a;
        (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    TextAreaControl.prototype.handleFocus = function (e) {
        var onFocus = this.props.onFocus;
        this.setState({
            focused: true
        }, function () {
            onFocus && onFocus(e);
        });
    };
    TextAreaControl.prototype.handleBlur = function (e) {
        var _a = this.props, onBlur = _a.onBlur, trimContents = _a.trimContents, value = _a.value, onChange = _a.onChange;
        this.setState({
            focused: false
        }, function () {
            if (trimContents && value && typeof value === 'string') {
                onChange(value.trim());
            }
            onBlur && onBlur(e);
        });
    };
    TextAreaControl.prototype.render = function () {
        var rest = (0, tslib_1.__rest)(this.props, []);
        return (react_1.default.createElement(Textarea_1.default, (0, tslib_1.__assign)({}, rest, { onFocus: this.handleFocus, onBlur: this.handleBlur })));
    };
    var _a, _b;
    TextAreaControl.defaultProps = {
        minRows: 3,
        maxRows: 20,
        trimContents: true,
        resetValue: '',
        clearable: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, Decorators_1.bindRendererEvent)('focus'),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.FocusEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TextAreaControl.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, Decorators_1.bindRendererEvent)('blur'),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.FocusEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], TextAreaControl.prototype, "handleBlur", null);
    return TextAreaControl;
}(react_1.default.Component));
exports.default = TextAreaControl;
var TextAreaControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TextAreaControlRenderer, _super);
    function TextAreaControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextAreaControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'textarea'
        })
    ], TextAreaControlRenderer);
    return TextAreaControlRenderer;
}(TextAreaControl));
exports.TextAreaControlRenderer = TextAreaControlRenderer;
//# sourceMappingURL=./renderers/Form/Textarea.js.map
