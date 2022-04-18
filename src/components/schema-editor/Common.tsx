import React from 'react';
import {LocaleProps} from '../../locale';
import {ThemeProps} from '../../theme';
import type {JSONSchema} from '../../utils/DataScope';
import {autobind} from '../../utils/helper';
import Checkbox from '../Checkbox';
import InputBox from '../InputBox';
import Select from '../Select';

export interface SchemaEditorItemCommonProps extends LocaleProps, ThemeProps {
  value?: JSONSchema;
  onChange: (value: JSONSchema) => void;
  disabled?: boolean;
  required?: boolean;
  onRequiredChange?: (value: boolean) => void;
  typeMutable?: boolean;
  showInfo?: boolean;
  renderExtraProps?: (
    value: JSONSchema,
    onChange: (value: JSONSchema) => void
  ) => JSX.Element;
  prefix?: JSX.Element;
  affix?: JSX.Element;
}

export class SchemaEditorItemCommon<
  P extends SchemaEditorItemCommonProps = SchemaEditorItemCommonProps,
  S = any
> extends React.Component<P, S> {
  typeOptions: Array<any>;

  constructor(props: P) {
    super(props);
    const __ = props.translate;

    this.typeOptions = [
      {
        label: __('SchemaType.string'),
        value: 'string'
      },

      {
        label: __('SchemaType.number'),
        value: 'number'
      },

      {
        label: __('SchemaType.interger'),
        value: 'interger'
      },

      {
        label: __('SchemaType.object'),
        value: 'object'
      },

      {
        label: __('SchemaType.array'),
        value: 'array'
      },

      {
        label: __('SchemaType.boolean'),
        value: 'boolean'
      },

      {
        label: __('SchemaType.null'),
        value: 'null'
      }
    ];
  }

  @autobind
  handleTypeChange(type: any) {
    const {value, onChange} = this.props;
    const newValue: any = {
      type
    };

    if (type === 'array') {
      newValue.items = {
        type: 'string'
      };
    }
    onChange?.(newValue);
  }

  @autobind
  handleDescriptionChange(description: string) {
    const {value, onChange} = this.props;
    onChange?.({
      ...value,
      description
    });
  }

  @autobind
  handleExtraPropsChange(newValue: JSONSchema) {
    const {value, onChange} = this.props;
    onChange?.({
      ...value,
      ...newValue
    });
  }

  renderCommon() {
    const {
      value,
      translate: __,
      typeMutable,
      disabled,
      classnames: cx,
      required,
      onRequiredChange,
      renderExtraProps,
      prefix,
      affix
    } = this.props;

    return (
      <>
        {prefix}

        <Select
          options={this.typeOptions}
          className={cx('SchemaEditor-type')}
          value={value?.type || 'string'}
          onChange={this.handleTypeChange}
          clearable={false}
          disabled={disabled || typeMutable === false}
          simpleValue
        />

        {onRequiredChange ? (
          <Checkbox
            className={cx('SchemaEditor-required')}
            label={__('Required')}
            value={required}
            onChange={onRequiredChange}
            disabled={disabled || typeMutable === false}
          />
        ) : null}

        <InputBox
          className={cx('SchemaEditor-description')}
          value={value?.description || ''}
          onChange={this.handleDescriptionChange}
          placeholder={__('JSONSchema.description')}
          disabled={disabled}
        />

        {renderExtraProps?.(value!, this.handleExtraPropsChange)}

        {affix}
      </>
    );
  }

  render() {
    const {classnames: cx} = this.props;
    return <div className={cx('SchemaEditorItem')}>{this.renderCommon()}</div>;
  }
}
