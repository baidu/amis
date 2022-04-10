/**
 * @file 扩展 codemirror
 */

import type CodeMirror from 'codemirror';
import {eachTree} from '../../utils/helper';
import type {FormulaEditorProps, VariableItem} from './Editor';

export function editorFactory(
  dom: HTMLElement,
  cm: typeof CodeMirror,
  props: any
) {
  registerLaunguageMode(cm);

  return cm(dom, {
    value: props.value || '',
    autofocus: true,
    mode: props.evalMode ? 'text/formula' : 'text/formula-template'
  });
}

export class FormulaPlugin {
  constructor(
    readonly editor: CodeMirror.Editor,
    readonly cm: typeof CodeMirror,
    readonly getProps: () => FormulaEditorProps
  ) {
    // editor.on('change', this.autoMarkText);
    this.autoMarkText();
  }

  autoMarkText() {
    const {functions, variables, value} = this.getProps();
    if (value) {
      // todo functions 也需要自动替换
      this.autoMark(variables);
    }
  }

  insertContent(value: any, type: 'variable' | 'func') {
    const from = this.editor.getCursor();
    if (type === 'variable') {
      this.editor.replaceSelection(value.key);
      var to = this.editor.getCursor();

      this.markText(from, to, value.name, 'cm-field');
    } else if (type === 'func') {
      // todo 支持 snippet，目前是不支持的

      this.editor.replaceSelection(`${value}()`);
      var to = this.editor.getCursor();
      this.markText(
        from,
        {
          line: to.line,
          ch: to.ch - 2
        },
        value,
        'cm-func'
      );

      this.editor.setCursor({
        line: to.line,
        ch: to.ch - 1
      });
    } else if (typeof value === 'string') {
      this.editor.replaceSelection(value);
    }

    this.editor.focus();
  }

  markText(
    from: CodeMirror.Position,
    to: CodeMirror.Position,
    label: string,
    className = 'cm-func'
  ) {
    const text = document.createElement('span');
    text.className = className;
    text.innerText = label;
    this.editor.markText(from, to, {
      atomic: true,
      replacedWith: text
    });
  }

  autoMark(variables: Array<VariableItem>) {
    if (!Array.isArray(variables) || !variables.length) {
      return;
    }

    const varMap: {
      [propname: string]: string;
    } = {};

    eachTree(
      variables,
      item => item.value && (varMap[item.value] = item.label)
    );
    const vars = Object.keys(varMap).sort((a, b) => b.length - a.length);

    const editor = this.editor;
    const lines = editor.lineCount();
    for (let line = 0; line < lines; line++) {
      const content = editor.getLine(line);

      // 标记方法调用
      content.replace(/([A-Z]+)\s*\(/g, (_, func, pos) => {
        this.markText(
          {
            line: line,
            ch: pos
          },
          {
            line: line,
            ch: pos + func.length
          },
          func,
          'cm-func'
        );
        return _;
      });

      // 标记变量
      vars.forEach(v => {
        let from = 0;
        let idx = -1;
        while (~(idx = content.indexOf(v, from))) {
          this.markText(
            {
              line: line,
              ch: idx
            },
            {
              line: line,
              ch: idx + v.length
            },
            varMap[v],
            'cm-field'
          );
          from = idx + v.length;
        }
      });
    }
  }

  dispose() {}

  validate() {}
}

let modeRegisted = false;
function registerLaunguageMode(cm: typeof CodeMirror) {
  if (modeRegisted) {
    return;
  }
  modeRegisted = true;

  // 对应 evalMode
  cm.defineMode('formula', (config: any, parserConfig: any) => {
    var formula = cm.getMode(config, 'javascript');
    if (!parserConfig || !parserConfig.base) return formula;

    return cm.multiplexingMode(cm.getMode(config, parserConfig.base), {
      open: '${',
      close: '}',
      mode: formula
    });
  });

  cm.defineMIME('text/formula', {name: 'formula'});
  cm.defineMIME('text/formula-template', {name: 'formula', base: 'htmlmixed'});
}
