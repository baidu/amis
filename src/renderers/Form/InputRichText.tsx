import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import LazyComponent from '../../components/LazyComponent';
import {tokenize} from '../../utils/tpl-builtin';
import {normalizeApi} from '../../utils/api';
import {ucFirst} from '../../utils/helper';

/**
 * RichText
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-rich-text
 */
export interface RichTextControlSchema extends FormBaseControl {
  type: 'input-rich-text';

  vendor?: 'froala' | 'tinymce';

  receiver?: string;
  videoReceiver?: string;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  options?: any;
}

export interface RichTextProps extends FormControlProps {
  options?: any;
  vendor?: 'froala' | 'tinymce';
}

function loadRichText(
  type: 'tinymce' | 'froala' = 'froala'
): () => Promise<any> {
  return () =>
    type === 'tinymce'
      ? import('../../components/Tinymce').then(item => item.default)
      : import('../../components/RichText').then(item => item.default);
}

export default class RichTextControl extends React.Component<
  RichTextProps,
  any
> {
  static defaultProps: Partial<RichTextProps> = {
    imageEditable: true,
    receiver: '/api/upload/image',
    videoReceiver: '/api/upload/video',
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

  state = {
    focused: false
  };
  config: any = null;
  constructor(props: RichTextProps) {
    super(props);

    const finnalVendor =
      props.vendor || (props.env.richTextToken ? 'froala' : 'tinymce');
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);

    if (finnalVendor === 'froala') {
      this.config = {
        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
        imageDefaultAlign: 'left',
        imageEditButtons: props.imageEditable
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
          : [],
        key: props.env.richTextToken,
        attribution: false,
        ...props.options,
        editorClass: props.editorClass,
        placeholderText: props.translate(props.placeholder),
        imageUploadURL: tokenize(props.receiver, props.data),
        imageUploadParams: {
          from: 'rich-text'
        },
        videoUploadURL: tokenize(props.videoReceiver, props.data),
        videoUploadParams: {
          from: 'rich-text'
        },
        events: {
          ...(props.options && props.options.events),
          focus: this.handleFocus,
          blur: this.handleBlur
        },
        language:
          !this.props.locale || this.props.locale === 'zh-CN' ? 'zh_cn' : ''
      };

      if (props.buttons) {
        this.config.toolbarButtons = props.buttons;
      }
    } else {
      const fetcher = props.env.fetcher;
      this.config = {
        ...props.options,
        images_upload_handler: async (
          blobInfo: any,
          ok: (locaiton: string) => void,
          fail: (reason: string) => void
        ) => {
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          try {
            const receiver = {
              adaptor: (payload: object) => {
                return {
                  ...payload,
                  data: payload
                };
              },
              ...normalizeApi(props.receiver, 'post')
            };
            const response = await fetcher(receiver, formData, {
              method: 'post'
            });
            if (response.ok) {
              const location =
                response.data?.link ||
                response.data?.url ||
                response.data?.value ||
                response.data?.data?.link ||
                response.data?.data?.url ||
                response.data?.data?.value;
              if (location) {
                ok(location);
              } else {
                console.warn('must have return value');
              }
            }
          } catch (e) {
            fail(e);
          }
        }
      };
    }
  }

  handleFocus() {
    this.setState({
      focused: true
    });
  }

  handleBlur() {
    this.setState({
      focused: false
    });
  }

  handleChange(
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) {
    const {onChange, disabled} = this.props;

    if (disabled) {
      return;
    }

    onChange?.(value, submitOnChange, changeImmediately);
  }

  render() {
    const {
      className,
      classPrefix: ns,
      value,
      onChange,
      disabled,
      size,
      vendor,
      env,
      locale,
      translate,
      borderMode
    } = this.props;

    const finnalVendor = vendor || (env.richTextToken ? 'froala' : 'tinymce');

    return (
      <div
        className={cx(`${ns}RichTextControl`, className, {
          'is-focused': this.state.focused,
          'is-disabled': disabled,
          [`${ns}RichTextControl--border${ucFirst(borderMode)}`]: borderMode
        })}
      >
        <LazyComponent
          getComponent={loadRichText(finnalVendor)}
          model={value}
          onModelChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          config={this.config}
          disabled={disabled}
          locale={locale}
          translate={translate}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-rich-text',
  sizeMutable: false
})
export class RichTextControlRenderer extends RichTextControl {}
