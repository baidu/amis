import React from 'react';
import {Renderer} from '../../factory';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import LazyComponent from '../../components/LazyComponent';
import {
  isPureVariable,
  resolveVariableAndFilter
} from '../../utils/tpl-builtin';
import {SchemaTokenizeableString} from '../../Schema';
import {autobind} from '../../utils/helper';
import {bindRendererEvent} from '../../actions/Decorators';

import type {Position} from 'monaco-editor';
import type {ListenerAction} from '../../actions/Action';

/**
 * Diff 编辑器
 * 文档：https://baidu.gitee.io/amis/docs/components/form/diff
 */
export interface DiffControlSchema extends FormBaseControl {
  /**
   * 指定为 Diff 编辑器
   */
  type: 'diff-editor';

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

export type DiffEditorRendererEvent = 'blur' | 'focus';

function loadComponent(): Promise<any> {
  return import('../../components/Editor').then(item => item.default);
}

export interface DiffEditorProps
  extends FormControlProps,
    Omit<
      DiffControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

function normalizeValue(value: any, language?: string) {
  if (value && typeof value !== 'string') {
    value = JSON.stringify(value, null, 2);
  }

  if (language && language === 'json') {
    try {
      value = JSON.stringify(
        typeof value === 'string' ? JSON.parse(value) : value,
        null,
        2
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
  divRef = React.createRef<HTMLDivElement>();

  constructor(props: DiffEditorProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.editorFactory = this.editorFactory.bind(this);
    this.handleEditorMounted = this.handleEditorMounted.bind(this);
    this.handleModifiedEditorChange =
      this.handleModifiedEditorChange.bind(this);
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
  }

  doAction(action: ListenerAction, args: any) {
    const actionType = action?.actionType as string;

    if (actionType === 'focus') {
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

  @bindRendererEvent<DiffEditorProps, DiffEditorRendererEvent>('focus')
  handleFocus() {
    this.setState({
      focused: true
    });
  }

  @bindRendererEvent<DiffEditorProps, DiffEditorRendererEvent>('blur')
  handleBlur() {
    this.setState({
      focused: false
    });
  }

  componentDidUpdate(prevProps: any) {
    const {data, value, diffValue, language} = this.props;

    if (
      this.originalEditor &&
      (diffValue !== prevProps.diffValue || data !== prevProps.data)
    ) {
      this.originalEditor.getModel().setValue(
        isPureVariable(diffValue as string)
          ? normalizeValue(
              resolveVariableAndFilter(
                diffValue || '',
                data,
                '| raw',
                () => ''
              ),
              language
            )
          : normalizeValue(diffValue, language)
      );
    }

    if (
      this.modifiedEditor &&
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

    this.toDispose.push(
      this.modifiedEditor.onDidChangeModelDecorations(() => {
        this.updateContainerSize(this.modifiedEditor, monaco); // typing
        requestAnimationFrame(
          this.updateContainerSize.bind(this, this.modifiedEditor, monaco)
        ); // folding
      }).dispose
    );

    this.editor.setModel({
      original: this.monaco.editor.createModel(
        isPureVariable(diffValue as string)
          ? normalizeValue(
              resolveVariableAndFilter(diffValue || '', data, '| raw'),
              language
            )
          : normalizeValue(diffValue, language),
        language
      ),
      modified: this.monaco.editor.createModel(
        normalizeValue(value, language),
        language
      )
    });
  }

  handleModifiedEditorChange() {
    const {onChange} = this.props;
    onChange && onChange(this.modifiedEditor.getModel().getValue());
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
        ref={this.divRef}
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
          isDiffEditor
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

// @Renderer({
//   test: /(^|\/)diff-editor$/,
//   name: 'diff-editor'
// })
// export class DiffEditorRenderer extends DiffEditor {
//   static defaultProps = {
//     ...DiffEditor.defaultProps,
//     disabled: true
//   };
// }
