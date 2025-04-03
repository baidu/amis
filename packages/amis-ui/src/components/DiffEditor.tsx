import React from 'react';
import Editor, {EditorBaseProps} from './Editor';
import {autobind} from 'amis-core';

export interface DiffEditorProps extends EditorBaseProps {
  originValue?: string;
}

export default class DiffEditor extends React.Component<DiffEditorProps> {
  editor: any;
  monaco: any;
  originalEditor: any;
  modifiedEditor: any;
  toDispose: Array<Function> = [];
  domRef = React.createRef<any>();

  componentDidUpdate(prevProps: any) {
    const {value, originValue} = this.props;

    if (this.originalEditor && originValue !== prevProps.originValue) {
      this.originalEditor.getModel().setValue(originValue || '');
    }

    if (this.modifiedEditor && value !== prevProps.value) {
      const editorValue = this.modifiedEditor.getModel().getValue();
      editorValue !== value &&
        this.modifiedEditor.getModel().setValue(value || '');
    }

    if (this.props.disabled !== prevProps.disabled && this.modifiedEditor) {
      this.modifiedEditor.updateOptions?.({
        readOnly: this.props.disabled
      });
    }
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
  }

  prevHeight = 0;
  @autobind
  updateContainerSize(editor: any, monaco: any) {
    const dom = this.domRef.current?.getDom();
    if (!dom) {
      return;
    }

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel()?.getLineCount() || 1;
    const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

    if (this.prevHeight !== height && dom.parentElement) {
      this.prevHeight = height;
      dom.parentElement.style.height = `${height}px`;
      editor.layout();
    }
  }

  @autobind
  editorFactory(containerElement: any, monaco: any, options: any) {
    if (this.props.editorFactory) {
      return this.props.editorFactory(containerElement, monaco, options);
    }
    return monaco.editor.createDiffEditor(containerElement, options);
  }

  @autobind
  handleModifiedEditorChange(e: any) {
    const {onChange} = this.props;
    const value = this.modifiedEditor.getModel().getValue();
    value !== this.props.value && onChange?.(value, e);
  }

  @autobind
  editorDidMount(editor: any, monaco: any) {
    const {value, originValue, language, onFocus, onBlur, editorDidMount} =
      this.props;
    editorDidMount?.(editor, monaco);

    this.monaco = monaco;
    this.editor = editor;
    this.modifiedEditor = editor.getModifiedEditor();
    this.originalEditor = editor.getOriginalEditor();

    onFocus &&
      this.toDispose.push(
        this.modifiedEditor.onDidFocusEditorWidget(onFocus).dispose
      );
    onBlur &&
      this.toDispose.push(
        this.modifiedEditor.onDidBlurEditorWidget(onBlur).dispose
      );

    this.toDispose.push(
      this.modifiedEditor.onDidChangeModelDecorations(() => {
        this.updateContainerSize(this.modifiedEditor, monaco); // typing
        requestAnimationFrame(
          this.updateContainerSize.bind(this, this.modifiedEditor, monaco)
        ); // folding
      }).dispose
    );

    this.toDispose.push(
      this.modifiedEditor.onDidChangeModelContent(
        this.handleModifiedEditorChange
      ).dispose
    );

    this.editor.setModel({
      original: this.monaco.editor.createModel(originValue || '', language),
      modified: this.monaco.editor.createModel(value, language)
    });
  }

  render() {
    const {value, originValue, options, ...rest} = this.props;
    return (
      <Editor
        {...rest}
        ref={this.domRef}
        editorDidMount={this.editorDidMount}
        editorFactory={this.editorFactory}
        isDiffEditor
      />
    );
  }
}
