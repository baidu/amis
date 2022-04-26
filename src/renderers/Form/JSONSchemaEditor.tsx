import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import JSONSchemaEditor from '../../components/schema-editor/index';
import {autobind} from '../../utils/helper';

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
   * 可以理解为类型模板，方便快速定义复杂类型
   */
  definitions?: {
    [propName: string]: {
      title: string;
      type:
        | 'string'
        | 'number'
        | 'interger'
        | 'object'
        | 'array'
        | 'boolean'
        | 'null';
      [propName: string]: any;
    };
  };

  /**
   * 顶层是否允许修改类型
   */
  rootTypeMutable?: boolean;

  /**
   * 顶层类型信息是否隐藏
   */
  showRootInfo?: boolean;

  /**
   * 禁用类型，默认禁用了 null 类型
   */
  disabledTypes?: Array<string>;

  /**
   * 开启详情配置
   */
  enableAdvancedSetting?: boolean;

  /**
   * 自定义详情配置面板如：
   *
   * {
   *   boolean: [
   *      {type: "input-text", name: "aa", label: "AA" }
   *   ]
   * }
   *
   * 当配置布尔字段详情时，就会出现以上配置
   */
  advancedSettings?: {
    [propName: string]: any;
  };
}

export interface JSONSchemaEditorProps
  extends FormControlProps,
    Omit<
      JSONSchemaEditorControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class JSONSchemaEditorControl extends React.PureComponent<JSONSchemaEditorProps> {
  static defaultProps = {
    enableAdvancedSetting: false
  };

  // todo 完善这块配置
  settings: any = {
    common: [
      {
        type: 'input-text',
        name: 'title',
        label: this.props.translate('JSONSchema.title')
      },

      {
        type: 'textarea',
        name: 'description',
        label: this.props.translate('JSONSchema.description')
      }
    ]
  };

  @autobind
  renderModalProps({value, onChange}: any) {
    const {render, advancedSettings} = this.props;
    return render(
      `modal`,
      {
        type: 'form',
        wrapWithPanel: false,
        body: [
          ...(this.settings[value?.type] || this.settings.common),
          ...(advancedSettings?.[value?.type] || [])
        ]
      },
      {
        data: value,
        onChange: (value: any) => onChange(value)
      }
    );
  }

  render() {
    const {enableAdvancedSetting, ...rest} = this.props;

    return (
      <JSONSchemaEditor
        {...rest}
        renderModalProps={
          enableAdvancedSetting ? this.renderModalProps : undefined
        }
      />
    );
  }
}

@FormItem({
  type: 'json-schema-editor'
})
export class JSONSchemaEditorRenderer extends JSONSchemaEditorControl {}
