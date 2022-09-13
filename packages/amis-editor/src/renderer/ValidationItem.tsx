/**
 * @file 校验项
 */

import React from 'react';
import cx from 'classnames';
import {render, Button, Switch} from 'amis';

import {autobind} from 'amis-editor-core';
import {Validator} from '../validator';
import {tipedLabel} from 'amis-editor-core';
import {SchemaCollection} from 'amis/lib/Schema';

export type ValidatorData = {
  name: string;
  value?: any;
  message?: string;
  isBuiltIn?: boolean; // 是否是内置校验
};

export interface ValidationItemProps {
  /**
   * 组件的CSS主题前缀
   */
  classPrefix?: string;

  /**
   * 校验配置
   */
  data: ValidatorData;

  /**
   * 是否是默认props，默认可开关
   */
  isDefault: boolean;

  validator: Validator;

  onEdit?: (data: ValidatorData) => void;
  onDelete?: (name: string) => void;
  onSwitch?: (checked: boolean, data?: ValidatorData) => void;
}

interface ValidationItemState {
  value: string | number | boolean | undefined;
  checked: boolean;
  message: string;
  isBuiltIn: boolean | undefined;
}

export default class ValidationItem extends React.Component<
  ValidationItemProps,
  ValidationItemState
> {
  validator: Validator;

  constructor(props: ValidationItemProps) {
    super(props);

    const {data} = this.props;

    this.validator = this.props.validator;

    this.state = {
      value: data?.value,
      checked: data.value != null,
      message: data?.message || '',
      isBuiltIn: data?.isBuiltIn
    };
  }

  @autobind
  handleEdit(value: any, action: any) {
    const {onEdit, data} = this.props;

    if (action?.type === 'submit') {
      onEdit &&
        onEdit({
          name: data.name,
          ...value
        });
    }
  }

  @autobind
  handleDelete() {
    const {onDelete, data} = this.props;

    onDelete && onDelete(data.name);
  }

  @autobind
  handleSwitch(checked: boolean) {
    let {onSwitch, data} = this.props;
    let {value, message} = this.state;

    this.setState({
      checked
    });

    if (checked) {
      data.value = this.validator.schema ? value : true;
      data.message = '';
    }

    onSwitch && onSwitch(checked, data);
  }

  renderActions() {
    const {isDefault} = this.props;
    const actions = [];

    if (!isDefault) {
      actions.push(
        <Button
          className="ae-ValidationControl-item-action"
          level="link"
          size="md"
          key="delete"
          onClick={this.handleDelete}
        >
          <i className="fa fa-trash" />
        </Button>
      );
    }

    return actions.length !== 0 ? (
      <>
        <div className="ae-ValidationControl-item-actions">{actions}</div>
        {/* <hr /> */}
      </>
    ) : null;
  }

  renderInputControl() {
    const {value, message, checked} = this.state;
    let control: any = [];

    if (!checked) {
      return null;
    }

    if (this.validator.schema) {
      control = control.concat(this.validator.schema as SchemaCollection);
    }

    if (this.validator.message) {
      control.push({
        name: 'message',
        type: 'input-text',
        label: tipedLabel(
          '错误提示',
          `系统默认提示：${this.validator.message}`
        ),
        pipeIn: (value: string, data: any) => {
          // value中 $1 会被运算，导致无法正确回显$1。此处从this.props.data中获取该校验项的错误提示
          return this.props.data.message;
        },
        placeholder: '默认使用系统定义提示'
      });
    }

    return control.length !== 0 ? (
      <section
        className={cx('ae-ValidationControl-item-input', 'ae-ExtendMore')}
      >
        {render(
          {
            type: 'form',
            className: 'w-full',
            wrapWithPanel: false,
            panelClassName: 'border-none shadow-none mb-0',
            bodyClassName: 'p-none',
            actionsClassName: 'border-none mt-2.5',
            wrapperComponent: 'div',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4,
              right: 8
            },
            preventEnterSubmit: true,
            submitOnChange: true,
            body: control,
            data: {value, message}
          },
          {
            onSubmit: this.handleEdit
          }
        )}
      </section>
    ) : null;
  }

  render() {
    const {classPrefix, data, isDefault} = this.props;
    const {checked, isBuiltIn} = this.state;
    return (
      <div
        className={cx('ae-ValidationControl-item', {
          'is-active': checked
        })}
        key={data.name}
      >
        <section
          className={cx('ae-ValidationControl-item-control', {
            'is-active': checked && data.name !== 'required'
          })}
        >
          <label className={cx(`${classPrefix}Form-label`)}>
            {this.validator.label}
          </label>
          <div>
            {this.renderActions()}
            <Switch
              key="switch"
              value={checked}
              disabled={isBuiltIn}
              onChange={this.handleSwitch}
            />
          </div>
        </section>

        {this.renderInputControl()}
      </div>
    );
  }
}
