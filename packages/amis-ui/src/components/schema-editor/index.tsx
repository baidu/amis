/**
 * 用来定义数据结构的编辑器
 */

import React from 'react';
import {
  localeable,
  LocaleProps,
  themeable,
  ThemeProps,
  autobind,
  JSONSchema
} from 'amis-core';
import {uncontrollable} from 'amis-core';
import {SchemaEditorItem} from './Item';
import {schemaEditorItemPlaceholder} from './Common';
import type {JSONSchema7TypeName} from 'json-schema';
import type {SchemaEditorItemPlaceholder} from './Common';

export interface SchemaEditorProps extends LocaleProps, ThemeProps {
  value?: JSONSchema;
  onChange: (value: JSONSchema) => void;
  disabled?: boolean;
  defaultType: JSONSchema7TypeName;
  renderExtraProps?: (
    value: JSONSchema,
    onChange: (value: JSONSchema) => void
  ) => JSX.Element;
  renderModalProps?: (
    value: JSONSchema,
    onChange: (value: JSONSchema) => void
  ) => JSX.Element;

  disabledTypes?: Array<string>;

  /**
   * 预设模板
   */
  definitions?: {
    [propName: string]: {
      type:
        | 'string'
        | 'number'
        | 'integer'
        | 'object'
        | 'array'
        | 'boolean'
        | 'null';
      title: string;
      [propName: string]: any;
    };
  };

  /**
   * 顶层是否允许修改类型
   */
  rootTypeMutable: boolean;

  /**
   * 顶层类型信息是否隐藏
   */
  showRootInfo: boolean;

  /**
   * 是否开启高级配置
   */
  enableAdvancedSetting?: boolean;

  popOverContainer?: any;

  /**
   * 各属性输入控件的占位提示文本
   */
  placeholder?: SchemaEditorItemPlaceholder;
}

export class SchemaEditor extends React.Component<SchemaEditorProps> {
  static defaultProps: Pick<
    SchemaEditorProps,
    | 'defaultType'
    | 'rootTypeMutable'
    | 'showRootInfo'
    | 'disabledTypes'
    | 'placeholder'
  > = {
    defaultType: 'object',
    rootTypeMutable: false,
    showRootInfo: false,
    disabledTypes: ['null'],
    placeholder: schemaEditorItemPlaceholder
  };

  defaultTypes: Array<any>;

  constructor(props: SchemaEditorProps) {
    super(props);

    const __ = props.translate;
    this.defaultTypes = [
      {
        label: __('SchemaType.string'),
        value: 'string'
      },

      {
        label: __('SchemaType.number'),
        value: 'number'
      },

      {
        label: __('SchemaType.integer'),
        value: 'integer'
      },

      {
        label: __('SchemaType.boolean'),
        value: 'boolean'
      },

      {
        label: __('SchemaType.null'),
        value: 'null'
      },

      {
        label: __('SchemaType.object'),
        value: 'object'
      },

      {
        label: __('SchemaType.array'),
        value: 'array'
      }
    ];
  }

  @autobind
  handleTypeChange(type: string, value: any, origin: any) {
    const {definitions} = this.props;

    if (type === 'array') {
      value.items = {
        type: 'string'
      };
    }

    if (definitions?.[type]) {
      value = {
        ...value,
        ...definitions[type],
        $ref: type
      };
    }

    return value;
  }

  render() {
    const {
      defaultType,
      classnames: cx,
      onChange,
      renderExtraProps,
      renderModalProps,
      translate,
      locale,
      classPrefix,
      rootTypeMutable,
      showRootInfo,
      disabled,
      definitions,
      enableAdvancedSetting,
      popOverContainer,
      placeholder,
      mobileUI
    } = this.props;
    const value: JSONSchema = this.props.value || {
      type: defaultType || 'object'
    };

    const disabledTypes = Array.isArray(this.props.disabledTypes)
      ? this.props.disabledTypes
      : [];
    let types = this.defaultTypes.concat();

    if (definitions) {
      const keys = Object.keys(definitions);
      keys.forEach(key => {
        const definition = definitions[key];

        if (
          definition?.type &&
          definition.title &&
          [
            'string',
            'number',
            'integer',
            'object',
            'array',
            'boolean',
            'null'
          ].includes(definition.type)
        ) {
          types.push({
            value: key,
            label: translate(definition.title)
          });
        }
      });
    }

    if (disabledTypes.length) {
      types = types.filter(item => !~disabledTypes.indexOf(item.value));
    }

    return (
      <div className={cx('SchemaEditor')}>
        <SchemaEditorItem
          types={types}
          typeMutable={rootTypeMutable}
          showInfo={showRootInfo}
          value={value}
          onChange={onChange}
          renderExtraProps={renderExtraProps}
          renderModalProps={renderModalProps}
          locale={locale}
          translate={translate}
          classnames={cx}
          classPrefix={classPrefix}
          disabled={disabled}
          onTypeChange={this.handleTypeChange}
          enableAdvancedSetting={enableAdvancedSetting}
          popOverContainer={popOverContainer}
          placeholder={placeholder}
          mobileUI={mobileUI}
        />
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(SchemaEditor, {
      value: 'onChange'
    })
  )
);
