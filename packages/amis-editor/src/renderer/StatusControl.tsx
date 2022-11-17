/**
 * @file 状态配置组件
 */

import React from 'react';
import cx from 'classnames';
import {FormItem, Switch, Option} from 'amis';

import {autobind} from 'amis-editor-core';
import {BaseLabelMark} from '../component/BaseControl';

import type {FormControlProps} from 'amis-core';
import type {SchemaCollection} from 'amis/lib/Schema';
import type {FormSchema} from 'amis/lib/schema';

export interface StatusControlProps extends FormControlProps {
  name: string;
  expressionName: string;
  trueValue?: boolean;
  falseValue?: boolean;
  options?: Option[];
  children?: SchemaCollection;
  messages?: Pick<FormSchema, 'messages'>;
}

type StatusFormData = {
  statusType: number;
  expression: string;
};

interface StatusControlState {
  checked: boolean;
  formData: StatusFormData;
}

export class StatusControl extends React.Component<
  StatusControlProps,
  StatusControlState
> {
  static defaultProps = {
    trueValue: true,
    falseValue: false
  };

  constructor(props: StatusControlProps) {
    super(props);
    this.state = this.initState();
  }

  initState() {
    const {data: ctx = {}, expressionName, name, trueValue} = this.props;
    const formData: StatusFormData = {
      statusType: 1,
      expression: ''
    };
    if (ctx[expressionName] || ctx[expressionName] === '') {
      formData.statusType = 2;
      formData.expression = ctx[expressionName];
    }
    return {
      checked:
        ctx[name] == trueValue || typeof ctx[expressionName] === 'string',
      formData
    };
  }

  shouldComponentUpdate(
    nextProps: StatusControlProps,
    nextState: StatusControlState
  ) {
    return nextState.checked !== this.state.checked;
  }

  @autobind
  handleSwitch(value: boolean) {
    const {trueValue, falseValue} = this.props;
    this.setState({checked: value == trueValue ? true : false}, () => {
      const {onBulkChange, expressionName, name} = this.props;
      onBulkChange &&
        onBulkChange({
          [name]: value == trueValue ? trueValue : falseValue,
          [expressionName]: undefined
        });
    });
  }

  @autobind
  handleFormSubmit(values: StatusFormData) {
    const {onBulkChange, name, expressionName} = this.props;
    const data: Record<string, any> = {
      [name]: undefined,
      [expressionName]: undefined
    };

    this.setState({formData: values});

    switch (values.statusType) {
      case 1:
        data[name] = true;
        break;
      case 2:
        data[expressionName] = values.expression;
        break;
    }
    onBulkChange && onBulkChange(data);
  }

  render() {
    const {className, data: ctx = {}, trueValue, falseValue, env} = this.props;
    const {checked} = this.state;

    return (
      <div className={cx('ae-StatusControl', className)}>
        <header className={cx('ae-StatusControl-switch')}>
          <div>
            <Switch
              className="ae-BaseSwitch"
              size="md"
              trueValue={trueValue}
              falseValue={falseValue}
              checked={checked}
              onChange={this.handleSwitch}
            ></Switch>
          </div>
        </header>
        {checked ? this.renderContent() : null}
      </div>
    );
  }

  renderContent() {
    const {
      render,
      label,
      data: ctx = {},
      name,
      expressionName,
      options,
      children,
      messages
    } = this.props;
    const {formData} = this.state;

    return (
      <div className="ae-StatusControl-content">
        {render(
          'status-control-form',
          {
            type: 'form',
            title: '',
            panelClassName: 'border-none shadow-none mb-0',
            bodyClassName: 'p-none',
            actionsClassName: 'border-none mt-2.5',
            wrapperComponent: 'div',
            submitOnChange: true,
            autoFocus: true,
            formLazyChange: true,
            footerWrapClassName: 'hidden',
            preventEnterSubmit: true,
            messages: messages,
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 3
            },
            body: [
              {
                type: 'select',
                label: '条件',
                name: 'statusType',
                options: options || [
                  {
                    label: '静态',
                    value: 1
                  },
                  {
                    label: '表达式',
                    value: 2
                  }
                ]
              },
              {
                type: 'ae-expressionFormulaControl',
                label: '表达式',
                name: 'expression',
                placeholder: `请输入${label}条件`,
                visibleOn: 'this.statusType === 2',
                onChange: (value: any) => {}
              }
            ]
          },
          {
            data: formData,
            onSubmit: this.handleFormSubmit
          }
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-statusControl'
})
export class StatusControlRenderer extends StatusControl {}
