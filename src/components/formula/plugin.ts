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
    mode: props.evalMode ? 'formula' : 'formula-tpl'
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

  // todo 需要优化这一块，还需要扩充 formula-tpl 语法
  // 对应 evalMode
  cm.defineMode('formula', function () {
    interface State {
      tokenize?:
        | ((stream: CodeMirror.StringStream, state: State) => string | null)
        | null;
    }

    const isOperatorChar = /[+\-*&%=<>!?|~^@]/;
    const wordRE = /[\w$\xa1-\uffff]/; ///[\u4e00-\u9fa5A-Za-z_$@][\u4e00-\u9fa5A-Za-z0-9_]*/;
    const builtinFuncs: Array<string> = [];

    // functions.forEach(group =>
    //   group.items.forEach(item => {
    //     builtinFuncs.push(item.name);
    //   })
    // );

    // todo `ss${xxx}` 这个用法语法高亮有问题。
    function tokenBase(stream: CodeMirror.StringStream, state: State) {
      const next = stream.next()!;

      if (next === '"' || next === "'") {
        state.tokenize = makeStringToken(next);
        return state.tokenize!(stream, state);
      } else if (next === '`') {
        state.tokenize = tokenQuasi;
        return state.tokenize!(stream, state);
      } else if (
        next == '.' &&
        stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)
      ) {
        return 'number';
      } else if (/[\[\]{}\(\),;\:\.]/.test(next!)) {
        return 'bracket';
      } else if (next == '=' && stream.eat('>')) {
        // todo 还有其他操作
        return 'operator';
      } else if (
        next == '0' &&
        stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)
      ) {
        return 'number';
      } else if (/\d/.test(next!)) {
        stream.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/);
        return 'number';
      } else if (next === '/') {
        if (stream.eat('*')) {
          state.tokenize = tokenComment;
          return tokenComment(stream, state);
        } else if (stream.eat('/')) {
          stream.skipToEnd();
          return 'comment';
        }
      } else if (isOperatorChar.test(next!)) {
        if (next != '>') {
          if (stream.eat('=')) {
            if (next == '!' || next == '=') stream.eat('=');
          } else if (/[<>*+\-|&?]/.test(next)) {
            stream.eat(next);
            if (next == '>') stream.eat(next);
          }
        }
        return 'operator';
      } else if (wordRE.test(next)) {
        stream.eatWhile(wordRE);
        const word = stream.current()!;

        if (/^[A-Z]+$/.test(word)) {
          if (~builtinFuncs.indexOf(word)) {
            return 'func';
          }

          return 'builtin';
        } else if (/^KJ/.test(word)) {
          return 'invalidchar';
        } else if (
          ~['true', 'false', 'pi', 'null'].indexOf(word.toLowerCase())
        ) {
          return 'atom';
        }
        return 'variable';
      }

      return null;
    }

    function makeStringToken(quote: string) {
      return (stream: CodeMirror.StringStream, state: State) => {
        let escaped = false,
          next,
          end = false;
        while ((next = stream.next()) != null) {
          if (next === quote && !escaped) {
            end = true;
            break;
          }
          escaped = !escaped && next === '\\';
        }
        if (end || !escaped) {
          state.tokenize = null;
        }
        return 'string';
      };
    }

    function tokenQuasi(stream: CodeMirror.StringStream, state: State) {
      var escaped = false,
        next;
      while ((next = stream.next()) != null) {
        if (!escaped && (next == '`' || (next == '$' && stream.eat('{')))) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && next == '\\';
      }
      return 'string-2';
    }

    function tokenComment(stream: CodeMirror.StringStream, state: State) {
      var maybeEnd = false,
        next;
      while ((next = stream.next())) {
        if (next == '/' && maybeEnd) {
          state.tokenize = tokenBase;
          break;
        }
        maybeEnd = next == '*';
      }
      return 'comment';
    }

    return {
      startState: () => {
        return {
          tokenize: null
        };
      },

      token: (stream, state) => {
        if (stream.eatSpace()) {
          return null;
        }
        return (state.tokenize || tokenBase)(stream, state);
      },

      blockCommentStart: '/*',
      blockCommentEnd: '*/',
      blockCommentContinue: ' * ',
      lineComment: '//',
      fold: 'brace',
      closeBrackets: '()[]{}\'\'""``'
    };
  });
}
