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
  UseFormReturn
} from 'react-hook-form';
import useSubForm from '../hooks/use-sub-form';
import Button from './Button';
import FormField, {FormFieldProps} from './FormField';
import {Icon} from './icons';

export interface InputTabbleProps<T = any>
  extends ThemeProps,
    LocaleProps,
    Omit<
      FormFieldProps,
      'children' | 'errors' | 'hasError' | 'isRequired' | 'className'
    >,
    UseFieldArrayProps {
  control: Control<any>;
  fieldClassName?: string;

  columns: Array<{
    title?: string;
    className?: string;
    thRender?: () => JSX.Element;
    tdRender: (methods: UseFormReturn, index: number) => JSX.Element | null;
  }>;

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
  maxLength
}: InputTabbleProps) {
  const {fields, append, update, remove} = useFieldArray({
    control,
    name: name
  });

  if (!Array.isArray(columns)) {
    columns = [];
  }

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
                    />
                    <td key="operation">
                      <Button
                        level="link"
                        key="delete"
                        className={cx(
                          `Table-delBtn ${
                            removable === false ||
                            (minLength && fields.length <= minLength)
                              ? 'is-disabled'
                              : ''
                          }`
                        )}
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
      hasError={false /*目前看来不支持，后续研究一下 */}
      errors={undefined /*目前看来不支持，后续研究一下 */}
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
}

export function InputTableRow({
  value,
  columns,
  index,
  translate,
  update,
  classnames: cx
}: InputTableRowProps) {
  const methods = useSubForm(value, translate, data => update(index, data));

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
