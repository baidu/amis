"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
var tslib_1 = require("tslib");
/**
 * @file 给组件用的，渲染器里面不要用这个
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var react_hook_form_1 = require("react-hook-form");
function FormField(props) {
    var _a;
    var mode = props.mode, children = props.children, cx = props.classnames, className = props.className, hasError = props.hasError, isRequired = props.isRequired, label = props.label, description = props.description;
    var errors = Array.isArray(props.errors)
        ? props.errors
        : props.errors
            ? [props.errors]
            : [];
    if (mode === 'horizontal') {
    }
    return (react_1.default.createElement("div", { "data-role": "form-item", className: cx("Form-item Form-item--normal", className, (_a = {
                'is-error': hasError
            },
            _a["is-required"] = isRequired,
            _a)) },
        label ? (react_1.default.createElement("label", { className: cx("Form-label") },
            react_1.default.createElement("span", null,
                label,
                isRequired && label ? (react_1.default.createElement("span", { className: cx("Form-star") }, "*")) : null))) : null,
        children,
        hasError && errors.length ? (react_1.default.createElement("ul", { className: cx("Form-feedback") }, errors.map(function (msg, key) { return (react_1.default.createElement("li", { key: key }, msg)); }))) : null,
        description ? (react_1.default.createElement("div", { className: cx("Form-description") }, description)) : null));
}
var ThemedFormField = (0, theme_1.themeable)(FormField);
exports.default = ThemedFormField;
function Controller(props) {
    var render = props.render, name = props.name, shouldUnregister = props.shouldUnregister, defaultValue = props.defaultValue, control = props.control, rest = (0, tslib_1.__rest)(props, ["render", "name", "shouldUnregister", "defaultValue", "control"]);
    var rules = (0, tslib_1.__assign)({}, props.rules);
    if (rest.isRequired) {
        rules.required = true;
    }
    return (react_1.default.createElement(react_hook_form_1.Controller, { name: name, rules: rules, shouldUnregister: shouldUnregister, defaultValue: defaultValue, control: control, render: function (methods) {
            var _a;
            return (react_1.default.createElement(ThemedFormField, (0, tslib_1.__assign)({}, rest, { hasError: !!methods.fieldState.error, errors: (_a = methods.fieldState.error) === null || _a === void 0 ? void 0 : _a.message }), render(methods)));
        } }));
}
exports.Controller = Controller;
//# sourceMappingURL=./components/FormField.js.map
