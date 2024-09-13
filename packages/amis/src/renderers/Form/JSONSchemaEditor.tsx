import React from 'react';
import pick from 'lodash/pick';
import {FormItem, FormControlProps} from 'amis-core';
import {JSONSchemaEditor} from 'amis-ui';
import {autobind, isObject} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';

import {schemaEditorItemPlaceholder} from 'amis-ui/lib/components/schema-editor/Common';
import type {SchemaEditorItemPlaceholder} from 'amis-ui';
import {isMobile} from 'amis-core';

/**
 * JSON Schema Editor
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/json-schema-editor
 */
export interface JSONSchemaEditorControlSchema
  extends Omit<FormBaseControlSchema, 'placeholder'> {
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
        | 'integer'
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

  /**
   * 各属性输入控件的占位提示文本
   *
   * {
   *   key: "key placeholder",
   *   title: "title placeholder",
   *   description: "description placeholder",
   *   default: "default placeholder"
   * }
   *
   */
  placeholder?: SchemaEditorItemPlaceholder;

  /**
   * 是否为迷你模式，会隐藏一些不必要的元素
   */
  mini?: boolean;
}

export interface JSONSchemaEditorProps
  extends FormControlProps,
    Omit<
      JSONSchemaEditorControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export default class JSONSchemaEditorControl extends React.PureComponent<
  JSONSchemaEditorProps
> {
  static defaultProps = {
    enableAdvancedSetting: false,
    placeholder: schemaEditorItemPlaceholder
  };

  normalizePlaceholder(): SchemaEditorItemPlaceholder {
    const {placeholder} = this.props;

    if (isObject(placeholder)) {
      return {
        ...schemaEditorItemPlaceholder,
        ...pick(placeholder, [
          'key',
          'title',
          'description',
          'default',
          'empty'
        ])
      };
    }

    return schemaEditorItemPlaceholder;
  }

  @autobind
  renderModalProps(value: any, onChange: (value: any) => void) {
    const {render, advancedSettings} = this.props;
    const fields = advancedSettings?.[value?.type] || [];
    return render(
      `modal`,
      {
        type: 'form',
        wrapWithPanel: false,
        body: fields,
        submitOnChange: true
      },
      {
        data: value,
        onSubmit: (value: any) => onChange(value)
      }
    );
  }

  render() {
    const {enableAdvancedSetting, mobileUI, env, ...rest} = this.props;

    return (
      <JSONSchemaEditor
        {...rest}
        mobileUI={mobileUI}
        placeholder={this.normalizePlaceholder()}
        enableAdvancedSetting={enableAdvancedSetting}
        renderModalProps={this.renderModalProps}
        popOverContainer={
          mobileUI
            ? env?.getModalContainer
            : rest.popOverContainer || env.getModalContainer
        }
      />
    );
  }
}

@FormItem({
  type: 'json-schema-editor'
})
export class JSONSchemaEditorRenderer extends JSONSchemaEditorControl {}
