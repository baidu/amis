/**
 * @file 条件输入框组件
 */

import React from 'react';
import {
  render as renderAmis,
  autobind,
  FormControlProps,
  flattenTree
} from 'amis-core';
import cx from 'classnames';
import {FormItem, Button, PickerContainer, ConditionBuilderFields} from 'amis';
import {reaction} from 'mobx';
import {getConditionVariables} from 'amis-editor-core';

interface ConditionFormulaControlProps extends FormControlProps {
  /**
   * 用于选择的变量集合，默认为空，用法同ConditionBuilder 条件组合
   */
  fields?: ConditionBuilderFields;

  /**
   * 是否从 amis数据域中取变量集合，默认 true
   */
  requiredDataPropsFields?: boolean;

  [props: string]: any;
}

interface ConditionFormulaControlState {
  formulaPickerValue: string;
  fields: ConditionBuilderFields;
}

// 把数据域中的变量类型转换成符合ConditionBuilder的type
const PropsFieldsMapping: {
  [props: string]: string;
} = {
  string: 'text',
  number: 'number',
  boolean: 'boolean'
};

export default class ConditionFormulaControl extends React.Component<
  ConditionFormulaControlProps,
  ConditionFormulaControlState
> {
  static defaultProps: Partial<ConditionFormulaControlProps> = {
    requiredDataPropsFields: true
  };

  isUnmount: boolean;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: ConditionFormulaControlProps) {
    super(props);
    this.state = {
      fields: [],
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

    const fieldsArr = await this.buildFieldsData();
    this.setState({
      fields: fieldsArr
    });
  }

  async componentDidUpdate(prevProps: ConditionFormulaControlProps) {
    if (prevProps.value !== this.props.value) {
      this.initFormulaPickerValue(this.props.value);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.unReaction?.();
  }

  @autobind
  async buildFieldsData() {
    let fieldsArr: ConditionBuilderFields = [];
    const {requiredDataPropsFields, fields} = this.props;
    if (requiredDataPropsFields) {
      const variablesArr = await getConditionVariables(this);

      fieldsArr = flattenTree(variablesArr, (item: any) => {
        if (PropsFieldsMapping[item.type]) {
          let obj: any = {
            label: item.label,
            type: PropsFieldsMapping[item.type],
            name: item.value
          };

          return obj;
        }
      })?.filter(item => item);
    }
    return fieldsArr.concat(fields || []);
  }

  @autobind
  initFormulaPickerValue(value: string) {
    this.setState({
      formulaPickerValue: value
    });
  }

  @autobind
  handleConfirm(value = '') {
    this.props?.onChange?.(value);
  }

  @autobind
  async handleOnClick(
    e: React.MouseEvent,
    onClick: (e: React.MouseEvent) => void
  ) {
    const fieldsArr = await this.buildFieldsData();
    this.setState({
      fields: fieldsArr
    });

    return onClick?.(e);
  }

  render() {
    const {name, className, modalSize} = this.props;
    const {formulaPickerValue, fields} = this.state;
    return (
      <div className={cx('ae-ExpressionFormulaControl', className)}>
        <PickerContainer
          title="条件设置"
          bodyRender={({
            value,
            onChange
          }: {
            onChange: (value: any) => void;
            value: any;
          }) => {
            const condition = renderAmis(
              {
                type: 'condition-builder',
                label: false,
                name,
                fields: fields
              },
              {
                value,
                onChange
              }
            );
            return condition;
          }}
          value={formulaPickerValue}
          onConfirm={this.handleConfirm}
          size={modalSize ?? 'lg'}
        >
          {({onClick}: {onClick: (e: React.MouseEvent) => any}) => (
            <Button
              size="sm"
              className="btn-set-expression"
              onClick={(e: any) => this.handleOnClick(e, onClick)}
            >
              点击编写条件
            </Button>
          )}
        </PickerContainer>
      </div>
    );
  }
}

@FormItem({
  type: 'ae-conditionFormulaControl'
})
export class ConditionFormulaControlRenderer extends ConditionFormulaControl {}
