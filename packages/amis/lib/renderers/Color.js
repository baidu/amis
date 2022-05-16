"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorFieldRenderer = exports.ColorField = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来展示颜色块。
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var ColorField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ColorField, _super);
    function ColorField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorField.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, defaultColor = _a.defaultColor, showValue = _a.showValue;
        var color = (0, helper_1.getPropValue)(this.props);
        return (react_1.default.createElement("div", { className: cx('ColorField', className) },
            react_1.default.createElement("i", { className: cx('ColorField-previewIcon'), style: { backgroundColor: color || defaultColor } }),
            showValue ? (react_1.default.createElement("span", { className: cx('ColorField-value') }, color)) : null));
    };
    ColorField.defaultProps = {
        className: '',
        defaultColor: '#ccc',
        showValue: true
    };
    return ColorField;
}(react_1.default.Component));
exports.ColorField = ColorField;
var ColorFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ColorFieldRenderer, _super);
    function ColorFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'color'
        })
    ], ColorFieldRenderer);
    return ColorFieldRenderer;
}(ColorField));
exports.ColorFieldRenderer = ColorFieldRenderer;
//# sourceMappingURL=./renderers/Color.js.map
