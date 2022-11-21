/**
 * @file 长文本公式输入框
 */

import React from 'react';
import cx from 'classnames';
import {Icon, FormItem} from 'amis';
import {autobind, FormControlProps, Schema} from 'amis-core';
import CodeMirrorEditor from 'amis-ui/lib/components/CodeMirror';
import {FormulaPlugin, editorFactory} from './plugin';

import FormulaPicker from './FormulaPicker';
import debounce from 'lodash/debounce';
import CodeMirror from 'codemirror';
import {getVariables} from './utils';
import {VariableItem} from 'amis-ui/lib/components/formula/Editor';

export interface TextareaFormulaControlProps extends FormControlProps {
  /**
   * 输入框的高度， 默认 100 px
   */
  height?: number;

  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem> | Function;

  /**
   * 配合 variables 使用
   * 当 props.variables 存在时， 是否再从 amis数据域中取变量集合，默认 false;
   */
  requiredDataPropsVariables?: boolean;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tree' | 'tabs';

  /**
   *  附加底部按钮菜单项
   */
  additionalMenus?: Array<{
    label: string; // 文案（当存在图标时，为tooltip内容）
    onClick: () => void; // 触发事件
    icon?: string; // 图标
    className?: string; //外层类名
  }>;
}

interface TextareaFormulaControlState {
  value: string; // 当前文本值

  variables: Array<VariableItem>; // 变量数据

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
      formulaPickerOpen: false,
      formulaPickerValue: '',
      isFullscreen: false
    };
  }

  async componentDidMount() {
    const variablesArr = await getVariables(this);
    this.setState({
      variables: variablesArr
    });
  }

  async componentDidUpdate(prevProps: TextareaFormulaControlProps) {
    if (this.props.data !== prevProps.data) {
      const variablesArr = await getVariables(this);
      this.setState({
        variables: variablesArr
      });
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
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
  }, 200);

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

  @autobind
  handleFormulaClick() {
    this.setState({
      formulaPickerOpen: true,
      formulaPickerValue: '',
      expressionBrace: undefined
    });
  }

  @autobind
  editorAutoMark() {
    this.editorPlugin?.autoMark();
  }

  render() {
    const {
      className,
      header,
      label,
      placeholder,
      height,
      additionalMenus,
      ...rest
    } = this.props;
    const {
      value,
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
        className={cx(
          'ae-TextareaFormulaControl',
          {
            'is-fullscreen': this.state.isFullscreen
          },
          className
        )}
      >
        <div className={cx('ae-TextareaResultBox')} style={resultBoxStyle}>
          <CodeMirrorEditor
            className="ae-TextareaResultBox-editor"
            value={value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onBlur={this.editorAutoMark}
          />
          <ul className="ae-TextareaResultBox-footer">
            <li className="ae-TextareaResultBox-footer-fullscreen">
              <a
                className={cx('Modal-fullscreen')}
                data-tooltip={isFullscreen ? '退出全屏' : '全屏'}
                data-position="top"
                onClick={this.handleFullscreenModeChange}
              >
                <Icon
                  icon={isFullscreen ? 'compress-alt' : 'expand-alt'}
                  className="icon"
                />
              </a>
            </li>
            <li className="ae-TextareaResultBox-footer-fxIcon">
              <a
                data-tooltip="表达式"
                data-position="top"
                onClick={this.handleFormulaClick}
              >
                <Icon icon="function" className="icon" />
              </a>
            </li>
            {/* 附加底部按钮菜单项 */}
            {additionalMenus?.length &&
              additionalMenus?.map((item, i) => {
                return (
                  <li key={i} className={item?.className || ''}>
                    {item.icon ? (
                      <a
                        data-tooltip={item.label}
                        data-position="top"
                        onClick={() => item.onClick()}
                      >
                        <Icon icon={item.icon} className="icon" />
                      </a>
                    ) : (
                      <a onClick={() => item?.onClick()}>{item.label}</a>
                    )}
                  </li>
                );
              })}
          </ul>
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
