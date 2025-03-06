/**
 * @file 公式编辑器
 */
import React from 'react';
import {
  eachTree,
  resolveVariableAndFilterForAsync,
  uncontrollable
} from 'amis-core';
import {
  parse,
  autobind,
  themeable,
  ThemeProps,
  localeable,
  LocaleProps
} from 'amis-core';
import {editorFactory} from './plugin';
import FuncList from './FuncList';
import VariableList from './VariableList';
import {toast} from '../Toast';
import Switch from '../Switch';
import CodeEditor, {FuncGroup, FuncItem, VariableItem} from './CodeEditor';
import {getFunctionsDoc} from 'amis-formula';
import Transition, {
  EXITED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import MonacoEditor from '../Editor';
import debounce from 'lodash/debounce';

const collapseStyles: {
  [propName: string]: string;
} = {
  [EXITED]: 'out',
  [EXITING]: 'out',
  [ENTERING]: 'in'
};

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

  enableRunPanel?: boolean;

  simplifyMemberOprs?: boolean;
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
  isCodeMode: boolean;
  showRunPanel: boolean;
  expandTree: boolean;
  functions?: Array<FuncGroup>;
  runContext: string;
  runResult: string;
  runValid: boolean;
}

export class FormulaEditor extends React.Component<
  FormulaEditorProps,
  FormulaState
