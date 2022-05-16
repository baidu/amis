"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaPicker = void 0;
var tslib_1 = require("tslib");
var uncontrollable_1 = require("uncontrollable");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Editor_1 = require("./Editor");
var helper_1 = require("../../utils/helper");
var icon_1 = require("../../utils/icon");
var Editor_2 = (0, tslib_1.__importDefault)(require("./Editor"));
var ResultBox_1 = (0, tslib_1.__importDefault)(require("../ResultBox"));
var Button_1 = (0, tslib_1.__importDefault)(require("../Button"));
var icons_1 = require("../icons");
var Modal_1 = (0, tslib_1.__importDefault)(require("../Modal"));
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var amis_formula_1 = require("amis-formula");
var FormulaPicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FormulaPicker, _super);
    function FormulaPicker(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isOpened: false,
            value: _this.props.value,
            editorValue: _this.props.value,
            isError: false
        };
        _this.props.onRef && _this.props.onRef(_this);
        return _this;
    }
    FormulaPicker.prototype.handleConfirm = function () {
        var _a, _b;
        var value = this.state.value;
        if (this.props.onConfirm) {
            this.props.onConfirm(value);
        }
        else {
            (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        }
    };
    FormulaPicker.prototype.renderFormulaValue = function (item) {
        var _a = this.props, allowInput = _a.allowInput, cx = _a.classnames;
        var html = { __html: item.html };
        if (allowInput) {
            return '';
        }
        return (react_1.default.createElement("div", { className: cx('FormulaPicker-ResultBox'), dangerouslySetInnerHTML: html }));
    };
    FormulaPicker.prototype.handleInputChange = function (value) {
        var _this = this;
        this.setState({ value: value }, function () { return _this.handleConfirm(); });
    };
    FormulaPicker.prototype.handleEditorChange = function (value) {
        this.setState({
            editorValue: value,
            isError: false
        });
    };
    FormulaPicker.prototype.handleEditorConfirm = function () {
        var _this = this;
        var __ = this.props.translate;
        var value = this.state.editorValue;
        var validate = this.validate(value);
        if (validate === true) {
            this.setState({ value: value }, function () {
                _this.close(undefined, function () { return _this.handleConfirm(); });
            });
        }
        else {
            this.setState({ isError: validate });
        }
    };
    FormulaPicker.prototype.handleClick = function () {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var state, _c;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = [{}];
                        return [4 /*yield*/, ((_b = (_a = this.props).onPickerOpen) === null || _b === void 0 ? void 0 : _b.call(_a, this.props))];
                    case 1:
                        state = tslib_1.__assign.apply(void 0, [tslib_1.__assign.apply(void 0, _c.concat([(_d.sent())])), { editorValue: this.props.value, isOpened: true }]);
                        this.setState(state);
                        return [2 /*return*/];
                }
            });
        });
    };
    FormulaPicker.prototype.close = function (e, callback) {
        this.setState({
            isOpened: false,
            isError: false
        }, function () {
            if (callback) {
                callback();
                return;
            }
        });
    };
    FormulaPicker.prototype.updateState = function (state) {
        if (state === void 0) { state = {}; }
        var isOpened = state.isOpened, rest = (0, tslib_1.__rest)(state, ["isOpened"]);
        this.setState((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.state), rest));
    };
    FormulaPicker.prototype.validate = function (value) {
        var __ = this.props.translate;
        try {
            var ast = (0, amis_formula_1.parse)(value, {
                evalMode: this.props.evalMode,
                allowFilter: false
            });
            new amis_formula_1.Evaluator({}).evalute(ast);
            return true;
        }
        catch (e) {
            if (/\s(\d+:\d+)$/.test(e.message)) {
                var _a = /\s(\d+:\d+)$/.exec(e.message) || [], position = _a[1];
                return position;
            }
            return e.message;
        }
    };
    FormulaPicker.prototype.render = function () {
        var _a, _b, _c;
        var _d, _e, _f, _g, _h;
        var _j = this.props, cx = _j.classnames, __ = _j.translate, disabled = _j.disabled, allowInput = _j.allowInput, className = _j.className, onChange = _j.onChange, size = _j.size, borderMode = _j.borderMode, placeholder = _j.placeholder, mode = _j.mode, btnLabel = _j.btnLabel, level = _j.level, btnSize = _j.btnSize, icon = _j.icon, title = _j.title, clearable = _j.clearable, variables = _j.variables, functions = _j.functions, children = _j.children, variableMode = _j.variableMode, rest = (0, tslib_1.__rest)(_j, ["classnames", "translate", "disabled", "allowInput", "className", "onChange", "size", "borderMode", "placeholder", "mode", "btnLabel", "level", "btnSize", "icon", "title", "clearable", "variables", "functions", "children", "variableMode"]);
        var _k = this.state, isOpened = _k.isOpened, value = _k.value, editorValue = _k.editorValue, isError = _k.isError;
        var iconElement = (0, icon_1.generateIcon)(cx, icon, 'Icon');
        return (react_1.default.createElement(react_1.default.Fragment, null,
            children ? (children({
                isOpened: this.state.isOpened,
                onClick: this.handleClick,
                setState: this.updateState
            })) : (react_1.default.createElement("div", { className: cx('FormulaPicker', className) }, mode === 'button' ? (react_1.default.createElement(Button_1.default, { className: cx('FormulaPicker-action', 'w-full'), level: level, size: btnSize, onClick: this.handleClick },
                iconElement ? (react_1.default.cloneElement(iconElement, {
                    className: cx((_e = (_d = iconElement === null || iconElement === void 0 ? void 0 : iconElement.props) === null || _d === void 0 ? void 0 : _d.className) !== null && _e !== void 0 ? _e : '', 'FormulaPicker-icon', (_a = {},
                        _a['is-filled'] = !!value,
                        _a))
                })) : (react_1.default.createElement(icons_1.Icon, { icon: "function", className: cx('FormulaPicker-icon', 'icon', (_b = {},
                        _b['is-filled'] = !!value,
                        _b)) })),
                react_1.default.createElement("span", { className: cx('FormulaPicker-label') }, __(btnLabel || 'FormulaEditor.btnLabel')))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ResultBox_1.default, { className: cx('FormulaPicker-input', isOpened ? 'is-active' : '', !!isError ? 'is-error' : ''), allowInput: allowInput, clearable: clearable, value: value, result: allowInput
                        ? void 0
                        : Editor_1.FormulaEditor.highlightValue(value, variables, this.props.evalMode), itemRender: this.renderFormulaValue, onResultChange: helper_1.noop, onChange: this.handleInputChange, disabled: disabled, borderMode: borderMode, placeholder: placeholder }),
                react_1.default.createElement(Button_1.default, { className: cx('FormulaPicker-action'), onClick: this.handleClick },
                    react_1.default.createElement(icons_1.Icon, { icon: "function", className: cx('FormulaPicker-icon', 'icon', (_c = {},
                            _c['is-filled'] = !!value,
                            _c)) })))))),
            react_1.default.createElement(Modal_1.default, { size: "md", closeOnEsc: true, show: this.state.isOpened, onHide: this.close },
                react_1.default.createElement(Modal_1.default.Header, { onClose: this.close, className: "font-bold" }, __(title || 'FormulaEditor.title')),
                react_1.default.createElement(Modal_1.default.Body, null,
                    react_1.default.createElement(Editor_2.default, (0, tslib_1.__assign)({}, rest, { variables: (_f = this.state.variables) !== null && _f !== void 0 ? _f : variables, functions: (_g = this.state.functions) !== null && _g !== void 0 ? _g : functions, variableMode: (_h = this.state.variableMode) !== null && _h !== void 0 ? _h : variableMode, value: editorValue, onChange: this.handleEditorChange }))),
                react_1.default.createElement(Modal_1.default.Footer, null,
                    !!isError ? (react_1.default.createElement("div", { className: cx('Dialog-info'), key: "info" },
                        react_1.default.createElement("span", { className: cx('Dialog-error') }, __('FormulaEditor.invalidData', { err: isError })))) : null,
                    react_1.default.createElement(Button_1.default, { onClick: this.close }, __('cancel')),
                    react_1.default.createElement(Button_1.default, { onClick: this.handleEditorConfirm, level: "primary" }, __('confirm'))))));
    };
    FormulaPicker.defaultProps = {
        evalMode: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "handleConfirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "renderFormulaValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "handleInputChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "handleEditorChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "handleEditorConfirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], FormulaPicker.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Function]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "updateState", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaPicker.prototype, "validate", null);
    return FormulaPicker;
}(react_1.default.Component));
exports.FormulaPicker = FormulaPicker;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(FormulaPicker, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/formula/Picker.js.map
