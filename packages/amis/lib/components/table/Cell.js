"use strict";
/**
 * @file table/BodyCell
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyCell = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var zIndex = 1;
var BodyCell = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BodyCell, _super);
    function BodyCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BodyCell.prototype.render = function () {
        var _a;
        var _b = this.props, fixed = _b.fixed, rowSpan = _b.rowSpan, colSpan = _b.colSpan, key = _b.key, children = _b.children, className = _b.className, column = _b.column, style = _b.style, groupId = _b.groupId, depth = _b.depth, Component = _b.wrapperComponent, cx = _b.classnames;
        return (react_1.default.createElement(Component, { key: key || null, rowSpan: rowSpan && rowSpan > 1 ? rowSpan : null, colSpan: colSpan && colSpan > 1 ? colSpan : null, className: cx('Table-cell', className, (_a = {},
                _a[cx("Table-cell-fix-".concat(fixed))] = fixed,
                _a["text-".concat(column === null || column === void 0 ? void 0 : column.align)] = column === null || column === void 0 ? void 0 : column.align,
                _a)), style: fixed ? (0, tslib_1.__assign)({ position: 'sticky', zIndex: zIndex }, style) : (0, tslib_1.__assign)({}, style), "data-group-id": groupId || null, "data-depth": depth || null }, children));
    };
    BodyCell.defaultProps = {
        fixed: '',
        wrapperComponent: 'td',
        rowSpan: null,
        colSpan: null
    };
    return BodyCell;
}(react_1.default.Component));
exports.BodyCell = BodyCell;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(BodyCell));
//# sourceMappingURL=./components/table/Cell.js.map
