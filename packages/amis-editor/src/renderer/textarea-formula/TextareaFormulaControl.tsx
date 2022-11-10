/**
 * @file 长文本公式输入框
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import {Icon, FormItem} from 'amis';
import {autobind, FormControlProps, Schema} from 'amis-core';
import CodeMirrorEditor from 'amis-ui/lib/components/CodeMirror';
import {FormulaPlugin, editorFactory} from './plugin';

import FormulaPicker from './FormulaPicker';
import debounce from 'lodash/debounce';
import CodeMirror from 'codemirror';
import {resolveVariablesFromScope} from './utils';
import Menu from './Menu';
import {VariableItem} from 'amis-ui/lib/components/formula/Editor';

export interface TextareaFormulaControlProps extends FormControlProps {
  height?: number; // 输入框的高度

  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem> | Function;

  /**
   * 配合 variables 使用
   * 当 props.variables 存在时， 是否再从 amis数据域中取变量集合，默认 false;
   */
  requiredDataPropsVariables?: boolean;

  variableMode?: 'tree' | 'tabs';

  additionalMenus?: Array<{
    label: string;
    onClick: () => void;
  }>; // 附加底部按钮菜单项
}

interface TextareaFormulaControlState {
  value: string; // 当前文本值

  variables: Array<VariableItem>; // 变量数据

  menusList: Array<{
    label: string;
    onClick: () => void;
  }>; // 底部按钮菜单

  formulaPickerOpen: boolean; // 是否打开公式编辑器

  formulaPickerValue: string; // 公式编辑器内容

  expressionBrace?: Array<CodeMirror.Position>; // 表达式所在位置

  isFullscreen: boolean; //是否全屏
}

export class TextareaFormulaControl extends React.Component<
  TextareaFormulaControlProps,
  TextareaFormulaControlState
> {
  static defaultProps: Partial<TextareaFormulaControlProps> = {
    variableMode: 'tabs',
    requiredDataPropsVariables: false,
    height: 100
  };

  isUnmount: boolean;

  editorPlugin?: FormulaPlugin;

  constructor(props: TextareaFormulaControlProps) {
    super(props);
    this.state = {
      value: '',
      variables: [],
      menusList: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      isFullscreen: false
    };
  }

  componentDidMount() {
    const {additionalMenus = [], value} = this.props;
    const menusList = [
      {
        label: '表达式',
        onClick: () => {
          this.setState({
            formulaPickerOpen: true,
            formulaPickerValue: '',
            expressionBrace: undefined
          });
        }
      }
    ];
    this.setState({
      menusList: [...menusList, ...additionalMenus]
    });

    this.getVariables();
  }

  componentDidUpdate(prevProps: TextareaFormulaControlProps) {
    if (this.props.data !== prevProps.data) {
      this.getVariables();
    }
  }
  componentWillUnmount() {
    this.isUnmount = true;
  }

  // 设置 variables
  async getVariables() {
    let variablesArr: any[] = [];
    const {variables, requiredDataPropsVariables} = this.props;
    if (!variables || requiredDataPropsVariables) {
      // 从amis数据域中取变量数据
      const {node, manager} = this.props.formProps || this.props;
      const vars = await resolveVariablesFromScope(node, manager);
      if (Array.isArray(vars)) {
        if (!this.isUnmount && !isEqual(vars, this.state.variables)) {
          variablesArr = vars;
        }
      }
    }
    if (variables) {
      if (Array.isArray(variables)) {
        variablesArr = [...variables, ...variablesArr];
      }
      if (typeof variables === 'function') {
        variablesArr = [...variables(), ...variablesArr];
      }
    }

    this.setState({
      variables: variablesArr
    });
  }

  @autobind
  onExpressionClick(expression: string, brace?: Array<CodeMirror.Position>) {
    this.setState({
      formulaPickerValue: expression,
      formulaPickerOpen: true,
      expressionBrace: brace
    });
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  @autobind
  handleConfirm(value: any) {
    const {expressionBrace} = this.state;
    // 去除可能包裹的最外层的${}
    value = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
    value = value ? `\${${value}}` : value;
    this.editorPlugin?.insertContent(value, 'expression', expressionBrace);
    this.setState({
      formulaPickerOpen: false,
      expressionBrace: undefined
    });

    this.closeFormulaPicker();
  }

  handleOnChange = debounce((value: any) => {
    this.props.onChange?.(value);
  }, 1000);

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    const variables = this.props.variables || this.state.variables;
    return editorFactory(dom, cm, {...this.props, variables});
  }
  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.props.variables || this.state.variables;
    this.editorPlugin = new FormulaPlugin(
      editor,
      cm,
      () => ({...this.props, variables}),
      this.onExpressionClick
    );
  }

  @autobind
  handleFullscreenModeChange() {
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
  }

  render() {
    const {className, header, label, placeholder, height, ...rest} = this.props;
    const {
      value,
      menusList,
      formulaPickerOpen,
      formulaPickerValue,
      isFullscreen,
      variables
    } = this.state;

    // 输入框样式
    let resultBoxStyle: {[key in string]: string} = {};
    if (height) {
      resultBoxStyle.height = `${height}px`;
    }

    return (
      <div
        className={cx('ae-TextareaFormulaControl', {
          'is-fullscreen': this.state.isFullscreen
        })}
      >
        <div className={cx('ae-TextareaResultBox')} style={resultBoxStyle}>
          <CodeMirrorEditor
            className="ae-TextareaResultBox-editor"
            value={value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
          />
          <Menu menus={menusList} />
          <div className="ae-TextareaResultBox-fullscreen">
            <a
              className={cx('Modal-fullscreen')}
              data-tooltip={isFullscreen ? '退出全屏' : '全屏'}
              data-position="left"
              onClick={this.handleFullscreenModeChange}
            >
              <Icon
                icon={isFullscreen ? 'compress-alt' : 'expand-alt'}
                className="icon"
              />
            </a>
          </div>
        </div>
        {formulaPickerOpen ? (
          <FormulaPicker
            value={formulaPickerValue}
            initable={true}
            variables={variables}
            variableMode={rest.variableMode}
            evalMode={true}
            onClose={() => this.setState({formulaPickerOpen: false})}
            onConfirm={this.handleConfirm}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-textareaFormulaControl'
})
export default class TextareaFormulaControlRenderer extends TextareaFormulaControl {}
