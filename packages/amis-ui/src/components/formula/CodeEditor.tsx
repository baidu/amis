import {ThemeProps, themeable} from 'amis-core';
import React from 'react';
import CodeMirrorEditor, {CodeMirrorEditorProps} from '../CodeMirror';
import {FormulaPlugin, editorFactory as createEditor} from './plugin';
import type CodeMirror from 'codemirror';

export interface VariableItem {
  label: string;
  value?: string;
  path?: string; // 路径（label）
  children?: Array<VariableItem>;
  type?: string;
  tag?: string;
  selectMode?: 'tree' | 'tabs';
  isMember?: boolean; // 是否是数组成员
  // chunks?: string[]; // 内容块，作为一个整体进行高亮标记
}

export interface FuncGroup {
  groupName: string;
  items: Array<FuncItem>;
}

export interface FuncItem {
  name: string; // 函数名
  example?: string; // 示例
  description?: string; // 描述
  [propName: string]: any;
}

export interface CodeEditorProps
  extends ThemeProps,
    Omit<CodeMirrorEditorProps, 'style' | 'editorFactory' | 'editorDidMount'> {
  readOnly?: boolean;

  /**
   * 是否为单行模式，默认为 false
   */
  singleLine?: boolean;

  /**
   * evalMode 即直接就是表达式，否则
   * 需要 ${这里面才是表达式}
   * 默认为 true
   */
  evalMode?: boolean;

  autoFocus?: boolean;

  editorTheme?: 'dark' | 'light';

  editorOptions?: any;

  /**
   * expression 即高亮表达式整体
   * formula 即高亮表达式内部
   */
  highlightMode?: 'expression' | 'formula';

  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem>;

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions?: Array<FuncGroup>;

  placeholder?: string;

  editorDidMount?: (
    cm: typeof CodeMirror,
    editor: CodeMirror.Editor,
    plugin: FormulaPlugin
  ) => void;
}

function CodeEditor(props: CodeEditorProps, ref: any) {
  const {
    classnames: cx,
    className,
    value,
    onChange,
    editorDidMount,
    onFocus,
    onBlur,
    functions,
    variables,
    evalMode,
    singleLine,
    autoFocus,
    editorTheme,
    theme: defaultTheme,
    editorOptions,
    placeholder,
    highlightMode
  } = props;
  const pluginRef = React.useRef<FormulaPlugin>();

  const editorFactory = React.useCallback((dom: HTMLElement, cm: any) => {
    let theme =
      (editorTheme ??
        ((defaultTheme || '').includes('dark') ? 'dark' : 'light')) === 'dark'
        ? 'base16-dark'
        : 'idea';
    let options: any = {
      autoFocus,
      indentUnit: 2,
      lineNumbers: true,
      lineWrapping: true, // 自动换行
      theme,
      placeholder,
      ...editorOptions
    };
    if (singleLine) {
      options = {
        lineNumbers: false,
        indentWithTabs: false,
        indentUnit: 4,
        lineWrapping: false,
        scrollbarStyle: null,
        theme,
        placeholder,
        ...editorOptions
      };
    }

    return createEditor(dom, cm, props, options);
  }, []);

  const [readOnly, setReadOnly] = React.useState(props.readOnly);

  React.useEffect(() => setReadOnly(props.readOnly), [props.readOnly]);
  React.useEffect(
    () => pluginRef.current?.editor?.setOption('placeholder', placeholder),
    [placeholder]
  );

  // singleLine 模式下，禁止输入换行符
  const onEditorBeforeChange = React.useCallback((cm: any, event: any) => {
    // Identify typing events that add a newline to the buffer.
    const hasTypedNewline =
      event.origin === '+input' &&
      typeof event.text === 'object' &&
      event.text.join('') === '';

    // Prevent newline characters from being added to the buffer.
    if (hasTypedNewline) {
      return event.cancel();
    }

    // Identify paste events.
    const hasPastedNewline =
      event.origin === 'paste' &&
      typeof event.text === 'object' &&
      event.text.length > 1;

    // Format pasted text to replace newlines with spaces.
    if (hasPastedNewline) {
      const newText = event.text.join(' ');
      return event.update(null, null, [newText]);
    }

    return null;
  }, []);

  const onEditorMount = React.useCallback(
    (cm: any, editor: any) => {
      const plugin = (pluginRef.current = new FormulaPlugin(editor, cm));
      plugin.setEvalMode(!!evalMode);
      plugin.setFunctions(functions || []);
      plugin.setVariables(variables || []);
      plugin.setHighlightMode(highlightMode || 'formula');
      editorDidMount?.(cm, editor, plugin);
      plugin.autoMarkText();

      // 单行模式，不允许输入换行，同时原来的换行符也要去掉
      if (singleLine) {
        editor.on('beforeChange', onEditorBeforeChange);

        const value = editor.getValue();
        if (value && /[\n\r]/.test(value)) {
          // 初始数据有换行，不允许直接编辑
          // 只能弹窗弹出非单行模式编辑
          setReadOnly(true);
          editor.setValue(value.replace(/[\n\r]+/g, ''));
        }
      }
    },
    [evalMode, functions, variables]
  );

  React.useEffect(() => {
    return () => {
      pluginRef.current?.editor.off('beforeChange', onEditorBeforeChange);
      pluginRef.current?.dispose();
    };
  }, []);

  React.useImperativeHandle(ref, () => {
    return {
      insertContent: (value: any, type: 'variable' | 'func') =>
        pluginRef.current?.insertContent(value, type),
      setValue: (value: any) => pluginRef.current?.setValue(value),
      getValue: () => pluginRef.current?.getValue(),
      setDisableAutoMark: (value: boolean) =>
        pluginRef.current?.setDisableAutoMark(value)
    };
  });

  React.useEffect(() => {
    const plugin = pluginRef.current;
    if (!plugin) {
      return;
    }

    plugin.setEvalMode(!!evalMode);
    plugin.setFunctions(functions || []);
    plugin.setVariables(variables || []);
    plugin.autoMarkText();
  }, [evalMode, functions, variables, value]);

  return (
    <CodeMirrorEditor
      className={cx(
        'FormulaCodeEditor',
        className,
        singleLine ? 'FormulaCodeEditor--singleLine' : ''
      )}
      value={value}
      onChange={onChange}
      editorFactory={editorFactory}
      editorDidMount={onEditorMount}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={readOnly}
    />
  );
}

export default themeable(React.forwardRef(CodeEditor));
