"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var HiddenControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HiddenControl, _super);
    function HiddenControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HiddenControl.prototype.render = function () {
        return null;
    };
    return HiddenControl;
}(react_1.default.Component));
exports.default = HiddenControl;
var HiddenControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HiddenControlRenderer, _super);
    function HiddenControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HiddenControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'hidden',
            wrap: false,
            sizeMutable: false
        })
    ], HiddenControlRenderer);
    return HiddenControlRenderer;
}(HiddenControl));
exports.HiddenControlRenderer = HiddenControlRenderer;
//# sourceMappingURL=./renderers/Form/Hidden.js.map
