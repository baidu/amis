"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonGroupRenderer = void 0;
var tslib_1 = require("tslib");
var ButtonGroupSelect_1 = (0, tslib_1.__importDefault)(require("./Form/ButtonGroupSelect"));
var factory_1 = require("../factory");
exports.default = ButtonGroupSelect_1.default;
var ButtonGroupRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ButtonGroupRenderer, _super);
    function ButtonGroupRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonGroupRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'button-group'
        })
    ], ButtonGroupRenderer);
    return ButtonGroupRenderer;
}(ButtonGroupSelect_1.default));
exports.ButtonGroupRenderer = ButtonGroupRenderer;
//# sourceMappingURL=./renderers/ButtonGroup.js.map
