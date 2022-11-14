/**
 * @file 表达式输入框组件
 */

import React from 'react';
import {autobind, FormControlProps} from 'amis-core';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import {FormItem, Button, Icon, PickerContainer} from 'amis';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';
import type {VariableItem} from 'amis-ui/lib/components/formula/Editor';
import {resolveVariablesFromScope} from './textarea-formula/utils';

interface ExpressionFormulaControlProps extends FormControlProps {
  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem> | Function;

  /**
   * 配合 variables 使用
   * 当 props.variables 存在时， 是否再从 amis数据域中取变量集合，默认 false
   */
  requiredDataPropsVariables?: boolean;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tabs' | 'tree';
  /**
   * 表达式最外层是否使用 ${} 来包裹，默认 false
   */
  evalMode: boolean;
}

interface ExpressionFormulaControlState {
  variables: Array<VariableItem>;

  formulaPickerValue: string;
}

export default class ExpressionFormulaControl extends React.Component<
  ExpressionFormulaControlProps,
  ExpressionFormulaControlState
> {
  static defaultProps: Partial<ExpressionFormulaControlProps> = {
    variableMode: 'tabs',
    requiredDataPropsVariables: false,
    evalMode: false
  };

  isUnmount: boolean;

  constructor(props: ExpressionFormulaControlProps) {
    super(props);
    this.state = {
      variables: [],
      formulaPickerValue: ''
    };
  }

  componentDidMount() {
    this.initFormulaPickerValue(this.props.value);
    this.getVariables();
  }

  componentDidUpdate(prevProps: ExpressionFormulaControlProps) {
    if (this.props.data !== prevProps.data) {
      this.getVariables();
    }
    if (prevProps.value !== this.props.value) {
      this.initFormulaPickerValue(this.props.value);
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
        if (!this.isUnmount) {
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
  initFormulaPickerValue(value: string) {
    const formulaPickerValue =
      value?.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1) || '';
    this.setState({
      formulaPickerValue
    });
  }

  @autobind
  renderFormulaValue(item: any) {
    const html = {__html: item.html};
    // bca-disable-next-line
    return <span dangerouslySetInnerHTML={html}></span>;
  }

  @autobind
  handleConfirm(value = '') {
    if (this.props.evalMode) {
      value = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
      value = value ? `\${${value}}` : '';
    }
    this.props?.onChange?.(value);
  }

  @autobind
  handleClearExpression(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    this.props?.onChange?.('');
  }

  render() {
    const {value, className, variableMode, header, ...rest} = this.props;
    const {formulaPickerValue, variables} = this.state;

    const highlightValue = FormulaEditor.highlightValue(
      formulaPickerValue,
      variables
    ) || {
      html: formulaPickerValue
    };

    // 自身字段
    const selfName = this.props?.data?.name;

    return (
      <div className={cx('ae-ExpressionFormulaControl', className)}>
        <PickerContainer
          showTitle={false}
          bodyRender={({
            value,
            onChange
          }: {
            onChange: (value: any) => void;
            value: any;
          }) => {
            return (
              <FormulaEditor
                {...rest}
                evalMode={true}
                variableMode={variableMode}
                variables={variables}
                header={header || '表达式'}
                value={formulaPickerValue}
                onChange={onChange}
                selfVariableName={selfName}
              />
            );
          }}
          value={formulaPickerValue}
          onConfirm={this.handleConfirm}
          size="md"
        >
          {({onClick}: {onClick: (e: React.MouseEvent) => void}) =>
            formulaPickerValue ? (
              <Button
                className="btn-configured"
                level="primary"
                tooltip={{
                  placement: 'top',
                  tooltipTheme: 'dark',
                  mouseLeaveDelay: 20,
                  content: value,
                  tooltipClassName: 'btn-configured-tooltip',
                  children: () => this.renderFormulaValue(highlightValue)
                }}
                onClick={onClick}
              >
                已配置表达式
                <Icon
                  icon="input-clear"
                  className="icon"
                  onClick={this.handleClearExpression}
                />
              </Button>
            ) : (
              <Button className="btn-set-expression" onClick={onClick}>
                点击编写表达式
              </Button>
            )
          }
        </PickerContainer>
      </div>
    );
  }
}

@FormItem({
  type: 'ae-expressionFormulaControl'
})
export class ExpressionFormulaControlRenderer extends ExpressionFormulaControl {}
