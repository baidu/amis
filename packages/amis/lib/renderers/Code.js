"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeRenderer = void 0;
var tslib_1 = require("tslib");
/**
 * @file 代码高亮
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var isEqual_1 = (0, tslib_1.__importDefault)(require("lodash/isEqual"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var Code = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Code, _super);
    function Code(props) {
        var _this = _super.call(this, props) || this;
        _this.toDispose = [];
        _this.codeRef = react_1.default.createRef();
        return _this;
    }
    Code.prototype.componentDidMount = function () {
        var _this = this;
        Promise.resolve().then(function () { return new Promise(function(resolve){require(['monaco-editor'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (monaco) { return _this.handleMonaco(monaco); });
    };
    Code.prototype.componentDidUpdate = function (preProps) {
        var _this = this;
        var props = this.props;
        var sourceCode = (0, helper_1.getPropValue)(this.props);
        var preSourceCode = (0, helper_1.getPropValue)(this.props);
        if (sourceCode !== preSourceCode ||
            (props.customLang && !(0, isEqual_1.default)(props.customLang, preProps.customLang))) {
            var dom_1 = this.codeRef.current;
            dom_1.innerHTML = sourceCode;
            var theme_1 = this.registTheme() || this.props.editorTheme || 'vs';
            setTimeout(function () {
                _this.monaco.editor.colorizeElement(dom_1, {
                    tabSize: _this.props.tabSize,
                    theme: theme_1
                });
            }, 16);
        }
    };
    Code.prototype.handleMonaco = function (monaco) {
        var _this = this;
        this.monaco = monaco;
        if (this.codeRef.current) {
            var dom_2 = this.codeRef.current;
            var theme_2 = this.registTheme() || this.props.editorTheme || 'vs';
            // 这里必须是异步才能准确，可能是因为 monaco 里注册主题是异步的
            setTimeout(function () {
                monaco.editor.colorizeElement(dom_2, {
                    tabSize: _this.props.tabSize,
                    theme: theme_2
                });
            }, 16);
        }
    };
    Code.prototype.registTheme = function () {
        var monaco = this.monaco;
        if (!monaco) {
            return null;
        }
        if (this.customLang &&
            this.customLang.name &&
            this.customLang.tokens &&
            this.customLang.tokens.length) {
            var langName = this.customLang.name;
            monaco.languages.register({ id: langName });
            var tokenizers = [];
            var rules = [];
            for (var _i = 0, _a = this.customLang.tokens; _i < _a.length; _i++) {
                var token = _a[_i];
                var regex = new RegExp(token.regex, token.regexFlags || undefined);
                tokenizers.push([regex, token.name]);
                rules.push({
                    token: token.name,
                    foreground: token.color,
                    background: token.background,
                    fontStyle: token.fontStyle
                });
            }
            monaco.languages.setMonarchTokensProvider(langName, {
                tokenizer: {
                    root: tokenizers
                }
            });
            monaco.editor.defineTheme(langName, {
                base: 'vs',
                inherit: false,
                rules: rules
            });
            return langName;
        }
        return null;
    };
    Code.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, data = _a.data, customLang = _a.customLang, wordWrap = _a.wordWrap;
        var language = this.props.language;
        var sourceCode = (0, helper_1.getPropValue)(this.props);
        if ((0, tpl_builtin_1.isPureVariable)(language)) {
            language = (0, tpl_builtin_1.resolveVariableAndFilter)(language, data);
        }
        if (customLang) {
            if (customLang.name) {
                language = customLang.name;
            }
            this.customLang = customLang;
        }
        return (react_1.default.createElement("code", { ref: this.codeRef, className: cx("Code", { 'word-break': wordWrap }, className), "data-lang": language }, sourceCode));
    };
    Code.defaultProps = {
        language: 'plaintext',
        editorTheme: 'vs',
        tabSize: 4,
        wordWrap: true
    };
    return Code;
}(react_1.default.Component));
exports.default = Code;
var CodeRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CodeRenderer, _super);
    function CodeRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CodeRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'code'
        })
    ], CodeRenderer);
    return CodeRenderer;
}(Code));
exports.CodeRenderer = CodeRenderer;
//# sourceMappingURL=./renderers/Code.js.map
