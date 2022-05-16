"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var ItemActionsWrapper = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ItemActionsWrapper, _super);
    function ItemActionsWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemActionsWrapper.prototype.render = function () {
        var _a, _b;
        var _c = this.props, cx = _c.classnames, children = _c.children, dom = _c.dom;
        if (!dom) {
            return;
        }
        var frame = (_b = (_a = dom.closest('table')) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
        var rect = dom.getBoundingClientRect();
        var height = rect.height;
        var top = rect.top - frame.getBoundingClientRect().top;
        return (react_1.default.createElement("div", { className: cx('Table-itemActions-wrap'), style: { top: top + 'px', height: height + 'px' } }, children));
    };
    return ItemActionsWrapper;
}(react_1.default.Component));
exports.default = ItemActionsWrapper;
//# sourceMappingURL=./components/table/ItemActionsWrapper.js.map
