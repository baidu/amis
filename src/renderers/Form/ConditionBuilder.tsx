import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {Funcs, Fields} from '../../components/condition-builder/types';
import {Config} from '../../components/condition-builder/config';
import ConditionBuilder from '../../components/condition-builder/index';
import {SchemaApi, SchemaTokenizeableString} from '../../Schema';
import FormulaPicker from '../../components/formula/Picker';
import {
  RemoteOptionsProps,
  withRemoteConfig
} from '../../components/WithRemoteConfig';
import {Schema} from '../../types';
import {autobind} from '../../utils/helper';

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
  funcs?: Funcs;

  /**
   * 字段集合
   */
  fields: Fields;

  /**
   * 其他配置
   */
  config?: Config;

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

    return (
      <div className={cx(`ConditionBuilderControl`, className)}>
        <ConditionBuilderWithRemoteOptions
          renderEtrValue={this.renderEtrValue}
          {...rest}
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
