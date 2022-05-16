"use strict";
/**
 * @file Editor
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = exports.monacoFactory = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var icons_1 = require("./icons");
var locale_1 = require("../locale");
// 用于发布 sdk 版本的时候替换，因为不确定 sdk 版本怎么部署，而 worker 地址路径不可知。
// 所以会被 fis3 替换成取相对的代码。
function filterUrl(url) {
    return url;
}
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        var url = '/pkg/editor.worker.js';
        if (label === 'json') {
            url = '/pkg/json.worker.js';
        }
        else if (label === 'css') {
            url = '/pkg/css.worker.js';
        }
        else if (label === 'html') {
            url = '/pkg/html.worker.js';
        }
        else if (label === 'typescript' || label === 'javascript') {
            url = '/pkg/ts.worker.js';
        }
        url = filterUrl(url);
        // url 有可能会插件替换成 cdn 地址，比如：fis3-prepackager-stand-alone-pack
        if (/^https?/.test(url)) {
            return "data:text/javascript;charset=utf-8,".concat(encodeURIComponent("\n        importScripts('".concat(url, "');")), "\n      ");
        }
        return url;
    }
};
function monacoFactory(containerElement, monaco, options) {
    return monaco.editor.create(containerElement, (0, tslib_1.__assign)({ 'autoIndent': true, 'formatOnType': true, 'formatOnPaste': true, 'selectOnLineNumbers': true, 'scrollBeyondLastLine': false, 'folding': true, 'minimap': {
            enabled: false
        }, 'scrollbar': {
            alwaysConsumeMouseWheel: false
        }, 'bracketPairColorization.enabled': true }, options));
}
exports.monacoFactory = monacoFactory;
var Editor = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Editor, _super);
    function Editor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isFullscreen: false,
            innerWidth: 'auto',
            innerHeight: 'auto'
        };
        _this.disposes = [];
        _this.wrapperRef = _this.wrapperRef.bind(_this);
        _this.currentValue = props.value;
        return _this;
    }
    Editor.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b;
        if (this.props.value !== this.currentValue &&
            this.editor &&
            !this.props.isDiffEditor) {
            var value = String(this.props.value);
            if (this.props.language === 'json') {
                try {
                    value = JSON.stringify(JSON.parse(value), null, 2);
                }
                catch (e) { }
            }
            this.preventTriggerChangeEvent = true;
            var eidtor = this.editor.getModifiedEditor
                ? this.editor.getModifiedEditor()
                : this.editor;
            var model = eidtor.getModel();
            eidtor.pushUndoStop();
            // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
            model.pushEditOperations([], [
                {
                    range: model.getFullModelRange(),
                    text: value
                }
            ]);
            eidtor.pushUndoStop();
            this.preventTriggerChangeEvent = false;
        }
        if (this.props.options.readOnly !== prevProps.options.readOnly &&
            this.editor) {
            (_b = (_a = this.editor).updateOptions) === null || _b === void 0 ? void 0 : _b.call(_a, this.props.options);
        }
    };
    Editor.prototype.componentWillUnmount = function () {
        var _a;
        if (this.editor) {
            var context = this.props.context || window;
            var monaco = context.monaco || window.monaco;
            var editorWillUnmount = this.props.editorWillUnmount;
            editorWillUnmount && editorWillUnmount(this.editor, monaco);
        }
        this.disposes.forEach(function (_a) {
            var dispose = _a.dispose;
            return dispose();
        });
        this.disposes = [];
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    Editor.prototype.wrapperRef = function (ref) {
        this.container = ref;
        if (ref) {
            this.loadMonaco();
        }
        else {
            try {
                this.disposes.forEach(function (_a) {
                    var dispose = _a.dispose;
                    return dispose();
                });
                this.disposes = [];
                if (this.editor) {
                    this.editor.getModel().dispose();
                    this.editor.dispose();
                }
                this.editor = null;
            }
            catch (e) {
                // ignore
            }
        }
    };
    Editor.prototype.loadMonaco = function () {
        var _this = this;
        Promise.resolve().then(function () { return new Promise(function(resolve){require(['monaco-editor'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (monaco) { return _this.initMonaco(monaco); });
    };
    Editor.prototype.initMonaco = function (monaco) {
        var _a, _b;
        var value = this.props.value !== null ? this.props.value : this.props.defaultValue;
        var _c = this.props, language = _c.language, editorTheme = _c.editorTheme, options = _c.options, editorFactory = _c.editorFactory;
        var containerElement = this.container;
        if (!containerElement) {
            return;
        }
        // Before initializing monaco editor
        this.editorWillMount(monaco);
        if (this.props.language === 'json') {
            try {
                value = JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2);
            }
            catch (e) {
                // ignore
            }
        }
        var factory = editorFactory || monacoFactory;
        this.editor = factory(containerElement, monaco, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, options), { automaticLayout: true, value: value, language: language, editorTheme: editorTheme, theme: editorTheme }));
        // json 默认开启验证。
        (_a = monaco.languages.json) === null || _a === void 0 ? void 0 : _a.jsonDefaults.setDiagnosticsOptions((0, tslib_1.__assign)({ enableSchemaRequest: true, validate: true, allowComments: true }, (_b = monaco.languages.json) === null || _b === void 0 ? void 0 : _b.jsonDefaults.diagnosticsOptions));
        // After initializing monaco editor
        this.editorDidMount(this.editor, monaco);
    };
    Editor.prototype.editorWillMount = function (monaco) {
        var editorWillMount = this.props.editorWillMount;
        editorWillMount && editorWillMount(monaco);
    };
    Editor.prototype.editorDidMount = function (editor, monaco) {
        var _this = this;
        var _a, _b, _c;
        var _d = this.props, editorDidMount = _d.editorDidMount, onChange = _d.onChange, onFocus = _d.onFocus, onBlur = _d.onBlur;
        editorDidMount && editorDidMount(editor, monaco);
        editor.onDidChangeModelContent &&
            this.disposes.push(editor.onDidChangeModelContent(function (event) {
                var value = editor.getValue();
                // Always refer to the latest value
                _this.currentValue = value;
                // Only invoking when user input changed
                if (!_this.preventTriggerChangeEvent && onChange) {
                    onChange(value, event);
                }
            }));
        onFocus &&
            editor.onDidFocusEditorWidget &&
            this.disposes.push(editor.onDidFocusEditorWidget(onFocus));
        onBlur &&
            editor.onDidBlurEditorWidget &&
            this.disposes.push(editor.onDidBlurEditorWidget(onBlur));
        var _e = (_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.editor) === null || _a === void 0 ? void 0 : _a._configuration) === null || _b === void 0 ? void 0 : _b._elementSizeObserver) !== null && _c !== void 0 ? _c : {}, _f = _e.width, width = _f === void 0 ? 'auto' : _f, _g = _e.height, height = _g === void 0 ? 'auto' : _g;
        this.setState({ innerHeight: height, innerWidth: width });
    };
    Editor.prototype.handleFullscreenModeChange = function () {
        var _this = this;
        this.setState({ isFullscreen: !this.state.isFullscreen }, function () {
            // 退出全屏模式后需要resize一下editor的宽高，避免溢出父元素
            return !_this.state.isFullscreen &&
                _this.editor.layout({
                    width: _this.state.innerWidth,
                    height: _this.state.innerHeight
                });
        });
    };
    Editor.prototype.render = function () {
        var _a = this.props, className = _a.className, ns = _a.classPrefix, width = _a.width, height = _a.height, __ = _a.translate;
        var style = (0, tslib_1.__assign)({}, (this.props.style || {}));
        style.width = width;
        style.height = height;
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "MonacoEditor"), { 'is-fullscreen': this.state.isFullscreen }, className), style: style, ref: this.wrapperRef }, this.editor && this.props.allowFullscreen ? (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "MonacoEditor-header")) },
            react_1.default.createElement("a", { className: (0, classnames_1.default)('Modal-close', "".concat(ns, "MonacoEditor-fullscreen")), "data-tooltip": this.state.isFullscreen
                    ? __('Editor.exitFullscreen')
                    : __('Editor.fullscreen'), "data-position": "left", onClick: this.handleFullscreenModeChange },
                react_1.default.createElement(icons_1.Icon, { icon: this.state.isFullscreen ? 'compress-alt' : 'expand-alt', className: "icon" })))) : null));
    };
    Editor.defaultProps = {
        language: 'javascript',
        editorTheme: 'vs',
        width: '100%',
        height: '100%',
        allowFullscreen: false,
        options: {}
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Editor.prototype, "handleFullscreenModeChange", null);
    return Editor;
}(react_1.default.Component));
exports.Editor = Editor;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(Editor));
//# sourceMappingURL=./components/Editor.js.map
