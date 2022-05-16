"use strict";
/**
 * @file 404
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var NotFound = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NotFound, _super);
    function NotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotFound.prototype.render = function () {
        var _a = this.props, links = _a.links, footerText = _a.footerText, description = _a.description, children = _a.children, code = _a.code;
        return (react_1.default.createElement("div", { className: "container w-xxl w-auto-xs m-auto" },
            react_1.default.createElement("div", { className: "text-center m-b-lg" },
                react_1.default.createElement("h1", { className: "text-shadow text-white" }, code || '404'),
                description ? (react_1.default.createElement("div", { className: "text-danger" }, description)) : null),
            children,
            links ? (react_1.default.createElement("div", { className: "list-group bg-info auto m-b-sm m-b-lg" }, links)) : null,
            footerText ? (react_1.default.createElement("div", { className: "text-center" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement("small", { className: "text-muted" }, footerText)))) : null));
    };
    return NotFound;
}(react_1.default.Component));
exports.NotFound = NotFound;
exports.default = (0, theme_1.themeable)(NotFound);
//# sourceMappingURL=./components/404.js.map
