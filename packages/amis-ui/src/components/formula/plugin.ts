/**
 * @file 扩展 codemirror
 */

import type CodeMirror from 'codemirror';
import {findTree} from 'amis-core';
import {FuncGroup, VariableItem} from './CodeEditor';
import {parse} from 'amis-formula';
import debounce from 'lodash/debounce';

export function editorFactory(
  dom: HTMLElement,
  cm: typeof CodeMirror,
  props: any,
  options?: any
) {
  registerLaunguageMode(cm);

  return cm(dom, {
    value: props.value || '',
    autofocus: false,
    mode: props.evalMode ? 'text/formula' : 'text/formula-template',
    readOnly: props.readOnly ? 'nocursor' : false,
    ...options
  });
}

function traverseAst(ast: any, iterator: (ast: any) => void | false) {
  if (!ast || !ast.type) {
    return;
  }

  const ret = iterator(ast);
  if (ret === false) {
    return;
  }

  Object.keys(ast).forEach(key => {
    const value = ast[key];

    if (Array.isArray(value)) {
      value.forEach(child => traverseAst(child, iterator));
    } else {
      traverseAst(value, iterator);
    }
  });
}

export class FormulaPlugin {
  /**
   * 用于提示的变量集合，默认为空
   */
  variables: Array<VariableItem> = [];

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions: Array<FuncGroup> = [];

  /**
   * evalMode 即直接就是表达式，否则就是混合模式
   */
  evalMode: boolean = true;

  highlightMode: 'expression' | 'formula' = 'formula';

  disableAutoMark = false;

  constructor(
    readonly editor: CodeMirror.Editor,
    readonly cm: typeof CodeMirror
  ) {
    // this.autoMarkText();
    this.autoMarkText = debounce(this.autoMarkText.bind(this), 250, {
      leading: false,
      trailing: true
    });

    editor.on('blur', () => this.autoMarkText());
  }

  setVariables(variables: Array<VariableItem>) {
    this.variables = Array.isArray(variables) ? variables : [];
  }

  setFunctions(functions: Array<FuncGroup>) {
    this.functions = Array.isArray(functions) ? functions : [];
  }

  setEvalMode(evalMode: boolean) {
    this.evalMode = evalMode;
  }

  setHighlightMode(highlightMode: 'expression' | 'formula') {
    this.highlightMode = highlightMode;
  }

  setDisableAutoMark(disableAutoMark: boolean) {
    this.disableAutoMark = disableAutoMark;
    this.autoMarkText(true);
  }

