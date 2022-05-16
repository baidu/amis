"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellFieldRenderer = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("../../factory");
var Table_1 = require("../Table");
var QuickEdit_1 = (0, tslib_1.__importDefault)(require("../QuickEdit"));
var Copyable_1 = (0, tslib_1.__importDefault)(require("../Copyable"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../PopOver"));
var CellFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CellFieldRenderer, _super);
    function CellFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CellFieldRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, Table_1.TableCell.defaultProps), { wrapperComponent: 'div' });
    CellFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'cell-field',
            name: 'cell-field'
        }),
        (0, PopOver_1.default)(),
        (0, Copyable_1.default)(),
        (0, QuickEdit_1.default)()
    ], CellFieldRenderer);
    return CellFieldRenderer;
}(Table_1.TableCell));
exports.CellFieldRenderer = CellFieldRenderer;
//# sourceMappingURL=./renderers/Table-v2/TableCell.js.map
