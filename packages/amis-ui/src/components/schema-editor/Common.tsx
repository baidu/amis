import React from 'react';
import {LocaleProps, ThemeProps, autobind, JSONSchema} from 'amis-core';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Form from '../Form';
import FormField, {Controller} from '../FormField';
import {Icon} from '../icons';
import InputBox from '../InputBox';
import PickerContainer from '../PickerContainer';
import Select from '../Select';
import Textarea from '../Textarea';

export const schemaEditorItemPlaceholder = {
  key: 'JSONSchema.key',
  title: 'JSONSchema.title',
  description: 'JSONSchema.description',
  default: 'JSONSchema.default',
  empty: 'placeholder.empty'
};

export type SchemaEditorItemPlaceholder = Partial<
  typeof schemaEditorItemPlaceholder
>;

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
  /** 各属性输入控件的placeholder */
  placeholder?: SchemaEditorItemPlaceholder;
  popOverContainer?: any;
  mobileUI?: boolean;
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
      popOverContainer,
      prefix,
      affix,
      types,
      placeholder,
      mobileUI
    } = this.props;

    return (
      <>
        {prefix}

        {types.length > 1 ? (
          <Select
            options={types}
            className={cx('SchemaEditor-type')}
            value={value?.$ref || value?.type || 'string'}
            onChange={this.handleTypeChange}
            clearable={false}
            disabled={disabled || typeMutable === false}
            simpleValue
            mobileUI={mobileUI}
            popOverContainer={popOverContainer}
          />
        ) : null}

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
            mobileUI={mobileUI}
            value={value}
            bodyRender={({isOpened, value, onChange, ref}) => {
              return isOpened ? (
                <Form defaultValue={value} onSubmit={onChange} ref={ref}>
                  {({control, getValues, setValue}) => (
                    <>
                      <Controller
                        label={__('JSONSchema.title')}
                        name="title"
                        control={control}
                        rules={{maxLength: 20}}
                        isRequired
                        render={({field}) => (
                          <InputBox
                            {...field}
                            disabled={disabled}
                            placeholder={__(placeholder?.title ?? '')}
                            mobileUI={mobileUI}
                          />
                        )}
                      />

                      <Controller
                        label={__('JSONSchema.description')}
                        name="description"
                        control={control}
                        render={({field}) => (
                          <Textarea
                            {...field}
                            disabled={disabled}
                            mobileUI={mobileUI}
                            placeholder={__(placeholder?.description ?? '')}
                          />
                        )}
                      />

                      <Controller
                        label={__('JSONSchema.default')}
                        name="default"
                        control={control}
                        render={({field}) => (
                          <InputBox
                            {...field}
                            disabled={disabled}
                            placeholder={__(placeholder?.default ?? '')}
                            mobileUI={mobileUI}
                          />
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
            popOverContainer={popOverContainer}
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
