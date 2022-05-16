"use strict";
/**
 * @file 用于表格类型的展现效果，界面可定制化能力更强
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableViewRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var defaultPadding = 'var(--TableCell-paddingY) var(--TableCell-paddingX)';
var TableView = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableView, _super);
    function TableView(props) {
        return _super.call(this, props) || this;
    }
    TableView.prototype.renderTd = function (td, colIndex, rowIndex) {
        var _a = this.props, border = _a.border, borderColor = _a.borderColor, render = _a.render, style = _a.style;
        var key = "td-".concat(colIndex);
        var styleBorder;
        if (border) {
            styleBorder = "1px solid ".concat(borderColor);
        }
        return (react_1.default.createElement("td", { style: (0, tslib_1.__assign)({ border: styleBorder, color: td.color, fontWeight: td.bold ? 'bold' : 'normal', background: td.background, padding: td.padding || defaultPadding, width: td.width || 'auto', textAlign: td.align || 'left', verticalAlign: td.valign || 'center' }, style), align: td.align, valign: td.valign, rowSpan: td.rowspan, colSpan: td.colspan, key: key }, this.renderTdBody(td.body)));
    };
    TableView.prototype.renderTdBody = function (body) {
        var render = this.props.render;
        return render('td', body || '');
    };
    TableView.prototype.renderTds = function (tds, rowIndex) {
        var _this = this;
        return tds.map(function (td, colIndex) { return _this.renderTd(td, colIndex, rowIndex); });
    };
    TableView.prototype.renderTr = function (tr, rowIndex) {
        var key = "tr-".concat(rowIndex);
        return (react_1.default.createElement("tr", { style: (0, tslib_1.__assign)({ height: tr.height, background: tr.background }, tr.style), key: key }, this.renderTds(tr.tds || [], rowIndex)));
    };
    TableView.prototype.renderTrs = function (trs) {
        var _this = this;
        var tr = trs.map(function (tr, rowIndex) { return _this.renderTr(tr, rowIndex); });
        return tr;
    };
    TableView.prototype.renderCols = function () {
        var cols = this.props.cols;
        if (cols) {
            var colsElement = cols.map(function (col) {
                return react_1.default.createElement("col", { span: col.span, style: col.style });
            });
            return react_1.default.createElement("colgroup", null, colsElement);
        }
        return null;
    };
    TableView.prototype.renderCaption = function () {
        if (this.props.caption) {
            return (react_1.default.createElement("caption", { style: {
                    captionSide: this.props.captionSide === 'bottom' ? 'bottom' : 'top'
                } }, this.props.caption));
        }
        return null;
    };
    TableView.prototype.render = function () {
        var _a = this.props, width = _a.width, border = _a.border, borderColor = _a.borderColor, trs = _a.trs, cx = _a.classnames, className = _a.className;
        var styleBorder;
        if (border) {
            styleBorder = "1px solid ".concat(borderColor);
        }
        return (react_1.default.createElement("table", { className: cx('TableView', className), style: { width: width, border: styleBorder, borderCollapse: 'collapse' } },
            this.renderCaption(),
            this.renderCols(),
            react_1.default.createElement("tbody", null, this.renderTrs(trs))));
    };
    TableView.defaultProps = {
        padding: defaultPadding,
        width: '100%',
        border: true,
        borderColor: 'var(--borderColor)'
    };
    return TableView;
}(react_1.default.Component));
exports.default = TableView;
var TableViewRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TableViewRenderer, _super);
    function TableViewRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableViewRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'table-view'
        })
    ], TableViewRenderer);
    return TableViewRenderer;
}(TableView));
exports.TableViewRenderer = TableViewRenderer;
//# sourceMappingURL=./renderers/TableView.js.map
