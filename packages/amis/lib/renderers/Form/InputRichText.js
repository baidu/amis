"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichTextControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("../../components/LazyComponent"));
var tpl_builtin_1 = require("../../utils/tpl-builtin");
var api_1 = require("../../utils/api");
var helper_1 = require("../../utils/helper");
function loadRichText(type) {
    if (type === void 0) { type = 'froala'; }
    return function () {
        return type === 'tinymce'
            ? Promise.resolve().then(function () { return new Promise(function(resolve){require(['../../components/Tinymce'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (item) { return item.default; })
            : Promise.resolve().then(function () { return new Promise(function(resolve){require(['../../components/RichText'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (item) { return item.default; });
    };
}
var RichTextControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RichTextControl, _super);
    function RichTextControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            focused: false
        };
        _this.config = null;
        var finnalVendor = props.vendor || (props.env.richTextToken ? 'froala' : 'tinymce');
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        if (finnalVendor === 'froala') {
            _this.config = (0, tslib_1.__assign)((0, tslib_1.__assign)({ imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'], imageDefaultAlign: 'left', imageEditButtons: props.imageEditable
                    ? [
                        'imageReplace',
                        'imageAlign',
                        'imageRemove',
                        '|',
                        'imageLink',
                        'linkOpen',
                        'linkEdit',
                        'linkRemove',
                        '-',
                        'imageDisplay',
                        'imageStyle',
                        'imageAlt',
                        'imageSize'
                    ]
                    : [], key: props.env.richTextToken, attribution: false }, props.options), { editorClass: props.editorClass, placeholderText: props.translate(props.placeholder), imageUploadURL: (0, tpl_builtin_1.tokenize)(props.receiver, props.data), imageUploadParams: {
                    from: 'rich-text'
                }, videoUploadURL: (0, tpl_builtin_1.tokenize)(props.videoReceiver, props.data), videoUploadParams: {
                    from: 'rich-text'
                }, events: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (props.options && props.options.events)), { focus: _this.handleFocus, blur: _this.handleBlur }), language: !_this.props.locale || _this.props.locale === 'zh-CN' ? 'zh_cn' : '' });
            if (props.buttons) {
                _this.config.toolbarButtons = props.buttons;
            }
        }
        else {
            var fetcher_1 = props.env.fetcher;
            _this.config = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props.options), { images_upload_handler: function (blobInfo, ok, fail) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                    var formData, receiver, response, location, e_1;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    return (0, tslib_1.__generator)(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                formData = new FormData();
                                formData.append(props.fileField, blobInfo.blob(), blobInfo.filename());
                                _k.label = 1;
                            case 1:
                                _k.trys.push([1, 3, , 4]);
                                receiver = (0, tslib_1.__assign)({ adaptor: function (payload) {
                                        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, payload), { data: payload });
                                    } }, (0, api_1.normalizeApi)((0, tpl_builtin_1.tokenize)(props.receiver, props.data), 'post'));
                                return [4 /*yield*/, fetcher_1(receiver, formData, {
                                        method: 'post'
                                    })];
                            case 2:
                                response = _k.sent();
                                if (response.ok) {
                                    location = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.link) ||
                                        ((_b = response.data) === null || _b === void 0 ? void 0 : _b.url) ||
                                        ((_c = response.data) === null || _c === void 0 ? void 0 : _c.value) ||
                                        ((_e = (_d = response.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.link) ||
                                        ((_g = (_f = response.data) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.url) ||
                                        ((_j = (_h = response.data) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.value);
                                    if (location) {
                                        ok(location);
                                    }
                                    else {
                                        console.warn('must have return value');
                                    }
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _k.sent();
                                fail(e_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); } });
        }
        return _this;
    }
    RichTextControl.prototype.handleFocus = function () {
        this.setState({
            focused: true
        });
    };
    RichTextControl.prototype.handleBlur = function () {
        this.setState({
            focused: false
        });
    };
    RichTextControl.prototype.handleChange = function (value, submitOnChange, changeImmediately) {
        var _a = this.props, onChange = _a.onChange, disabled = _a.disabled;
        if (disabled) {
            return;
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(value, submitOnChange, changeImmediately);
    };
    RichTextControl.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, ns = _b.classPrefix, value = _b.value, onChange = _b.onChange, disabled = _b.disabled, size = _b.size, vendor = _b.vendor, env = _b.env, locale = _b.locale, translate = _b.translate, borderMode = _b.borderMode;
        var finnalVendor = vendor || (env.richTextToken ? 'froala' : 'tinymce');
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "RichTextControl"), className, (_a = {
                    'is-focused': this.state.focused,
                    'is-disabled': disabled
                },
                _a["".concat(ns, "RichTextControl--border").concat((0, helper_1.ucFirst)(borderMode))] = borderMode,
                _a)) },
            react_1.default.createElement(LazyComponent_1.default, { getComponent: loadRichText(finnalVendor), model: value, onModelChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur, config: this.config, disabled: disabled, locale: locale, translate: translate })));
    };
    RichTextControl.defaultProps = {
        imageEditable: true,
        receiver: '/api/upload/image',
        videoReceiver: '/api/upload/video',
        fileField: 'file',
        placeholder: 'placeholder.enter',
        options: {
            toolbarButtons: [
                'undo',
                'redo',
                'paragraphFormat',
                'textColor',
                'backgroundColor',
                'bold',
                'underline',
                'strikeThrough',
                'formatOL',
                'formatUL',
                'align',
                'quote',
                'insertLink',
                'insertImage',
                'insertEmotion',
                'insertTable',
                'html'
            ]
        }
    };
    return RichTextControl;
}(react_1.default.Component));
exports.default = RichTextControl;
var RichTextControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(RichTextControlRenderer, _super);
    function RichTextControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RichTextControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-rich-text',
            sizeMutable: false
        })
    ], RichTextControlRenderer);
    return RichTextControlRenderer;
}(RichTextControl));
exports.RichTextControlRenderer = RichTextControlRenderer;
//# sourceMappingURL=./renderers/Form/InputRichText.js.map
