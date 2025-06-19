/**
 * @file 表单项校验配置
 */

import React, {ReactNode} from 'react';
import groupBy from 'lodash/groupBy';
import remove from 'lodash/remove';
import omit from 'lodash/omit';
import cx from 'classnames';
import {ConditionBuilderFields, FormItem, flattenTree} from 'amis';

import {
  JSONPipeOut,
  autobind,
  getConditionVariables,
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
    const variablesArr = await getConditionVariables(this);

    const arr = flattenTree(variablesArr, (item: any) => {
      let obj: any = {
        label: item.label,
        value: item.value
      };
      return obj;
    });

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
        message: validationErrors?.isRequired
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
        message && (validationErrors['isRequired'] = message);
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

    remove(validators as any, v => v.name === valid);
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
            popOverContainer: () => document.body,
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
    const _rendererSchema = ValidationControl.getRendererSchemaFromProps(
      this.props
    );
    const rendererSchema = this.filterCustomRendererProps(_rendererSchema);
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
      const data = remove(validators as any, v => v.name === validName);
      rules.push(
        <ValidationItem
          rendererSchema={rendererSchema}
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
      const data = remove(validators as any, v => v.name === validName);
      rules.push(
        <ValidationItem
          rendererSchema={rendererSchema}
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
            rendererSchema={rendererSchema}
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

  // 剔除掉一些用不上的属性
  @autobind
  filterCustomRendererProps(rendererSchema: any) {
    const {
      data,
      name,
      placeholder,
      rendererSchema: _rendererSchema
    } = this.props;

    let curRendererSchema: any = rendererSchema;
    if (rendererSchema && typeof _rendererSchema === 'function') {
      curRendererSchema = Object.assign({}, rendererSchema, {
        type: rendererSchema.type ?? data.type,
        popOverContainer: () => document.body,
        name: 'value'
      });

      // 默认要剔除的字段
      const deleteProps = [
        'id',
        '$$id',
        'className',
        'style',
        'readOnly',
        'horizontal',
        'size',
        'remark',
        'labelRemark',
        'static',
        'staticOn',
        'hidden',
        'hiddenOn',
        'visible',
        'visibleOn',
        'disabled',
        'disabledOn',
        'required',
        'requiredOn',
        'className',
        'labelClassName',
        'labelAlign',
        'inputClassName',
        'description',
        'autoUpdate',
        'prefix',
        'suffix',
        'unitOptions',
        'keyboard',
        'kilobitSeparator',
        'value',
        'inputControlClassName',
        'css',
        'validateApi',
        'validations',
        'themeCss',
        'onEvent',
        'embed'
      ];

      curRendererSchema = omit(curRendererSchema, deleteProps);
      // 设置可清空
      curRendererSchema.clearable = true;

      if (placeholder) {
        curRendererSchema.placeholder = placeholder;
      }
    }

    JSONPipeOut(curRendererSchema);

    return curRendererSchema;
  }

  /**
   * 获取rendererSchema的值
   */
  static getRendererSchemaFromProps(props: ValidationControlProps) {
    let rendererSchema = props.rendererSchema;

    if (typeof rendererSchema === 'function') {
      const schema = props.data ? {...props.data} : undefined;
      return rendererSchema(schema);
    } else {
      return rendererSchema;
    }
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
  strictMode: false,
  shouldComponentUpdate: (
    props: ValidationControlProps,
    nextProps: ValidationControlProps
  ) => {
    const rendererSchema = ValidationControl.getRendererSchemaFromProps(props);
    const newRendererSchema =
      ValidationControl.getRendererSchemaFromProps(nextProps);
    return isObjectShallowModified(rendererSchema, newRendererSchema);
  }
})
export class ValidationControlRenderer extends ValidationControl {}
