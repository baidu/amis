import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import JSONSchemaEditor from '../../components/schema-editor/index';

/**
 * JSON Schema Editor
 * 文档：https://baidu.gitee.io/amis/docs/components/form/json-schema-editor
 */
export interface JSONSchemaEditorControlSchema extends FormBaseControl {
  /**
   * 指定为 JSON Schema Editor
   */
  type: 'json-schema-editor';

  /**
   * 顶层是否允许修改类型
   */
  rootTypeMutable: boolean;

  /**
   * 顶层类型信息是否隐藏
   */
  showRootInfo: boolean;
}

export interface JSONSchemaEditorProps
  extends FormControlProps,
    Omit<
      JSONSchemaEditorControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class JSONSchemaEditorControl extends React.PureComponent<JSONSchemaEditorProps> {
  render() {
    const {...rest} = this.props;

    return <JSONSchemaEditor {...rest} />;
  }
}

@FormItem({
  type: 'json-schema-editor'
})
export class JSONSchemaEditorRenderer extends JSONSchemaEditorControl {}
