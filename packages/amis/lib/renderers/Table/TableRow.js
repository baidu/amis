"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRow = void 0;
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../../utils/helper");
var TableRow = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableRow, _super);
    // reaction?: () => void;
    function TableRow(props) {
        var _this = _super.call(this, props) || this;
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleItemClick = _this.handleItemClick.bind(_this);
        return _this;
    }
    // 定义点击一行的行为，通过 itemAction配置
    TableRow.prototype.handleItemClick = function (e) {
        if ((0, helper_1.isClickOnInput)(e)) {
            return;
        }
        var _a = this.props, itemAction = _a.itemAction, onAction = _a.onAction, item = _a.item;
        if (itemAction) {
            onAction && onAction(e, itemAction, item === null || item === void 0 ? void 0 : item.data);
            item.toggle();
        }
        else {
            this.props.onCheck(this.props.item);
        }
    };
    TableRow.prototype.handleAction = function (e, action, ctx) {
        var _a = this.props, onAction = _a.onAction, item = _a.item;
        onAction && onAction(e, action, ctx || item.data);
    };
    TableRow.prototype.handleQuickChange = function (values, saveImmediately, savePristine, resetOnFailed) {
        var _a = this.props, onQuickChange = _a.onQuickChange, item = _a.item;
        onQuickChange &&
            onQuickChange(item, values, saveImmediately, savePristine, resetOnFailed);
    };
    TableRow.prototype.handleChange = function (value, name, submit, changePristine) {
        var _a;
        if (!name || typeof name !== 'string') {
            return;
        }
        var _b = this.props, item = _b.item, onQuickChange = _b.onQuickChange;
        onQuickChange === null || onQuickChange === void 0 ? void 0 : onQuickChange(item, (_a = {},
            _a[name] = value,
            _a), submit, changePristine);
    };
    TableRow.prototype.render = function () {
        var _a, _b;
        var _this = this;
        var _c = this.props, itemClassName = _c.itemClassName, itemIndex = _c.itemIndex, item = _c.item, columns = _c.columns, renderCell = _c.renderCell, children = _c.children, footableMode = _c.footableMode, ignoreFootableContent = _c.ignoreFootableContent, footableColSpan = _c.footableColSpan, regionPrefix = _c.regionPrefix, checkOnItemClick = _c.checkOnItemClick, ns = _c.classPrefix, render = _c.render, cx = _c.classnames, parent = _c.parent, itemAction = _c.itemAction, rest = (0, tslib_1.__rest)(_c, ["itemClassName", "itemIndex", "item", "columns", "renderCell", "children", "footableMode", "ignoreFootableContent", "footableColSpan", "regionPrefix", "checkOnItemClick", "classPrefix", "render", "classnames", "parent", "itemAction"]);
        if (footableMode) {
            if (!item.expanded) {
                return null;
            }
            return (react_1.default.createElement("tr", { "data-id": item.id, "data-index": item.newIndex, onClick: checkOnItemClick || itemAction ? this.handleItemClick : undefined, className: cx(itemClassName, (_a = {
                        'is-hovered': item.isHover,
                        'is-checked': item.checked,
                        'is-modified': item.modified,
                        'is-moved': item.moved
                    },
                    _a["Table-tr--hasItemAction"] = itemAction,
                    _a["Table-tr--odd"] = itemIndex % 2 === 0,
                    _a["Table-tr--even"] = itemIndex % 2 === 1,
                    _a)) },
                react_1.default.createElement("td", { className: cx("Table-foot"), colSpan: footableColSpan },
                    react_1.default.createElement("table", { className: cx("Table-footTable") },
                        react_1.default.createElement("tbody", null, ignoreFootableContent
                            ? columns.map(function (column) { return (react_1.default.createElement("tr", { key: column.index },
                                column.label !== false ? react_1.default.createElement("th", null) : null,
                                react_1.default.createElement("td", null))); })
                            : columns.map(function (column) { return (react_1.default.createElement("tr", { key: column.index },
                                column.label !== false ? (react_1.default.createElement("th", null, render("".concat(regionPrefix).concat(itemIndex, "/").concat(column.index, "/tpl"), column.label))) : null,
                                renderCell("".concat(regionPrefix).concat(itemIndex, "/").concat(column.index), column, item, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { width: null, rowIndex: itemIndex, colIndex: column.index, key: column.index, onAction: _this.handleAction, onQuickChange: _this.handleQuickChange, onChange: _this.handleChange })))); }))))));
        }
        if (parent && !parent.expanded) {
            return null;
        }
        return (react_1.default.createElement("tr", { onClick: checkOnItemClick || itemAction ? this.handleItemClick : undefined, "data-index": item.depth === 1 ? item.newIndex : undefined, "data-id": item.id, className: cx(itemClassName, (_b = {
                    'is-hovered': item.isHover,
                    'is-checked': item.checked,
                    'is-modified': item.modified,
                    'is-moved': item.moved,
                    'is-expanded': item.expanded && item.expandable,
                    'is-expandable': item.expandable
                },
                _b["Table-tr--hasItemAction"] = itemAction,
                _b["Table-tr--odd"] = itemIndex % 2 === 0,
                _b["Table-tr--even"] = itemIndex % 2 === 1,
                _b), "Table-tr--".concat(item.depth, "th")) }, columns.map(function (column) {
            return renderCell("".concat(itemIndex, "/").concat(column.index), column, item, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { rowIndex: itemIndex, colIndex: column.index, key: column.index, onAction: _this.handleAction, onQuickChange: _this.handleQuickChange, onChange: _this.handleChange }));
        })));
    };
    TableRow = (0, tslib_1.__decorate)([
        mobx_react_1.observer,
        (0, tslib_1.__metadata)("design:paramtypes", [Object])
    ], TableRow);
    return TableRow;
}(react_1.default.Component));
exports.TableRow = TableRow;
//# sourceMappingURL=./renderers/Table/TableRow.js.map
