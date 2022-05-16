"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffEditorControlRenderer = exports.DiffEditor = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("../../components/LazyComponent"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var helper_1 = require("../../utils/helper");
var Decorators_1 = require("../../actions/Decorators");
function loadComponent() {
    return Promise.resolve().then(function () { return new Promise(function(resolve){require(['../../components/Editor'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (item) { return item.default; });
}
function normalizeValue(value, language) {
    if (value && typeof value !== 'string') {
        value = JSON.stringify(value, null, 2);
    }
    if (language && language === 'json') {
        try {
            value = JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2);
        }
        catch (e) { }
    }
    return value;
}
var DiffEditor = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DiffEditor, _super);
    function DiffEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            focused: false
        };
        _this.toDispose = [];
        _this.divRef = react_1.default.createRef();
        _this.prevHeight = 0;
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.editorFactory = _this.editorFactory.bind(_this);
        _this.handleEditorMounted = _this.handleEditorMounted.bind(_this);
        _this.handleModifiedEditorChange =
            _this.handleModifiedEditorChange.bind(_this);
        return _this;
    }
    DiffEditor.prototype.componentWillUnmount = function () {
        this.toDispose.forEach(function (fn) { return fn(); });
    };
    DiffEditor.prototype.doAction = function (action, args) {
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
    DiffEditor.prototype.focus = function () {
        var _a, _b;
        this.editor.focus();
        this.setState({ focused: true });
        // 最近一次光标位置
        var position = (_a = this.editor) === null || _a === void 0 ? void 0 : _a.getPosition();
        (_b = this.editor) === null || _b === void 0 ? void 0 : _b.setPosition(position);
    };
    DiffEditor.prototype.handleFocus = function () {
        this.setState({
            focused: true
        });
    };
    DiffEditor.prototype.handleBlur = function () {
        this.setState({
            focused: false
        });
    };
    DiffEditor.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, data = _a.data, value = _a.value, diffValue = _a.diffValue, language = _a.language;
        if (this.originalEditor &&
            (diffValue !== prevProps.diffValue || data !== prevProps.data)) {
            this.originalEditor.getModel().setValue((0, tpl_builtin_1.isPureVariable)(diffValue)
                ? normalizeValue((0, tpl_builtin_1.resolveVariableAndFilter)(diffValue || '', data, '| raw', function () { return ''; }), language)
                : normalizeValue(diffValue, language));
        }
        if (this.modifiedEditor &&
            value !== prevProps.value &&
            !this.state.focused) {
            this.modifiedEditor.getModel().setValue(normalizeValue(value, language));
        }
    };
    DiffEditor.prototype.editorFactory = function (containerElement, monaco, options) {
        return monaco.editor.createDiffEditor(containerElement, options);
    };
    DiffEditor.prototype.handleEditorMounted = function (editor, monaco) {
        var _this = this;
        var _a = this.props, value = _a.value, data = _a.data, language = _a.language, diffValue = _a.diffValue;
        this.monaco = monaco;
        this.editor = editor;
        this.modifiedEditor = editor.getModifiedEditor();
        this.originalEditor = editor.getOriginalEditor();
        this.toDispose.push(this.modifiedEditor.onDidFocusEditorWidget(this.handleFocus).dispose);
        this.toDispose.push(this.modifiedEditor.onDidBlurEditorWidget(this.handleBlur).dispose);
        this.toDispose.push(this.modifiedEditor.onDidChangeModelContent(this.handleModifiedEditorChange).dispose);
        this.toDispose.push(this.modifiedEditor.onDidChangeModelDecorations(function () {
            _this.updateContainerSize(_this.modifiedEditor, monaco); // typing
            requestAnimationFrame(_this.updateContainerSize.bind(_this, _this.modifiedEditor, monaco)); // folding
        }).dispose);
        this.editor.setModel({
            original: this.monaco.editor.createModel((0, tpl_builtin_1.isPureVariable)(diffValue)
                ? normalizeValue((0, tpl_builtin_1.resolveVariableAndFilter)(diffValue || '', data, '| raw'), language)
                : normalizeValue(diffValue, language), language),
            modified: this.monaco.editor.createModel(normalizeValue(value, language), language)
        });
    };
    DiffEditor.prototype.handleModifiedEditorChange = function () {
        var onChange = this.props.onChange;
        onChange && onChange(this.modifiedEditor.getModel().getValue());
    };
    DiffEditor.prototype.updateContainerSize = function (editor, monaco) {
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
    DiffEditor.prototype.render = function () {
        var _a = this.props, className = _a.className, value = _a.value, onChange = _a.onChange, disabled = _a.disabled, size = _a.size, options = _a.options, language = _a.language, theme = _a.theme, cx = _a.classnames;
        return (react_1.default.createElement("div", { ref: this.divRef, className: cx('EditorControl', size ? "EditorControl--".concat(size) : '', className, {
                'is-focused': this.state.focused
            }) },
            react_1.default.createElement(LazyComponent_1.default, { getComponent: loadComponent, value: value, onChange: onChange, disabled: disabled, language: language, theme: theme, editorDidMount: this.handleEditorMounted, editorFactory: this.editorFactory, options: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { readOnly: disabled }), isDiffEditor: true })));
    };
    DiffEditor.defaultProps = {
        language: 'javascript',
        theme: 'vs',
        options: {
            automaticLayout: false,
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            folding: true,
            minimap: {
                enabled: false
            }
        },
        diffValue: ''
    };
    (0, tslib_1.__decorate)([
        (0, Decorators_1.bindRendererEvent)('focus'),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DiffEditor.prototype, "handleFocus", null);
    (0, tslib_1.__decorate)([
        (0, Decorators_1.bindRendererEvent)('blur'),
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DiffEditor.prototype, "handleBlur", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], DiffEditor.prototype, "updateContainerSize", null);
    return DiffEditor;
}(react_1.default.Component));
exports.DiffEditor = DiffEditor;
var DiffEditorControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(DiffEditorControlRenderer, _super);
    function DiffEditorControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DiffEditorControlRenderer.defaultProps = (0, tslib_1.__assign)({}, DiffEditor.defaultProps);
    DiffEditorControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: "diff-editor",
            sizeMutable: false
        })
    ], DiffEditorControlRenderer);
    return DiffEditorControlRenderer;
}(DiffEditor));
exports.DiffEditorControlRenderer = DiffEditorControlRenderer;
// @Renderer({
//   test: /(^|\/)diff-editor$/,
//   name: 'diff-editor'
// })
// export class DiffEditorRenderer extends DiffEditor {
//   static defaultProps = {
//     ...DiffEditor.defaultProps,
//     disabled: true
//   };
// }
//# sourceMappingURL=./renderers/Form/DiffEditor.js.map
