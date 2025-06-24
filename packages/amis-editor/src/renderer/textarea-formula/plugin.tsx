/**
 * @file 扩展 codemirror
 */

import {TextareaFormulaControlProps} from './TextareaFormulaControl';
import {FormulaEditor} from 'amis-ui';
import type {VariableItem, CodeMirror} from 'amis-ui';

export function editorFactory(
  dom: HTMLElement,
  cm: typeof CodeMirror,
  value: string,
  config?: Object
) {
  return cm(dom, {
    value: value || '',
    autofocus: false,
    lineWrapping: true,
    ...config
  });
}

interface FormulaPluginConfig {
  getProps: () => TextareaFormulaControlProps;
  onExpressionMouseEnter?: (
    e: MouseEvent,
    expression: string,
    brace?: Array<CodeMirror.Position>
  ) => any;
  customMarkText?: (editor: CodeMirror.Editor) => void;
  onPluginInit?: (plugin: FormulaPlugin) => void;
  showPopover?: boolean;
  showClearIcon?: boolean; // 表达式是否展示删除icon
}

const defaultPluginConfig = {
  showPopover: false,
  showClearIcon: false
};

export class FormulaPlugin {
  config: FormulaPluginConfig;

  constructor(readonly editor: CodeMirror.Editor, config: FormulaPluginConfig) {
    this.config = {
      ...defaultPluginConfig,
      ...config
    };
    const {value} = this.config.getProps();
    if (value) {
      this.autoMark();
      this.focus(value);
    }

    this.setValue = this.setValue.bind(this);
    this.insertContent = this.insertContent.bind(this);
    this.autoMark = this.autoMark.bind(this);
    this.focus = this.focus.bind(this);
    this.dispose = this.dispose.bind(this);
    this.config.onPluginInit?.(this);
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
    this.config.customMarkText?.(editor);
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
          if (char === '{') {
            cache.push('{');
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

  // 重新赋值
  setValue(value: string) {
    this.editor.setValue(value);
  }

  getCorsur() {
    return this.editor.getCursor();
  }

  insertContent(
    content: string,
    type: 'expression' | 'string' = 'string',
    brace?: Array<CodeMirror.Position>
  ) {
    if (brace) {
      // 替换
      const [from, to] = brace;
      if (type === 'expression') {
        this.editor.replaceRange(content, from, to);
        this.autoMark();
      } else if (type === 'string') {
        this.editor.replaceRange(content, from, to);
      }
    } else {
      // 新增
      if (type === 'expression') {
        this.editor.replaceSelection(content);
        this.autoMark();
      } else if (type === 'string') {
        this.editor.replaceSelection(content);
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
    const {onExpressionMouseEnter, getProps, showPopover, showClearIcon} =
      this.config;

    const variables = getProps()?.variables as VariableItem[];
    const highlightValue = FormulaEditor.highlightValue(
      expression,
      variables,
      true,
      false
    ) || {
      html: expression
    };
    if (getProps()?.env?.filterHtml && highlightValue.html) {
      highlightValue.html = getProps()?.env?.filterHtml(highlightValue.html);
    }

    const wrap = document.createElement('span');
    wrap.className = className;
    const text = document.createElement('span');
    text.className = `${className}-text`;
    text.innerHTML = highlightValue.html;
    text.setAttribute('data-expression', expression);
    text.onmouseenter = e => {
      const brace = this.getExpressionBrace(expression);
      onExpressionMouseEnter?.(e, expression, brace);
    };
    wrap.appendChild(text);

    if (showClearIcon) {
      const closeIcon = document.createElement('i');
      closeIcon.className = 'cm-expression-close iconfont icon-close';
      closeIcon.onclick = () => {
        const brace = this.getExpressionBrace(expression);
        this.insertContent('', 'expression', brace);
      };
      wrap.appendChild(closeIcon);
    }

    if (showPopover) {
      // 添加popover
      const popoverEl = document.createElement('div');
      // bca-disable-next-line
      popoverEl.innerHTML = highlightValue.html;
      popoverEl.classList.add('cm-expression-popover');
      const arrow = document.createElement('div');
      arrow.classList.add('cm-expression-popover-arrow');
      popoverEl.appendChild(arrow);
      wrap.appendChild(popoverEl);
    }

    this.editor.markText(from, to, {
      atomic: true,
      replacedWith: wrap
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
