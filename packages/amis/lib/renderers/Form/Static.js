"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticFieldRenderer = exports.StaticControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var Table_1 = require("../Table");
var PopOver_1 = (0, tslib_1.__importDefault)(require("../PopOver"));
var QuickEdit_1 = (0, tslib_1.__importDefault)(require("../QuickEdit"));
var Copyable_1 = (0, tslib_1.__importDefault)(require("../Copyable"));
var helper_1 = require("../../utils/helper");
var omit = require("lodash/omit");
var StaticControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(StaticControl, _super);
    function StaticControl(props) {
        var _this = _super.call(this, props) || this;
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        return _this;
    }
    StaticControl.prototype.handleQuickChange = function (values, saveImmediately) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onBulkChange, onAction, data;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onBulkChange = _a.onBulkChange, onAction = _a.onAction, data = _a.data;
                        if (!(saveImmediately && saveImmediately.api)) return [3 /*break*/, 2];
                        return [4 /*yield*/, onAction(null, {
                                actionType: 'ajax',
                                api: saveImmediately.api
                            }, (0, helper_1.extendObject)(data, values), true)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        onBulkChange && onBulkChange(values, saveImmediately === true);
                        return [2 /*return*/];
                }
            });
        });
    };
    StaticControl.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, value = _b.value, label = _b.label, type = _b.type, render = _b.render, children = _b.children, data = _b.data, cx = _b.classnames, name = _b.name, disabled = _b.disabled, $schema = _b.$schema, defaultValue = _b.defaultValue, borderMode = _b.borderMode, rest = (0, tslib_1.__rest)(_b, ["className", "value", "label", "type", "render", "children", "data", "classnames", "name", "disabled", "$schema", "defaultValue", "borderMode"]);
        var subType = /^static/.test(type)
            ? type.substring(7) || (rest.tpl ? 'tpl' : 'plain')
            : type;
        var field = (0, tslib_1.__assign)((0, tslib_1.__assign)({ label: label, name: name }, $schema), { type: subType });
        return (react_1.default.createElement("div", { className: cx('Form-static', (_a = {},
                _a["Form-static--border".concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a)) },
            react_1.default.createElement(StaticFieldRenderer, (0, tslib_1.__assign)({}, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), { name: name, render: render, field: field, value: value === defaultValue ? undefined : value, className: className, onQuickChange: this.handleQuickChange, data: data, disabled: disabled, classnames: cx })))));
    };
    StaticControl.defaultProps = {
        placeholder: '-'
    };
    return StaticControl;
}(react_1.default.Component));
exports.default = StaticControl;
var StaticControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(StaticControlRenderer, _super);
    function StaticControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            test: /(^|\/)static(\-[^\/]+)?$/,
            weight: -90,
            strictMode: false,
            sizeMutable: false,
            name: 'static'
        })
    ], StaticControlRenderer);
    return StaticControlRenderer;
}(StaticControl));
exports.StaticControlRenderer = StaticControlRenderer;
var StaticFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(StaticFieldRenderer, _super);
    function StaticFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticFieldRenderer.prototype.render = function () {
        var _a = this.props, type = _a.type, className = _a.className, render = _a.render, style = _a.style, Component = _a.wrapperComponent, labelClassName = _a.labelClassName, value = _a.value, data = _a.data, children = _a.children, width = _a.width, inputClassName = _a.inputClassName, label = _a.label, tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, field = _a.field, rest = (0, tslib_1.__rest)(_a, ["type", "className", "render", "style", "wrapperComponent", "labelClassName", "value", "data", "children", "width", "inputClassName", "label", "tabIndex", "onKeyUp", "field"]);
        var schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, field), { className: inputClassName, type: (field && field.type) || 'plain' });
        var body = children
            ? children
            : render('field', schema, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, omit(rest, Object.keys(schema))), { value: value, data: data }));
        if (width) {
            style = style || {};
            style.width = style.width || width;
        }
        if (!Component) {
            return body;
        }
        return (react_1.default.createElement(Component, { style: style, className: className, tabIndex: tabIndex, onKeyUp: onKeyUp }, body));
    };
    StaticFieldRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, Table_1.TableCell.defaultProps), { wrapperComponent: 'div' });
    StaticFieldRenderer = (0, tslib_1.__decorate)([
        (0, QuickEdit_1.default)(),
        (0, PopOver_1.default)({
            position: 'right'
        }),
        (0, Copyable_1.default)()
    ], StaticFieldRenderer);
    return StaticFieldRenderer;
}(Table_1.TableCell));
exports.StaticFieldRenderer = StaticFieldRenderer;
//# sourceMappingURL=./renderers/Form/Static.js.map
