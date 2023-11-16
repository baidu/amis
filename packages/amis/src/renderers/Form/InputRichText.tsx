import React from 'react';
import {
  FormItem,
  FormControlProps,
  buildApi,
  qsstringify,
  resolveEventData,
  autobind
} from 'amis-core';
import cx from 'classnames';
import {LazyComponent} from 'amis-core';
import {normalizeApi} from 'amis-core';
import {ucFirst, anyChanged} from 'amis-core';
import type {FormBaseControlSchema, SchemaApi} from '../../Schema';

/**
 * RichText
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/input-rich-text
 */
export interface RichTextControlSchema extends FormBaseControlSchema {
  type: 'input-rich-text';

  /**
   * 编辑器类型
   */
  vendor?: 'froala' | 'tinymce';

  /**
   * 图片保存 API
   *
   * @default /api/upload/image
   */
  receiver?: SchemaApi;

  /**
   * 视频保存 API
   *
   * @default /api/upload/video
   */
  videoReceiver?: SchemaApi;

  /**
   * 接收器的字段名
   */
  fileField?: string;

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   *  tinymce 或 froala 的配置
   */
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
      ? import('amis-ui/lib/components/Tinymce').then(item => item.default)
      : import('amis-ui/lib/components/RichText').then(item => item.default);
}

export default class RichTextControl extends React.Component<
  RichTextProps,
  any
> {
  static defaultProps: Partial<RichTextProps> = {
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

  state = {
    config: null,
    focused: false
  };

  constructor(props: RichTextProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state.config = this.getConfig(props);
  }

  componentDidUpdate(prevProps: Readonly<RichTextProps>) {
    const props = this.props;
    const finnalVendor =
      props.vendor || (props.env.richTextToken ? 'froala' : 'tinymce');

    if (finnalVendor === 'froala') {
      if (
        anyChanged(
          ['options', 'editorClass', 'placeholder', 'buttons'],
          prevProps,
          props
        )
      ) {
        this.setState({
          config: this.getConfig(props)
        });
      }
    } else if (finnalVendor === 'tinymce') {
      if (anyChanged(['options', 'fileField'], prevProps, props)) {
        this.setState({
          config: this.getConfig(props)
        });
      }
    }
  }

  getConfig(props: RichTextProps) {
    const finnalVendor =
      props.vendor || (props.env.richTextToken ? 'froala' : 'tinymce');

    const imageReceiver = normalizeApi(
      props.receiver,
      props.receiver?.method || 'post'
    );
    imageReceiver.data = imageReceiver.data || {};
    const imageApi = buildApi(imageReceiver, props.data, {
      method: props.receiver.method || 'post'
    });
    if (finnalVendor === 'froala') {
      const videoReceiver = normalizeApi(
        props.videoReceiver,
        props.videoReceiver.method || 'post'
      );
      videoReceiver.data = videoReceiver.data || {};
      const videoApi = buildApi(videoReceiver, props.data, {
        method: props.videoReceiver.method || 'post'
      });
      return {
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
        imageUploadURL: imageApi.url,
        imageUploadParams: {
          from: 'rich-text',
          ...imageApi.data
        },
        videoUploadURL: videoApi.url,
        videoUploadParams: {
          from: 'rich-text',
          ...videoApi.data
        },
        events: {
          ...(props.options && props.options.events),
          focus: this.handleFocus,
          blur: this.handleBlur
        },
        language:
          !this.props.locale || this.props.locale === 'zh-CN' ? 'zh_cn' : '',
        ...(props.buttons ? {toolbarButtons: props.buttons} : {})
      };
    } else {
      const fetcher = props.env.fetcher;
      return {
        ...props.options,
        onLoaded: this.handleTinyMceLoaded,
        images_upload_handler: (blobInfo: any, progress: any) =>
          new Promise(async (resolve, reject) => {
            const formData = new FormData();

            if (imageApi.data) {
              qsstringify(imageApi.data)
                .split('&')
                .filter(item => item !== '')
                .forEach(item => {
                  let parts = item.split('=');
                  formData.append(parts[0], decodeURIComponent(parts[1]));
                });
            }

            formData.append(
              props.fileField || 'file',
              blobInfo.blob(),
              blobInfo.filename()
            );

            try {
              if (!imageApi.url) {
                var reader = new FileReader();
                reader.readAsDataURL(blobInfo.blob());
                reader.onloadend = function () {
                  var base64data = reader.result;
                  resolve(base64data);
                };
                return;
              }
              const receiver = {
                adaptor: (payload: object) => {
                  return {
                    ...payload,
                    data: payload
                  };
                },
                ...imageApi
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
                  resolve(location);
                } else {
                  console.warn('must have return value');
                }
              }
            } catch (e) {
              reject(e);
            }
          })
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

  async handleChange(
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) {
    const {onChange, disabled, dispatchEvent} = this.props;

    if (disabled) {
      return;
    }

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value})
    );
    if (rendererEvent?.prevented) {
      return;
    }
    onChange?.(value, submitOnChange, changeImmediately);
  }

  @autobind
  handleTinyMceLoaded(tinymce: any) {
    const env = this.props.env;
    return env?.loadTinymcePlugin?.(tinymce);
  }

  render() {
    const {
      className,
      style,
      classPrefix: ns,
      value,
      onChange,
      disabled,
      static: isStatic,
      size,
      vendor,
      env,
      locale,
      translate,
      borderMode
    } = this.props;

    const finnalVendor = vendor || (env.richTextToken ? 'froala' : 'tinymce');

    if (isStatic) {
      return (
        <div
          className={cx(`${ns}RichTextControl`, className, {
            'is-focused': this.state.focused,
            'is-disabled': disabled,
            [`${ns}RichTextControl--border${ucFirst(borderMode)}`]: borderMode
          })}
          dangerouslySetInnerHTML={{__html: env.filterHtml(value)}}
        ></div>
      );
    }

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
          config={this.state.config}
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
  sizeMutable: false,
  detectProps: ['options', 'buttons']
})
export class RichTextControlRenderer extends RichTextControl {}
