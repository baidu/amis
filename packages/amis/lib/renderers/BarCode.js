"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarCodeFieldRenderer = exports.BarCodeField = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来条形码
 */
var react_1 = tslib_1.__importStar(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var BarCode = react_1.default.lazy(function () { return Promise.resolve().then(function () { return new Promise(function(resolve){require(['../components/BarCode'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }); });
var BarCodeField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BarCodeField, _super);
    function BarCodeField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarCodeField.prototype.render = function () {
        var _a = this.props, className = _a.className, width = _a.width, height = _a.height, cx = _a.classnames, options = _a.options;
        var value = (0, helper_1.getPropValue)(this.props);
        return (react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement("div", null, "...") },
            react_1.default.createElement("div", { "data-testid": "barcode", className: cx('BarCode', className) },
                react_1.default.createElement(BarCode, { value: value, options: options }))));
    };
    return BarCodeField;
}(react_1.default.Component));
exports.BarCodeField = BarCodeField;
var BarCodeFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BarCodeFieldRenderer, _super);
    function BarCodeFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarCodeFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'barcode'
        })
    ], BarCodeFieldRenderer);
    return BarCodeFieldRenderer;
}(BarCodeField));
exports.BarCodeFieldRenderer = BarCodeFieldRenderer;
//# sourceMappingURL=./renderers/BarCode.js.map
