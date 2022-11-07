import {
  ClassNamesFn,
  localeable,
  LocaleProps,
  themeable,
  ThemeProps,
  TranslateFn
} from 'amis-core';
import React from 'react';
import {
  Control,
  useFieldArray,
  UseFieldArrayProps,
  UseFormReturn,
  useFormState
} from 'react-hook-form';
import useSubForm from '../hooks/use-sub-form';
import Button from './Button';
import FormField, {FormFieldProps} from './FormField';
import {Icon} from './icons';

export interface InputTableColumnProps {
  title?: string;
  className?: string;
  thRender?: () => JSX.Element;
  tdRender: (methods: UseFormReturn, index: number) => JSX.Element | null;
}

export interface InputTabbleProps<T = any>
  extends ThemeProps,
    LocaleProps,
    Omit<FormFieldProps, 'children' | 'errors' | 'hasError' | 'className'>,
    UseFieldArrayProps {
  control: Control<any>;
  fieldClassName?: string;
  columns: Array<InputTableColumnProps>;

  /**
   * 要不要包裹 label 之类的
   */
  wrap?: boolean;
  scaffold?: any;

  addable?: boolean;
  addButtonClassName?: string;
  addButtonText?: string;

  maxLength?: number;
  minLength?: number;
  removable?: boolean;
}

export function InputTable({
  control,
  name,
  wrap,
  mode,
  label,
  labelAlign,
  labelClassName,
  description,
  fieldClassName,
  className,
  translate: __,
  classnames: cx,
  removable,
  columns,
  addable,
  addButtonText,
  addButtonClassName,
  scaffold,
  minLength,
  maxLength,
  isRequired,
  rules
}: InputTabbleProps) {
  const subForms = React.useRef<Record<any, UseFormReturn>>({});
  const subFormRef = React.useCallback(
    (subform: UseFormReturn | null, index: number) => {
      if (subform) {
        subForms.current[index] = subform;
      } else {
        delete subForms.current[index];
      }
    },
    [subForms]
  );
  let rules2: any = {...rules};

  if (isRequired) {
    rules2.required = true;
  }

  if (minLength) {
    rules2.minLength = minLength;
  }

  if (maxLength) {
    rules2.maxLength = maxLength;
  }

  rules2.validate =
    rules2.validate ||
    React.useCallback(
      async (items: Array<any>) => {
        const map = subForms.current;

        for (let key of Object.keys(map)) {
          const valid = await (function (methods) {
            return new Promise<boolean>(resolve => {
              methods.handleSubmit(
                () => resolve(true),
                () => resolve(false)
              )();
            });
          })(map[key]);

          if (!valid) {
            return __('validateFailed');
          }
        }
      },
      [subForms]
    );

  const {fields, append, update, remove} = useFieldArray({
    control,
    name: name,
    rules: rules2
  });

  if (!Array.isArray(columns)) {
    columns = [];
  }

  const {errors} = useFormState({
    control
  });

  function renderBody() {
    return (
      <div className={cx(`Table`, className)}>
        <div className={cx(`Table-contentWrap`)}>
          <table className={cx(`Table-table`)}>
            <thead>
              <tr>
                {columns.map((item, index) => (
                  <th key={index} className={item.className}>
                    {item.thRender ? item.thRender() : item.title}
                  </th>
                ))}
                <th key="operation">{__('Table.operation')}</th>
              </tr>
            </thead>
            <tbody>
              {fields.length ? (
                fields.map((field, index) => (
                  <tr key={field.id}>
                    <InputTableRow
                      key="columns"
                      control={control}
                      update={update}
                      index={index}
                      value={field}
                      columns={columns}
                      translate={__}
                      classnames={cx}
                      formRef={subFormRef}
                    />
                    <td key="operation">
                      <Button
                        level="link"
                        key="delete"
                        disabled={
                          removable === false ||
                          !!(minLength && fields.length <= minLength)
                        }
                        className={cx('Table-delBtn')}
                        onClick={() => remove(index)}
                      >
                        {__('delete')}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <Icon
                      icon="desk-empty"
                      className={cx('Table-placeholder-empty-icon', 'icon')}
                    />
                    {__('placeholder.noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {addable !== false && (!maxLength || fields.length < maxLength) ? (
          <div className={cx(`InputTable-toolbar`)}>
            <Button
              className={cx(addButtonClassName)}
              onClick={() => append({...scaffold})}
              size="sm"
            >
              <Icon icon="plus" className="icon" />
              <span>{__(addButtonText || 'add')}</span>
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return wrap === false ? (
    renderBody()
  ) : (
    <FormField
      className={fieldClassName}
      label={label}
      labelAlign={labelAlign}
      labelClassName={labelClassName}
      description={description}
      mode={mode}
      hasError={!!errors[name]?.message}
      errors={errors[name]?.message as any}
    >
      {renderBody()}
    </FormField>
  );
}

export interface InputTableRowProps {
  value: any;
  control: Control<any>;
  columns: Array<{
    tdRender: (methods: UseFormReturn, index: number) => JSX.Element | null;
    className?: string;
  }>;
  update: (index: number, data: Record<string, any>) => void;
  index: number;
  translate: TranslateFn;
  classnames: ClassNamesFn;
  formRef: (form: UseFormReturn | null, index: number) => void;
}

export function InputTableRow({
  value,
  columns,
  index,
  translate,
  update,
  formRef,
  classnames: cx
}: InputTableRowProps) {
  const methods = useSubForm(value, translate, data => update(index, data));
  React.useEffect(() => {
    formRef?.(methods, index);
    return () => {
      formRef?.(null, index);
    };
  }, [methods]);

  return (
    <>
      {columns.map((item, index) => (
        <td key={index} className={item.className}>
          {item.tdRender(methods, index)}
        </td>
      ))}
    </>
  );
}

export default themeable(localeable(InputTable));
