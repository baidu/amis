"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldRenderer = exports.TableCellRenderer = exports.TableCell = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../../factory");
var QuickEdit_1 = (0, tslib_1.__importDefault)(require("../QuickEdit"));
var Copyable_1 = (0, tslib_1.__importDefault)(require("../Copyable"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("../PopOver"));
var mobx_react_1 = require("mobx-react");
var omit = require("lodash/omit");
var tpl_1 = require("../../utils/tpl");
var Badge_1 = require("../../components/Badge");
var ColorScale_1 = (0, tslib_1.__importDefault)(require("../../utils/ColorScale"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var TableCell = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableCell, _super);
    function TableCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableCell.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, classNameExpr = _a.classNameExpr, render = _a.render, _b = _a.style, style = _b === void 0 ? {} : _b, Component = _a.wrapperComponent, column = _a.column, value = _a.value, data = _a.data, children = _a.children, width = _a.width, align = _a.align, innerClassName = _a.innerClassName, label = _a.label, tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, rowSpan = _a.rowSpan, _body = _a.body, tpl = _a.tpl, remark = _a.remark, prefix = _a.prefix, affix = _a.affix, isHead = _a.isHead, colIndex = _a.colIndex, row = _a.row, showBadge = _a.showBadge, itemBadge = _a.itemBadge, rest = (0, tslib_1.__rest)(_a, ["classnames", "className", "classNameExpr", "render", "style", "wrapperComponent", "column", "value", "data", "children", "width", "align", "innerClassName", "label", "tabIndex", "onKeyUp", "rowSpan", "body", "tpl", "remark", "prefix", "affix", "isHead", "colIndex", "row", "showBadge", "itemBadge"]);
        var schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, column), { className: innerClassName, type: (column && column.type) || 'plain' });
        // 如果本来就是 type 为 button，不要删除，其他情况下都应该删除。
        if (schema.type !== 'button' && schema.type !== 'dropdown-button') {
            delete schema.label;
        }
        var body = children
            ? children
            : render('field', schema, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, omit(rest, Object.keys(schema))), { inputOnly: true, value: value, data: data }));
        if (width) {
            style = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, style), { width: (style && style.width) || width });
            if (!/%$/.test(String(style.width))) {
                body = (react_1.default.createElement("div", { style: { width: style.width } },
                    prefix,
                    body,
                    affix));
                prefix = null;
                affix = null;
                // delete style.width;
            }
        }
        if (align) {
            style = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, style), { textAlign: align });
        }
        if (column.backgroundScale) {
            var backgroundScale = column.backgroundScale;
            var min = backgroundScale.min;
            var max = backgroundScale.max;
            if ((0, tpl_builtin_1.isPureVariable)(min)) {
                min = (0, tpl_builtin_1.resolveVariableAndFilter)(min, data, '| raw');
            }
            if ((0, tpl_builtin_1.isPureVariable)(max)) {
                max = (0, tpl_builtin_1.resolveVariableAndFilter)(max, data, '| raw');
            }
            if (typeof min === 'undefined') {
                min = Math.min.apply(Math, data.rows.map(function (r) { return r[column.name]; }));
            }
            if (typeof max === 'undefined') {
                max = Math.max.apply(Math, data.rows.map(function (r) { return r[column.name]; }));
            }
            var colorScale = new ColorScale_1.default(min, max, backgroundScale.colors || ['#FFEF9C', '#FF7127']);
            var value_1 = data[column.name];
            if ((0, tpl_builtin_1.isPureVariable)(backgroundScale.source)) {
                value_1 = (0, tpl_builtin_1.resolveVariableAndFilter)(backgroundScale.source, data, '| raw');
            }
            var color = colorScale.getColor(Number(value_1)).toHexString();
            style.background = color;
        }
        if (!Component) {
            return body;
        }
        if (isHead) {
            Component = 'th';
        }
        return (react_1.default.createElement(Component, { rowSpan: rowSpan > 1 ? rowSpan : undefined, style: style, className: cx(className, column.classNameExpr ? (0, tpl_1.filter)(column.classNameExpr, data) : null), tabIndex: tabIndex, onKeyUp: onKeyUp },
            showBadge ? (react_1.default.createElement(Badge_1.Badge, { classnames: cx, badge: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, itemBadge), { className: cx("Table-badge", itemBadge === null || itemBadge === void 0 ? void 0 : itemBadge.className) }), data: row.data })) : null,
            prefix,
            body,
            affix));
    };
    TableCell.defaultProps = {
        wrapperComponent: 'td'
    };
    TableCell.propsList = [
        'type',
        'label',
        'column',
        'body',
        'tpl',
        'rowSpan',
        'remark'
    ];
    return TableCell;
}(react_1.default.Component));
exports.TableCell = TableCell;
var TableCellRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableCellRenderer, _super);
    function TableCellRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableCellRenderer.propsList = (0, tslib_1.__spreadArray)([
        'quickEdit',
        'quickEditEnabledOn',
        'popOver',
        'copyable',
        'inline'
    ], TableCell.propsList, true);
    TableCellRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)table\/(?:.*\/)?cell$/,
            name: 'table-cell'
        }),
        (0, QuickEdit_1.default)(),
        (0, PopOver_1.default)({
            targetOutter: true
        }),
        (0, Copyable_1.default)(),
        mobx_react_1.observer
    ], TableCellRenderer);
    return TableCellRenderer;
}(TableCell));
exports.TableCellRenderer = TableCellRenderer;
var FieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FieldRenderer, _super);
    function FieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, TableCell.defaultProps), { wrapperComponent: 'div' });
    FieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'field',
            name: 'field'
        }),
        (0, PopOver_1.default)(),
        (0, Copyable_1.default)()
    ], FieldRenderer);
    return FieldRenderer;
}(TableCell));
exports.FieldRenderer = FieldRenderer;
//# sourceMappingURL=./renderers/Table/TableCell.js.map
