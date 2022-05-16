"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
var tslib_1 = require("tslib");
/**
 * @file 给组件用的，渲染器里面不要用这个
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var react_hook_form_1 = require("react-hook-form");
var use_validation_resolver_1 = require("../hooks/use-validation-resolver");
var locale_1 = require("../locale");
function Form(props) {
    var _a;
    var cx = props.classnames;
    var methods = (0, react_hook_form_1.useForm)({
        defaultValues: props.defaultValues,
        resolver: (0, use_validation_resolver_1.useValidationResolver)(props.translate)
    });
    react_1.default.useEffect(function () {
        if (props.forwardRef) {
            // 这个模式别的组件没见到过不知道后续会不会不允许
            props.forwardRef.current = {
                submit: function () {
                    return new Promise(function (resolve, reject) {
                        methods.handleSubmit(function (values) { return resolve(values); }, function () { return resolve(false); })();
                    });
                }
            };
        }
        return function () {
            if (props.forwardRef) {
                props.forwardRef.current = undefined;
            }
        };
    });
    return (react_1.default.createElement("form", { className: cx('Form'), onSubmit: methods.handleSubmit(props.onSubmit), noValidate: true },
        react_1.default.createElement("input", { type: "submit", style: { display: 'none' } }), (_a = props.children) === null || _a === void 0 ? void 0 :
        _a.call(props, methods)));
}
exports.Form = Form;
var ThemedForm = (0, theme_1.themeable)((0, locale_1.localeable)(Form));
exports.default = react_1.default.forwardRef(function (props, ref) { return (react_1.default.createElement(ThemedForm, (0, tslib_1.__assign)({}, props, { forwardRef: ref }))); });
//# sourceMappingURL=./components/Form.js.map
