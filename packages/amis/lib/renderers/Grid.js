"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRenderer = exports.ColProps = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var pick_1 = (0, tslib_1.__importDefault)(require("lodash/pick"));
var helper_1 = require("../utils/helper");
exports.ColProps = ['lg', 'md', 'sm', 'xs'];
function fromBsClass(cn) {
    if (typeof cn === 'string' && cn) {
        return cn.replace(/\bcol-(xs|sm|md|lg)-(\d+)\b/g, function (_, bp, size) { return "Grid-col--".concat(bp).concat(size); });
    }
    return cn;
}
function copProps2Class(props) {
    var cns = [];
    var modifiers = exports.ColProps;
    modifiers.forEach(function (modifier) {
        return props &&
            props[modifier] &&
            cns.push("Grid-col--".concat(modifier).concat((0, helper_1.ucFirst)(props[modifier])));
    });
    cns.length || cns.push('Grid-col--md');
    return cns.join(' ');
}
var Grid = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Grid, _super);
    function Grid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Grid.prototype.renderChild = function (region, node, length, props) {
        if (props === void 0) { props = {}; }
        var _a = this.props, render = _a.render, itemRender = _a.itemRender;
        return itemRender
            ? itemRender(node, length, this.props)
            : render(region, node, props);
    };
    Grid.prototype.renderColumn = function (column, key, length) {
        var _a;
        var colProps = (0, pick_1.default)(column, exports.ColProps);
        colProps = (0, tslib_1.__assign)({}, colProps);
        var _b = this.props, cx = _b.classnames, formMode = _b.formMode, subFormMode = _b.subFormMode, subFormHorizontal = _b.subFormHorizontal, formHorizontal = _b.formHorizontal, __ = _b.translate, disabled = _b.disabled;
        return (react_1.default.createElement("div", { key: key, className: cx(copProps2Class(colProps), fromBsClass(column.columnClassName), (_a = {},
                _a["Grid-col--v".concat((0, helper_1.ucFirst)(column.valign))] = column.valign,
                _a)) }, this.renderChild("column/".concat(key), column.body || '', length, {
            disabled: disabled,
            formMode: column.mode || subFormMode || formMode,
            formHorizontal: column.horizontal || subFormHorizontal || formHorizontal
        })));
    };
    Grid.prototype.renderColumns = function (columns) {
        var _this = this;
        return Array.isArray(columns)
            ? columns.map(function (column, key) {
                return _this.renderColumn(column, key, columns.length);
            })
            : null;
    };
    Grid.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, gap = _b.gap, vAlign = _b.valign, hAlign = _b.align;
        return (react_1.default.createElement("div", { className: cx('Grid', (_a = {},
                _a["Grid--".concat(gap)] = gap,
                _a["Grid--v".concat((0, helper_1.ucFirst)(vAlign))] = vAlign,
                _a["Grid--h".concat((0, helper_1.ucFirst)(hAlign))] = hAlign,
                _a), className) }, this.renderColumns(this.props.columns)));
    };
    Grid.propsList = ['columns'];
    Grid.defaultProps = {};
    return Grid;
}(react_1.default.Component));
exports.default = Grid;
var GridRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(GridRenderer, _super);
    function GridRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'grid'
        })
    ], GridRenderer);
    return GridRenderer;
}(Grid));
exports.GridRenderer = GridRenderer;
//# sourceMappingURL=./renderers/Grid.js.map
