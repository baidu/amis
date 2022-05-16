"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputFormulaRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = (0, tslib_1.__importDefault)(require("./Item"));
var Picker_1 = (0, tslib_1.__importDefault)(require("../../components/formula/Picker"));
var helper_1 = require("../../utils/helper");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var InputFormulaRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(InputFormulaRenderer, _super);
    function InputFormulaRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InputFormulaRenderer.prototype.formulaRef = function (ref) {
        if (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.ref = ref;
        }
        else {
            this.ref = undefined;
        }
    };
    InputFormulaRenderer.prototype.validate = function () {
        var _a;
        var _b = this.props, __ = _b.translate, value = _b.value;
        if ((_a = this.ref) === null || _a === void 0 ? void 0 : _a.validate) {
            var res = this.ref.validate(value);
            if (res !== true) {
                return __('FormulaEditor.invalidData', { err: res });
            }
        }
    };
    InputFormulaRenderer.prototype.render = function () {
        var _a = this.props, selectedOptions = _a.selectedOptions, disabled = _a.disabled, onChange = _a.onChange, evalMode = _a.evalMode, variableMode = _a.variableMode, header = _a.header, label = _a.label, value = _a.value, clearable = _a.clearable, className = _a.className, ns = _a.classPrefix, cx = _a.classnames, _b = _a.allowInput, allowInput = _b === void 0 ? true : _b, borderMode = _a.borderMode, placeholder = _a.placeholder, inputMode = _a.inputMode, btnLabel = _a.btnLabel, level = _a.level, btnSize = _a.btnSize, icon = _a.icon, title = _a.title, variableClassName = _a.variableClassName, functionClassName = _a.functionClassName, data = _a.data, onPickerOpen = _a.onPickerOpen;
        var _c = this.props, variables = _c.variables, functions = _c.functions;
        if ((0, tpl_builtin_1.isPureVariable)(variables)) {
            // 如果 variables 是 ${xxx} 这种形式，将其处理成实际的值
            variables = (0, tpl_builtin_1.resolveVariableAndFilter)(variables, this.props.data, '| raw');
        }
        if ((0, tpl_builtin_1.isPureVariable)(functions)) {
            // 如果 functions 是 ${xxx} 这种形式，将其处理成实际的值
            functions = (0, tpl_builtin_1.resolveVariableAndFilter)(functions, this.props.data, '| raw');
        }
        return (react_1.default.createElement(Picker_1.default, { ref: this.formulaRef, className: className, value: value, disabled: disabled, allowInput: allowInput, onChange: onChange, evalMode: evalMode, variables: variables, variableMode: variableMode, functions: functions, header: header || label || '', borderMode: borderMode, placeholder: placeholder, mode: inputMode, btnLabel: btnLabel, level: level, btnSize: btnSize, icon: icon, title: title, clearable: clearable, variableClassName: variableClassName, functionClassName: functionClassName, data: data, onPickerOpen: onPickerOpen }));
    };
    InputFormulaRenderer.defaultProps = {
        inputMode: 'input-button',
        borderMode: 'full',
        evalMode: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], InputFormulaRenderer.prototype, "formulaRef", null);
    InputFormulaRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.default)({
            type: 'input-formula'
        })
    ], InputFormulaRenderer);
    return InputFormulaRenderer;
}(react_1.default.Component));
exports.InputFormulaRenderer = InputFormulaRenderer;
//# sourceMappingURL=./renderers/Form/InputFormula.js.map
