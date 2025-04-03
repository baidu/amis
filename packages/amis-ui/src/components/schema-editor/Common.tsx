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
import {SchemaEditorItem} from './Item';
import {UseFormReturn} from 'react-hook-form';

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
  label?: string;
  value?: JSONSchema;
  dataName?: string;
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
  addButtonText?: string;

  // 额外的渲染，控制 item 的渲染，而不是详情
  renderExtraProps?: (
    value: JSONSchema,
    onChange: (value: JSONSchema) => void
  ) => JSX.Element;

  // 开启详情配置是，是否额外还要渲染其他东西
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
  mini?: boolean;
  // 表单模式，mini 模式下会弹出详情模式
  formMode?: boolean;
  formRef?: any;
  onFormConfirm?: (value: any) => void | Promise<any>;
  // mini 模式让顶层展开
  expandMembers?: boolean;

  formPrefixRender?: (
    methods: UseFormReturn & {
      onSubmit: (value: any) => void;
    }
  ) => JSX.Element | null;

  formAffixRender?: (
    methods: UseFormReturn & {
      onSubmit: (value: any) => void;
    }
  ) => JSX.Element | null;
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
  async handlePropsChange(newValue: JSONSchema) {
    const {onFormConfirm, onChange, value} = this.props;
    if (onFormConfirm) {
      await onFormConfirm(newValue);
    }
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
      label,
      value,
      translate: __,
      locale,
      typeMutable,
      disabled,
      classnames: cx,
      classPrefix,
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
      mobileUI,
      mini,
      formPrefixRender,
      formAffixRender
    } = this.props;

    return (
      <>
        {prefix}

        {mini ? (
          <span className={cx('SchemaEditor-info')}>
            <span className={cx('SchemaEditor-label')}>
              {(value as any)?.isRequired ? (
                <span className={cx('Form-star')}>*</span>
              ) : (
                ''
              )}
              {label ?? (value?.title || (value as any)?.key || '')}
            </span>
            <span className={cx('SchemaEditor-typeLabel')}>
              {types.find(item => item.value === value?.type)?.label || ''}
            </span>
          </span>
        ) : null}

        {!mini && types.length > 1 ? (
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
            dataName={onRequiredChange ? `${this.props.dataName}-type` : ''}
          />
        ) : null}

        {!mini && onRequiredChange ? (
          <Checkbox
            className={cx('SchemaEditor-required')}
            label={__('Required')}
            value={required}
            onChange={onRequiredChange}
            disabled={disabled}
            dataName={`${this.props.dataName}-required`}
          />
        ) : null}

        {renderExtraProps?.(value!, this.handlePropsChange)}

        {enableAdvancedSetting || mini ? (
          <PickerContainer
            mobileUI={mobileUI}
            value={value}
            bodyRender={({isOpened, value, onChange, ref}: any) => {
              return isOpened ? (
                <SchemaEditorItem
                  types={types}
                  value={value}
                  onChange={onChange}
                  renderExtraProps={renderExtraProps}
                  renderModalProps={renderModalProps}
                  locale={locale}
                  translate={__}
                  classnames={cx}
                  classPrefix={classPrefix}
                  disabled={disabled}
                  onTypeChange={this.handleTypeChange}
                  enableAdvancedSetting={enableAdvancedSetting}
                  popOverContainer={popOverContainer}
                  placeholder={placeholder}
                  mobileUI={mobileUI}
                  mini={mini}
                  formRef={ref}
                  formMode
                  formPrefixRender={formPrefixRender}
                  formAffixRender={formAffixRender}
                />
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
                level={mini ? 'link' : 'default'}
              >
                <Icon icon={mini ? 'edit' : 'setting'} className="icon" />
              </Button>
            )}
          </PickerContainer>
        ) : null}

        {affix}
      </>
    );
  }

  @autobind
  handleFormChange(values: any) {
    const {value: originValue, onChange} = this.props;
    if (values?.type !== originValue?.type) {
      onChange(values);
    }
  }

  renderForm(props?: Partial<SchemaEditorItemCommonProps>) {
    const {
      value,
      onChange,
      formRef,
      translate: __,
      disabled,
      placeholder,
      mobileUI,
      renderModalProps,
      mini,
      types,
      classnames: cx,
      popOverContainer,
      formPrefixRender,
      formAffixRender
    } = {...this.props, ...props};

    return (
      <Form
        defaultValue={value}
        onChange={this.handleFormChange}
        onSubmit={onChange}
        ref={formRef}
      >
        {methods => (
          <>
            {formPrefixRender?.(methods) ?? null}

            {mini ? (
              <Controller
                label={__('JSONSchema.type')}
                name="type"
                control={methods.control}
                rules={{maxLength: 20}}
                isRequired
                render={({field}) => (
                  <Select
                    {...field}
                    block
                    options={types}
                    className={cx('SchemaEditor-type')}
                    clearable={false}
                    disabled={disabled}
                    simpleValue
                    mobileUI={mobileUI}
                    popOverContainer={popOverContainer}
                  />
                )}
              />
            ) : null}

            <Controller
              label={__('JSONSchema.title')}
              name="title"
              control={methods.control}
              rules={{maxLength: 20}}
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
              control={methods.control}
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
              control={methods.control}
              render={({field}) => (
                <InputBox
                  {...field}
                  disabled={disabled}
                  placeholder={__(placeholder?.default ?? '')}
                  mobileUI={mobileUI}
                />
              )}
            />

            {formAffixRender?.(methods) ?? null}

            {renderModalProps?.(methods.getValues(), (values: any) => {
              Object.keys(values).forEach(key =>
                methods.setValue(key, values[key])
              );
            })}
          </>
        )}
      </Form>
    );
  }

  render() {
    const {classnames: cx, formMode, mini} = this.props;

    if (formMode) {
      return this.renderForm();
    }

    return (
      <div
        className={cx('SchemaEditorItem', {
          'SchemaEditorItem--mini': mini
        })}
        data-amis-name={this.props.dataName}
      >
        {this.renderCommon()}
      </div>
    );
  }
}

export const ITEMMAP: {
  [propsName: string]: typeof SchemaEditorItemCommon;
} = {};
