"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeMirrorEditor = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var resize_sensor_1 = require("../utils/resize-sensor");
var CodeMirrorEditor = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CodeMirrorEditor, _super);
    function CodeMirrorEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dom = react_1.default.createRef();
        _this.toDispose = [];
        _this.unmounted = false;
        return _this;
    }
    CodeMirrorEditor.prototype.componentDidMount = function () {
        var _a, _b, _c, _d, _e;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var cm;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return new Promise(function(resolve){require(['codemirror'], function(ret) {resolve(tslib_1.__importStar(ret));})}); })];
                    case 1:
                        cm = (_f.sent()).default;
                        // @ts-ignore
                        return [4 /*yield*/, Promise.resolve().then(function () { return new Promise(function(resolve){require(['codemirror/mode/javascript/javascript'], function(ret) {resolve(tslib_1.__importStar(ret));})}); })];
                    case 2:
                        // @ts-ignore
                        _f.sent();
                        // @ts-ignore
                        return [4 /*yield*/, Promise.resolve().then(function () { return new Promise(function(resolve){require(['codemirror/mode/htmlmixed/htmlmixed'], function(ret) {resolve(tslib_1.__importStar(ret));})}); })];
                    case 3:
                        // @ts-ignore
                        _f.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return new Promise(function(resolve){require(['codemirror/addon/mode/simple'], function(ret) {resolve(tslib_1.__importStar(ret));})}); })];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return new Promise(function(resolve){require(['codemirror/addon/mode/multiplex'], function(ret) {resolve(tslib_1.__importStar(ret));})}); })];
                    case 5:
                        _f.sent();
                        if (this.unmounted) {
                            return [2 /*return*/];
                        }
                        this.editor =
                            (_c = (_b = (_a = this.props).editorFactory) === null || _b === void 0 ? void 0 : _b.call(_a, this.dom.current, cm, this.props)) !== null && _c !== void 0 ? _c : cm(this.dom.current, {
                                value: this.props.value || ''
                            });
                        (_e = (_d = this.props).editorDidMount) === null || _e === void 0 ? void 0 : _e.call(_d, cm, this.editor);
                        this.editor.on('change', this.handleChange);
                        this.toDispose.push((0, resize_sensor_1.resizeSensor)(this.dom.current, function () { var _a; return (_a = _this.editor) === null || _a === void 0 ? void 0 : _a.refresh(); }));
                        // todo 以后优化这个，解决弹窗里面默认光标太小的问题
                        setTimeout(function () { var _a; return (_a = _this.editor) === null || _a === void 0 ? void 0 : _a.refresh(); }, 350);
                        this.toDispose.push(function () {
                            var _a, _b;
                            (_b = (_a = _this.props).editorWillUnMount) === null || _b === void 0 ? void 0 : _b.call(_a, cm, _this.editor);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CodeMirrorEditor.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (props.value !== prevProps.value) {
            this.editor && this.setValue(props.value);
        }
    };
    CodeMirrorEditor.prototype.componentWillUnmount = function () {
        var _a;
        this.unmounted = true;
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.off('change', this.handleChange);
        this.toDispose.forEach(function (fn) { return fn(); });
        this.toDispose = [];
    };
    CodeMirrorEditor.prototype.handleChange = function (editor) {
        var _a, _b;
        (_b = (_a = this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, editor.getValue());
    };
    CodeMirrorEditor.prototype.setValue = function (value) {
        var doc = this.editor.getDoc();
        if (value && value !== doc.getValue()) {
            var cursor = doc.getCursor();
            doc.setValue(value);
            doc.setCursor(cursor);
        }
    };
    CodeMirrorEditor.prototype.render = function () {
        var className = this.props.className;
        return react_1.default.createElement("div", { className: className, ref: this.dom });
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CodeMirrorEditor.prototype, "handleChange", null);
    return CodeMirrorEditor;
}(react_1.default.Component));
exports.CodeMirrorEditor = CodeMirrorEditor;
exports.default = CodeMirrorEditor;
//# sourceMappingURL=./components/CodeMirror.js.map
