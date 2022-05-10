import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {autobind, isObjectShallowModified} from '../../utils/helper';
import InputJSONSchema from '../../components/json-schema/index';
import {
  isPureVariable,
  resolveVariableAndFilter
} from '../../utils/tpl-builtin';
import {isApiOutdated, isEffectiveApi} from '../../utils/api';
import {withRemoteConfig} from '../../components/WithRemoteConfig';

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

const EnhancedInputJSONSchema = withRemoteConfig({
  sourceField: 'schema',
  injectedPropsFilter: props => {
    return {
      schema: props.config,
      loading: props.loading
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
