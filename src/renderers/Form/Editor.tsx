import React from 'react';
import {FormItem, FormControlProps} from './Item';
import LazyComponent from '../../components/LazyComponent';
import debouce from 'lodash/debounce';
import Editor from '../../components/Editor';

export interface EditorProps extends FormControlProps {
  options?: object;
}

export default class EditorControl extends React.Component<EditorProps, any> {
  static defaultProps: Partial<EditorProps> = {
    language: 'javascript',
    editorTheme: 'vs',
    options: {
      automaticLayout: true,
      selectOnLineNumbers: true,
      scrollBeyondLastLine: false,
      folding: true,
      minimap: {
        enabled: false
      }
    }
  };

  state = {
    focused: false
  };
  editor: any;
  toDispose: Array<Function> = [];
  constructor(props: EditorProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEditorMounted = this.handleEditorMounted.bind(this);
    this.updateContainerSize = debouce(
      this.updateContainerSize.bind(this),
      250,
      {
        trailing: true,
        leading: false
      }
    );
    this.toDispose.push((this.updateContainerSize as any).cancel);
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
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

  handleEditorMounted(editor: any, monaco: any) {
    this.editor = editor;
    this.toDispose.push(
      editor.onDidFocusEditorWidget(this.updateContainerSize).dispose
    );
    this.toDispose.push(
      editor.onDidChangeModelContent(this.updateContainerSize).dispose
    );
    this.props.editorDidMount && this.props.editorDidMount(editor, monaco);
  }

  updateContainerSize() {
    const editor = this.editor;
    const parentDom = editor._domElement.parentNode;
    const configuration = editor.getConfiguration();
    const lineHeight = configuration.lineHeight;
    const lineCount = editor.getModel().getLineCount();
    const contentHeight = lineHeight * lineCount;
    const horizontalScrollbarHeight =
      configuration.layoutInfo.horizontalScrollbarHeight;
    const editorHeight = contentHeight + horizontalScrollbarHeight;
    parentDom.style.cssText = `height:${editorHeight}px`;
  }

  render() {
    const {
      className,
      classPrefix: ns,
      classnames: cx,
      value,
      onChange,
      disabled,
      options,
      language,
      editorTheme,
      size
    } = this.props;

    let finnalValue = value;

    if (finnalValue && typeof finnalValue !== 'string') {
      finnalValue = JSON.stringify(finnalValue, null, 4);
    }

    return (
      <div
        className={cx(
          `EditorControl`,
          {
            'is-focused': this.state.focused,
            [`EditorControl--${size}`]: size
          },
          className
        )}
      >
        <LazyComponent
          classPrefix={ns}
          component={Editor}
          value={finnalValue}
          onChange={onChange}
          disabled={disabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          language={language}
          editorTheme={editorTheme}
          editorDidMount={this.handleEditorMounted}
          options={{
            ...options,
            readOnly: disabled
          }}
        />
      </div>
    );
  }
}

export const availableLanguages = [
  'bat',
  'c',
  'coffeescript',
  'cpp',
  'csharp',
  'css',
  'dockerfile',
  'fsharp',
  'go',
  'handlebars',
  'html',
  'ini',
  'java',
  'javascript',
  'json',
  'less',
  'lua',
  'markdown',
  'msdax',
  'objective-c',
  'php',
  'plaintext',
  'postiats',
  'powershell',
  'pug',
  'python',
  'r',
  'razor',
  'ruby',
  'sb',
  'scss',
  'sol',
  'sql',
  'swift',
  'typescript',
  'vb',
  'xml',
  'yaml'
];

export const EditorControls: Array<
  typeof EditorControl
> = availableLanguages.map((lang: string) => {
  @FormItem({
    type: `${lang}-editor`,
    sizeMutable: false
  })
  class EditorControlRenderer extends EditorControl {
    static lang = lang;
    static displayName = `${lang[0].toUpperCase()}${lang.substring(
      1
    )}EditorControlRenderer`;
    static defaultProps = {
      ...EditorControl.defaultProps,
      language: lang
    };
  }

  return EditorControlRenderer;
});

@FormItem({
  type: 'js-editor',
  sizeMutable: false
})
class JavascriptEditorControlRenderer extends EditorControl {
  static defaultProps = {
    ...EditorControl.defaultProps,
    language: 'javascript'
  };
}

@FormItem({
  type: 'ts-editor',
  sizeMutable: false
})
class TypescriptEditorControlRenderer extends EditorControl {
  static defaultProps = {
    ...EditorControl.defaultProps,
    language: 'typescript'
  };
}

@FormItem({
  type: `editor`,
  sizeMutable: false
})
export class EditorControlRenderer extends EditorControl {
  static defaultProps = {
    ...EditorControl.defaultProps,
    language: 'javascript'
  };
}
