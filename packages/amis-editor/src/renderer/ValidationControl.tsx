/**
 * @file 表单项校验配置
 */

import React, {ReactNode} from 'react';
import groupBy from 'lodash/groupBy';
import remove from 'lodash/remove';
import cx from 'classnames';
import {ConditionBuilderFields, FormItem, flattenTree} from 'amis';

import {
  autobind,
  getQuickVariables,
  isObjectShallowModified
} from 'amis-editor-core';
import ValidationItem, {ValidatorData} from './ValidationItem';

import type {FormControlProps} from 'amis-core';
import {
  getValidator,
  getValidatorsByTag,
  Validator,
  ValidatorTag
} from '../validator';

export type ValidatorFilter = string[] | ((ctx: any) => string[]);

export interface ValidationControlProps extends FormControlProps {
  /**
   * 匹配验证器标签进行默认和顶部可选的验证器展示
   */
  tag: ValidatorTag | ((ctx: any) => ValidatorTag);
}

interface ValidationControlState {
  avaliableValids: {
    moreValidators: Record<string, Validator>;
    defaultValidators: Record<string, Validator>;
    builtInValidators: Record<string, Validator>;
  };
  fields: ConditionBuilderFields;
}

export default class ValidationControl extends React.Component<
  ValidationControlProps,
  ValidationControlState
