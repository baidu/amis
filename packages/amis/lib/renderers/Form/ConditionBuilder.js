"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionBuilderRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var index_1 = (0, tslib_1.__importDefault)(require("../../components/condition-builder/index"));
var WithRemoteConfig_1 = require("../../components/WithRemoteConfig");
var types_1 = require("../../types");
var helper_1 = require("../../utils/helper");
var ConditionBuilderControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ConditionBuilderControl, _super);
    function ConditionBuilderControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionBuilderControl.prototype.renderEtrValue = function (schema, data) {
        return this.props.render('inline', Object.assign(schema, { label: false }), data);
    };
    ConditionBuilderControl.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, rest = (0, tslib_1.__rest)(_a, ["className", "classnames"]);
        return (react_1.default.createElement("div", { className: cx("ConditionBuilderControl", className) },
            react_1.default.createElement(ConditionBuilderWithRemoteOptions, (0, tslib_1.__assign)({ renderEtrValue: this.renderEtrValue }, rest))));
    };
    var _a;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof types_1.Schema !== "undefined" && types_1.Schema) === "function" ? _a : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ConditionBuilderControl.prototype, "renderEtrValue", null);
    return ConditionBuilderControl;
}(react_1.default.PureComponent));
exports.default = ConditionBuilderControl;
var ConditionBuilderWithRemoteOptions = (0, WithRemoteConfig_1.withRemoteConfig)({
    adaptor: function (data) { return data.fields || data; }
})(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, loading = _a.loading, config = _a.config, deferLoad = _a.deferLoad, disabled = _a.disabled, renderEtrValue = _a.renderEtrValue, rest = (0, tslib_1.__rest)(_a, ["loading", "config", "deferLoad", "disabled", "renderEtrValue"]);
        return (react_1.default.createElement(index_1.default, (0, tslib_1.__assign)({}, rest, { fields: config || rest.fields || [], disabled: disabled || loading, renderEtrValue: renderEtrValue })));
    };
    return class_1;
}(react_1.default.Component)));
var ConditionBuilderRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ConditionBuilderRenderer, _super);
    function ConditionBuilderRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionBuilderRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'condition-builder',
            strictMode: false
        })
    ], ConditionBuilderRenderer);
    return ConditionBuilderRenderer;
}(ConditionBuilderControl));
exports.ConditionBuilderRenderer = ConditionBuilderRenderer;
//# sourceMappingURL=./renderers/Form/ConditionBuilder.js.map
