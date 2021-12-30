/**
 * @file 公式编辑器
 */
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import {FormulaPlugin, editorFactory} from './plugin';
import {doc} from 'amis-formula/dist/doc';
import FuncList from './FuncList';
import {VariableList} from './VariableList';
import {parse} from 'amis-formula';
import {autobind} from '../../utils/helper';
import CodeMirrorEditor from '../CodeMirror';
import {themeable, ThemeProps} from '../../theme';
import {localeable, LocaleProps} from '../../locale';

export interface VariableItem {
  label: string;
  value?: string;
  children?: Array<VariableItem>;
  selectMode?: 'tree' | 'tabs';
}

export interface FuncGroup {
  groupName: string;
  items: Array<FuncItem>;
}

export interface FuncItem {
  name: string;
  [propName: string]: any;
}

export interface FormulaEditorProps extends ThemeProps, LocaleProps {
  onChange?: (value: string) => void;
  value: string;
  /**
   * evalMode 即直接就是表达式，否则
   * 需要 ${这里面才是表达式}
   * 默认为 true
   */
  evalMode?: boolean;

  /**
   * 用于提示的变量集合，默认为空
   */
  variables: Array<VariableItem>;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tabs' | 'tree';

  /**
   * 函数集合，默认不需要传，即  amis-formula 里面那个函数
   * 如果有扩充，则需要传。
   */
  functions: Array<FuncGroup>;

  /**
   * 顶部标题，默认为表达式
   */
  header: string;
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

  static defaultProps: Pick<
    FormulaEditorProps,
    'functions' | 'variables' | 'evalMode'
  > = {
    functions: this.buildDefaultFunctions(doc),
    variables: [],
    evalMode: true
  };

  static highlightValue(
    value: string,
    variables: Array<VariableItem>,
    functions: Array<FuncGroup>
  ) {
    // todo 高亮原始文本
    return value;
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
      classnames: cx
    } = this.props;
    const {focused} = this.state;

    return (
      <div
        className={cx(`FormulaEditor`, {
          'is-focused': focused
        })}
      >
        <div className={cx(`FormulaEditor-content`)}>
          <div className={cx(`FormulaEditor-header`)}>{header ?? '表达式'}</div>

          <CodeMirrorEditor
            className={cx('FormulaEditor-editor')}
            value={value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          ></CodeMirrorEditor>
        </div>

        <div className={cx('FormulaEditor-settings')}>
          {Array.isArray(functions) && functions.length ? (
            <div>
              <h3>变量</h3>
              <VariableList
                className={cx('VariableList')}
                selectMode={variableMode}
                data={variables}
                onSelect={this.handleVariableSelect}
              />
            </div>
          ) : null}
          {Array.isArray(variables) && variables.length ? (
            <div>
              <h3>函数</h3>
              <FuncList data={functions} onSelect={this.handleFunctionSelect} />
            </div>
          ) : null}
        </div>
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
