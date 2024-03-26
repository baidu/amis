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
import {FormulaPickerProps} from '../formula/Picker';
import Button from '../Button';
import Modal from '../Modal';
import Editor from '../Editor';

export interface SchemaEditorMapProps extends LocaleProps, ThemeProps {
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

  /**
   * 是否为 mini 模式
   */
  mini?: boolean;

  //公式数据
  formulaForIf?: FormulaPickerProps;

  /**
   * 添加属性的按钮文本
   */
  addButtonText?: string;

  store?: any;
}

let jsonSchemaValue: any;

export interface SchemaEditorState {
  showJsonSchema: boolean;
  isJson: boolean;
  exportJsonSchema: any;
}

export class SchemaEditorMap extends React.Component<
  SchemaEditorMapProps,
  SchemaEditorState
> {
  static defaultProps: Pick<
    SchemaEditorMapProps,
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

  state = {
    showJsonSchema: false,
    isJson: false,
    exportJsonSchema: {}
  };

  constructor(props: SchemaEditorMapProps) {
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

  hideModal(notResetOptions?: boolean) {
    this.setState({showJsonSchema: false});
  }

  generateJsonSchema(data: any): Record<string, any> {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return {type: 'array'};
      }

      const arrayItemSchema = this.generateJsonSchema(data[0]);
      return {type: 'array', items: arrayItemSchema};
    }

    if (typeof data === 'object' && data !== null) {
      const schema: Record<string, any> = {
        type: 'object',
        properties: {},
        required: []
      };

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          const propertySchema = this.generateJsonSchema(value);
          schema.properties[key] = propertySchema;
          schema.required.push(key);
        }
      }

      return schema;
    }

    if (typeof data === 'boolean') {
      return {type: 'boolean'};
    }

    return {type: typeof data};
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
      mobileUI,
      mini,
      className,
      addButtonText,
      formulaForIf
    } = this.props;

    if (formulaForIf) {
      formulaForIf.store = this.props.store;
    }
    const {showJsonSchema, isJson} = this.state;
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
      <div>
        <div style={{marginBottom: '15px', color: 'red'}}>
          <Button
            className={cx('SchemaEditor-btn')}
            level={'default'}
            size="md"
            onClick={() => {
              this.setState({
                showJsonSchema: true,
                isJson: false
              });
            }}
            disabled={disabled || !!value?.$ref}
          >
            导入JsonSchema
          </Button>
          <Modal show={showJsonSchema} onHide={this.hideModal}>
            <Modal.Header
              onClose={() => {
                this.hideModal();
              }}
            >
              {isJson == true ? '导入JSON' : '导入JsonSchema'}
            </Modal.Header>
            <Modal.Body>
              <Editor
                language="json"
                width="100%"
                height="400px"
                onChange={value => {
                  jsonSchemaValue = value;
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  this.hideModal();
                }}
              >
                取消
              </Button>
              <Button
                level="primary"
                onClick={() => {
                  this.hideModal();
                  if (
                    isJson == false &&
                    jsonSchemaValue &&
                    jsonSchemaValue.length > 0
                  ) {
                    let value = JSON.parse(jsonSchemaValue);
                    onChange(value);
                  } else {
                    if (jsonSchemaValue && jsonSchemaValue.length > 0) {
                      let value = this.generateJsonSchema(
                        JSON.parse(jsonSchemaValue)
                      );
                      onChange(value);
                    }
                  }
                }}
              >
                确认
              </Button>
            </Modal.Footer>
          </Modal>
          <Button
            className={cx('SchemaEditor-btn')}
            style={{marginLeft: '15px'}}
            level={'default'}
            size="md"
            disabled={disabled || !!value?.$ref}
            onClick={() => {
              this.setState({
                showJsonSchema: true,
                isJson: true
              });
            }}
          >
            导入Json
          </Button>
        </div>
        <div className={cx('SchemaEditor', className)}>
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
            enableAdvancedSetting={false}
            popOverContainer={popOverContainer}
            placeholder={placeholder}
            mobileUI={mobileUI}
            mini={mini}
            addButtonText={addButtonText}
            expandMembers
            formulaForIf={formulaForIf}
          />
        </div>
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(SchemaEditorMap, {
      value: 'onChange'
    })
  )
);
