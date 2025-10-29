import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  Schema,
  isPureVariable,
  resolveVariableAndFilter,
  createObject,
  evalExpression,
  AMISConditionRule
} from 'amis-core';
import {
  FormBaseControlSchema,
  SchemaApi,
  SchemaTokenizeableString
} from '../../Schema';

import {autobind} from 'amis-core';
import {
  ConditionBuilderFields,
  ConditionBuilderFuncs,
  ConditionBuilderConfig,
  withRemoteConfig,
  RemoteOptionsProps,
  ConditionBuilder
} from 'amis-ui';

import {AMISIconSchema} from '../Icon';
import {isMobile} from 'amis-core';
import type {AMISInputFormulaSchemaBase} from './InputFormula';
import {AMISFormItem} from 'amis-core';

/**
 * 条件组合控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/condition-builder
 */
export interface AMISConditionBuilderSchema extends AMISFormItem {
  /**
   * 指定为 condition-builder 组件
   */
  type: 'condition-builder';

  /**
   * 内嵌模式
   */
  embed?: boolean;

  /**
   * 非内嵌模式时弹窗触发icon
   */
  pickerIcon?: AMISIconSchema;

  /**
   * 函数集合
   */
  funcs?: ConditionBuilderFuncs;

  /**
   * 字段集合
   */
  fields: ConditionBuilderFields;

  /**
   * 是否限制字段唯一
   */
  uniqueFields?: boolean;

  /**
   * 其他配置
   */
  config?: ConditionBuilderConfig;

  /**
   * 通过远程拉取配置项
   */
  source?: SchemaApi | SchemaTokenizeableString;

  /**
   * 展现模式
   */
  builderMode?: 'simple' | 'full';

  /**
   * 是否显示并或切换键按钮
   */
  showANDOR?: boolean;

  /**
   * 是否可拖拽
   */
  draggable?: boolean;

  /*
   * 表达式：控制按钮"添加条件"的显示
   */
  addBtnVisibleOn?: string;

  /**
   * 表达式：控制按钮"添加条件组"的显示
   */
  addGroupBtnVisibleOn?: string;

  /**
   * 将字段输入控件变成公式编辑器。
   */
  formula?: AMISInputFormulaSchemaBase;

  /**
   * if 里面公式编辑器配置
   */
  formulaForIf?: any;
}

export interface ConditionBuilderProps
  extends FormControlProps,
    Omit<
      AMISConditionBuilderSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class ConditionBuilderControl extends React.PureComponent<ConditionBuilderProps> {
  @autobind
  renderEtrValue(schema: Schema, props: any) {
    return this.props.render(
      'inline',
      Object.assign({}, schema, {
        label: false,
        inputOnly: true,
        changeImmediately: true
      }),
      props
    );
  }

  renderPickerIcon() {
    const {render, pickerIcon} = this.props;
    return pickerIcon ? render('picker-icon', pickerIcon) : undefined;
  }

  @autobind
  getAddBtnVisible(param: {depth: number; breadth: number}) {
    const {data, addBtnVisibleOn} = this.props;
    if (typeof addBtnVisibleOn === 'string' && addBtnVisibleOn) {
      return evalExpression(addBtnVisibleOn, createObject(data, param));
    }
    return;
  }

  @autobind
  getAddGroupBtnVisible(param: {depth: number; breadth: number}) {
    const {data, addGroupBtnVisibleOn} = this.props;
    if (typeof addGroupBtnVisibleOn === 'string' && addGroupBtnVisibleOn) {
      return evalExpression(addGroupBtnVisibleOn, createObject(data, param));
    }
    return;
  }

  validate(): any {
    const {value, required, translate: __} = this.props;
    // 校验必填
    // 只要存在不为空条件即可通过校验
    if (required) {
      if (!value || !value.children) {
        return __('Condition.isRequired');
      }

      let isEmpty = true;
      const allowRightEmpty = ['is_empty', 'is_not_empty'];
      value?.children?.forEach((item: AMISConditionRule) => {
        // 如果左侧、操作符为空，必填不通过
        if (
          item.op &&
          (item.right || !!~allowRightEmpty.indexOf(item.op as string))
        ) {
          isEmpty = false;
          return;
        }
      });
      return isEmpty ? __('Condition.isRequired') : null;
    }

    return;
  }

  render() {
    const {
      className,
      classnames: cx,
      style,
      pickerIcon,
      env,
      popOverContainer,
      mobileUI,
      ...rest
    } = this.props;

    // 处理一下formula类型值的变量列表
    let formula = this.props.formula ? {...this.props.formula} : undefined;
    if (formula && formula.variables && isPureVariable(formula.variables)) {
      // 如果 variables 是 ${xxx} 这种形式，将其处理成实际的值
      formula.variables = resolveVariableAndFilter(
        formula.variables,
        this.props.data,
        '| raw'
      );
    }

    return (
      <div
        className={cx(
          `ConditionBuilderControl`,
          {'is-mobile': mobileUI},
          className
        )}
      >
        <ConditionBuilderWithRemoteOptions
          renderEtrValue={this.renderEtrValue}
          pickerIcon={this.renderPickerIcon()}
          isAddBtnVisibleOn={this.getAddBtnVisible}
          isAddGroupBtnVisibleOn={this.getAddGroupBtnVisible}
          popOverContainer={popOverContainer || env.getModalContainer}
          {...rest}
          placeholder={rest.placeholder as string}
          formula={formula as any}
        />
      </div>
    );
  }
}

const ConditionBuilderWithRemoteOptions = withRemoteConfig({
  adaptor: data => data.fields || data
})(
  class extends React.Component<
    RemoteOptionsProps & React.ComponentProps<typeof ConditionBuilder>
  > {
    render() {
      const {loading, config, deferLoad, disabled, renderEtrValue, ...rest} =
        this.props;
      return (
        <ConditionBuilder
          {...rest}
          fields={config || rest.fields || []}
          disabled={disabled || loading}
          renderEtrValue={renderEtrValue}
        />
      );
    }
  }
);

@FormItem({
  type: 'condition-builder',
  strictMode: false
})
export class ConditionBuilderRenderer extends ConditionBuilderControl {}
