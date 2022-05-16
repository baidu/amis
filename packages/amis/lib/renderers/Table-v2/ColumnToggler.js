"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnTogglerRenderer = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("../../factory");
var ColumnToggler_1 = (0, tslib_1.__importDefault)(require("../Table/ColumnToggler"));
var ColumnTogglerRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ColumnTogglerRenderer, _super);
    function ColumnTogglerRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnTogglerRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'column-toggler',
            name: 'column-toggler'
        })
    ], ColumnTogglerRenderer);
    return ColumnTogglerRenderer;
}(ColumnToggler_1.default));
exports.ColumnTogglerRenderer = ColumnTogglerRenderer;
//# sourceMappingURL=./renderers/Table-v2/ColumnToggler.js.map
