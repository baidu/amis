/**
 * @file 表达式输入框组件
 */

import React from 'react';
import {autobind, FormControlProps} from 'amis-core';
import cx from 'classnames';
import {FormItem, Button, Icon, PickerContainer} from 'amis';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';
import type {VariableItem} from 'amis-ui/lib/components/formula/Editor';
import {getVariables} from './textarea-formula/utils';

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

  async componentDidMount() {
    this.initFormulaPickerValue(this.props.value);
    const variablesArr = await getVariables(this);
    this.setState({
      variables: variablesArr
    });
  }

  async componentDidUpdate(prevProps: ExpressionFormulaControlProps) {
    if (this.props.data !== prevProps.data) {
      const variablesArr = await getVariables(this);
      this.setState({
        variables: variablesArr
      });
    }
    if (prevProps.value !== this.props.value) {
      this.initFormulaPickerValue(this.props.value);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  @autobind
  initFormulaPickerValue(value: string) {
    let formulaPickerValue = value;
    if (this.props.evalMode) {
      formulaPickerValue =
        value?.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1) || '';
    }
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
              <>
                <Button className="btn-set-expression" onClick={onClick}>
                  点击编写表达式
                </Button>
              </>
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