> {
  cache?: any;

  constructor(props: ValidationControlProps) {
    super(props);

    this.state = {
      avaliableValids: this.getAvaliableValids(props),
      fields: []
    };
  }

  async componentDidMount() {
    const fieldsArr = await this.buildFieldsData();
    this.setState({
      fields: fieldsArr
    });
  }

  componentWillReceiveProps(nextProps: ValidationControlProps) {
    if (
      this.props.data.type !== nextProps.data.type ||
      this.cache?.required !== nextProps.data.required ||
      isObjectShallowModified(
        this.cache?.validations,
        nextProps.data.validations
      ) ||
      isObjectShallowModified(
        this.cache?.validationErrors,
        nextProps.data.validationErrors
      )
    ) {
      this.setState({
        avaliableValids: this.getAvaliableValids(nextProps)
      });
      // const validators = this.transformValid(this.props.data);
      // this.updateValidation(validators);
    }
    // todo 删除不允许配置的值
  }

  @autobind
  async buildFieldsData() {
    const variablesArr = await getQuickVariables(this);
    // 自身字段
    const selfName = this.props.data.name;

    const arr: ConditionBuilderFields = flattenTree(
      variablesArr,
      (item: any) => {
        if (item.value && item.type !== 'array' && !item.isMember) {
          let obj: any = {
            label: item.label,
            value: item.value
          };

          if (selfName === item.value) {
            obj = {
              ...obj,
              label: item.label + '（self）',
              disabled: true
            };
          }
          return obj;
        }
      }
    )?.filter(item => item);

    return arr;
  }

  getAvaliableValids(props: ValidationControlProps) {
    let {data, tag} = props;
    tag = typeof tag === 'string' ? tag : tag(data);
    return getValidatorsByTag(tag);
  }

  transformValid(data: any) {
    const {required, validations, validationErrors} = data;
    let validators: ValidatorData[] = [];

    if (required) {
      validators.push({
        name: 'required',
        value: true,
        message: validationErrors?.required
      });
    }

    if (validations) {
      Object.keys(validations).forEach(name => {
        validators.push({
          name,
          value: validations[name],
          message: validationErrors?.[name]
        });
      });
    }
    return validators;
  }

  /**
   * 统一更新校验相关字段
   */
  updateValidation(validators: ValidatorData[]) {
    const {onBulkChange} = this.props;

    if (!validators.length) {
      this.cache = undefined;
      onBulkChange &&
        onBulkChange({
          required: undefined,
          validations: undefined,
          validationErrors: undefined
        });
      return;
    }

    let required = undefined;
    const validations: Record<string, any> = {};
    const validationErrors: Record<string, string> = {};

    validators.forEach(data => {
      const {name, value, message} = data;
      if (name === 'required') {
        required = value;
        return;
      }
      if (value != null) {
        validations[name] = value;
        message && (validationErrors[name] = message);
      }
    });

    this.cache = {
      required,
      validations: Object.keys(validations).length ? validations : undefined,
      validationErrors: Object.keys(validationErrors).length
        ? validationErrors
        : undefined
    };

    onBulkChange && onBulkChange({...this.cache});
  }

  /**
   * 添加规则
   *
   * @param {Validator} valid 校验规则配置
   */
  handleAddValidator(valid: Validator): void {
    const validators = this.transformValid(this.props.data);
    validators.push({
      name: valid.name,
      value: valid.schema ? '' : true,
      message: ''
    });
    this.updateValidation(validators);
  }

  /**
   * 更新校验规则
   */
  @autobind
  handleEditRule(data: ValidatorData) {
    const validators = this.transformValid(this.props.data);
    const validator = validators.find(v => v.name === data.name);

    if (validator) {
      validator.value = data.value;
      validator.message = data.message;
    } else {
      /** 预设的校验规则props.data取不到 */
      validators.push(data);
    }

    this.updateValidation(validators);
  }

  /**
   * 删除校验规则
   */
  @autobind
  handleRemoveRule(valid: string) {
    const validators = this.transformValid(this.props.data);

    remove(validators, v => v.name === valid);
    this.updateValidation(validators);
  }

  /**
   * 开关默认规则
   */
  @autobind
  handleSwitchRule(checked: boolean, data: ValidatorData) {
    const validators = this.transformValid(this.props.data);

    let valid = validators.find(v => v.name === data.name);
    if (!valid) {
      valid = {name: data.name};
      validators.push(valid);
    }

    valid.value = checked ? data.value : undefined;
    valid.message = checked ? data.message : undefined;

    this.updateValidation(validators);
  }

  /**
   * 添加规则下拉框
   */
  renderDropdown() {
    const {render, validations = {}} = this.props;
    const {
      avaliableValids: {moreValidators}
    } = this.state;
    // 去掉已经选用的
    const validators = Object.values(moreValidators).filter(
      item => !validations.hasOwnProperty(item.name)
    );
    const buttons = Object.entries(groupBy(validators, 'group')).map(
      ([group, validations]) => ({
        label: group,
        children: validations.map(v => ({
          label: v.label,
          onClick: () => this.handleAddValidator(v)
        }))
      })
    );

    return (
      <div className="ae-ValidationControl-dropdown">
        {render(
          'validation-control-dropdown',
          {
            type: 'dropdown-button',
            btnClassName: 'ae-ValidationControl-dropdown-btn',
            menuClassName: 'ae-ValidationControl-dropdown-menu',
            level: 'link',
            size: 'md',
            icon: 'fa fa-plus',
            label: '',
            tooltip: '添加校验规则',
            placement: 'left',
            align: 'right',
            tooltipTrigger: 'hover',
            closeOnClick: true,
            closeOnOutside: true,
            hideCaret: true,
            disabled: buttons.length === 0,
            buttons
          },
          {
            key: 'validation-control-dropdown',
            popOverContainer: null
          }
        )}
      </div>
    );
  }

  /**
   * 规则列表
   */
  renderValidaton() {
    const classPrefix = this.props?.env?.theme?.classPrefix;
    let {
      avaliableValids: {defaultValidators, moreValidators, builtInValidators},
      fields
    } = this.state;
    let validators = this.transformValid(this.props.data);
    const rules: ReactNode[] = [];
    validators = validators.concat();
    // 优先渲染默认的顺序
    Object.keys(defaultValidators).forEach((validName: string) => {
      const data = remove(validators, v => v.name === validName);
      rules.push(
        <ValidationItem
          fields={fields}
          key={validName}
          validator={defaultValidators[validName]}
          data={data.length ? data[0] : {name: validName}}
          classPrefix={classPrefix}
          isDefault={defaultValidators.hasOwnProperty(validName)}
          onEdit={this.handleEditRule}
          onDelete={this.handleRemoveRule}
          onSwitch={this.handleSwitchRule}
        />
      );
    });

    Object.keys(builtInValidators).forEach((validName: string) => {
      const data = remove(validators, v => v.name === validName);
      rules.push(
        <ValidationItem
          fields={fields}
          key={validName}
          validator={builtInValidators[validName]}
          data={
            data.length
              ? {...data[0], isBuiltIn: true}
              : {name: validName, value: true, isBuiltIn: true}
          }
          classPrefix={classPrefix}
          isDefault={builtInValidators.hasOwnProperty(validName)}
          onEdit={this.handleEditRule}
          onDelete={this.handleRemoveRule}
          onSwitch={this.handleSwitchRule}
        />
      );
    });

    // 剩余的按顺序渲染
    if (validators.length) {
      validators.forEach(valid => {
        const validator =
          moreValidators[valid.name] || getValidator(valid.name);
        if (!validator) {
          return;
        }
        rules.push(
          <ValidationItem
            fields={fields}
            key={valid.name}
            data={valid}
            classPrefix={classPrefix}
            validator={validator}
            isDefault={defaultValidators.hasOwnProperty(valid.name)}
            onEdit={this.handleEditRule}
            onDelete={this.handleRemoveRule}
            onSwitch={this.handleSwitchRule}
          />
        );
      });
    }

    return (
      <div className="ae-ValidationControl-rules" key="rules">
        {rules}
      </div>
    );
  }

  render() {
    const {className} = this.props;

    return (
      <div
        className={cx('ae-ValidationControl', className)}
        key="validation-control"
      >
        {this.renderDropdown()}

        {this.renderValidaton()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-validationControl',
  renderLabel: false,
  strictMode: false
})
export class ValidationControlRenderer extends ValidationControl {}
