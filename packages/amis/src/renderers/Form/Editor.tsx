import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData
} from 'amis-core';
import {LazyComponent} from 'amis-core';
import {Editor} from 'amis-ui';
import {autobind} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';

import type {Position} from 'monaco-editor';
import type {ListenerAction} from 'amis-core';

/**
 * Editor 代码编辑器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/editor
 */
export interface EditorControlSchema extends Omit<FormBaseControl, 'size'> {
  type:
    | 'editor'
    | 'bat-editor'
    | 'c-editor'
    | 'coffeescript-editor'
    | 'cpp-editor'
    | 'csharp-editor'
    | 'css-editor'
    | 'dockerfile-editor'
    | 'fsharp-editor'
    | 'go-editor'
    | 'handlebars-editor'
    | 'html-editor'
    | 'ini-editor'
    | 'java-editor'
    | 'javascript-editor'
    | 'json-editor'
    | 'less-editor'
    | 'lua-editor'
    | 'markdown-editor'
    | 'msdax-editor'
    | 'objective-c-editor'
    | 'php-editor'
    | 'plaintext-editor'
    | 'postiats-editor'
    | 'powershell-editor'
    | 'pug-editor'
    | 'python-editor'
    | 'r-editor'
    | 'razor-editor'
    | 'ruby-editor'
    | 'sb-editor'
    | 'scss-editor'
    | 'sol-editor'
    | 'sql-editor'
    | 'swift-editor'
    | 'typescript-editor'
    | 'vb-editor'
    | 'xml-editor'
    | 'yaml-editor';

  /**
   * 语言类型
   */
  language?:
    | 'bat'
    | 'c'
    | 'coffeescript'
    | 'cpp'
    | 'csharp'
    | 'css'
    | 'dockerfile'
    | 'fsharp'
    | 'go'
    | 'handlebars'
    | 'html'
    | 'ini'
    | 'java'
    | 'javascript'
    | 'json'
    | 'less'
    | 'lua'
    | 'markdown'
    | 'msdax'
    | 'objective-c'
    | 'php'
    | 'plaintext'
    | 'postiats'
    | 'powershell'
    | 'pug'
    | 'python'
    | 'r'
    | 'razor'
    | 'ruby'
    | 'sb'
    | 'scss'
    | 'shell'
    | 'sol'
    | 'sql'
    | 'swift'
    | 'typescript'
    | 'vb'
    | 'xml'
    | 'yaml';

  /**
   * 编辑器大小
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

  /**
   * 是否展示全屏模式开关
   */
  allowFullscreen?: boolean;

  /**
   * 获取编辑器底层实例
   */
  editorDidMount?: string;
}

export type EditorRendererEvent = 'blur' | 'focus';

export interface EditorProps extends FormControlProps {
  options?: object;
}

export default class EditorControl extends React.Component<EditorProps, any> {
  static defaultProps: Partial<EditorProps> = {
    language: 'javascript',
    editorTheme: 'vs',
    allowFullscreen: true,
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
  divRef = React.createRef<HTMLDivElement>();
  constructor(props: EditorProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditorMounted = this.handleEditorMounted.bind(this);
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
  }

  doAction(action: ListenerAction, args: any) {
    const actionType = action?.actionType as string;
    const {onChange, resetValue} = this.props;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    } else if (actionType === 'focus') {
      this.focus();
    }
  }

  focus() {
    this.editor.focus();
    this.setState({focused: true});

    // 最近一次光标位置
    const position: Position | null = this.editor?.getPosition();
    this.editor?.setPosition(position);
  }

  async handleFocus(e: any) {
    const {dispatchEvent, value, onFocus} = this.props;

    this.setState({
      focused: true
    });

    const rendererEvent = await dispatchEvent(
      'focus',
      resolveEventData(this.props, {value})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onFocus?.(e);
  }

  async handleBlur(e: any) {
    const {dispatchEvent, value, onBlur} = this.props;

    this.setState({
      focused: false
    });

    const rendererEvent = await dispatchEvent(
      'blur',
      resolveEventData(this.props, {value})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onBlur?.(e);
  }

  async handleChange(e: any) {
    const {dispatchEvent, onChange} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value: e})
    );

    if (rendererEvent?.prevented) {
      return;
    }
    onChange?.(e);
  }

  handleEditorMounted(editor: any, monaco: any) {
    this.editor = editor;
    this.toDispose.push(
      editor.onDidChangeModelDecorations(() => {
        this.updateContainerSize(editor, monaco); // typing
        requestAnimationFrame(
          this.updateContainerSize.bind(this, editor, monaco)
        ); // folding
      }).dispose
    );
    if (this.props.editorDidMount) {
      let editorDidMount = this.props.editorDidMount;
      if (typeof editorDidMount === 'string') {
        editorDidMount = new Function('editor', 'monaco', editorDidMount);
      }
      const dispose = editorDidMount(editor, monaco);
      if (typeof dispose === 'function') {
        this.toDispose.push(dispose);
      }
    }
  }

  prevHeight = 0;
  @autobind
  updateContainerSize(editor: any, monaco: any) {
    if (!this.divRef.current) {
      return;
    }

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    if (this.prevHeight !== height) {
      this.prevHeight = height;
      this.divRef.current.style.height = `${height}px`;
      editor.layout();
    }
  }

  render() {
    const {
      className,
      style,
      classPrefix: ns,
      classnames: cx,
      value,
      onChange,
      disabled,
      options,
      editorTheme,
      size,
      data,
      allowFullscreen,
      placeholder
    } = this.props;

    let language = this.props.language;

    let finnalValue = value;

    if (finnalValue && typeof finnalValue !== 'string') {
      finnalValue = JSON.stringify(finnalValue, null, 2);
    }

    if (isPureVariable(language)) {
      language = resolveVariableAndFilter(language, data);
    }

    return (
      <div
        ref={this.divRef}
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
          allowFullscreen={allowFullscreen}
          value={finnalValue}
          onChange={this.handleChange}
          disabled={disabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          language={language}
          editorTheme={editorTheme}
          editorDidMount={this.handleEditorMounted}
          childProps={{
            placeholder: placeholder
          }}
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
  'shell',
  'sql',
  'swift',
  'typescript',
  'vb',
  'xml',
  'yaml'
];

export const EditorControls: Array<typeof EditorControl> =
  availableLanguages.map((lang: string) => {
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
