/**
 * @file Editor
 * @description
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {ClassNamesFn, themeable} from 'amis-core';
import {autobind} from 'amis-core';
import {Icon} from './icons';
import {LocaleProps, localeable} from 'amis-core';

// 用于发布 sdk 版本的时候替换，因为不确定 sdk 版本怎么部署，而 worker 地址路径不可知。
// 所以会被 fis3 替换成取相对的代码。
function filterUrl(url: string) {
  return url;
}

(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    let url = '/pkg/editor.worker.js';

    if (label === 'json') {
      url = '/pkg/json.worker.js';
    } else if (label === 'css') {
      url = '/pkg/css.worker.js';
    } else if (label === 'html') {
      url = '/pkg/html.worker.js';
    } else if (label === 'typescript' || label === 'javascript') {
      url = '/pkg/ts.worker.js';
    }

    url = filterUrl(url);

    // url 有可能会插件替换成 cdn 地址，比如：fis3-prepackager-stand-alone-pack
    if (/^https?/.test(url)) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        importScripts('${url}');`)}
      `;
    }

    return url;
  }
};

export function monacoFactory(
  containerElement: HTMLElement,
  monaco: any,
  options: any
) {
  return monaco.editor.create(containerElement, {
    'autoIndent': true,
    'formatOnType': true,
    'formatOnPaste': true,
    'selectOnLineNumbers': true,
    'scrollBeyondLastLine': false,
    'folding': true,
    'minimap': {
      enabled: false
    },
    'scrollbar': {
      alwaysConsumeMouseWheel: false
    },
    'bracketPairColorization.enabled': true,
    ...options
  });
}

export interface EditorProps extends LocaleProps {
  value?: string;
  defaultValue?: string;
  width?: number | string;
  height?: number | string;
  onChange?: (value: string, event: any) => void;
  language?: string;
  editorTheme?: string;
  allowFullscreen?: boolean;
  options: {
    [propName: string]: any;
  };
  classPrefix: string;
  className?: string;
  classnames: ClassNamesFn;
  context?: any;
  style?: any;
  isDiffEditor?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  editorDidMount?: (editor: any, monaco: any) => void;
  editorWillMount?: (monaco: any) => void;
  editorWillUnmount?: (editor: any, monaco: any) => void;
  editorFactory?: (conatainer: HTMLElement, monaco: any, options: any) => any;
}

export class Editor extends React.Component<EditorProps, any> {
  static defaultProps = {
    language: 'javascript',
    editorTheme: 'vs',
    width: '100%',
    height: '100%',
    allowFullscreen: false,
    options: {}
  };

  state = {
    isFullscreen: false,
    innerWidth: 'auto',
    innerHeight: 'auto'
  };
  editor: any;
  container: any;
  currentValue: any;
  preventTriggerChangeEvent: boolean;
  disposes: Array<{dispose: () => void}> = [];
  constructor(props: EditorProps) {
    super(props);

    this.wrapperRef = this.wrapperRef.bind(this);
    this.currentValue = props.value;
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (
      this.props.value !== this.currentValue &&
      this.editor &&
      !this.props.isDiffEditor
    ) {
      let value = String(this.props.value);

      if (this.props.language === 'json') {
        try {
          value = JSON.stringify(JSON.parse(value), null, 2);
        } catch (e) {}
      }

      this.preventTriggerChangeEvent = true;
      const eidtor = this.editor.getModifiedEditor
        ? this.editor.getModifiedEditor()
        : this.editor;
      const model = eidtor.getModel();
      eidtor.pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value
          }
        ]
      );
      eidtor.pushUndoStop();
      this.preventTriggerChangeEvent = false;
    }

    if (
      this.props.options.readOnly !== prevProps.options.readOnly &&
      this.editor
    ) {
      this.editor.updateOptions?.(this.props.options);
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      const context = this.props.context || window;
      const monaco = context.monaco || (window as any).monaco;
      const editorWillUnmount = this.props.editorWillUnmount;
      editorWillUnmount && editorWillUnmount(this.editor, monaco);
    }
    this.disposes.forEach(({dispose}) => dispose());
    this.disposes = [];
    this.editor?.dispose();
  }

  wrapperRef(ref: any) {
    this.container = ref;
    if (ref) {
      this.loadMonaco();
    } else {
      try {
        this.disposes.forEach(({dispose}) => dispose());
        this.disposes = [];
        if (this.editor) {
          this.editor.getModel().dispose();
          this.editor.dispose();
        }
        this.editor = null;
      } catch (e) {
        // ignore
      }
    }
  }

  loadMonaco() {
    import('monaco-editor').then(monaco => this.initMonaco(monaco));
  }

  initMonaco(monaco: any) {
    let value =
      this.props.value !== null ? this.props.value : this.props.defaultValue;
    const {language, editorTheme, options, editorFactory} = this.props;
    const containerElement = this.container;
    if (!containerElement) {
      return;
    }

    // Before initializing monaco editor
    this.editorWillMount(monaco);

    if (this.props.language === 'json') {
      try {
        value = JSON.stringify(
          typeof value === 'string' ? JSON.parse(value) : value,
          null,
          2
        );
      } catch (e) {
        // ignore
      }
    }

    const factory = editorFactory || monacoFactory;
    this.editor = factory(containerElement, monaco, {
      ...options,
      automaticLayout: true,
      value,
      language,
      editorTheme,
      theme: editorTheme
    });

    // json 默认开启验证。
    monaco.languages.json?.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      validate: true,
      allowComments: true,
      ...monaco.languages.json?.jsonDefaults.diagnosticsOptions
    });

    // After initializing monaco editor
    this.editorDidMount(this.editor, monaco);
  }

  editorWillMount(monaco: any) {
    const {editorWillMount} = this.props;
    editorWillMount && editorWillMount(monaco);
  }

  editorDidMount(editor: any, monaco: any) {
    const {editorDidMount, onChange, onFocus, onBlur} = this.props;
    editorDidMount && editorDidMount(editor, monaco);
    editor.onDidChangeModelContent &&
      this.disposes.push(
        editor.onDidChangeModelContent((event: any) => {
          const value = editor.getValue();
          // Always refer to the latest value
          this.currentValue = value;

          // Only invoking when user input changed
          if (!this.preventTriggerChangeEvent && onChange) {
            onChange(value, event);
          }
        })
      );
    onFocus &&
      editor.onDidFocusEditorWidget &&
      this.disposes.push(editor.onDidFocusEditorWidget(onFocus));
    onBlur &&
      editor.onDidBlurEditorWidget &&
      this.disposes.push(editor.onDidBlurEditorWidget(onBlur));

    const {width = 'auto', height = 'auto'} =
      this?.editor?._configuration?._elementSizeObserver ?? {};

    this.setState({innerHeight: height, innerWidth: width});
  }

  @autobind
  handleFullscreenModeChange() {
    this.setState(
      {isFullscreen: !this.state.isFullscreen},
      () =>
        // 退出全屏模式后需要resize一下editor的宽高，避免溢出父元素
        !this.state.isFullscreen &&
        this.editor.layout({
          width: this.state.innerWidth,
          height: this.state.innerHeight
        })
    );
  }

  render() {
    const {
      className,
      classPrefix: ns,
      width,
      height,
      translate: __
    } = this.props;
    let style = {...(this.props.style || {})};

    style.width = width;
    style.height = height;

    return (
      <div
        className={cx(
          `${ns}MonacoEditor`,
          {'is-fullscreen': this.state.isFullscreen},
          className
        )}
        style={style}
        ref={this.wrapperRef}
      >
        {this.editor && this.props.allowFullscreen ? (
          <div className={cx(`${ns}MonacoEditor-header`)}>
            <a
              className={cx('Modal-close', `${ns}MonacoEditor-fullscreen`)}
              data-tooltip={
                this.state.isFullscreen
                  ? __('Editor.exitFullscreen')
                  : __('Editor.fullscreen')
              }
              data-position="left"
              onClick={this.handleFullscreenModeChange}
            >
              <Icon
                icon={this.state.isFullscreen ? 'compress-alt' : 'expand-alt'}
                className="icon"
              />
            </a>
          </div>
        ) : null}
      </div>
    );
  }
}

export default themeable(localeable(Editor));
