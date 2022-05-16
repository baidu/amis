"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarRenderer = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("../factory");
var InputDate_1 = require("./Form/InputDate");
var CalendarRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CalendarRenderer, _super);
    function CalendarRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CalendarRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, InputDate_1.DateControlRenderer.defaultProps), { embed: true });
    CalendarRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'calendar'
        })
    ], CalendarRenderer);
    return CalendarRenderer;
}(InputDate_1.DateControlRenderer));
exports.CalendarRenderer = CalendarRenderer;
//# sourceMappingURL=./renderers/Calendar.js.map
