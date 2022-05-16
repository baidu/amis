"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Pagination_1 = require("../components/Pagination");
var Pagination = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Pagination, _super);
    function Pagination() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pagination.prototype.render = function () {
        return react_1.default.createElement(Pagination_1.Pagination, (0, tslib_1.__assign)({}, this.props));
    };
    return Pagination;
}(react_1.default.Component));
exports.default = Pagination;
var PaginationRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PaginationRenderer, _super);
    function PaginationRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaginationRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:pagination|pager)$/,
            name: 'pagination'
        })
    ], PaginationRenderer);
    return PaginationRenderer;
}(Pagination));
exports.PaginationRenderer = PaginationRenderer;
//# sourceMappingURL=./renderers/Pagination.js.map
