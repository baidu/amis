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
  expressioName: string;
  trueValue?: boolean;
  falseValue?: boolean;
  options?: Option[];
  children?: SchemaCollection;
  messages?: Pick<FormSchema, 'messages'>;
}

interface StatusControlState {
  checked: boolean;
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
    const {data: ctx = {}, expressioName, name, trueValue} = this.props;
    return {
      checked: ctx[name] == trueValue || typeof ctx[expressioName] === 'string'
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
      const {onBulkChange, expressioName, name} = this.props;
      onBulkChange &&
        onBulkChange({
          [name]: value == trueValue ? trueValue : falseValue,
          [expressioName]: undefined
        });
    });
  }

  @autobind
  handleSubmit(values: any) {
    const {onBulkChange, name, expressioName} = this.props;
    values[name] = !values[name] ? undefined : values[name];
    values[expressioName] = !values[expressioName]
      ? undefined
      : values[expressioName];
    onBulkChange && onBulkChange(values);
  }

  @autobind
  handleSelect(value: true | '') {
    const {onBulkChange, name, expressioName} = this.props;
    onBulkChange &&
      onBulkChange({
        [value ? expressioName : name]: undefined,
        [(!value && expressioName) || '']: ''
      });
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
      expressioName,
      options,
      children,
      messages
    } = this.props;

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
                name: name,
                valueOn: `typeof this.${expressioName} === "string" ? 2 : 1`,
                options: options || [
                  {
                    label: '静态',
                    value: 1
                  },
                  {
                    label: '表达式',
                    value: 2
                  }
                ],
                pipeIn: (value: any) => (typeof value === 'boolean' ? 1 : 2),
                pipeOut: (value: any) => (value === 1 ? true : ''),
                onChange: this.handleSelect
              },
              ...(Array.isArray(children)
                ? children
                : [
                    children || {
                      type: 'ae-formulaControl',
                      name: expressioName,
                      label: '表达式',
                      placeholder: `请输入${label}条件`,
                      visibleOn: `typeof this.${name} !== "boolean"`
                    }
                  ])
            ]
          },
          {
            onSubmit: this.handleSubmit
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
