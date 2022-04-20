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
  types: Array<{
    label: string;
    value: string;
    [propName: string]: any;
  }>;
  onTypeChange?: (
    type: string,
    value: JSONSchema,
    origin?: JSONSchema
  ) => JSONSchema | void;
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
  @autobind
  handleTypeChange(type: any) {
    const {value, onChange, onTypeChange} = this.props;
    let newValue: any = {
      type
    };

    newValue = onTypeChange?.(type, newValue, value) ?? newValue;
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
    const {onChange} = this.props;
    onChange?.({
      ...newValue
    });
  }

  // @autobind
  // handleSettingClick() {}

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
      affix,
      types
    } = this.props;

    return (
      <>
        {prefix}

        <Select
          options={types}
          className={cx('SchemaEditor-type')}
          value={value?.$ref || value?.type || 'string'}
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

        {/* <Button
          className={cx('SchemaEditor-btn')}
          onClick={this.handleSettingClick}
          iconOnly
        >
          <Icon icon="setting" className="icon" />
        </Button> */}

        {affix}
      </>
    );
  }

  render() {
    const {classnames: cx} = this.props;
    return <div className={cx('SchemaEditorItem')}>{this.renderCommon()}</div>;
  }
}
