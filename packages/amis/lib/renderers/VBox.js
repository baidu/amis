"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VBoxRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var VBox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(VBox, _super);
    function VBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VBox.prototype.renderChild = function (region, node) {
        var render = this.props.render;
        return render(region, node);
    };
    VBox.prototype.renderCell = function (row, key) {
        var ns = this.props.classPrefix;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "Vbox-cell"), row.cellClassName) }, this.renderChild("row/".concat(key), row)));
    };
    VBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, rows = _a.rows, ns = _a.classPrefix;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "Vbox"), className) }, Array.isArray(rows)
            ? rows.map(function (row, key) { return (react_1.default.createElement("div", { className: (0, classnames_1.default)('row-row', row.rowClassName), key: key }, _this.renderCell(row, key))); })
            : null));
    };
    VBox.propsList = ['rows'];
    VBox.defaultProps = {};
    return VBox;
}(react_1.default.Component));
exports.default = VBox;
var VBoxRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(VBoxRenderer, _super);
    function VBoxRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VBoxRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'vbox'
        })
    ], VBoxRenderer);
    return VBoxRenderer;
}(VBox));
exports.VBoxRenderer = VBoxRenderer;
//# sourceMappingURL=./renderers/VBox.js.map
