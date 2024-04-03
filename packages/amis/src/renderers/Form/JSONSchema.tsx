import React from 'react';
import {FormItem, FormControlProps, FormBaseControl, autobind} from 'amis-core';
import {InputJSONSchema} from 'amis-ui';
import {withRemoteConfig} from 'amis-ui';
import {FormBaseControlSchema} from '../../Schema';
import {InputFormulaControlSchema} from './InputFormula';

/**
 * JSON Schema
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/json-schema
 */
export interface JSONSchemaControlSchema extends FormBaseControlSchema {
  /**
   * 指定为 JSON Schema
   */
  type: 'json-schema';

  /**
   * json-schema 详情，支持关联上下文数据
   */
  schema?: any;

  /**
   * 将字段输入控件变成公式编辑器。
   */
  formula?: Omit<InputFormulaControlSchema, 'type'>;
}

export interface JSONSchemaProps
  extends FormControlProps,
    Omit<
      JSONSchemaControlSchema,
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
