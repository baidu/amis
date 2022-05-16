"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file 这个 Input 与系统默认的 input 不同的地方在于，
 * 中文输入过程中不会触发 onChange 事件。对于 autoComplete
 * 功能很有必要。
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var InputInner = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(InputInner, _super);
    function InputInner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isOnComposition = false;
        _this.state = { value: _this.props.value };
        return _this;
    }
    InputInner.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({
                value: props.value
            });
        }
    };
    InputInner.prototype.handleComposition = function (e) {
        this.isOnComposition = e.type !== 'compositionend';
        if (!this.isOnComposition) {
            this.handleChange(e);
        }
    };
    InputInner.prototype.handleChange = function (e) {
        var onChange = this.props.onChange;
        var value = e.currentTarget.value;
        this.isOnComposition || (onChange && onChange(e));
        this.setState({
            value: value
        });
    };
    InputInner.prototype.render = function () {
        var _a = this.props, forwardedRef = _a.forwardedRef, rest = (0, tslib_1.__rest)(_a, ["forwardedRef"]);
        return (react_1.default.createElement("input", (0, tslib_1.__assign)({ type: "text" }, rest, { value: this.state.value, ref: forwardedRef, onChange: this.handleChange, onCompositionStart: this.handleComposition, onCompositionUpdate: this.handleComposition, onCompositionEnd: this.handleComposition })));
    };
    var _a, _b;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.CompositionEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputInner.prototype, "handleComposition", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputInner.prototype, "handleChange", null);
    return InputInner;
}(react_1.default.Component));
exports.default = react_1.default.forwardRef(function (props, ref) {
    return react_1.default.createElement(InputInner, (0, tslib_1.__assign)({}, props, { forwardedRef: ref }));
});
//# sourceMappingURL=./components/Input.js.map
