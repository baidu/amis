"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HBoxRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var HBox = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HBox, _super);
    function HBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HBox.prototype.renderChild = function (region, node, props) {
        if (props === void 0) { props = {}; }
        var render = this.props.render;
        return render(region, node, props);
    };
    HBox.prototype.renderColumn = function (column, key, length) {
        var _a;
        var _b = this.props, itemRender = _b.itemRender, data = _b.data, cx = _b.classnames, subFormMode = _b.subFormMode, subFormHorizontal = _b.subFormHorizontal, formMode = _b.formMode, formHorizontal = _b.formHorizontal;
        if (!(0, helper_1.isVisible)(column, data) || !column) {
            return null;
        }
        var style = (0, tslib_1.__assign)({ width: column.width, height: column.height }, column.style);
        return (react_1.default.createElement("div", { key: key, className: cx("Hbox-col", style.width === 'auto'
                ? 'Hbox-col--auto'
                : style.width
                    ? 'Hbox-col--customWidth'
                    : '', (_a = {},
                _a["Hbox-col--v".concat((0, helper_1.ucFirst)(column.valign))] = column.valign,
                _a), column.columnClassName), style: style }, itemRender
            ? itemRender(column, key, length, this.props)
            : this.renderChild("column/".concat(key), column.body, {
                formMode: column.mode || subFormMode || formMode,
                formHorizontal: column.horizontal || subFormHorizontal || formHorizontal
            })));
    };
    HBox.prototype.renderColumns = function () {
        var _this = this;
        var columns = this.props.columns;
        return columns.map(function (column, key) {
            return _this.renderColumn(column, key, columns.length);
        });
    };
    HBox.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, cx = _b.classnames, gap = _b.gap, vAlign = _b.valign, hAlign = _b.align;
        return (react_1.default.createElement("div", { className: cx("Hbox", className, (_a = {},
                _a["Hbox--".concat(gap)] = gap,
                _a["Hbox--v".concat((0, helper_1.ucFirst)(vAlign))] = vAlign,
                _a["Hbox--h".concat((0, helper_1.ucFirst)(hAlign))] = hAlign,
                _a)) }, this.renderColumns()));
    };
    HBox.propsList = ['columns'];
    HBox.defaultProps = {
        gap: 'xs'
    };
    return HBox;
}(react_1.default.Component));
exports.default = HBox;
var HBoxRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(HBoxRenderer, _super);
    function HBoxRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HBoxRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'hbox'
        })
    ], HBoxRenderer);
    return HBoxRenderer;
}(HBox));
exports.HBoxRenderer = HBoxRenderer;
//# sourceMappingURL=./renderers/HBox.js.map
