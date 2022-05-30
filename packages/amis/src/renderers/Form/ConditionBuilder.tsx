import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  Schema,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import {SchemaApi, SchemaTokenizeableString} from '../../Schema';

import {autobind} from 'amis-core';
import {
  ConditionBuilderFields,
  ConditionBuilderFuncs,
  ConditionBuilderConfig,
  withRemoteConfig,
  RemoteOptionsProps,
  ConditionBuilder
} from 'amis-ui';

/**
 * 条件组合控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/condition-builder
 */
export interface ConditionBuilderControlSchema extends FormBaseControl {
  /**
   * 指定为
   */
  type: 'condition-builder';

  /**
   * 函数集合
   */
  funcs?: ConditionBuilderFuncs;

  /**
   * 字段集合
   */
  fields: ConditionBuilderFields;

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
   * 是否显示并或切换键按钮，只在简单模式下有用
   */
  showANDOR?: boolean;
}

export interface ConditionBuilderProps
  extends FormControlProps,
    Omit<
      ConditionBuilderControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class ConditionBuilderControl extends React.PureComponent<ConditionBuilderProps> {
  @autobind
  renderEtrValue(schema: Schema, data: any) {
    return this.props.render(
      'inline',
      Object.assign(schema, {label: false}),
      data
    );
  }
  render() {
    const {className, classnames: cx, ...rest} = this.props;

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
      <div className={cx(`ConditionBuilderControl`, className)}>
        <ConditionBuilderWithRemoteOptions
          renderEtrValue={this.renderEtrValue}
          {...rest}
          formula={formula}
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
