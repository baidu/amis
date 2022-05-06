import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {autobind} from '../../utils/helper';

/**
 * JSON Schema
 * 文档：https://baidu.gitee.io/amis/docs/components/form/json-schema
 */
export interface JSONSchemaControlSchema extends FormBaseControl {
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

export default class JSONSchemaControl extends React.PureComponent<JSONSchemaProps> {
  render() {
    const {} = this.props;

    return <p>233</p>;
  }
}

@FormItem({
  type: 'json-schema'
})
export class JSONSchemaRenderer extends JSONSchemaControl {}
