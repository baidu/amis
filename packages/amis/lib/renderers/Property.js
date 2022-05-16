"use strict";
/**
 * @file 表格的方式显示只读信息，比如产品详情
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var helper_1 = require("../utils/helper");
var style_1 = require("../utils/style");
var Property = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Property, _super);
    function Property(props) {
        return _super.call(this, props) || this;
    }
    /**
     * 算好每行的分布情况，方便后续渲染
     */
    Property.prototype.prepareRows = function () {
        var _a = this.props, _b = _a.column, column = _b === void 0 ? 3 : _b, items = _a.items, source = _a.source, data = _a.data;
        var propertyItems = (items
            ? items
            : (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw')) || [];
        var rows = [];
        var row = [];
        var columnLeft = column;
        var index = 0;
        var filteredItems = (0, helper_1.visibilityFilter)(propertyItems, data);
        for (var _i = 0, filteredItems_1 = filteredItems; _i < filteredItems_1.length; _i++) {
            var item = filteredItems_1[_i];
            index = index + 1;
            var span = Math.min(item.span || 1, column);
            columnLeft = columnLeft - span;
            var rowItem = {
                label: item.label,
                content: item.content,
                span: span
            };
            // 如果还能放得下就放这一行
            if (columnLeft >= 0) {
                row.push(rowItem);
            }
            else {
                rows.push(row);
                columnLeft = column - span;
                row = [rowItem];
            }
            // 最后一行将最后的数据 push
            if (index === filteredItems.length) {
                rows.push(row);
            }
        }
        return rows;
    };
    Property.prototype.renderRow = function (rows) {
        var _a = this.props, render = _a.render, contentStyle = _a.contentStyle, labelStyle = _a.labelStyle, _b = _a.separator, separator = _b === void 0 ? ': ' : _b, _c = _a.mode, mode = _c === void 0 ? 'table' : _c, data = _a.data;
        return rows.map(function (row, key) {
            return (react_1.default.createElement("tr", { key: key }, row.map(function (property, index) {
                return mode === 'table' ? (react_1.default.createElement(react_1.default.Fragment, { key: "item-".concat(index) },
                    react_1.default.createElement("th", { style: (0, style_1.buildStyle)(labelStyle, data) }, render('label', property.label)),
                    react_1.default.createElement("td", { colSpan: property.span + property.span - 1, style: (0, style_1.buildStyle)(contentStyle, data) }, render('content', property.content)))) : (react_1.default.createElement("td", { colSpan: property.span, style: (0, style_1.buildStyle)(contentStyle, data), key: "item-".concat(index) },
                    react_1.default.createElement("span", { style: (0, style_1.buildStyle)(labelStyle, data) }, render('label', property.label)),
                    separator,
                    render('content', property.content)));
            })));
        });
    };
    Property.prototype.render = function () {
        var _a = this.props, style = _a.style, title = _a.title, _b = _a.column, column = _b === void 0 ? 3 : _b, cx = _a.classnames, className = _a.className, titleStyle = _a.titleStyle, data = _a.data, _c = _a.mode, mode = _c === void 0 ? 'table' : _c;
        var rows = this.prepareRows();
        return (react_1.default.createElement("div", { className: cx('Property', "Property--".concat(mode), className), style: (0, style_1.buildStyle)(style, data) },
            react_1.default.createElement("table", null,
                title ? (react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { colSpan: mode === 'table' ? column + column : column, style: (0, style_1.buildStyle)(titleStyle, data) }, title)))) : null,
                react_1.default.createElement("tbody", null, this.renderRow(rows)))));
    };
    return Property;
}(react_1.default.Component));
exports.default = Property;
var PropertyRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PropertyRenderer, _super);
    function PropertyRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropertyRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'property'
        })
    ], PropertyRenderer);
    return PropertyRenderer;
}(Property));
exports.PropertyRenderer = PropertyRenderer;
//# sourceMappingURL=./renderers/Property.js.map
