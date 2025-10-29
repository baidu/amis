import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  autobind,
  AMISFormItem
} from 'amis-core';
import {InputJSONSchema} from 'amis-ui';
import {withRemoteConfig} from 'amis-ui';
import {FormBaseControlSchema} from '../../Schema';
import {AMISInputFormulaSchema} from './InputFormula';

/**
 * JSON Schema
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/json-schema
 */
export interface AMISJsonSchemaSchema extends AMISFormItem {
  /**
   * 指定为 json-schema 组件
   */
  type: 'json-schema';

  /**
   * json-schema 详情
   */
  schema?: any;

  /**
   * 将字段输入控件变成公式编辑器
   */
  formula?: Omit<AMISInputFormulaSchema, 'type'>;
}

export interface JSONSchemaProps
  extends FormControlProps,
    Omit<
      AMISJsonSchemaSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

const EnhancedInputJSONSchema = withRemoteConfig({
  sourceField: 'schema',
  injectedPropsFilter: (injectedProps, props) => {
    return {
      schema: injectedProps.config,
      loading: injectedProps.loading
    };
  }
})(InputJSONSchema as any);
export default class JSONSchemaControl extends React.PureComponent<JSONSchemaProps> {
  control: any;

  @autobind
  controlRef(ref: any) {
    while (ref?.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.control = ref;
  }

  validate() {
    return this.control?.validate();
  }

  render() {
    const {...rest} = this.props;

    return <EnhancedInputJSONSchema {...rest} ref={this.controlRef} />;
  }
}

@FormItem({
  type: 'json-schema',
  strictMode: false
})
export class JSONSchemaRenderer extends JSONSchemaControl {}
