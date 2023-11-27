/**
 * @file 表达式输入框组件
 */

import React from 'react';
import {autobind, FormControlProps} from 'amis-core';
import cx from 'classnames';
import {FormItem, Button, Icon, PickerContainer} from 'amis';
import {FormulaEditor} from 'amis-ui';
import type {VariableItem} from 'amis-ui';
import {renderFormulaValue} from './FormulaControl';
import {reaction} from 'mobx';
import {getVariables} from 'amis-editor-core';

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
   * 表达式最外层是否使用 ${} 来包裹，默认 true
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
    variableMode: 'tree',
    requiredDataPropsVariables: false,
    evalMode: true
  };

  isUnmount: boolean;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: ExpressionFormulaControlProps) {
    super(props);
    this.state = {
      variables: [],
      formulaPickerValue: ''
    };
  }

  async componentDidMount() {
    this.initFormulaPickerValue(this.props.value);
    const editorStore = (window as any).editorStore;
    this.appLocale = editorStore?.appLocale;
    this.appCorpusData = editorStore?.appCorpusData;

    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      async () => {
        this.appLocale = editorStore?.appLocale;
        this.appCorpusData = editorStore?.appCorpusData;
      }
    );
  }

  async componentDidUpdate(prevProps: ExpressionFormulaControlProps) {
    if (prevProps.value !== this.props.value) {
      this.initFormulaPickerValue(this.props.value);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.unReaction?.();
  }

  @autobind
  initFormulaPickerValue(value: string) {
    let formulaPickerValue =
      value?.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1) || '';

    this.setState({
      formulaPickerValue
    });
  }

  @autobind
  handleConfirm(value = '') {
    const expressionReg = /^\$\{(.*)\}$/;
    value = value.replace(/\r\n|\r|\n/g, ' ');
    if (value && !expressionReg.test(value)) {
      value = `\${${value}}`;
    }
    this.props?.onChange?.(value);
  }

  @autobind
  handleClearExpression(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    this.props?.onChange?.(undefined);
  }

  @autobind
  async handleOnClick(
    e: React.MouseEvent,
    onClick: (e: React.MouseEvent) => void
  ) {
    const variablesArr = await getVariables(this);
    this.setState({
      variables: variablesArr
    });

    return onClick?.(e);
  }

  render() {
    const {value, className, variableMode, header, size, ...rest} = this.props;
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
          size={size ?? 'lg'}
        >
          {({onClick}: {onClick: (e: React.MouseEvent) => any}) =>
            formulaPickerValue ? (
              <Button
                className="btn-configured"
                tooltip={{
                  placement: 'top',
                  tooltipTheme: 'dark',
                  mouseLeaveDelay: 20,
                  content: value,
                  tooltipClassName: 'btn-configured-tooltip',
                  children: () => renderFormulaValue(highlightValue)
                }}
                onClick={e => this.handleOnClick(e, onClick)}
              >
                {renderFormulaValue(highlightValue)}
                <Icon
                  icon="input-clear"
                  className="icon"
                  onClick={this.handleClearExpression}
                />
              </Button>
            ) : (
              <>
                <Button
                  className="btn-set-expression"
                  onClick={e => this.handleOnClick(e, onClick)}
                >
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
