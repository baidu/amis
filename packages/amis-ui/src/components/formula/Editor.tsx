/**
 * @file 公式编辑器
 */
import React from 'react';
import {uncontrollable} from 'uncontrollable';
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
import {doc} from 'amis-formula/dist/doc';

import {FormulaPlugin, editorFactory} from './plugin';
import FuncList from './FuncList';
import VariableList from './VariableList';
import CodeMirrorEditor from '../CodeMirror';

export interface VariableItem {
  label: string;
  value?: string;
  children?: Array<VariableItem>;
  type?: string;
  tag?: string;
  selectMode?: 'tree' | 'tabs';
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
  focused: boolean;
}

export class FormulaEditor extends React.Component<
  FormulaEditorProps,
  FormulaState
> {
  state: FormulaState = {
    focused: false
  };
  editorPlugin?: FormulaPlugin;

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

  static defaultProps: Pick<FormulaEditorProps, 'variables' | 'evalMode'> = {
    variables: [],
    evalMode: true
  };

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
        varMap[key] = item.label;
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

    vars.forEach(v => {
      let from = 0;
      let idx = -1;
      while (~(idx = content.indexOf(v, from))) {
        const curNameEg = new RegExp(`\\b${v}\\b`, 'g'); // 避免变量识别冲突，比如：name、me 被识别成 na「me」
        html = html.replace(curNameEg, `<span class="c-field">${varMap[v]}</span>`);
        from = idx + v.length;
      }
    });

    return {html};
  }

  componentWillUnmount() {
    this.editorPlugin?.dispose();
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
    this.editorPlugin = new FormulaPlugin(editor, cm, () => this.props);
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

    if (item && item.value && selfVariableName === item.value) {
      toast.warning('不能使用当前变量[self]，避免循环引用。');
      return;
    }

    this.editorPlugin?.insertContent(
      {
        key: item.value,
        name: item.label
      },
      'variable'
    );
  }

  @autobind
  handleOnChange(value: any) {
    const onChange = this.props.onChange;
    onChange?.(value);
  }

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    return editorFactory(dom, cm, this.props);
  }

  render() {
    const {
      variables,
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
    const {focused} = this.state;
    const customFunctions = Array.isArray(functions) ? functions : [];
    const functionList = [
      ...FormulaEditor.buildDefaultFunctions(doc),
      ...customFunctions
    ];

    return (
      <div
        className={cx(`FormulaEditor`, {
          'is-focused': focused
        })}
      >
        <section className={cx(`FormulaEditor-content`)}>
          <header className={cx(`FormulaEditor-header`)}>
            {__(header || 'FormulaEditor.title')}
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
        </section>

        <section className={cx('FormulaEditor-settings')}>
          <div className={cx('FormulaEditor-panel')}>
            {variableMode !== 'tabs' ? (
              <div className={cx('FormulaEditor-panel-header')}>
                {__('FormulaEditor.variable')}
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
                selectMode={variableMode}
                data={variables!}
                onSelect={this.handleVariableSelect}
                selfVariableName={selfVariableName}
              />
            </div>
          </div>

          <FuncList
            className={functionClassName}
            title={__('FormulaEditor.function')}
            data={functionList}
            onSelect={this.handleFunctionSelect}
          />
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
