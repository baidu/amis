import React from 'react';
import {Renderer} from '../../factory';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {filter} from '../../utils/tpl';
import cx from 'classnames';
import LazyComponent from '../../components/LazyComponent';
import debouce from 'lodash/debounce';
import {isPureVariable} from '../../utils/tpl-builtin';
import {SchemaTokenizeableString} from '../../Schema';

/**
 * Diff 编辑器
 * 文档：https://baidu.gitee.io/amis/docs/components/form/diff
 */
export interface DiffControlSchema extends FormBaseControl {
  /**
   * 指定为 Diff 编辑器
   */
  type: 'diff';

  /**
   * 左侧面板的值， 支持取变量。
   */
  diffValue?: SchemaTokenizeableString;

  /**
   * 语言，参考 monaco-editor
   */
  language?: string;

  /**
   * 编辑器配置
   */
  options?: any;
}

function loadComponent(): Promise<React.ReactType> {
  return new Promise(resolve =>
    (require as any)(['../../components/Editor'], (component: any) =>
      resolve(component.default)
    )
  );
}

export interface DiffEditorProps
  extends FormControlProps,
    Omit<DiffControlSchema, 'type'> {}

function normalizeValue(value: any, language?: string) {
  if (value && typeof value !== 'string') {
    value = JSON.stringify(value, null, 4);
  }

  if (language && language === 'json') {
    try {
      value = JSON.stringify(
        typeof value === 'string' ? JSON.parse(value) : value,
        null,
        4
      );
    } catch (e) {}
  }

  return value;
}

export class DiffEditor extends React.Component<DiffEditorProps, any> {
  static defaultProps: Partial<DiffEditorProps> = {
    language: 'javascript',
    theme: 'vs',
    options: {
      automaticLayout: false,
      selectOnLineNumbers: true,
      scrollBeyondLastLine: false,
      folding: true,
      minimap: {
        enabled: false
      }
    },
    diffValue: ''
  };

  state = {
    focused: false
  };

  editor: any;
  monaco: any;
  originalEditor: any;
  modifiedEditor: any;
  toDispose: Array<Function> = [];

  constructor(props: DiffEditorProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.editorFactory = this.editorFactory.bind(this);
    this.handleEditorMounted = this.handleEditorMounted.bind(this);
    this.handleModifiedEditorChange = this.handleModifiedEditorChange.bind(
      this
    );
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

  componentDidUpdate(prevProps: any) {
    const {data, value, diffValue, language} = this.props;

    if (
      this.originalEditor &&
      diffValue &&
      (diffValue !== prevProps.diffValue || data !== prevProps.data)
    ) {
      this.originalEditor
        .getModel()
        .setValue(
          isPureVariable(diffValue as string)
            ? normalizeValue(filter(diffValue || '', data, '| raw'), language)
            : normalizeValue(diffValue, language)
        );
    }

    if (
      this.modifiedEditor &&
      value &&
      value !== prevProps.value &&
      !this.state.focused
    ) {
      this.modifiedEditor.getModel().setValue(normalizeValue(value, language));
    }
  }

  editorFactory(containerElement: any, monaco: any, options: any) {
    return monaco.editor.createDiffEditor(containerElement, options);
  }

  handleEditorMounted(editor: any, monaco: any) {
    const {value, data, language, diffValue} = this.props;

    this.monaco = monaco;
    this.editor = editor;
    this.modifiedEditor = editor.getModifiedEditor();
    this.originalEditor = editor.getOriginalEditor();

    this.toDispose.push(
      this.modifiedEditor.onDidFocusEditorWidget(this.handleFocus).dispose
    );
    this.toDispose.push(
      this.modifiedEditor.onDidBlurEditorWidget(this.handleBlur).dispose
    );
    this.toDispose.push(
      this.modifiedEditor.onDidChangeModelContent(
        this.handleModifiedEditorChange
      ).dispose
    );

    this.editor.setModel({
      original: this.monaco.editor.createModel(
        isPureVariable(diffValue as string)
          ? normalizeValue(filter(diffValue || '', data, '| raw'), language)
          : normalizeValue(diffValue, language),
        language
      ),
      modified: this.monaco.editor.createModel(
        normalizeValue(value, language),
        language
      )
    });

    this.updateContainerSize();
  }

  handleModifiedEditorChange() {
    const {onChange} = this.props;
    onChange && onChange(this.modifiedEditor.getModel().getValue());
    this.updateContainerSize();
  }

  updateContainerSize() {
    const editor = this.modifiedEditor;
    const parentDom = editor._domElement.parentNode.parentNode.parentNode;
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
      value,
      onChange,
      disabled,
      size,
      options,
      language,
      theme,
      classnames: cx
    } = this.props;

    return (
      <div
        className={cx(
          'EditorControl',
          size ? `EditorControl--${size}` : '',
          className,
          {
            'is-focused': this.state.focused
          }
        )}
      >
        <LazyComponent
          getComponent={loadComponent}
          value={value}
          onChange={onChange}
          disabled={disabled}
          language={language}
          theme={theme}
          editorDidMount={this.handleEditorMounted}
          editorFactory={this.editorFactory}
          options={{
            ...options,
            readOnly: disabled
          }}
        />
      </div>
    );
  }
}

@FormItem({
  type: `diff-editor`,
  sizeMutable: false
})
export class DiffEditorControlRenderer extends DiffEditor {
  static defaultProps = {
    ...DiffEditor.defaultProps
  };
}

@Renderer({
  test: /(^|\/)diff-editor$/,
  name: 'diff-editor'
})
export class DiffEditorRenderer extends DiffEditor {
  static defaultProps = {
    ...DiffEditor.defaultProps,
    disabled: true
  };
}
