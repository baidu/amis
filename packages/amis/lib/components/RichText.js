"use strict";
/**
 * @file RichText
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
// @ts-ignore
var froala_editor_1 = (0, tslib_1.__importDefault)(require("froala-editor"));
// @ts-ignore
var froala_editor_min_js_1 = (0, tslib_1.__importDefault)(require("froala-editor/js/froala_editor.min.js"));
require("froala-editor/js/plugins/align.min");
require("froala-editor/js/plugins/colors.min");
require("froala-editor/js/plugins/char_counter.min");
require("froala-editor/js/plugins/code_view.min");
require("froala-editor/js/plugins/draggable.min");
require("froala-editor/js/plugins/entities.min");
require("froala-editor/js/plugins/font_family.min");
require("froala-editor/js/plugins/font_size.min");
require("froala-editor/js/plugins/forms.min");
require("froala-editor/js/plugins/fullscreen.min");
require("froala-editor/js/plugins/help.min");
require("froala-editor/js/plugins/image.min");
require("froala-editor/js/plugins/inline_class.min");
require("froala-editor/js/plugins/inline_style.min");
require("froala-editor/js/plugins/line_breaker.min");
require("froala-editor/js/plugins/line_height.min");
require("froala-editor/js/plugins/link.min");
require("froala-editor/js/plugins/lists.min");
require("froala-editor/js/plugins/paragraph_format.min");
require("froala-editor/js/plugins/paragraph_style.min");
require("froala-editor/js/plugins/print.min");
require("froala-editor/js/plugins/quick_insert.min");
require("froala-editor/js/plugins/quote.min");
require("froala-editor/js/plugins/save.min");
require("froala-editor/js/plugins/special_characters.min");
require("froala-editor/js/plugins/table.min");
require("froala-editor/js/plugins/url.min");
require("froala-editor/js/plugins/video.min");
require("froala-editor/js/plugins/word_paste.min");
require("froala-editor/js/languages/zh_cn.js");
// 代码来源于：https://github.com/froala/react-froala-wysiwyg/blob/master/lib/FroalaEditorFunctionality.jsx
// 改动原因是model 同步有些问题，有时候不更新，所以基于官方代码改造一下。
// 目前发现的问题是，如果 model 数据修改，如果此时 editor 还没有初始化完成则不会同步成功
var FroalaEditorComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FroalaEditorComponent, _super);
    function FroalaEditorComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.listeningEvents = [];
        _this.element = null;
        _this.editor = null;
        _this.config = {
            immediateReactModelUpdate: false,
            reactIgnoreAttrs: null
        };
        _this.editorInitialized = false;
        _this.INNER_HTML_ATTR = 'innerHTML';
        _this.oldModel = null;
        return _this;
    }
    // After first time render.
    FroalaEditorComponent.prototype.componentDidMount = function () {
        this.createEditor();
    };
    FroalaEditorComponent.prototype.componentWillUnmount = function () {
        this.destroyEditor();
    };
    FroalaEditorComponent.prototype.componentDidUpdate = function () {
        if (JSON.stringify(this.oldModel) == JSON.stringify(this.props.model)) {
            return;
        }
        this.setContent();
    };
    // Return cloned object
    FroalaEditorComponent.prototype.clone = function (item) {
        var me = this;
        if (!item) {
            return item;
        } // null, undefined values check
        var types = [Number, String, Boolean], result;
        // normalizing primitives if someone did new String('aaa'), or new Number('444');
        types.forEach(function (type) {
            if (item instanceof type) {
                result = type(item);
            }
        });
        if (typeof result == 'undefined') {
            if (Object.prototype.toString.call(item) === '[object Array]') {
                result = [];
                item.forEach(function (child, index, array) {
                    result[index] = me.clone(child);
                });
            }
            else if (typeof item == 'object') {
                // testing that this is DOM
                if (item.nodeType && typeof item.cloneNode == 'function') {
                    result = item.cloneNode(true);
                }
                else if (!item.prototype) {
                    // check that this is a literal
                    if (item instanceof Date) {
                        result = new Date(item);
                    }
                    else {
                        // it is an object literal
                        result = {};
                        for (var i in item) {
                            result[i] = me.clone(item[i]);
                        }
                    }
                }
                else {
                    if (false && item.constructor) {
                        result = new item.constructor();
                    }
                    else {
                        result = item;
                    }
                }
            }
            else {
                result = item;
            }
        }
        return result;
    };
    FroalaEditorComponent.prototype.createEditor = function () {
        var _this = this;
        if (this.editorInitialized) {
            return;
        }
        this.config = this.clone(this.props.config || this.config);
        this.config = (0, tslib_1.__assign)({}, this.config);
        this.element = this.el;
        if (this.props.model) {
            this.element.innerHTML = this.props.model;
        }
        this.setContent();
        // Default initialized.
        this.registerEvent('initialized', this.config.events && this.config.events.initialized);
        // Check if events are set.
        if (!this.config.events)
            this.config.events = {};
        this.config.events.initialized = function () {
            _this.editorInitialized = true;
            _this.initListeners();
        };
        this.editor = new froala_editor_1.default(this.element, this.config);
    };
    FroalaEditorComponent.prototype.setContent = function () {
        var _this = this;
        if (this.props.model || this.props.model == '') {
            this.oldModel = this.props.model;
            if (this.editorInitialized) {
                this.setNormalTagContent();
            }
            else {
                if (!this._initEvents)
                    this._initEvents = [];
                this._initEvents.push(function () { return _this.setNormalTagContent(); });
            }
        }
    };
    FroalaEditorComponent.prototype.setNormalTagContent = function () {
        var self = this;
        self.editor.html && self.editor.html.set(self.props.model || '');
        if (self.editorInitialized && self.editor.undo) {
            //This will reset the undo stack everytime the model changes externally. Can we fix this?
            self.editor.undo.reset();
            self.editor.undo.saveStep();
        }
    };
    FroalaEditorComponent.prototype.destroyEditor = function () {
        if (this.element) {
            this.editor.destroy && this.editor.destroy();
            this.listeningEvents.length = 0;
            this.element = null;
            this.editorInitialized = false;
            this._initEvents = [];
        }
    };
    FroalaEditorComponent.prototype.getEditor = function () {
        if (this.element) {
            return this.editor;
        }
        return null;
    };
    FroalaEditorComponent.prototype.updateModel = function () {
        if (!this.props.onModelChange) {
            return;
        }
        var modelContent = '';
        var returnedHtml = this.editor.html.get();
        if (typeof returnedHtml === 'string') {
            modelContent = returnedHtml;
        }
        this.oldModel = modelContent;
        this.props.onModelChange(modelContent);
    };
    FroalaEditorComponent.prototype.initListeners = function () {
        var self = this;
        // bind contentChange and keyup event to froalaModel
        this.editor.events.on('contentChanged', function () {
            self.updateModel();
        });
        if (this.config.immediateReactModelUpdate) {
            this.editor.events.on('keyup', function () {
                self.updateModel();
            });
        }
        // Call init events.
        if (this._initEvents) {
            for (var i = 0; i < this._initEvents.length; i++) {
                this._initEvents[i].call(this.editor);
            }
        }
    };
    // register event on jquery editor element
    FroalaEditorComponent.prototype.registerEvent = function (eventName, callback) {
        if (!eventName || !callback) {
            return;
        }
        if (eventName == 'initialized') {
            if (!this._initEvents)
                this._initEvents = [];
            this._initEvents.push(callback);
        }
        else {
            if (!this.config.events) {
                this.config.events = {};
            }
            this.config.events[eventName] = callback;
        }
    };
    FroalaEditorComponent.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement("textarea", { ref: function (el) { return (_this.el = el); } }, this.props.children));
    };
    return FroalaEditorComponent;
}(react_1.default.Component));
var default_1 = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(default_1, _super);
    function default_1(props) {
        var _this = _super.call(this, props) || this;
        froala_editor_min_js_1.default.VIDEO_PROVIDERS = [
            {
                test_regex: /.*/,
                url_regex: '',
                url_text: '',
                html: '<span class="fr-video fr-dvb fr-draggable" contenteditable="false" draggable="true"><video class="fr-draggable" controls="" data-msg="ok" data-status="0" src="{url}" style="width: 600px;"></video></span>'
            }
        ];
        return _this;
    }
    default_1.prototype.render = function () {
        return (react_1.default.createElement(FroalaEditorComponent, { config: this.props.config, model: this.props.model, onModelChange: this.props.onModelChange }));
    };
    return default_1;
}(react_1.default.Component));
exports.default = default_1;
//# sourceMappingURL=./components/RichText.js.map
