import React from 'react';
import {LocaleProps} from '../../locale';
import {ThemeProps} from '../../theme';
import type {JSONSchema} from '../../utils/DataScope';
import {autobind} from '../../utils/helper';
import Button from '../Button';
import Checkbox from '../Checkbox';
import {Icon} from '../icons';
import InputBox from '../InputBox';
import PickerContainer from '../PickerContainer';
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
  renderModalProps?: (
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
      type,
      title: value?.title
    };

    newValue = onTypeChange?.(type, newValue, value) ?? newValue;
    onChange?.(newValue);
  }

  @autobind
  handlePropsChange(newValue: JSONSchema) {
    const {onChange, value} = this.props;
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
      renderModalProps,
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

        {renderExtraProps?.(value!, this.handlePropsChange)}

        {renderModalProps ? (
          <PickerContainer
            value={value}
            bodyRender={renderModalProps as any}
            onConfirm={this.handlePropsChange}
            size="md"
            title={__('SubForm.editDetail')}
          >
            {({onClick}) => (
              <Button className={cx('SchemaEditor-btn')} onClick={onClick}>
                <Icon icon="setting" className="icon" />
              </Button>
            )}
          </PickerContainer>
        ) : null}

        {affix}
      </>
    );
  }

  render() {
    const {classnames: cx} = this.props;
    return <div className={cx('SchemaEditorItem')}>{this.renderCommon()}</div>;
  }
}
