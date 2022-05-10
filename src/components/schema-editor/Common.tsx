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
import Textarea from '../Textarea';

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
  enableAdvancedSetting?: boolean;
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
      enableAdvancedSetting,
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

        {enableAdvancedSetting ? (
          <PickerContainer
            value={value}
            bodyRender={({isOpened, value, onChange, ref}) => {
              return isOpened ? (
                <Form defaultValues={value} onSubmit={onChange} ref={ref}>
                  {({control, getValues, setValue}) => (
                    <>
                      <Controller
                        label={__('JSONSchema.title')}
                        name="title"
                        control={control}
                        rules={{maxLength: 20}}
                        isRequired
                        render={({field}) => (
                          <InputBox {...field} disabled={disabled} />
                        )}
                      />

                      <Controller
                        label={__('JSONSchema.description')}
                        name="description"
                        control={control}
                        render={({field}) => (
                          <Textarea {...field} disabled={disabled} />
                        )}
                      />

                      <Controller
                        label={__('JSONSchema.default')}
                        name="default"
                        control={control}
                        render={({field}) => (
                          <InputBox {...field} disabled={disabled} />
                        )}
                      />

                      {renderModalProps?.(getValues(), (values: any) => {
                        Object.keys(values).forEach(key =>
                          setValue(key, values[key])
                        );
                      })}
                    </>
                  )}
                </Form>
              ) : null;
            }}
            beforeConfirm={this.handleBeforeSubmit}
            onConfirm={this.handlePropsChange}
            title={__('SubForm.editDetail')}
          >
            {({onClick}) => (
              <Button
                disabled={disabled || !!value?.$ref}
                className={cx('SchemaEditor-btn')}
                onClick={onClick}
              >
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
