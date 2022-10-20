/**
 * @file 表达式输入框组件
 */

import React from 'react';
import {autobind, FormControlProps} from 'amis-core';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import {FormItem, Button, Icon} from 'amis';
import {renderFormulaValue} from './textarea-formula/TextareaFormulaControl';
import FormulaPicker from './textarea-formula/FormulaPicker';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';
import type {VariableItem} from 'amis-ui/lib/components/formula/Editor';


interface ExpressionFormulaControlProps extends FormControlProps {
  variables?: any; // 公式变量

  variableMode?: 'tree' | 'tabs';
}

interface ExpressionFormulaControlState {
  variables: Array<VariableItem>;

  formulaPickerOpen: boolean;

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
      formulaPickerOpen: false,
      formulaPickerValue: ''
    }
  }

  componentDidMount() {
    this.initFormulaPickerValue(this.props.value);
  }

  componentDidUpdate(prevProps: ExpressionFormulaControlProps) {
    // 优先使用props中的变量数据
    if (!this.props.variables) {
      // 从amis数据域中取变量数据
      this.resolveVariablesFromScope().then(variables => {
        if (Array.isArray(variables)) {
          const vars = variables.filter(item => item.children?.length);
          if (!this.isUnmount && !isEqual(vars, this.state.variables)) {
            this.setState({
              variables: vars
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
    const formulaPickerValue = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
    this.setState({
      formulaPickerValue
    });
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
  openFormulaPickerModal() {
    this.setState({
      formulaPickerOpen: true
    });
  }

  @autobind
  handleConfirm(value: any) {
    value = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
    value = value ? `\${${value}}` : '';
    this.props?.onChange?.(value);
    this.setState({
      formulaPickerOpen: false
    });
  }

  @autobind
  handleClearExpression(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    this.props?.onChange?.('');
  }

  render() {
    const {value, className, variableMode} = this.props;
    const {formulaPickerOpen, formulaPickerValue} = this.state;

    const variables = this.props.variables || this.state.variables;
    const highlightValue = FormulaEditor.highlightValue(formulaPickerValue, this.state.variables) || {
      html: formulaPickerValue
    };

    return (
      <div className={cx('ae-ExpressionFormulaControl', className)}>
        {
          formulaPickerValue ? (
            <Button
              className="btn-configured"
              level="primary"
              tooltip={{
                placement: 'bottom',
                children: () => renderFormulaValue(highlightValue)
              }}
              onClick={this.openFormulaPickerModal}
            >
              已配置表达式
              <Icon
                icon="close"
                className="icon"
                onClick={this.handleClearExpression}
              />
            </Button>
          ) : (
            <Button
              className="btn-set-expression"
              onClick={this.openFormulaPickerModal}
            >
              点击编写表达式
            </Button>
          )
        }

        {formulaPickerOpen ? (
          <FormulaPicker
            value={formulaPickerValue}
            initable={true}
            variables={variables}
            variableMode={variableMode}
            evalMode={true}
            onClose={() => this.setState({formulaPickerOpen: false})}
            onConfirm={this.handleConfirm}
          />
        ) : null}
      </div>
    )
  }
}

@FormItem({
  type: 'ae-expressionFormulaControl'
})
export class ExpressionFormulaControlRenderer extends ExpressionFormulaControl {}
