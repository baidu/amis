/**
 * @file 公式编辑器
 */
import React from 'react';
import {mapTree, uncontrollable} from 'amis-core';
import {
  parse,
  autobind,
  utils,
  themeable,
  ThemeProps,
  localeable,
  LocaleProps,
  eachTree
} from 'amis-core';
import {functionDocs} from 'amis-formula';
import type {FunctionDocMap} from 'amis-formula/lib/types';

import {FormulaPlugin, editorFactory} from './plugin';
import FuncList from './FuncList';
import VariableList from './VariableList';
import CodeMirrorEditor from '../CodeMirror';
import {toast} from '../Toast';
import Switch from '../Switch';

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

export interface FormulaEditorProps extends ThemeProps, LocaleProps {
  onChange?: (value: string) => void;
  value?: string;
  /**
   * evalMode 即直接就是表达式，否则
   * 需要 ${这里面才是表达式}
   * 默认为 true
   */
  evalMode?: boolean;

  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem>;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tabs' | 'tree';

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions?: Array<FuncGroup>;

  /**
   * 顶部标题，默认为表达式
   */
  header: string;

  variableClassName?: string;

  functionClassName?: string;

  /**
   * 当前输入项字段 name: 用于避免循环绑定自身导致无限渲染
   */
  selfVariableName?: string;

  /**
   * 编辑器配置
   */
  editorOptions?: any;
}

export interface FunctionsProps {
  name: string;
  items: FunctionProps[];
}

export interface FunctionProps {
  name: string;
  intro: string;
  usage: string;
  example: string;
}

export interface FormulaState {
  functions: FuncGroup[];
  focused: boolean;
  isCodeMode: boolean;
  expandTree: boolean;
  normalizeVariables?: Array<VariableItem>;
}

export class FormulaEditor extends React.Component<
  FormulaEditorProps,
  FormulaState
