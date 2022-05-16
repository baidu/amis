"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONFieldRenderer = exports.JSONField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var react_json_view_1 = tslib_1.__importStar(require("react-json-view"));
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var JSONField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(JSONField, _super);
    function JSONField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONField.prototype.emitChange = function (e) {
        var _a = this.props, onChange = _a.onChange, name = _a.name;
        if (!name || !onChange) {
            return false;
        }
        onChange(e.updated_src, name);
        return true;
    };
    JSONField.prototype.shouldExpandNode = function (_a) {
        var namespace = _a.namespace;
        var levelExpand = this.props.levelExpand;
        if (typeof levelExpand !== 'number') {
            return false;
        }
        return namespace.length > levelExpand;
    };
    JSONField.prototype.render = function () {
        var _a;
        var _b;
        var _c = this.props, className = _c.className, jsonTheme = _c.jsonTheme, cx = _c.classnames, placeholder = _c.placeholder, source = _c.source, levelExpand = _c.levelExpand, mutable = _c.mutable, displayDataTypes = _c.displayDataTypes, enableClipboard = _c.enableClipboard, iconStyle = _c.iconStyle, quotesOnKeys = _c.quotesOnKeys, sortKeys = _c.sortKeys, name = _c.name;
        var value = (0, helper_1.getPropValue)(this.props);
        var data = value;
        if (source !== undefined && (0, tpl_builtin_1.isPureVariable)(source)) {
            data = (0, tpl_builtin_1.resolveVariableAndFilter)(source, this.props.data, '| raw');
        }
        else if (typeof value === 'string') {
            // 尝试解析 json
            try {
                data = JSON.parse(value);
            }
            catch (e) { }
        }
        var jsonThemeValue = jsonTheme;
        if ((0, tpl_builtin_1.isPureVariable)(jsonTheme)) {
            jsonThemeValue = (0, tpl_builtin_1.resolveVariableAndFilter)(jsonTheme, this.props.data, '| raw');
        }
        // JsonView 只支持对象，所以不是对象格式需要转成对象格式。
        if (data && ~['string', 'number'].indexOf(typeof data)) {
            data = (_a = {},
                _a[typeof data] = data,
                _a);
        }
        return (react_1.default.createElement("div", { className: cx('JsonField', className) }, typeof data === 'undefined' || data === null ? (placeholder) : (react_1.default.createElement(react_json_view_1.default, { name: false, src: data, theme: (_b = jsonThemeValue) !== null && _b !== void 0 ? _b : 'rjv-default', shouldCollapse: this.shouldExpandNode, enableClipboard: enableClipboard, displayDataTypes: displayDataTypes, iconStyle: iconStyle, quotesOnKeys: quotesOnKeys, sortKeys: sortKeys, onEdit: name && mutable ? this.emitChange : false, onDelete: name && mutable ? this.emitChange : false, onAdd: name && mutable ? this.emitChange : false }))));
    };
    var _a;
    JSONField.defaultProps = {
        placeholder: '-',
        levelExpand: 1,
        source: '',
        displayDataTypes: false,
        enableClipboard: false,
        iconStyle: "square",
        quotesOnKeys: true,
        sortKeys: false,
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_json_view_1.InteractionProps !== "undefined" && react_json_view_1.InteractionProps) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], JSONField.prototype, "emitChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], JSONField.prototype, "shouldExpandNode", null);
    return JSONField;
}(react_1.default.Component));
exports.JSONField = JSONField;
var JSONFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(JSONFieldRenderer, _super);
    function JSONFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'json'
        })
    ], JSONFieldRenderer);
    return JSONFieldRenderer;
}(JSONField));
exports.JSONFieldRenderer = JSONFieldRenderer;
//# sourceMappingURL=./renderers/Json.js.map
