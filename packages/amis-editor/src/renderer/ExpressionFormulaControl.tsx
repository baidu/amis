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
  variables?: any; // 公式变量

  variableMode?: 'tree' | 'tabs';
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
    variableMode: 'tabs'
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
  }

  componentDidUpdate(prevProps: ExpressionFormulaControlProps) {
    // 优先使用props中的变量数据
    if (!this.props.variables) {
      // 从amis数据域中取变量数据
      const {node, manager} = this.props.formProps || this.props;
      resolveVariablesFromScope(node, manager).then(variables => {
        if (Array.isArray(variables)) {
          if (!this.isUnmount && !isEqual(variables, this.state.variables)) {
            this.setState({
              variables: variables
            });
          }
        }
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

  async resolveVariablesFromScope() {
    const {node, manager} = this.props.formProps || this.props;
    await manager?.getContextSchemas(node);
    const dataPropsAsOptions = manager?.dataSchema?.getDataPropsAsOptions();

    if (dataPropsAsOptions) {
      return dataPropsAsOptions.map((item: any) => ({
        selectMode: 'tree',
        ...item
      }));
    }
    return [];
  }

  @autobind
  handleConfirm(value = '') {
    value = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
    value = value ? `\${${value}}` : '';
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
    const {formulaPickerValue} = this.state;

    const variables = this.props.variables || this.state.variables;
    const highlightValue = FormulaEditor.highlightValue(
      formulaPickerValue,
      this.state.variables
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
