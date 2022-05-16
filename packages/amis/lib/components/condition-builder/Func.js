"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionFunc = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var PopOverContainer_1 = (0, tslib_1.__importDefault)(require("../PopOverContainer"));
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("../GroupedSelection"));
var helper_1 = require("../../utils/helper");
var ResultBox_1 = (0, tslib_1.__importDefault)(require("../ResultBox"));
var icons_1 = require("../icons");
var Expression_1 = (0, tslib_1.__importDefault)(require("./Expression"));
var locale_1 = require("../../locale");
var option2value = function (item) { return item.type; };
var ConditionFunc = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ConditionFunc, _super);
    function ConditionFunc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionFunc.prototype.handleFuncChange = function (type) {
        var value = (0, tslib_1.__assign)({}, this.props.value);
        value.func = type;
        this.props.onChange(value);
    };
    ConditionFunc.prototype.handleArgChange = function (arg, index) {
        var value = (0, tslib_1.__assign)({}, this.props.value);
        value.args = Array.isArray(value.args) ? value.args.concat() : [];
        value.args.splice(index, 1, arg);
        this.props.onChange(value);
    };
    ConditionFunc.prototype.renderFunc = function (func) {
        var _this = this;
        var _a = this.props, cx = _a.classnames, fields = _a.fields, value = _a.value, funcs = _a.funcs, config = _a.config, disabled = _a.disabled;
        return (react_1.default.createElement("div", { className: cx('CBFunc-args') },
            react_1.default.createElement("span", null, "("),
            Array.isArray(func.args) && func.args.length ? (react_1.default.createElement("div", null, func.args.map(function (item, index) { return (react_1.default.createElement(Expression_1.default, { config: config, key: index, index: index, fields: fields, value: value === null || value === void 0 ? void 0 : value.args[index], valueField: { type: item.type }, onChange: _this.handleArgChange, funcs: funcs, disabled: disabled })); }))) : null,
            react_1.default.createElement("span", null, ")")));
    };
    ConditionFunc.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, cx = _a.classnames, fieldClassName = _a.fieldClassName, funcs = _a.funcs, disabled = _a.disabled, __ = _a.translate;
        var func = value
            ? (0, helper_1.findTree)(funcs, function (item) { return item.type === value.func; })
            : null;
        return (react_1.default.createElement("div", { className: cx('CBFunc') },
            react_1.default.createElement(PopOverContainer_1.default, { popOverRender: function (_a) {
                    var _b;
                    var onClose = _a.onClose;
                    return (react_1.default.createElement(GroupedSelection_1.default, { onClick: onClose, options: funcs, value: (_b = func) === null || _b === void 0 ? void 0 : _b.type, option2value: option2value, onChange: _this.handleFuncChange, multiple: false }));
                } }, function (_a) {
                var onClick = _a.onClick, ref = _a.ref, isOpened = _a.isOpened;
                return (react_1.default.createElement("div", { className: cx('CBFunc-select') },
                    react_1.default.createElement(ResultBox_1.default, { className: cx('CBGroup-fieldInput', fieldClassName, isOpened ? 'is-active' : ''), ref: ref, allowInput: false, result: func, onResultChange: helper_1.noop, onResultClick: onClick, placeholder: __('Condition.field_placeholder'), disabled: disabled },
                        react_1.default.createElement("span", { className: cx('CBGroup-fieldCaret') },
                            react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" })))));
            }),
            func ? (this.renderFunc(func)) : (react_1.default.createElement("span", { className: cx('CBFunc-error') }, __('Condition.fun_error')))));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ConditionFunc.prototype, "handleFuncChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ConditionFunc.prototype, "handleArgChange", null);
    return ConditionFunc;
}(react_1.default.Component));
exports.ConditionFunc = ConditionFunc;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(ConditionFunc));
//# sourceMappingURL=./components/condition-builder/Func.js.map
