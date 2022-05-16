"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formula = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var theme_1 = require("../../theme");
var InputBox_1 = (0, tslib_1.__importDefault)(require("../InputBox"));
var Formula = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Formula, _super);
    function Formula() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Formula.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, value = _a.value, onChange = _a.onChange, disabled = _a.disabled, __ = _a.translate;
        return (react_1.default.createElement("div", { className: cx('CBFormula') },
            react_1.default.createElement(InputBox_1.default, { disabled: disabled, value: value, onChange: onChange, placeholder: __('Condition.formula_placeholder'), prefix: react_1.default.createElement("span", { className: cx('CBFormula-label') }, __('Condition.expression')) })));
    };
    return Formula;
}(react_1.default.Component));
exports.Formula = Formula;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Formula));
//# sourceMappingURL=./components/condition-builder/Formula.js.map