> {
  state: FormulaState = {
    focused: false,
    isCodeMode: false,
    showRunPanel: false,
    expandTree: false,
    functions: this.props.functions,
    runContext: '{\n}',
    runResult: '',
    runValid: false
  };
  unmounted: boolean = false;
  editor = React.createRef<any>();

  static async buildFunctions(
    functions?: Array<any>,
    functionsFilter?: (functions: Array<FuncGroup>) => Array<FuncGroup>
  ): Promise<any> {
    const builtInFunctions = await getFunctionsDoc();
    const customFunctions = Array.isArray(functions) ? functions : [];
    const functionList = [...builtInFunctions, ...customFunctions];

    if (functionsFilter) {
      return functionsFilter(functionList);
    }

    return functionList;
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

  /**
   * 干不掉，太多地方使用了，但是要废弃了。
   * 不要用了，输入框也换成 codemirror 了，本身就支持高亮
   * @deprecated
   * @param value
   * @param variables
   * @param evalMode
   * @returns
   */
  static highlightValue(
    value: string,
    variables: Array<VariableItem>,
    evalMode: boolean = true,
    sourceCode: boolean = true
  ) {
    if (!Array.isArray(variables) || !variables.length || !value) {
      return;
    }

    if (typeof value !== 'string') {
      try {
        value = JSON.stringify(value);
      } catch (error) {
        console.error('[amis][formula] given value is not a string');
        value = '';
      }
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
            `<span class="c-field">${sourceCode ? v : varMap[v]}</span>`
          );
        } else {
          html = encodeHtml.replace(REPLACE_KEY, v);
        }

        from = idx + v.length;
      }
    });

    return {html};
  }

  constructor(props: FormulaEditorProps) {
    super(props);
    this.runCode = debounce(this.runCode.bind(this), 250, {
      leading: false,
      trailing: true
    });
  }

  async componentDidMount() {
    const functionList = await FormulaEditor.buildFunctions();
    if (this.unmounted) {
      return;
    }
    if (!this.state.functions) {
      this.setState({
        functions: functionList
      });
    } else {
      this.setState({
        functions: [...functionList, ...this.state.functions]
      });
    }
  }

  componentDidUpdate(prevProps: FormulaEditorProps): void {
    if (prevProps.functions !== this.props.functions) {
      this.setState({
        functions: this.props.functions
      });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    (this.runCode as any).cancel();
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

  getEditor() {
    let ref = this.editor.current;
    while (ref?.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    return ref;
  }

  @autobind
  insertValue(value: any, type: 'variable' | 'func') {
    this.getEditor()?.insertContent(value, type);
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
    this.getEditor()?.insertContent(`${item.name}`, 'func');
  }

  @autobind
  handleVariableSelect(item: VariableItem) {
    const {selfVariableName} = this.props;

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

    this.getEditor()?.insertContent(
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
    this.runCode();
  }

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    const {editorOptions, ...rest} = this.props;
    return editorFactory(dom, cm, rest, {
      lineWrapping: true, // 自动换行
      autoFocus: true
    });
  }

  @autobind
  handleIsCodeModeChange(showCode: boolean) {
    // 重置一下value
    // this.getEditor()?.setValue(this.getEditor()?.getValue());
    // 非源码模式，则mark一下
    // !showCode && this.getEditor()?.autoMarkText();
    this.setState({isCodeMode: showCode}, () =>
      this.getEditor()?.setDisableAutoMark(showCode ? true : false)
    );
  }

  @autobind
  toggleRunPanel() {
    this.setState(
      {
        showRunPanel: !this.state.showRunPanel
      },
      this.runCode
    );
  }
  @autobind
  handleRunContextChange(value: string) {
    this.setState({runContext: value}, this.runCode);
  }

  async runCode() {
    const value = this.props.value || '';
    if (!this.state.showRunPanel) {
      return;
    }

    try {
      // 因为 resolveVariableAndFilterForAsync 不会报语法错误
      parse(value, {
        evalMode: this.props.evalMode
      });

      const runContext = JSON.parse(this.state.runContext);
      let code = this.props.evalMode ? `\${${value}}` : value;

      const result = await resolveVariableAndFilterForAsync(code, runContext);

      this.unmounted ||
        this.setState({
          runValid: true,
          runResult: JSON.stringify(result)
        });
    } catch (e) {
      this.unmounted ||
        this.setState({
          runValid: false,
          runResult: e.message
        });
    }
  }

  @autobind
  handleExpandTreeChange(expand: boolean) {
    this.setState({expandTree: expand});
  }

  render() {
    const {
      header,
      value,
      variables,
      variableMode,
      translate: __,
      classnames: cx,
      variableClassName,
      functionClassName,
      classPrefix,
      selfVariableName,
      evalMode,
      simplifyMemberOprs,
      enableRunPanel = true
    } = this.props;
    const {
      focused,
      isCodeMode,
      showRunPanel,
      expandTree,
      functions,
      runContext,
      runResult,
      runValid
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
            data={functions || []}
            onSelect={this.handleFunctionSelect}
          />

          <div className={cx(`FormulaEditor-content`)}>
            <header className={cx(`FormulaEditor-header`)}>
              {__(header || 'FormulaEditor.title')}
              {enableRunPanel ? (
                <div className={cx(`FormulaEditor-header-toolbar m-l`)}>
                  <span>{__('FormulaEditor.run')}</span>
                  <Switch value={showRunPanel} onChange={this.toggleRunPanel} />
                </div>
              ) : null}
              <div className={cx(`FormulaEditor-header-toolbar`)}>
                <span>{__('FormulaEditor.sourceMode')}</span>
                <Switch
                  value={isCodeMode}
                  onChange={this.handleIsCodeModeChange}
                />
              </div>
            </header>

            <CodeEditor
              evalMode={evalMode}
              functions={functions}
              variables={variables}
              className={cx('FormulaEditor-editor')}
              value={value}
              onChange={this.handleOnChange}
              ref={this.editor}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              autoFocus
            />

            <Transition
              mountOnEnter
              unmountOnExit
              key="run-panel"
              in={showRunPanel}
              timeout={300}
            >
              {(status: string) => {
                return (
                  <div
                    className={cx(
                      `FormulaEditor-runPanel`,
                      collapseStyles[status]
                    )}
                  >
                    <div className={cx(`FormulaEditor-runPanel-context`)}>
                      <header>{__('FormulaEditor.runContext')}</header>
                      <div>
                        <MonacoEditor
                          value={runContext}
                          onChange={this.handleRunContextChange}
                          language="json"
                          options={{
                            tabSize: 2,
                            lineNumbers: false
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={cx(
                        `FormulaEditor-runPanel-result`,
                        runValid ? '' : 'is-error'
                      )}
                    >
                      <header>{__('FormulaEditor.runResult')}</header>
                      <div>{runResult}</div>
                    </div>
                  </div>
                );
              }}
            </Transition>
          </div>
          <div className={cx('FormulaEditor-panel', 'right')}>
            {variableMode !== 'tabs' ? (
              <div className={cx('FormulaEditor-panel-header')}>
                {__('FormulaEditor.variable')}
                {variableMode === 'tree' ? (
                  <div className={cx(`FormulaEditor-header-toolbar`)}>
                    <span>{__('FormulaEditor.toggleAll')}</span>
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
                data={variables!}
                onSelect={this.handleVariableSelect}
                selfVariableName={selfVariableName}
                simplifyMemberOprs={simplifyMemberOprs}
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
