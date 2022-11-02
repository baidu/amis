/**
 * @file 扩展 codemirror
 */

import type CodeMirror from 'codemirror';
import {TextareaFormulaControlProps} from './TextareaFormulaControl';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';

export function editorFactory(
  dom: HTMLElement,
  cm: typeof CodeMirror,
  props: any
) {
  return cm(dom, {
    value: props.value || '',
    autofocus: true,
    lineWrapping: true
  });
}

export class FormulaPlugin {
  constructor(
    readonly editor: CodeMirror.Editor,
    readonly cm: typeof CodeMirror,
    readonly getProps: () => TextareaFormulaControlProps,
    readonly onExpressionClick: (
      expression: string,
      brace?: Array<CodeMirror.Position>
    ) => any
  ) {
    const {value} = this.getProps();
    if (value) {
      this.autoMark();
      this.focus(value);
    }
  }

  autoMark() {
    const editor = this.editor;
    const lines = editor.lineCount();
    for (let line = 0; line < lines; line++) {
      const content = editor.getLine(line);
      const braces = this.computedBracesPosition(content);
      for (let i = 0; i < braces.length; i++) {
        // 替换每个公式表达式中的内容
        const start = braces[i].begin;
        const end = braces[i].end;
        const expression = content.slice(start, end);
        this.markExpression(
          {
            line: line,
            ch: start - 2
          },
          {
            line: line,
            ch: end + 1
          },
          expression
        );
      }
    }
  }

  // 找到表达式所在的位置
  getExpressionBrace(expression: string) {
    const editor = this.editor;
    const lines = editor.lineCount();
    for (let line = 0; line < lines; line++) {
      const content = editor.getLine(line);
      const braces = this.computedBracesPosition(content);
      for (let i = 0; i < braces.length; i++) {
        // 替换每个公式表达式中的内容
        const start = braces[i].begin;
        const end = braces[i].end;
        if (expression === content.slice(start, end)) {
          return [
            {
              line: line,
              ch: start - 2
            },
            {
              line: line,
              ch: end + 1
            }
          ];
        }
      }
    }
    return undefined;
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
    type?: 'expression',
    brace?: Array<CodeMirror.Position>
  ) {
    if (brace) {
      // 替换
      const [from, to] = brace;
      if (type === 'expression') {
        this.editor.replaceRange(value, from, to);
        this.autoMark();
      } else if (typeof value === 'string') {
        this.editor.replaceRange(value, from, to);
      }
    } else {
      // 新增
      if (type === 'expression') {
        this.editor.replaceSelection(value);
        this.autoMark();
      } else if (typeof value === 'string') {
        this.editor.replaceSelection(value);
      }
      this.editor.focus();
    }
  }

  markExpression(
    from: CodeMirror.Position,
    to: CodeMirror.Position,
    expression = '',
    className = 'cm-expression'
  ) {
    const text = document.createElement('span');
    text.className = className;
    text.innerText = '表达式';
    text.setAttribute('data-expression', expression);
    text.onclick = () => {
      const brace = this.getExpressionBrace(expression);
      this.onExpressionClick(expression, brace);
    };
    const {variables} = this.getProps();
    const highlightValue = FormulaEditor.highlightValue(
      expression,
      variables
    ) || {
      html: expression
    };
    // 添加popover
    const popoverEl = document.createElement('div');
    // bca-disable-next-line
    popoverEl.innerHTML = highlightValue.html;
    popoverEl.classList.add('expression-popover');
    const arrow = document.createElement('div');
    arrow.classList.add('expression-popover-arrow');
    popoverEl.appendChild(arrow);
    text.appendChild(popoverEl);

    this.editor.markText(from, to, {
      atomic: true,
      replacedWith: text
    });
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