  autoMarkText(forceClear = false) {
    if (forceClear || !this.editor.hasFocus()) {
      this.editor?.getAllMarks().forEach(mark => mark.clear());
    }
    this.disableAutoMark || this.autoMark();
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

  insertContent(value: any, type?: 'variable' | 'func') {
    let from = this.editor.getCursor();
    const evalMode = this.evalMode;

    if (type === 'variable') {
      this.editor.replaceSelection(value.key);
      const to = this.editor.getCursor();

      !evalMode && this.insertBraces(from, to);
    } else if (type === 'func') {
      this.editor.replaceSelection(`${value}()`);
      const to = this.editor.getCursor();

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
    className = 'cm-func',
    rawString?: string
  ) {
    const text = document.createElement('span');
    text.className = className;
    text.innerText = label;

    if (rawString) {
      text.setAttribute('data-tooltip', rawString);
      text.setAttribute('data-position', 'bottom');
    }

    return this.editor.markText(from, to, {
      atomic: true,
      replacedWith: text
    });
  }

  widgets: any[] = [];
  marks: any[] = [];
  autoMark() {
    const editor = this.editor;
    const value = editor.getValue();
    const functions = this.functions;
    const variables = this.variables;
    const highlightMode = this.highlightMode;

    // 把旧的清掉
    this.widgets.forEach(widget => editor.removeLineWidget(widget));
    this.widgets = [];

    this.marks.forEach(mark => mark.clear());
    this.marks = [];

    try {
      const ast = parse(value, {
        evalMode: this.evalMode,
        variableMode: false
      });
      traverseAst(ast, (ast: any): any => {
        if (highlightMode === 'expression') {
          if (ast.type === 'script') {
            this.markText(
              {
                line: ast.start.line - 1,
                ch: ast.start.column - 1
              },
              {
                line: ast.end.line - 1,
                ch: ast.end.column - 1
              },
              value.substring(ast.start.index + 2, ast.end.index - 1),
              'cm-expression',
              value
            );
          }
          return;
        }

        if (ast.type === 'func_call') {
          const funName = ast.identifier;
          const exists = functions.some(item =>
            item.items.some(i => i.name === funName)
          );
          if (exists) {
            this.markText(
              {
                line: ast.start.line - 1,
                ch: ast.start.column - 1
              },
              {
                line: ast.start.line - 1,
                ch: ast.start.column + funName.length - 1
              },
              funName,
              'cm-func'
            );
          }
        } else if (ast.type === 'getter') {
          // 获取对象中的变量
          const list = [ast];
          let current = ast;
          while (current?.type === 'getter') {
            current = current.host;
            list.unshift(current);
          }
          const host = list.shift();
          if (host?.type === 'variable') {
            const variable = findTree(
              variables,
              item => item.value === host.name
            );
            if (variable) {
              // 先标记顶层对象
              this.markText(
                {
                  line: host.start.line - 1,
                  ch: host.start.column - 1
                },
                {
                  line: host.end.line - 1,
                  ch: host.end.column - 1
                },
                variable.label,
                'cm-field',
                host.name
              );

              // 再标记子对象
              let path = host.name + '.';
              let vars = variable.children || [];
              for (let i = 0, len = list.length; i < len; i++) {
                const item = list[i]?.key;

                // 支持 identifier 和 literal 类型的属性访问
                if (item?.type === 'identifier') {
                  const variable =
                    findTree(vars, v => v.value === path + item.name) ??
                    findTree(
                      vars,
                      v => v.value === item.name // 兼容不带路径的情况
                    );
                  if (variable) {
                    this.markText(
                      {
                        line: item.start.line - 1,
                        ch: item.start.column - 1
                      },
                      {
                        line: item.end.line - 1,
                        ch: item.end.column - 1
                      },
                      variable.label,
                      'cm-field',
                      item.name
                    );
                    path += item.name + '.';
                    vars = variable.children || [];
                  } else {
                    break;
                  }
                } else if (
                  (item?.type === 'literal' &&
                    typeof item.value === 'string') ||
                  item?.type === 'string'
                ) {
                  // 支持字符串字面量属性访问，如 data['username']
                  const propName = item.value;
                  const variable =
                    findTree(vars, v => v.value === path + propName) ??
                    findTree(
                      vars,
                      v => v.value === propName // 兼容不带路径的情况
                    );
                  if (variable) {
                    this.markText(
                      {
                        line: item.start.line - 1,
                        ch: item.start.column - 1
                      },
                      {
                        line: item.end.line - 1,
                        ch: item.end.column - 1
                      },
                      variable.label,
                      'cm-field',
                      propName
                    );
                    path += propName + '.';
                    vars = variable.children || [];
                  } else {
                    // 对于数组访问的情况，如 data[0]，尝试查找数组元素的类型定义
                    if (
                      typeof item.value === 'number' ||
                      /^\d+$/.test(propName)
                    ) {
                      // 数字索引，查找数组项的定义
                      const arrayItemVar = findTree(
                        vars,
                        v => v.isMember === true
                      );
                      if (arrayItemVar) {
                        // 继续使用数组项的子属性
                        vars = arrayItemVar.children || [];
                        path = host.name + '[' + item.value + '].';
                        // 数字索引本身不高亮，但允许继续处理后续属性
                        continue;
                      } else {
                        // 兼容没有 isMember 标记的数组配置
                        // 对于数组类型的变量，其children就是数组元素的属性
                        if (vars && vars.length > 0) {
                          path = host.name + '[' + item.value + '].';
                          // vars 保持不变，继续处理后续属性
                          continue;
                        } else {
                          break;
                        }
                      }
                    } else {
                      break;
                    }
                  }
                } else if (
                  item?.type === 'literal' &&
                  typeof item.value === 'number'
                ) {
                  // 支持数字索引访问，如 data[0]
                  // 查找数组项的定义
                  const arrayItemVar = findTree(vars, v => v.isMember === true);
                  if (arrayItemVar) {
                    // 继续使用数组项的子属性
                    vars = arrayItemVar.children || [arrayItemVar];
                    path = host.name + '[' + item.value + '].';
                    // 数字索引本身不高亮，但允许继续处理后续属性
                    continue;
                  } else {
                    // 兼容没有 isMember 标记的数组配置
                    // 对于数组类型的变量，其children就是数组元素的属性
                    if (vars && vars.length > 0) {
                      path = host.name + '[' + item.value + '].';
                      // vars 保持不变，继续处理后续属性
                      continue;
                    } else {
                      break;
                    }
                  }
                } else {
                  break;
                }
              }
            }
          }
          return false;
        } else if (ast.type === 'variable') {
          // 直接就是变量
          const variable = findTree(variables, item => item.value === ast.name);
          if (variable) {
            this.markText(
              {
                line: ast.start.line - 1,
                ch: ast.start.column - 1
              },
              {
                line: ast.end.line - 1,
                ch: ast.end.column - 1
              },
              variable.label,
              'cm-field',
              ast.name
            );
          }
          return false;
        }
      });
    } catch (e) {
      const reg = /^Unexpected\stoken\s(.+)\sin\s(\d+):(\d+)$/.exec(e.message);
      if (reg) {
        const token = reg[1];
        const line = parseInt(reg[2], 10);
        const column = parseInt(reg[3], 10);
        const msg = document.createElement('div');
        const icon = msg.appendChild(document.createElement('span'));
        icon.innerText = '!!';
        icon.className = 'lint-error-icon';
        msg.appendChild(
          document.createTextNode(`Unexpected token \`${token}\``)
        );
        msg.className = 'lint-error';
        this.widgets.push(
          editor.addLineWidget(line - 1, msg, {
            coverGutter: false,
            noHScroll: true
          })
        );

        this.marks.push(
          this.markText(
            {
              line: line - 1,
              ch: column - 1
            },
            {
              line: line - 1,
              ch: column + token.length - 1
            },
            token,
            'cm-error-token'
          )
        );
      }
      console.warn('synax error, ignore it');
    }
  }

  // 焦点放在最后
  focus(value: string) {
    this.editor.setCursor({
      line: 0,
      ch: value?.length || 0
    });
  }

  dispose() {
    (this.autoMarkText as any).cancel();
  }

  validate() {}
}

let modeRegisted = false;
function registerLaunguageMode(cm: typeof CodeMirror) {
  if (modeRegisted) {
    return;
  }
  modeRegisted = true;

  // TODO 自定义语言规则

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
