"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableContent = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var TableBody_1 = require("./TableBody");
var mobx_react_1 = require("mobx-react");
var ItemActionsWrapper_1 = (0, tslib_1.__importDefault)(require("./ItemActionsWrapper"));
var TableContent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableContent, _super);
    function TableContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableContent.prototype.renderItemActions = function () {
        var _a = this.props, itemActions = _a.itemActions, render = _a.render, store = _a.store, cx = _a.classnames;
        var finalActions = Array.isArray(itemActions)
            ? itemActions.filter(function (action) { return !action.hiddenOnHover; })
            : [];
        if (!finalActions.length) {
            return null;
        }
        return (react_1.default.createElement(ItemActionsWrapper_1.default, { store: store, classnames: cx },
            react_1.default.createElement("div", { className: cx('Table-itemActions') }, finalActions.map(function (action, index) {
                return render("itemAction/".concat(index), (0, tslib_1.__assign)((0, tslib_1.__assign)({}, action), { isMenuItem: true }), {
                    key: index,
                    item: store.hoverRow,
                    data: store.hoverRow.locals,
                    rowIndex: store.hoverRow.index
                });
            }))));
    };
    TableContent.prototype.render = function () {
        var _a = this.props, placeholder = _a.placeholder, cx = _a.classnames, render = _a.render, className = _a.className, columns = _a.columns, columnsGroup = _a.columnsGroup, onMouseMove = _a.onMouseMove, onScroll = _a.onScroll, tableRef = _a.tableRef, rows = _a.rows, renderHeadCell = _a.renderHeadCell, renderCell = _a.renderCell, onCheck = _a.onCheck, rowClassName = _a.rowClassName, onQuickChange = _a.onQuickChange, footable = _a.footable, footableColumns = _a.footableColumns, checkOnItemClick = _a.checkOnItemClick, buildItemProps = _a.buildItemProps, onAction = _a.onAction, rowClassNameExpr = _a.rowClassNameExpr, affixRowClassName = _a.affixRowClassName, prefixRowClassName = _a.prefixRowClassName, data = _a.data, prefixRow = _a.prefixRow, locale = _a.locale, translate = _a.translate, itemAction = _a.itemAction, affixRow = _a.affixRow, store = _a.store;
        var tableClassName = cx('Table-table', this.props.tableClassName);
        var hideHeader = columns.every(function (column) { return !column.label; });
        return (react_1.default.createElement("div", { onMouseMove: onMouseMove, className: cx('Table-content', className), onScroll: onScroll },
            store.hoverRow ? this.renderItemActions() : null,
            react_1.default.createElement("table", { ref: tableRef, className: tableClassName },
                react_1.default.createElement("thead", null,
                    columnsGroup.length ? (react_1.default.createElement("tr", null, columnsGroup.map(function (item, index) { return (react_1.default.createElement("th", { key: index, "data-index": item.index, colSpan: item.colSpan, rowSpan: item.rowSpan }, item.label ? render('tpl', item.label) : null)); }))) : null,
                    react_1.default.createElement("tr", { className: hideHeader ? 'fake-hide' : '' }, columns.map(function (column) {
                        var _a;
                        return ((_a = columnsGroup.find(function (group) { return ~group.has.indexOf(column); })) === null || _a === void 0 ? void 0 : _a.rowSpan) === 2
                            ? null
                            : renderHeadCell(column, {
                                'data-index': column.index,
                                'key': column.index
                            });
                    }))),
                !rows.length ? (react_1.default.createElement("tbody", null,
                    react_1.default.createElement("tr", { className: cx('Table-placeholder') },
                        react_1.default.createElement("td", { colSpan: columns.length }, render('placeholder', translate(placeholder || 'placeholder.noData')))))) : (react_1.default.createElement(TableBody_1.TableBody, { itemAction: itemAction, classnames: cx, render: render, renderCell: renderCell, onCheck: onCheck, onQuickChange: onQuickChange, footable: footable, footableColumns: footableColumns, checkOnItemClick: checkOnItemClick, buildItemProps: buildItemProps, onAction: onAction, rowClassNameExpr: rowClassNameExpr, rowClassName: rowClassName, prefixRowClassName: prefixRowClassName, affixRowClassName: affixRowClassName, rows: rows, columns: columns, locale: locale, translate: translate, prefixRow: prefixRow, affixRow: affixRow, data: data })))));
    };
    TableContent = (0, tslib_1.__decorate)([
        mobx_react_1.observer
    ], TableContent);
    return TableContent;
}(react_1.default.Component));
exports.TableContent = TableContent;
//# sourceMappingURL=./renderers/Table/TableContent.js.map
