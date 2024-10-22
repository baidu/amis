import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData,
  getVariable
} from 'amis-core';
import {DiffEditor} from 'amis-ui';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import {FormBaseControlSchema, SchemaTokenizeableString} from '../../Schema';

import type {Position} from 'monaco-editor';
import type {ListenerAction} from 'amis-core';

/**
 * Diff 编辑器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/diff
 */
export interface DiffControlSchema extends FormBaseControlSchema {
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

  return value || '';
}

export interface DiffEditorState {
  focused: boolean;
}

export class DiffEditorRenderer extends React.Component<
  DiffEditorProps,
  DiffEditorState
> {
  static defaultProps: Partial<DiffEditorProps> = {
    language: 'javascript',
    editorTheme: 'vs',
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

  constructor(props: DiffEditorProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEditorMounted = this.handleEditorMounted.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  doAction(
    action: ListenerAction,
    data: any,
    throwErrors: boolean = false,
    args?: any
  ) {
    const actionType = action?.actionType as string;
    const {onChange, resetValue, formStore, store, name} = this.props;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange(pristineVal ?? '');
    } else if (actionType === 'focus') {
      this.focus();
    }
  }

  focus() {
    this.editor?.focus();
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

  async handleChange(value: any) {
    const {onChange, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value})
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(value);
  }

  handleEditorMounted(editor: any) {
    this.editor = editor;
  }

  render() {
    const {
      className,
      style,
      value,
      onChange,
      disabled,
      size,
      options,
      language,
      editorTheme,
      diffValue,
      classnames: cx,
      data
    } = this.props;

    const originValue = isPureVariable(diffValue as string)
      ? normalizeValue(
          resolveVariableAndFilter(diffValue || '', data, '| raw'),
          language
        )
      : normalizeValue(diffValue, language);

    const finalValue = normalizeValue(value, language);

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
        <DiffEditor
          value={finalValue}
          originValue={originValue}
          onChange={this.handleChange}
          disabled={disabled}
          language={language}
          editorTheme={editorTheme}
          options={options}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          editorDidMount={this.handleEditorMounted}
        />
      </div>
    );
  }
}

@FormItem({
  type: `diff-editor`,
  sizeMutable: false
})
export class DiffEditorControlRenderer extends DiffEditorRenderer {
  static defaultProps = {
    ...DiffEditorRenderer.defaultProps
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
