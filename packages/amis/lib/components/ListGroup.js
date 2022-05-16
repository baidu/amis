"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListGroup = void 0;
var tslib_1 = require("tslib");
var theme_1 = require("../theme");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var ListGroup = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ListGroup, _super);
    function ListGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListGroup.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, expand = _a.expand, placeholder = _a.placeholder, items = _a.items, children = _a.children, itemClassName = _a.itemClassName, itemRender = _a.itemRender, getItemProps = _a.getItemProps, classPrefix = _a.classPrefix, rest = (0, tslib_1.__rest)(_a, ["classnames", "className", "expand", "placeholder", "items", "children", "itemClassName", "itemRender", "getItemProps", "classPrefix"]);
        return (react_1.default.createElement("div", (0, tslib_1.__assign)({}, rest, { className: cx('ListGroup', className, expand ? 'ListGroup--expanded' : '') }),
            Array.isArray(items) && items.length ? (items.map(function (item, index) {
                var itemProps = (getItemProps === null || getItemProps === void 0 ? void 0 : getItemProps({ item: item, index: index })) || {};
                return (react_1.default.createElement("div", (0, tslib_1.__assign)({ key: index }, itemProps, { className: cx('ListGroup-item', itemClassName, itemProps.className) }), itemRender(item, index)));
            })) : placeholder ? (react_1.default.createElement("div", { className: cx('Placeholder ListGroup-placeholder') })) : null,
            children));
    };
    ListGroup.defaultProps = {
        itemRender: function (item) { return react_1.default.createElement(react_1.default.Fragment, null, "".concat(item)); }
    };
    return ListGroup;
}(react_1.default.Component));
exports.ListGroup = ListGroup;
exports.default = (0, theme_1.themeable)(ListGroup);
//# sourceMappingURL=./components/ListGroup.js.map
