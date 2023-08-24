/**
 * @file 扩展 codemirror
 */

import type CodeMirror from 'codemirror';
import {eachTree} from 'amis-core';
import {FormulaEditorProps, VariableItem, FormulaEditor} from './Editor';

export function editorFactory(
  dom: HTMLElement,
  cm: typeof CodeMirror,
  props: any,
  options?: any
) {
  registerLaunguageMode(cm);

  return cm(dom, {
    value: props.value || '',
    autofocus: true,
    mode: props.evalMode ? 'text/formula' : 'text/formula-template',
    ...options
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
      this.autoMark(variables!);
      this.focus(value);
    }
  }

  // 计算 `${`、`}` 括号的位置，如 ${a}+${b}, 结果是 [ { from: 0, to: 3 }, { from: 5, to: 8 } ]
  computedBracesPosition(exp: string) {
    const braces: {begin: number; end: number}[] = [];

    exp?.replace(/\$\{/g, (val, offset) => {
      if (val) {
        const charArr = exp.slice(offset + val.length).split('');
        const cache = ['${'];

        for (let index = 0; index < charArr.length; index++) {
          const char = charArr[index];
          if (char === '$' && charArr[index + 1] === '{') {
            cache.push('${');
          } else if (char === '}') {
            cache.pop();
          }

          if (cache.length === 0) {
            braces.push({begin: offset + 2, end: index + offset + 2});
            break;
          }
        }
      }
      return '';
    });

    return braces;
  }

  // 判断字符串是否在 ${} 中
  checkStrIsInBraces(
    [from, to]: number[],
    braces: {begin: number; end: number}[]
  ) {
    let isIn = false;
    if (braces.length) {
      for (let index = 0; index < braces.length; index++) {
        const brace = braces[index];
        if (from >= brace.begin && to <= brace.end) {
          isIn = true;
          break;
        }
      }
    }
    return isIn;
  }

  insertBraces(originFrom: CodeMirror.Position, originTo: CodeMirror.Position) {
    const str = this.editor.getValue();
    const braces = this.computedBracesPosition(str);

    if (!this.checkStrIsInBraces([originFrom.ch, originTo.ch], braces)) {
      this.editor.setCursor({
        line: originFrom.line,
        ch: originFrom.ch
      });
      this.editor.replaceSelection('${');

      this.editor.setCursor({
        line: originTo.line,
        ch: originTo.ch + 2
      });
      this.editor.replaceSelection('}');
    }
  }

  insertContent(
    value: any,
    type?: 'variable' | 'func',
    className: string = 'cm-field',
    toMark: boolean = true
  ) {
    let from = this.editor.getCursor();
    const {evalMode} = this.getProps();

    if (type === 'variable') {
      this.editor.replaceSelection(value.key);
      const to = this.editor.getCursor();

      if (toMark) {
        // 路径中每个变量分别进行标记
        let markFrom = from.ch;
        value.path.split('.').forEach((label: string, index: number) => {
          const val = value.key.split('.')[index];
          this.markText(
            {line: from.line, ch: markFrom},
            {line: to.line, ch: markFrom + val.length},
            label,
            className
          );
          markFrom += 1 + val.length;
        });
      }

      !evalMode && this.insertBraces(from, to);
    } else if (type === 'func') {
      this.editor.replaceSelection(`${value}()`);
      const to = this.editor.getCursor();

      toMark &&
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

      if (!evalMode) {
        this.insertBraces(from, to);
        this.editor.setCursor({
          line: to.line,
          ch: to.ch + 1
        });
      }
    } else if (typeof value === 'string') {
      this.editor.replaceSelection(value);
      // 非变量、非函数，可能是组合模式，也需要标记
      toMark && setTimeout(() => this.autoMarkText(), 0);
    }

    this.editor.focus();
  }

  setValue(value: string) {
    this.editor.setValue(value);
  }

  getValue() {
    return this.editor.getValue();
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

    eachTree(variables, item => {
      if (item.value) {
        varMap[item.value] = item.path ?? item.label;
      }
    });

    const vars = Object.keys(varMap).sort((a, b) => b.length - a.length);
    const editor = this.editor;
    const lines = editor.lineCount();
    const {evalMode = true} = this.getProps();
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

      const REPLACE_KEY = 'AMIS_FORMULA_REPLACE_KEY';
      // 标记变量
      vars.forEach(v => {
        let from = 0;
        let idx = -1;

        while (~(idx = content.indexOf(v, from))) {
          const encode = FormulaEditor.replaceStrByIndex(
            content,
            idx,
            v,
            REPLACE_KEY
          );
          const reg = FormulaEditor.getRegExpByMode(evalMode, REPLACE_KEY);

          if (reg.test(encode)) {
            let markFrom = idx;
            v.split('.').forEach((val: string, index: number) => {
              this.markText(
                {
                  line: line,
                  ch: markFrom
                },
                {
                  line: line,
                  ch: markFrom + val.length
                },
                varMap[v].split('.')[index],
                'cm-field'
              );
              markFrom += 1 + val.length;
            });
          }

          from = idx + v.length;
        }
      });
    }
  }

  // 焦点放在最后
  focus(value: string) {
    this.editor.setCursor({
      line: 0,
      ch: value?.length || 0
    });
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
