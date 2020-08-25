import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import LazyComponent from '../../components/LazyComponent';
import {noop} from '../../utils/helper';

export interface RichTextProps extends FormControlProps {
  options?: any;
  vendor?: 'froala' | 'tinymce';
}

function loadRichText(
  type: 'tinymce' | 'froala' = 'froala'
): () => Promise<React.ReactType> {
  return () =>
    new Promise(resolve =>
      type === 'tinymce'
        ? (require as any)(['../../components/Tinymce'], (component: any) =>
            resolve(component.default)
          )
        : (require as any)(['../../components/RichText'], (component: any) =>
            resolve(component.default)
          )
    );
}

export default class RichTextControl extends React.Component<
  RichTextProps,
  any
> {
  static defaultProps: Partial<RichTextProps> = {
    imageEditable: true,
    reciever: '/api/upload/image',
    videoReciever: '/api/upload/video',
    placeholder: '请输入',
    options: {
      toolbarButtonsSM: [
        'paragraphFormat',
        'quote',
        'color',
        '|',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'formatOL',
        'formatUL',
        'align',
        '|',
        'insertLink',
        'insertImage',
        'insertEmotion',
        'insertTable',
        '|',
        'undo',
        'redo',
        'html'
      ],
      toolbarButtonsMD: [
        'paragraphFormat',
        'quote',
        'color',
        '|',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'formatOL',
        'formatUL',
        'align',
        '|',
        'insertLink',
        'insertImage',
        'insertEmotion',
        'insertTable',
        '|',
        'undo',
        'redo',
        'html'
      ],
      toolbarButtons: [
        'paragraphFormat',
        'quote',
        'color',
        '|',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'formatOL',
        'formatUL',
        'align',
        '|',
        'insertLink',
        'insertImage',
        'insertEmotion',
        'insertTable',
        '|',
        'undo',
        'redo',
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
        ...props.options,
        editorClass: props.editorClass,
        placeholderText: props.placeholder,
        imageUploadURL: props.reciever,
        imageUploadParams: {
          from: 'rich-text'
        },
        videoUploadURL: props.videoReciever,
        videoUploadParams: {
          from: 'rich-text'
        },
        events: {
          ...(props.options && props.options.events),
          'froalaEditor.focus': this.handleFocus,
          'froalaEditor.blur': this.handleBlur
        },
        language:
          !this.props.locale || this.props.locale === 'zh-cn' ? 'zh_cn' : ''
      };

      if (props.buttons) {
        this.config.toolbarButtonsSM = props.buttons;
        this.config.toolbarButtonsMD = props.buttons;
        this.config.toolbarButtonsXS = props.buttons;
        this.config.toolbarButtons = props.buttons;
      }
    } else {
      const fetcher = props.env.fetcher;
      this.config = {
        ...props.options,
        images_upload_url: props.reciever,
        images_upload_handler: async (
          blobInfo: any,
          ok: (locaiton: string) => void,
          fail: (reason: string) => void
        ) => {
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          try {
            const response = await fetcher(props.reciever, formData, {
              method: 'post'
            });
            if (response.ok) {
              ok(
                response.data?.link ||
                  response.data?.url ||
                  response.data?.value ||
                  (response as any).link
              );
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
      translate
    } = this.props;

    const finnalVendor = vendor || (env.richTextToken ? 'froala' : 'tinymce');

    return (
      <div
        className={cx(`${ns}RichTextControl`, className, {
          'is-focused': this.state.focused,
          'is-disabled': disabled
        })}
      >
        <LazyComponent
          getComponent={loadRichText(finnalVendor)}
          model={value}
          onModelChange={disabled ? noop : onChange}
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
  type: 'rich-text',
  sizeMutable: false
})
export class RichTextControlRenderer extends RichTextControl {}
