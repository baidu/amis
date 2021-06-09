import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {Funcs, Fields} from '../../components/condition-builder/types';
import {Config} from '../../components/condition-builder/config';
import ConditionBuilder from '../../components/condition-builder/index';
import {SchemaApi, SchemaTokenizeableString} from '../../Schema';
import {
  RemoteOptionsProps,
  withRemoteConfig
} from '../../components/WithRemoteConfig';

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
}

export interface ConditionBuilderProps
  extends FormControlProps,
    Omit<
      ConditionBuilderControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class ConditionBuilderControl extends React.PureComponent<ConditionBuilderProps> {
  render() {
    const {className, classnames: cx, ...rest} = this.props;

    return (
      <div className={cx(`ConditionBuilderControl`, className)}>
        <ConditionBuilderWithRemoteOptions {...rest} />
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
      const {loading, config, deferLoad, ...rest} = this.props;
      return (
        <ConditionBuilder
          {...rest}
          fields={config || rest.fields || []}
          disabled={loading}
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
