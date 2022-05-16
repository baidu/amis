"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationFieldRenderer = exports.OperationField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var OperationField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(OperationField, _super);
    function OperationField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationField.prototype.render = function () {
        var _a = this.props, className = _a.className, buttons = _a.buttons, render = _a.render, cx = _a.classnames;
        return (react_1.default.createElement("div", { className: cx('OperationField', className) }, Array.isArray(buttons)
            ? buttons.map(function (button, index) {
                return render("".concat(index), (0, tslib_1.__assign)({ type: 'button', size: button.size || 'sm', level: button.level ||
                        (button.icon && !button.label ? 'link' : '') }, button), {
                    key: index
                });
            })
            : null));
    };
    OperationField.propsList = ['buttons', 'label'];
    OperationField.defaultProps = {};
    return OperationField;
}(react_1.default.Component));
exports.OperationField = OperationField;
var OperationFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(OperationFieldRenderer, _super);
    function OperationFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OperationFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'operation'
        })
    ], OperationFieldRenderer);
    return OperationFieldRenderer;
}(OperationField));
exports.OperationFieldRenderer = OperationFieldRenderer;
//# sourceMappingURL=./renderers/Operation.js.map
