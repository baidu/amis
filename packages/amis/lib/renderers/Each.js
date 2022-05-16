"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EachRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var helper_1 = require("../utils/helper");
var Each = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Each, _super);
    function Each() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Each.prototype.render = function () {
        var _a = this.props, data = _a.data, name = _a.name, className = _a.className, render = _a.render, items = _a.items, placeholder = _a.placeholder, cx = _a.classnames, __ = _a.translate;
        var value = (0, helper_1.getPropValue)(this.props, function (props) {
            return props.source && !props.name
                ? (0, tpl_builtin_1.resolveVariableAndFilter)(props.source, props.data, '| raw')
                : undefined;
        });
        var arr = (0, helper_1.isObject)(value)
            ? Object.keys(value).map(function (key) { return ({
                key: key,
                value: value[key]
            }); })
            : Array.isArray(value)
                ? value
                : [];
        return (react_1.default.createElement("div", { className: cx('Each', className) }, Array.isArray(arr) && arr.length && items ? (arr.map(function (item, index) {
            var _a;
            return render("item/".concat(index), items, {
                data: (0, helper_1.createObject)(data, (0, helper_1.isObject)(item)
                    ? (0, tslib_1.__assign)({ index: index }, item) : (_a = {}, _a[name] = item, _a.item = item, _a.index = index, _a)),
                key: index
            });
        })) : (react_1.default.createElement("div", { className: cx('Each-placeholder') }, render('placeholder', __(placeholder))))));
    };
    Each.propsList = ['name', 'items', 'value'];
    Each.defaultProps = {
        className: '',
        placeholder: 'placeholder.noData'
    };
    return Each;
}(react_1.default.Component));
exports.default = Each;
var EachRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(EachRenderer, _super);
    function EachRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EachRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'each'
        })
    ], EachRenderer);
    return EachRenderer;
}(Each));
exports.EachRenderer = EachRenderer;
//# sourceMappingURL=./renderers/Each.js.map
