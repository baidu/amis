/**
 * @file RichText
 * @description
 * @author fex
 */

import React from 'react';

// @ts-ignore
import FroalaEditor from 'froala-editor';
// @ts-ignore
import Froala from 'froala-editor/js/froala_editor.min.js';
import 'froala-editor/js/plugins/align.min';
import 'froala-editor/js/plugins/colors.min';
import 'froala-editor/js/plugins/char_counter.min';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/draggable.min';
import 'froala-editor/js/plugins/entities.min';
import 'froala-editor/js/plugins/font_family.min';
import 'froala-editor/js/plugins/font_size.min';
import 'froala-editor/js/plugins/forms.min';
import 'froala-editor/js/plugins/fullscreen.min';
import 'froala-editor/js/plugins/help.min';
import 'froala-editor/js/plugins/image.min';
import 'froala-editor/js/plugins/inline_class.min';
import 'froala-editor/js/plugins/inline_style.min';
import 'froala-editor/js/plugins/line_breaker.min';
import 'froala-editor/js/plugins/line_height.min';
import 'froala-editor/js/plugins/link.min';
import 'froala-editor/js/plugins/lists.min';
import 'froala-editor/js/plugins/paragraph_format.min';
import 'froala-editor/js/plugins/paragraph_style.min';
import 'froala-editor/js/plugins/print.min';
import 'froala-editor/js/plugins/quick_insert.min';
import 'froala-editor/js/plugins/quote.min';
import 'froala-editor/js/plugins/save.min';
import 'froala-editor/js/plugins/special_characters.min';
import 'froala-editor/js/plugins/table.min';
import 'froala-editor/js/plugins/url.min';
import 'froala-editor/js/plugins/video.min';
import 'froala-editor/js/plugins/word_paste.min';
import 'froala-editor/js/languages/zh_cn.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

export interface FroalaEditorComponentProps {
  config: any;
  model: string;
  onModelChange: (value: string) => void;
}

// 代码来源于：https://github.com/froala/react-froala-wysiwyg/blob/master/lib/FroalaEditorFunctionality.jsx
// 改动原因是model 同步有些问题，有时候不更新，所以基于官方代码改造一下。
// 目前发现的问题是，如果 model 数据修改，如果此时 editor 还没有初始化完成则不会同步成功
class FroalaEditorComponent extends React.Component<FroalaEditorComponentProps> {
  listeningEvents: any;
  element: any;
  editor: any;
  config: any;
  editorInitialized: any;
  INNER_HTML_ATTR: any;
  oldModel: any;
  el: any;
  _initEvents: any;

  constructor(props: FroalaEditorComponentProps) {
    super(props);

    this.listeningEvents = [];
    this.element = null;
    this.editor = null;
    this.config = {
      immediateReactModelUpdate: false,
      reactIgnoreAttrs: null
    };

    this.editorInitialized = false;
    this.INNER_HTML_ATTR = 'innerHTML';

    this.oldModel = null;
  }

  // After first time render.
  componentDidMount() {
    this.createEditor();
  }

  componentWillUnmount() {
    this.destroyEditor();
  }

  componentDidUpdate() {
    if (JSON.stringify(this.oldModel) == JSON.stringify(this.props.model)) {
      return;
    }

    this.setContent();
  }

  // Return cloned object
  clone(item: any) {
    const me = this;
    if (!item) {
      return item;
    } // null, undefined values check

    let types = [Number, String, Boolean],
      result: any;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
      if (item instanceof type) {
        result = type(item);
      }
    });

    if (typeof result == 'undefined') {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        result = [];
        item.forEach(function (child: any, index: number, array: Array<any>) {
          result[index] = me.clone(child);
        });
      } else if (typeof item == 'object') {
        // testing that this is DOM
        if (item.nodeType && typeof item.cloneNode == 'function') {
          result = item.cloneNode(true);
        } else if (!item.prototype) {
          // check that this is a literal
          if (item instanceof Date) {
            result = new Date(item);
          } else {
            // it is an object literal
            result = {};
            for (var i in item) {
              result[i] = me.clone(item[i]);
            }
          }
        } else {
          if (false && item.constructor) {
            result = new item.constructor();
          } else {
            result = item;
          }
        }
      } else {
        result = item;
      }
    }
    return result;
  }

  createEditor() {
    if (this.editorInitialized) {
      return;
    }

    this.config = this.clone(this.props.config || this.config);
    this.config = {...this.config};

    this.element = this.el;

    if (this.props.model) {
      this.element.innerHTML = this.props.model;
    }

    this.setContent();

    // Default initialized.
    this.registerEvent(
      'initialized',
      this.config.events && this.config.events.initialized
    );

    // Check if events are set.
    if (!this.config.events) this.config.events = {};
    this.config.events.initialized = () => {
      this.editorInitialized = true;
      this.initListeners();
    };

    this.editor = new FroalaEditor(this.element, this.config);
  }

  setContent() {
    if (this.props.model || this.props.model == '') {
      this.oldModel = this.props.model;

      if (this.editorInitialized) {
        this.setNormalTagContent();
      } else {
        if (!this._initEvents) this._initEvents = [];
        this._initEvents.push(() => this.setNormalTagContent());
      }
    }
  }

  setNormalTagContent() {
    let self = this;

    self.editor.html && self.editor.html.set(self.props.model || '');
    if (self.editorInitialized && self.editor.undo) {
      //This will reset the undo stack everytime the model changes externally. Can we fix this?
      self.editor.undo.reset();
      self.editor.undo.saveStep();
    }
  }

  destroyEditor() {
    if (this.element) {
      this.editor.destroy && this.editor.destroy();
      this.listeningEvents.length = 0;
      this.element = null;
      this.editorInitialized = false;
      this._initEvents = [];
    }
  }

  getEditor() {
    if (this.element) {
      return this.editor;
    }

    return null;
  }

  updateModel() {
    if (!this.props.onModelChange) {
      return;
    }

    let modelContent = '';

    let returnedHtml = this.editor.html.get();
    if (typeof returnedHtml === 'string') {
      modelContent = returnedHtml;
    }

    this.oldModel = modelContent;
    this.props.onModelChange(modelContent);
  }

  initListeners() {
    let self = this;

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
      for (let i = 0; i < this._initEvents.length; i++) {
        this._initEvents[i].call(this.editor);
      }
    }
  }

  // register event on jquery editor element
  registerEvent(eventName: string, callback: Function) {
    if (!eventName || !callback) {
      return;
    }

    if (eventName == 'initialized') {
      if (!this._initEvents) this._initEvents = [];
      this._initEvents.push(callback);
    } else {
      if (!this.config.events) {
        this.config.events = {};
      }

      this.config.events[eventName] = callback;
    }
  }

  render() {
    return (
      <textarea ref={el => (this.el = el)}>{this.props.children}</textarea>
    );
  }
}

export default class extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    Froala.VIDEO_PROVIDERS = [
      {
        test_regex: /.*/,
        url_regex: '',
        url_text: '',
        html: '<span class="fr-video fr-dvb fr-draggable" contenteditable="false" draggable="true"><video class="fr-draggable" controls="" data-msg="ok" data-status="0" src="{url}" style="width: 600px;"></video></span>'
      }
    ];
  }

  render() {
    return (
      <FroalaEditorComponent
        config={this.props.config}
        model={this.props.model}
        onModelChange={this.props.onModelChange}
      />
    );
  }
}
