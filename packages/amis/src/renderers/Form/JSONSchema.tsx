import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import {InputJSONSchema} from 'amis-ui';
import {withRemoteConfig} from 'amis-ui';
import {FormBaseControlSchema} from '../../Schema';

/**
 * JSON Schema
 * 文档：https://baidu.gitee.io/amis/docs/components/form/json-schema
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
  render() {
    const {...rest} = this.props;

    return <EnhancedInputJSONSchema {...rest} />;
  }
}

@FormItem({
  type: 'json-schema',
  strictMode: false
})
export class JSONSchemaRenderer extends JSONSchemaControl {}