> {
  state: FormulaState = {
    focused: false,
    isCodeMode: false,
    expandTree: false,
    normalizeVariables: [],
    functions: []
  };
  editorPlugin?: FormulaPlugin;
  unmounted: boolean = false;

  static buildDefaultFunctions(
    doc: Array<{
      namespace: string;
      name: string;
      [propName: string]: any;
    }>
  ) {
    const funcs: Array<FuncGroup> = [];

    doc.forEach(item => {
      const namespace = item.namespace || 'Others';
      let exists = funcs.find(item => item.groupName === namespace);
      if (!exists) {
        exists = {
          groupName: namespace,
          items: []
        };
        funcs.push(exists);
      }
      exists.items.push(item);
    });

    return funcs;
  }

  static buildCustomFunctions(map: FunctionDocMap = {}) {
    return Object.entries(map).map(([k, items]) => ({
      groupName: k,
      items
    }));
  }

  static defaultProps: Pick<FormulaEditorProps, 'variables' | 'evalMode'> = {
    variables: [],
    evalMode: true
  };

  static replaceStrByIndex(
    str: string,
    idx: number,
    key: string,
    replaceKey: string
  ) {
    const from = str.slice(0, idx);
    const left = str.slice(idx);
    return from + left.replace(key, replaceKey);
  }

  static getRegExpByMode(evalMode: boolean, key: string) {
    const reg = evalMode
      ? `\\b${key}\\b`
      : `\\$\\{[^\\{\\}]*\\b${key}\\b[^\\{\\}]*\\}`;
    return new RegExp(reg);
  }

  static highlightValue(
    value: string,
    variables: Array<VariableItem>,
    evalMode: boolean = true
  ) {
    if (!Array.isArray(variables) || !variables.length || !value) {
      return;
    }

    const varMap: {
      [propname: string]: string;
    } = {};

    eachTree(variables, item => {
      if (item.value) {
        const key = item.value;
        varMap[key] = item.path ?? item.label;
      }
    });
    const vars = Object.keys(varMap)
      .filter(item => item)
      .sort((a, b) => b.length - a.length);

    const content = value || '';
    let html = '';

    // 标记方法调用
    html = content.replace(/([A-Z]+)\s*\(/g, (_, func, pos) => {
      return _?.replace(func, `<span class="c-func">${func}</span>`);
    });

    const REPLACE_KEY = 'AMIS_FORMULA_REPLACE_KEY';
    vars.forEach(v => {
      let from = 0;
      let idx = -1;
      while (~(idx = content.indexOf(v, from))) {
        const encodeHtml = FormulaEditor.replaceStrByIndex(
          html,
          idx,
          v,
          REPLACE_KEY
        );
        const reg = FormulaEditor.getRegExpByMode(evalMode, REPLACE_KEY);

        // 如果匹配到则高亮，没有匹配到替换成原值
        if (reg.test(encodeHtml)) {
          html = encodeHtml.replace(
            REPLACE_KEY,
            `<span class="c-field">${v}</span>`
          );
        } else {
          html = encodeHtml.replace(REPLACE_KEY, v);
        }

        from = idx + v.length;
      }
    });

    return {html};
  }

  componentDidMount(): void {
    const {variables} = this.props;
    this.normalizeVariables(variables as VariableItem[]);
    this.buildFunctions();
  }

  componentDidUpdate(
    prevProps: Readonly<FormulaEditorProps>,
    prevState: Readonly<FormulaState>,
    snapshot?: any
  ): void {
    if (prevProps.variables !== this.props.variables) {
      this.normalizeVariables(this.props.variables as VariableItem[]);
    }

    if (prevProps.functions !== this.props.functions) {
      this.buildFunctions();
    }
  }

  componentWillUnmount() {
    this.editorPlugin?.dispose();
    this.unmounted = true;
  }

  async buildFunctions() {
    const {doc} = await import('amis-formula/lib/doc');
    if (this.unmounted) {
      return;
    }
    const customFunctions = Array.isArray(this.props.functions)
      ? this.props.functions
      : [];
    const functionList = [
      ...FormulaEditor.buildDefaultFunctions(doc),
      ...FormulaEditor.buildCustomFunctions(functionDocs),
      ...customFunctions
    ];
    this.setState({
      functions: functionList
    });
  }

  normalizeVariables(variables?: Array<VariableItem>) {
    if (!variables) {
      return;
    }
    // 追加path，用于分级高亮
    const list = mapTree(
      variables,
      (item: any, key: number, level: number, paths: any[]) => {
        const path = paths?.reduce((prev, next) => {
          return !next.value
            ? prev
            : `${prev}${prev ? '.' : ''}${next.label ?? next.value}`;
        }, '');

        return {
          ...item,
          path: `${path}${path ? '.' : ''}${item.label}`,
          // 自己是数组成员或者父级有数组成员
          ...(item.isMember || paths.some(item => item.isMember)
            ? {
                memberDepth: paths?.filter((item: any) => item.type === 'array')
                  ?.length
              }
            : {})
        };
      }
    );

    this.setState({normalizeVariables: list});
  }

  @autobind
  handleFocus() {
    this.setState({
      focused: true
    });
  }

  @autobind
  handleBlur() {
    this.setState({
      focused: false
    });
  }

  @autobind
  insertValue(value: any, type: 'variable' | 'func') {
    this.editorPlugin?.insertContent(value, type);
  }

  @autobind
  handleEditorMounted(cm: any, editor: any) {
    this.editorPlugin = new FormulaPlugin(editor, cm, () => ({
      ...this.props,
      variables: this.state.normalizeVariables
    }));
  }

  @autobind
  validate() {
    const value = this.props.value;

    try {
      value
        ? parse(value, {
            evalMode: this.props.evalMode
          })
        : null;
    } catch (e) {
      return e.message;
    }

    return;
  }

  @autobind
  handleFunctionSelect(item: FuncItem) {
    this.editorPlugin?.insertContent(`${item.name}`, 'func');
  }

  @autobind
  handleVariableSelect(item: VariableItem) {
    const {evalMode, selfVariableName} = this.props;

    if (
      item &&
      item.value &&
      selfVariableName &&
      selfVariableName === item.value
    ) {
      toast.warning('不能使用当前变量[self]，避免循环引用。');
      return;
    }

    if (!item.value) {
      return;
    }

    this.editorPlugin?.insertContent(
      item.isMember
        ? item.value
        : {
            key: item.value,
            name: item.label,
            path: item.path
            // chunks: item.chunks
          },
      item.isMember ? undefined : 'variable',
      'cm-field',
      !this.state.isCodeMode
    );
  }

  @autobind
  handleOnChange(value: any) {
    const onChange = this.props.onChange;
    onChange?.(value);
  }

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    const {editorOptions, ...rest} = this.props;
    return editorFactory(dom, cm, rest, {
      lineWrapping: true // 自动换行
    });
  }

  @autobind
  handleIsCodeModeChange(showCode: boolean) {
    // 重置一下value
    this.editorPlugin?.setValue(this.editorPlugin?.getValue());
    // 非源码模式，则mark一下
    !showCode && this.editorPlugin?.autoMarkText();
    this.setState({isCodeMode: showCode});
  }

  @autobind
  handleExpandTreeChange(expand: boolean) {
    this.setState({expandTree: expand});
  }

  render() {
    const {
      header,
      value,
      functions,
      variableMode,
      translate: __,
      classnames: cx,
      variableClassName,
      functionClassName,
      classPrefix,
      selfVariableName
    } = this.props;
    const {
      focused,
      isCodeMode,
      expandTree,
      normalizeVariables,
      functions: functionList
    } = this.state;

    return (
      <div
        className={cx(`FormulaEditor`, {
          'is-focused': focused
        })}
      >
        <section className={cx('FormulaEditor-settings')}>
          <FuncList
            className={functionClassName}
            title={__('FormulaEditor.function')}
            data={functionList}
            onSelect={this.handleFunctionSelect}
          />

          <div className={cx(`FormulaEditor-content`)}>
            <header className={cx(`FormulaEditor-header`)}>
              {__(header || 'FormulaEditor.title')}
              <div className={cx(`FormulaEditor-header-toolbar`)}>
                <span>源码模式</span>
                <Switch
                  value={isCodeMode}
                  onChange={this.handleIsCodeModeChange}
                />
              </div>
            </header>

            <CodeMirrorEditor
              className={cx('FormulaEditor-editor')}
              value={value}
              onChange={this.handleOnChange}
              editorFactory={this.editorFactory}
              editorDidMount={this.handleEditorMounted}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>
          <div className={cx('FormulaEditor-panel', 'right')}>
            {variableMode !== 'tabs' ? (
              <div className={cx('FormulaEditor-panel-header')}>
                {__('FormulaEditor.variable')}
                {variableMode === 'tree' ? (
                  <div className={cx(`FormulaEditor-header-toolbar`)}>
                    <span>展开全部</span>
                    <Switch
                      value={expandTree}
                      onChange={this.handleExpandTreeChange}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            <div
              className={cx(
                'FormulaEditor-panel-body',
                variableMode && `FormulaEditor-panel-body--${variableMode}`
              )}
            >
              <VariableList
                classPrefix={classPrefix}
                className={cx(
                  'FormulaEditor-VariableList',
                  'FormulaEditor-VariableList-root',
                  variableClassName
                )}
                expandTree={expandTree}
                selectMode={variableMode}
                data={normalizeVariables!}
                onSelect={this.handleVariableSelect}
                selfVariableName={selfVariableName}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default uncontrollable(
  themeable(localeable(FormulaEditor)),
  {
    value: 'onChange'
  },
  ['validate']
);
