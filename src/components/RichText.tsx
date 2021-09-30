/**
 * @file RichText
 * @description
 * @author fex
 */

import React from 'react';

// @ts-ignore
import FroalaEditorComponent from 'react-froala-wysiwyg';
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

export default class FroalaEditor extends React.Component<any, any> {
  oldModel: any = null;

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

    this.state = {
      model: this.props.model
    };
    this.handleModelChange = this.handleModelChange.bind(this);
  }

  componentDidUpdate() {
    if (JSON.stringify(this.oldModel) == JSON.stringify(this.props.model)) {
      return;
    }
    this.handleModelChange(this.props.model);
  }

  handleModelChange(model: string) {
    if (!this.props.onModelChange) {
      return;
    }
    this.oldModel = model;
    this.props.onModelChange(model);
    this.setState({
      model: model
    });
  }

  render() {
    return (
      <FroalaEditorComponent
        tag="textarea"
        config={this.props.config}
        model={this.state.model}
        onModelChange={this.handleModelChange}
      />
    );
  }
}
