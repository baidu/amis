import React from 'react';
import {LocaleProps} from '../../locale';
import {ThemeProps} from '../../theme';
import type {JSONSchema} from '../../utils/DataScope';
import {autobind} from '../../utils/helper';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Form from '../Form';
import FormField, {Controller} from '../FormField';
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

  @autobind
  handleBeforeSubmit(form: any) {
    return form.submit();
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

        <PickerContainer
          value={value}
          bodyRender={({isOpened, value, onChange, ref}) => {
            return isOpened ? (
              <Form defaultValues={value} onSubmit={onChange} ref={ref}>
                {({control, formState: {errors}}) => (
                  <>
                    <Controller
                      label={__('JSONSchema.title')}
                      name="title"
                      hasError={errors.title}
                      errors={errors.title}
                      control={control}
                      render={({field}) => (
                        <InputBox
                          className={cx('SchemaEditor-title')}
                          {...field}
                          disabled={disabled || !!value?.$ref}
                        />
                      )}
                    />
                  </>
                )}
              </Form>
            ) : null;
          }}
          beforeConfirm={this.handleBeforeSubmit}
          onConfirm={this.handlePropsChange}
          size="md"
          title={__('SubForm.editDetail')}
        >
          {({onClick}) => (
            <Button
              disabled={disabled}
              className={cx('SchemaEditor-btn')}
              onClick={onClick}
            >
              <Icon icon="setting" className="icon" />
            </Button>
          )}
        </PickerContainer>

        {affix}
      </>
    );
  }

  render() {
    const {classnames: cx} = this.props;
    return <div className={cx('SchemaEditorItem')}>{this.renderCommon()}</div>;
  }
}
