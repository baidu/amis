/**
 * @file Editor
 * @description
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {ClassNamesFn, themeable} from '../theme';

function noJsExt(raw: string) {
  return raw.replace(/\.js$/, '');
}

const defaultConfig = {
  url: 'vs/loader.js',
  'vs/nls': {
    availableLanguages: {
      '*': 'zh-cn'
    }
  },
  paths: {}
};

try {
  // fis 编译的话，能正确赋值上，如果不是，那请通过外部参数传递。
  defaultConfig.url = __uri('monaco-editor/min/vs/loader.js');
  defaultConfig.paths = {
    vs: noJsExt(__uri('monaco-editor/min/vs/editor/editor.main.js')).replace(
      /\/vs\/.*$/,
      ''
    ),
    'vs/base/worker/workerMain': noJsExt(
      __uri('monaco-editor/min/vs/base/worker/workerMain.js')
    ),

    'vs/basic-languages/apex/apex': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/apex/apex')
    ),
    'vs/basic-languages/azcli/azcli': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/azcli/azcli')
    ),
    'vs/basic-languages/clojure/clojure': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/clojure/clojure')
    ),
    'vs/basic-languages/bat/bat': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/bat/bat')
    ),
    'vs/basic-languages/coffee/coffee': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/coffee/coffee')
    ),
    'vs/basic-languages/cpp/cpp': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/cpp/cpp')
    ),
    'vs/basic-languages/csharp/csharp': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/csharp/csharp')
    ),
    'vs/basic-languages/css/css': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/css/css')
    ),
    'vs/basic-languages/dockerfile/dockerfile': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/dockerfile/dockerfile')
    ),
    'vs/basic-languages/fsharp/fsharp': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/fsharp/fsharp')
    ),
    'vs/basic-languages/go/go': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/go/go')
    ),
    'vs/basic-languages/handlebars/handlebars': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/handlebars/handlebars')
    ),
    'vs/basic-languages/html/html': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/html/html')
    ),
    'vs/basic-languages/ini/ini': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/ini/ini')
    ),
    'vs/basic-languages/java/java': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/java/java')
    ),
    'vs/basic-languages/javascript/javascript': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/javascript/javascript')
    ),
    'vs/basic-languages/less/less': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/less/less')
    ),
    'vs/basic-languages/lua/lua': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/lua/lua')
    ),
    'vs/basic-languages/markdown/markdown': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/markdown/markdown')
    ),
    'vs/basic-languages/msdax/msdax': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/msdax/msdax')
    ),
    'vs/basic-languages/objective-c/objective-c': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/objective-c/objective-c')
    ),
    'vs/basic-languages/php/php': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/php/php')
    ),
    'vs/basic-languages/postiats/postiats': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/postiats/postiats')
    ),
    'vs/basic-languages/powershell/powershell': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/powershell/powershell')
    ),
    'vs/basic-languages/pug/pug': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/pug/pug')
    ),
    'vs/basic-languages/python/python': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/python/python')
    ),
    'vs/basic-languages/r/r': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/r/r')
    ),
    'vs/basic-languages/razor/razor': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/razor/razor')
    ),
    'vs/basic-languages/redis/redis': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/redis/redis')
    ),
    'vs/basic-languages/redshift/redshift': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/redshift/redshift')
    ),
    'vs/basic-languages/ruby/ruby': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/ruby/ruby')
    ),
    'vs/basic-languages/rust/rust': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/rust/rust')
    ),
    'vs/basic-languages/sb/sb': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/sb/sb')
    ),
    'vs/basic-languages/scheme/scheme': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/scheme/scheme')
    ),
    'vs/basic-languages/scss/scss': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/scss/scss')
    ),
    'vs/basic-languages/shell/shell': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/shell/shell')
    ),
    'vs/basic-languages/solidity/solidity': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/solidity/solidity')
    ),
    'vs/basic-languages/sql/sql': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/sql/sql')
    ),
    'vs/basic-languages/st/st': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/st/st')
    ),
    'vs/basic-languages/swift/swift': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/swift/swift')
    ),
    'vs/basic-languages/typescript/typescript': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/typescript/typescript')
    ),
    'vs/basic-languages/vb/vb': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/vb/vb')
    ),
    'vs/basic-languages/xml/xml': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/xml/xml')
    ),
    'vs/basic-languages/yaml/yaml': noJsExt(
      __uri('monaco-editor/min/vs/basic-languages/yaml/yaml')
    ),

    'vs/editor/editor.main': noJsExt(
      __uri('monaco-editor/min/vs/editor/editor.main.js')
    ),
    'vs/editor/editor.main.css': noJsExt(
      __uri('monaco-editor/min/vs/editor/editor.main.css')
    ),
    'vs/editor/editor.main.nls': noJsExt(
      __uri('monaco-editor/min/vs/editor/editor.main.nls.js')
    ),
    'vs/editor/editor.main.nls.zh-cn': noJsExt(
      __uri('monaco-editor/min/vs/editor/editor.main.nls.zh-cn.js')
    ),

    // 'vs/editor/contrib/suggest/media/String_16x.svg': noJsExt(__uri('monaco-editor/min/vs/editor/contrib/suggest/media/String_16x.svg')),
    // 'vs/editor/contrib/suggest/media/String_inverse_16x.svg': noJsExt(__uri('monaco-editor/min/vs/editor/contrib/suggest/media/String_inverse_16x.svg')),
    // 'vs/editor/standalone/browser/quickOpen/symbol-sprite.svg': noJsExt(__uri('monaco-editor/min/vs/editor/standalone/browser/quickOpen/symbol-sprite.svg')),

    'vs/language/typescript/tsMode': noJsExt(
      __uri('monaco-editor/min/vs/language/typescript/tsMode.js')
    ),
    // 'vs/language/typescript/lib/typescriptServices': noJsExt(__uri('monaco-editor/min/vs/language/typescript/lib/typescriptServices.js')),
    'vs/language/typescript/tsWorker': noJsExt(
      __uri('monaco-editor/min/vs/language/typescript/tsWorker.js')
    ),

    'vs/language/json/jsonMode': noJsExt(
      __uri('monaco-editor/min/vs/language/json/jsonMode.js')
    ),
    'vs/language/json/jsonWorker': noJsExt(
      __uri('monaco-editor/min/vs/language/json/jsonWorker.js')
    ),

    'vs/language/html/htmlMode': noJsExt(
      __uri('monaco-editor/min/vs/language/html/htmlMode.js')
    ),
    'vs/language/html/htmlWorker': noJsExt(
      __uri('monaco-editor/min/vs/language/html/htmlWorker.js')
    ),

    'vs/language/css/cssMode': noJsExt(
      __uri('monaco-editor/min/vs/language/css/cssMode.js')
    ),
    'vs/language/css/cssWorker': noJsExt(
      __uri('monaco-editor/min/vs/language/css/cssWorker.js')
    )
  };

  // cdn 支持
  /^(https?:)?\/\//.test(defaultConfig.paths.vs) &&
    ((window as any).MonacoEnvironment = {
      getWorkerUrl: function() {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: '${defaultConfig.paths.vs}',
                    paths: ${JSON.stringify(defaultConfig.paths)}
                };
                importScripts('${__uri(
                  'monaco-editor/min/vs/base/worker/workerMain.js'
                )}');`)}`;
      }
    });
} catch (e) {}

export function monacoFactory(containerElement, monaco, options) {
  return monaco.editor.create(containerElement, {
    autoIndent: true,
    formatOnType: true,
    formatOnPaste: true,
    selectOnLineNumbers: true,
    scrollBeyondLastLine: false,
    folding: true,
    minimap: {
      enabled: false
    },
    ...options
  });
}

export interface EditorProps {
  value?: string;
  defaultValue?: string;
  width?: number | string;
  height?: number | string;
  onChange?: (value: string, event: any) => void;
  language?: string;
  editorTheme?: string;
  options: {
    [propName: string]: any;
  };
  classPrefix: string;
  className?: string;
  classnames: ClassNamesFn;
  context?: any;
  style?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  editorDidMount?: (editor: any, monaco: any) => void;
  editorWillMount?: (monaco: any) => void;
  editorWillUnmount?: (editor: any, monaco: any) => void;
  editorFactory?: (conatainer: HTMLElement, monaco: any, options: any) => any;
  requireConfig: {
    url: string;
    paths?: any;
    [propName: string]: any;
  };
}

export class Editor extends React.Component<EditorProps, any> {
  static defaultProps = {
    requireConfig: defaultConfig,
    language: 'javascript',
    editorTheme: 'vs',
    width: '100%',
    height: '100%',
    options: {}
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

  componentWillReceiveProps(nextProps: EditorProps) {
    if (
      this.props.options.readOnly !== nextProps.options.readOnly &&
      this.editor
    ) {
      this.editor.updateOptions && this.editor.updateOptions(nextProps.options);
    }
  }

  componentDidUpdate() {
    if (this.props.value !== this.currentValue && this.editor) {
      let value = String(this.props.value);

      if (this.props.language === 'json') {
        try {
          value = JSON.stringify(JSON.parse(value), null, 4);
        } catch (e) {}
      }

      this.preventTriggerChangeEvent = true;
      this.editor.setValue && this.editor.setValue(value);
      this.preventTriggerChangeEvent = false;
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
    const {requireConfig} = this.props;
    const loaderUrl = requireConfig.url || 'vs/loader.js';
    const context =
      (window as any).monacaAmd ||
      ((window as any).monacaAmd = {
        document: window.document
      });

    const onGotAmdLoader = () => {
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        // Do not use webpack
        if (requireConfig.paths && requireConfig.paths.vs) {
          context.require.config(requireConfig);
        }
      }

      // Load monaco
      context['require'](
        ['vs/editor/editor.main', 'vs/editor/editor.main.nls.zh-cn'],
        () => {
          this.initMonaco();
        }
      );

      // Call the delayed callbacks when AMD loader has been loaded
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        let loaderCallbacks = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;
        if (loaderCallbacks && loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift();
          while (currentCallback) {
            currentCallback.fn.call(currentCallback.context);
            currentCallback = loaderCallbacks.shift();
          }
        }
      }
    };

    // Load AMD loader if necessary
    if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
      //  delay to call callbacks except the first one
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ =
        context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      });
    } else {
      if (typeof context.require === 'undefined') {
        var loaderScript = context.document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = loaderUrl;
        loaderScript.addEventListener('load', onGotAmdLoader);
        context.document.body.appendChild(loaderScript);
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
      } else {
        onGotAmdLoader();
      }
    }
  }

  initMonaco() {
    let value =
      this.props.value !== null ? this.props.value : this.props.defaultValue;
    const {language, editorTheme, options, editorFactory} = this.props;
    const containerElement = this.container;
    if (!containerElement) {
      return;
    }
    const context = this.props.context || window;
    const monaco = context.monaco || (window as any).monaco;
    if (typeof monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(monaco);

      if (this.props.language === 'json') {
        try {
          value = JSON.stringify(
            typeof value === 'string' ? JSON.parse(value) : value,
            null,
            4
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
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        enableSchemaRequest: true,
        validate: true
      });

      // After initializing monaco editor
      this.editorDidMount(this.editor, monaco);
    }
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
  }

  render() {
    const {className, classPrefix: ns, width, height} = this.props;
    let style = this.props.style || {};
    style.width = width;
    style.height = height;

    return (
      <div
        className={cx(`${ns}MonacoEditor`, className)}
        style={style}
        ref={this.wrapperRef}
      />
    );
  }
}

export default themeable(Editor);
