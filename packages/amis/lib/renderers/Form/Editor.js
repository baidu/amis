"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorControlRenderer = exports.EditorControls = exports.availableLanguages = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("../../components/LazyComponent"));
var Editor_1 = (0, tslib_1.__importDefault)(require("../../components/Editor"));
var helper_1 = require("../../utils/helper");
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var Decorators_1 = require("../../actions/Decorators");
var EditorControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(EditorControl, _super);
    function EditorControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            focused: false
        };
        _this.toDispose = [];
        _this.divRef = react_1.default.createRef();
        _this.prevHeight = 0;
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleEditorMounted = _this.handleEditorMounted.bind(_this);
        return _this;
    }
    EditorControl.prototype.componentWillUnmount = function () {
        this.toDispose.forEach(function (fn) { return fn(); });
    };
    EditorControl.prototype.doAction = function (action, args) {
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        var _a = this.props, onChange = _a.onChange, resetValue = _a.resetValue;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
        else if (actionType === 'focus') {
            this.focus();
        }
    };
    EditorControl.prototype.focus = function () {
        var _a, _b;
        this.editor.focus();
        this.setState({ focused: true });
        // 最近一次光标位置
        var position = (_a = this.editor) === null || _a === void 0 ? void 0 : _a.getPosition();
        (_b = this.editor) === null || _b === void 0 ? void 0 : _b.setPosition(position);
    };
    EditorControl.prototype.handleFocus = function () {
        this.setState({
            focused: true
        });
    };
    EditorControl.prototype.handleBlur = function () {
        this.setState({
            focused: false
        });
    };
    EditorControl.prototype.handleEditorMounted = function (editor, monaco) {
        var _this = this;
        this.editor = editor;
        this.toDispose.push(editor.onDidChangeModelDecorations(function () {
            _this.updateContainerSize(editor, monaco); // typing
            requestAnimationFrame(_this.updateContainerSize.bind(_this, editor, monaco)); // folding
        }).dispose);
        if (this.props.editorDidMount) {
            var editorDidMount = this.props.editorDidMount;
            if (typeof editorDidMount === 'string') {
                editorDidMount = new Function('editor', 'monaco');
            }
            var dispose = editorDidMount(editor, monaco);
            if (typeof dispose === 'function') {
                this.toDispose.push(dispose);
            }
        }
    };
    EditorControl.prototype.updateContainerSize = function (editor, monaco) {
        var _a;
        if (!this.divRef.current) {
            return;
        }
        var lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        var lineCount = ((_a = editor.getModel()) === null || _a === void 0 ? void 0 : _a.getLineCount()) || 1;
        var height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;
        if (this.prevHeight !== height) {
            this.prevHeight = height;
            this.divRef.current.style.height = "".concat(height, "px");
            editor.layout();
        }
    };
    EditorControl.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, ns = _b.classPrefix, cx = _b.classnames, value = _b.value, onChange = _b.onChange, disabled = _b.disabled, options = _b.options, editorTheme = _b.editorTheme, size = _b.size, data = _b.data, allowFullscreen = _b.allowFullscreen;
        var language = this.props.language;
        var finnalValue = value;
        if (finnalValue && typeof finnalValue !== 'string') {
            finnalValue = JSON.stringify(finnalValue, null, 2);
        }
        if ((0, tpl_builtin_1.isPureVariable)(language)) {
            language = (0, tpl_builtin_1.resolveVariableAndFilter)(language, data);
        }
        return (react_1.default.createElement("div", { ref: this.divRef, className: cx("EditorControl", (_a = {
                    'is-focused': this.state.focused
                },
                _a["EditorControl--".concat(size)] = size,
                _a), className) },
            react_1.default.createElement(LazyComponent_1.default, { classPrefix: ns, component: Editor_1.default, allowFullscreen: allowFullscreen, value: finnalValue, onChange: onChange, disabled: disabled, onFocus: this.handleFocus, onBlur: this.handleBlur, language: language, editorTheme: editorTheme, editorDidMount: this.handleEditorMounted, options: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { readOnly: disabled }) })));
    };
    EditorControl.defaultProps = {
        language: 'javascript',
        editorTheme: 'vs',
        allowFullscreen: true,
        options: {
            automaticLayout: true,
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            folding: true,
            minimap: {
                enabled: false
            }
        }
    };
    (0, tslib_1.__decorate)([
        (0, Decorators_1.bindRendererEvent)('focus'),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], EditorControl.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        (0, Decorators_1.bindRendererEvent)('blur'),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], EditorControl.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], EditorControl.prototype, "updateContainerSize", null);
    return EditorControl;
}(react_1.default.Component));
exports.default = EditorControl;
exports.availableLanguages = [
    'bat',
    'c',
    'coffeescript',
    'cpp',
    'csharp',
    'css',
    'dockerfile',
    'fsharp',
    'go',
    'handlebars',
    'html',
    'ini',
    'java',
    'javascript',
    'json',
    'less',
    'lua',
    'markdown',
    'msdax',
    'objective-c',
    'php',
    'plaintext',
    'postiats',
    'powershell',
    'pug',
    'python',
    'r',
    'razor',
    'ruby',
    'sb',
    'scss',
    'sol',
    'shell',
    'sql',
    'swift',
    'typescript',
    'vb',
    'xml',
    'yaml'
];
exports.EditorControls = exports.availableLanguages.map(function (lang) {
    var EditorControlRenderer = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(EditorControlRenderer, _super);
        function EditorControlRenderer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorControlRenderer.lang = lang;
        EditorControlRenderer.displayName = "".concat(lang[0].toUpperCase()).concat(lang.substring(1), "EditorControlRenderer");
        EditorControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, EditorControl.defaultProps), { language: lang });
        EditorControlRenderer = (0, tslib_1.__decorate)([
            (0, Item_1.FormItem)({
                type: "".concat(lang, "-editor"),
                sizeMutable: false
            })
        ], EditorControlRenderer);
        return EditorControlRenderer;
    }(EditorControl));
    return EditorControlRenderer;
});
var JavascriptEditorControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(JavascriptEditorControlRenderer, _super);
    function JavascriptEditorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JavascriptEditorControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, EditorControl.defaultProps), { language: 'javascript' });
    JavascriptEditorControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'js-editor',
            sizeMutable: false
        })
    ], JavascriptEditorControlRenderer);
    return JavascriptEditorControlRenderer;
}(EditorControl));
var TypescriptEditorControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TypescriptEditorControlRenderer, _super);
    function TypescriptEditorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypescriptEditorControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, EditorControl.defaultProps), { language: 'typescript' });
    TypescriptEditorControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'ts-editor',
            sizeMutable: false
        })
    ], TypescriptEditorControlRenderer);
    return TypescriptEditorControlRenderer;
}(EditorControl));
var EditorControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(EditorControlRenderer, _super);
    function EditorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditorControlRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, EditorControl.defaultProps), { language: 'javascript' });
    EditorControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: "editor",
            sizeMutable: false
        })
    ], EditorControlRenderer);
    return EditorControlRenderer;
}(EditorControl));
exports.EditorControlRenderer = EditorControlRenderer;
//# sourceMappingURL=./renderers/Form/Editor.js.map
