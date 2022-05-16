"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaEditor = void 0;
var tslib_1 = require("tslib");
/**
 * @file 公式编辑器
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var uncontrollable_1 = require("uncontrollable");
var amis_formula_1 = require("amis-formula");
var doc_1 = require("amis-formula/dist/doc");
var plugin_1 = require("./plugin");
var FuncList_1 = (0, tslib_1.__importDefault)(require("./FuncList"));
var VariableList_1 = (0, tslib_1.__importDefault)(require("./VariableList"));
var CodeMirror_1 = (0, tslib_1.__importDefault)(require("../CodeMirror"));
var helper_1 = require("../../utils/helper");
var theme_1 = require("../../theme");
var locale_1 = require("../../locale");
var FormulaEditor = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FormulaEditor, _super);
    function FormulaEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            focused: false
        };
        return _this;
    }
    FormulaEditor.buildDefaultFunctions = function (doc) {
        var funcs = [];
        doc.forEach(function (item) {
            var namespace = item.namespace || 'Others';
            var exists = funcs.find(function (item) { return item.groupName === namespace; });
            if (!exists) {
                exists = {
                    groupName: namespace,
                    items: []
                };
                funcs.push(exists);
            }
            exists.items.push(item);
        });
        return funcs;
    };
    FormulaEditor.highlightValue = function (value, variables, evalMode) {
        if (evalMode === void 0) { evalMode = true; }
        if (!Array.isArray(variables) || !variables.length || !value) {
            return;
        }
        var varMap = {};
        (0, helper_1.eachTree)(variables, function (item) {
            if (item.value) {
                var key = item.value;
                varMap[key] = item.label;
            }
        });
        var vars = Object.keys(varMap)
            .filter(function (item) { return item; })
            .sort(function (a, b) { return b.length - a.length; });
        var content = value || '';
        var html = '';
        // 标记方法调用
        html = content.replace(/([A-Z]+)\s*\(/g, function (_, func, pos) {
            return _ === null || _ === void 0 ? void 0 : _.replace(func, "<span class=\"c-func\">".concat(func, "</span>"));
        });
        vars.forEach(function (v) {
            var from = 0;
            var idx = -1;
            while (~(idx = content.indexOf(v, from))) {
                html = html.replace(v, "<span class=\"c-field\">".concat(varMap[v], "</span>"));
                from = idx + v.length;
            }
        });
        return { html: html };
    };
    FormulaEditor.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.editorPlugin) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    FormulaEditor.prototype.handleFocus = function () {
        this.setState({
            focused: true
        });
    };
    FormulaEditor.prototype.handleBlur = function () {
        this.setState({
            focused: false
        });
    };
    FormulaEditor.prototype.insertValue = function (value, type) {
        var _a;
        (_a = this.editorPlugin) === null || _a === void 0 ? void 0 : _a.insertContent(value, type);
    };
    FormulaEditor.prototype.handleEditorMounted = function (cm, editor) {
        var _this = this;
        this.editorPlugin = new plugin_1.FormulaPlugin(editor, cm, function () { return _this.props; });
    };
    FormulaEditor.prototype.validate = function () {
        var value = this.props.value;
        try {
            value
                ? (0, amis_formula_1.parse)(value, {
                    evalMode: this.props.evalMode
                })
                : null;
        }
        catch (e) {
            return e.message;
        }
        return;
    };
    FormulaEditor.prototype.handleFunctionSelect = function (item) {
        var _a;
        (_a = this.editorPlugin) === null || _a === void 0 ? void 0 : _a.insertContent("".concat(item.name), 'func');
    };
    FormulaEditor.prototype.handleVariableSelect = function (item) {
        var _a;
        (_a = this.editorPlugin) === null || _a === void 0 ? void 0 : _a.insertContent({
            key: item.value,
            name: item.label
        }, 'variable');
    };
    FormulaEditor.prototype.handleOnChange = function (value) {
        var onChange = this.props.onChange;
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    FormulaEditor.prototype.editorFactory = function (dom, cm) {
        return (0, plugin_1.editorFactory)(dom, cm, this.props);
    };
    FormulaEditor.prototype.render = function () {
        var _a = this.props, variables = _a.variables, header = _a.header, value = _a.value, functions = _a.functions, variableMode = _a.variableMode, __ = _a.translate, cx = _a.classnames, variableClassName = _a.variableClassName, functionClassName = _a.functionClassName, classPrefix = _a.classPrefix;
        var focused = this.state.focused;
        var customFunctions = Array.isArray(functions) ? functions : [];
        var functionList = (0, tslib_1.__spreadArray)((0, tslib_1.__spreadArray)([], FormulaEditor.buildDefaultFunctions(doc_1.doc), true), customFunctions, true);
        return (react_1.default.createElement("div", { className: cx("FormulaEditor", {
                'is-focused': focused
            }) },
            react_1.default.createElement("section", { className: cx("FormulaEditor-content") },
                react_1.default.createElement("header", { className: cx("FormulaEditor-header") }, __(header || 'FormulaEditor.title')),
                react_1.default.createElement(CodeMirror_1.default, { className: cx('FormulaEditor-editor'), value: value, onChange: this.handleOnChange, editorFactory: this.editorFactory, editorDidMount: this.handleEditorMounted, onFocus: this.handleFocus, onBlur: this.handleBlur })),
            react_1.default.createElement("section", { className: cx('FormulaEditor-settings') },
                react_1.default.createElement("div", { className: cx('FormulaEditor-panel') },
                    variableMode !== 'tabs' ? (react_1.default.createElement("div", { className: cx('FormulaEditor-panel-header') }, __('FormulaEditor.variable'))) : null,
                    react_1.default.createElement("div", { className: cx('FormulaEditor-panel-body', variableMode && "FormulaEditor-panel-body--".concat(variableMode)) },
                        react_1.default.createElement(VariableList_1.default, { classPrefix: classPrefix, className: cx('FormulaEditor-VariableList', 'FormulaEditor-VariableList-root', variableClassName), selectMode: variableMode, data: variables, onSelect: this.handleVariableSelect }))),
                react_1.default.createElement(FuncList_1.default, { className: functionClassName, title: __('FormulaEditor.function'), data: functionList, onSelect: this.handleFunctionSelect }))));
    };
    var _a;
    FormulaEditor.defaultProps = {
        variables: [],
        evalMode: true
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "insertValue", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "handleEditorMounted", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "validate", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "handleFunctionSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "handleVariableSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "handleOnChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof HTMLElement !== "undefined" && HTMLElement) === "function" ? _a : Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaEditor.prototype, "editorFactory", null);
    return FormulaEditor;
}(react_1.default.Component));
exports.FormulaEditor = FormulaEditor;
exports.default = (0, uncontrollable_1.uncontrollable)((0, theme_1.themeable)((0, locale_1.localeable)(FormulaEditor)), {
    value: 'onChange'
}, ['validate']);
//# sourceMappingURL=./components/formula/Editor.js.map
