import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import LazyComponent from '../../components/LazyComponent';
import {noop} from '../../utils/helper';

export interface RichTextProps extends FormControlProps {
  options?: any;
}

function loadComponent(): Promise<React.ReactType> {
  return new Promise(resolve =>
    (require as any)(['../../components/RichText'], (component: any) =>
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
      language: 'zh_cn',
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

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

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
      }
    };

    if (props.buttons) {
      this.config.toolbarButtonsSM = props.buttons;
      this.config.toolbarButtonsMD = props.buttons;
      this.config.toolbarButtonsXS = props.buttons;
      this.config.toolbarButtons = props.buttons;
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
      size
    } = this.props;

    return (
      <div
        className={cx(`${ns}RichTextControl`, className, {
          'is-focused': this.state.focused,
          'is-disabled': disabled
        })}
      >
        <LazyComponent
          getComponent={loadComponent}
          model={value}
          onModelChange={disabled ? noop : onChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          config={this.config}
          disabled={disabled}
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
