/**
 * @file 状态配置组件
 */

import React from 'react';
import cx from 'classnames';
import {FormItem, Switch, Option} from 'amis';

import {autobind, getSchemaTpl} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';
import type {SchemaCollection} from 'amis';
import type {FormSchema} from 'amis/lib/Schema';

export interface StatusControlProps extends FormControlProps {
  name: string;
  expressionName: string;
  trueValue?: boolean;
  falseValue?: boolean;
  options?: Option[];
  children?: SchemaCollection;
  messages?: Pick<FormSchema, 'messages'>;
  // 应用于不需要 bulkChange 的场景，如
  noBulkChange?: boolean;
  noBulkChangeData?: any;
  defaultTrue?: boolean; // 默认是否开启，用于“可见”等默认开启的配置项
  onDataChange?: (value: any) => void;
}

type StatusFormData = {
  statusType: number;
  expression: string;
  condition: object;
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
    const {
      data = {},
      noBulkChange,
      noBulkChangeData,
      expressionName,
      name,
      trueValue,
      defaultTrue
    } = this.props;

    const formData: StatusFormData = {
      statusType: 1,
      expression: '',
      condition: {
        conjunction: 'and',
        children: []
      }
    };

    let ctx = data;

    if (noBulkChange && noBulkChangeData) {
      ctx = noBulkChangeData;
    }

    if (
      typeof ctx[expressionName] === 'string' &&
      (ctx[expressionName] || ctx[expressionName] === '')
    ) {
      formData.statusType = 2;
      formData.expression = ctx[expressionName];
    }

    if (
      typeof ctx[expressionName] === 'object' &&
      ctx[expressionName] &&
      ctx[expressionName].conjunction
    ) {
      formData.statusType = 3;
      formData.condition = ctx[expressionName];
    }

    return {
      checked:
        ctx[name] == trueValue ||
        typeof ctx[expressionName] === 'string' ||
        Object.prototype.toString.call(ctx[expressionName]) ===
          '[object Object]' ||
        (!!defaultTrue &&
          ctx[name] == undefined &&
          ctx[expressionName] == undefined),
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
    const {condition, expression, statusType = 1} = this.state.formData || {};
    this.setState({checked: value == trueValue ? true : false}, () => {
      const {onBulkChange, noBulkChange, onDataChange, expressionName, name} =
        this.props;

      const newData: Record<string, any> = {
        [name]: value == falseValue ? falseValue : undefined,
        [expressionName]: undefined
      };
      if (value == trueValue) {
        switch (statusType) {
          case 1:
            newData[name] = trueValue;
            break;
          case 2:
            newData[expressionName] = expression;
            break;
          case 3:
            newData[expressionName] = condition;
            break;
        }
      }
      !noBulkChange && onBulkChange && onBulkChange(newData);
      onDataChange && onDataChange(newData);
    });
  }

  @autobind
  handleFormSubmit(values: StatusFormData) {
    const {onBulkChange, noBulkChange, onDataChange, name, expressionName} =
      this.props;
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
      case 3:
        data[expressionName] = values.condition;
        break;
    }
    !noBulkChange && onBulkChange && onBulkChange(data);
    onDataChange && onDataChange(data);
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
            // autoFocus: true,
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
                  },
                  {
                    label: '自定义条件',
                    value: 3
                  }
                ]
              },
              getSchemaTpl('expressionFormulaControl', {
                evalMode: false,
                label: '表达式',
                name: 'expression',
                placeholder: `请输入${label}条件`,
                visibleOn: 'this.statusType === 2'
              }),
              getSchemaTpl('conditionFormulaControl', {
                label: '条件设置',
                name: 'condition',
                visibleOn: 'this.statusType === 3'
              })
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
