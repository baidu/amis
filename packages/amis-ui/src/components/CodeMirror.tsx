import React from 'react';
// import 'codemirror/lib/codemirror.css';
import type CodeMirror from 'codemirror';
import {autobind, changedEffect} from 'amis-core';
import {resizeSensor} from 'amis-core';

export interface CodeMirrorEditorProps {
  className?: string;
  style?: any;
  value?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  editorFactory?: (
    dom: HTMLElement,
    cm: typeof CodeMirror,
    props?: any
  ) => CodeMirror.Editor;
  editorDidMount?: (cm: typeof CodeMirror, editor: CodeMirror.Editor) => void;
  editorWillUnMount?: (
    cm: typeof CodeMirror,
    editor: CodeMirror.Editor
  ) => void;
}

export class CodeMirrorEditor extends React.Component<CodeMirrorEditorProps> {
  dom = React.createRef<HTMLDivElement>();

  editor?: CodeMirror.Editor;
  toDispose: Array<() => void> = [];
  unmounted = false;
  async componentDidMount() {
    const cm = (await import('codemirror')).default;
    // @ts-ignore
    await import('codemirror/mode/javascript/javascript');
    // @ts-ignore
    await import('codemirror/mode/htmlmixed/htmlmixed');
    await import('codemirror/addon/mode/simple');
    await import('codemirror/addon/mode/multiplex');
    await import('codemirror/addon/display/placeholder');
    if (this.unmounted) {
      return;
    }

    this.dom.current!.innerHTML = '';
    this.editor =
      this.props.editorFactory?.(this.dom.current!, cm, this.props) ??
      cm(this.dom.current!, {
        value: this.props.value || '',
        readOnly: this.props.readOnly ? 'nocursor' : false,
        autofocus: false
      });

    this.props.editorDidMount?.(cm, this.editor);
    this.editor.on('change', this.handleChange);
    this.editor.on('blur', this.handleBlur);
    this.editor.on('focus', this.handleFocus);

    this.props.value && this.setValue(this.props.value);

    this.toDispose.push(
      resizeSensor(this.dom.current as HTMLElement, () =>
        this.editor?.refresh()
      )
    );
    // todo 以后优化这个，解决弹窗里面默认光标太小的问题
    setTimeout(() => this.editor?.refresh(), 350);
    this.toDispose.push(() => {
      this.props.editorWillUnMount?.(cm, this.editor!);
    });
  }

  componentDidUpdate(prevProps: CodeMirrorEditorProps) {
    const props = this.props;

    if (props.value !== prevProps.value) {
      this.editor && this.setValue(props.value);
    }

    changedEffect(['readOnly'], prevProps, this.props, (changes: any) => {
      this.editor?.setOption('readOnly', changes.readOnly ? 'nocursor' : false);
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.editor?.off('change', this.handleChange);
    this.editor?.off('blur', this.handleBlur);
    this.editor?.off('focus', this.handleFocus);
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  @autobind
  handleChange(editor: any) {
    this.props.onChange?.(editor.getValue());
  }
  @autobind
  handleBlur(editor: any) {
    this.props.onBlur?.(editor);
  }

  @autobind
  handleFocus(editor: any) {
    this.props.onFocus?.(editor);
  }

  setValue(value?: string) {
    const doc = this.editor!.getDoc();
    if (value !== doc.getValue()) {
      const cursor = doc.getCursor();
      doc.setValue(value || '');
      doc.setCursor(cursor);
    }
  }

  render() {
    const {className, style} = this.props;
    return <div className={className} style={style} ref={this.dom}></div>;
  }
}

export default CodeMirrorEditor;
