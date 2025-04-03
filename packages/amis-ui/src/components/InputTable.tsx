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
  useFormContext,
  UseFormReturn,
  useFormState
} from 'react-hook-form';
import useSubForm from '../hooks/use-sub-form';
import Button from './Button';
import FormField, {FormFieldProps} from './FormField';
import {Icon} from './icons';

import type {ButtonProps} from './Button';

export interface tdRenderFunc {
  (
    methods: UseFormReturn & {
      popOverContainer?: any;
    },
    colIndex: number,
    rowIndex: number
  ): JSX.Element | null;
}

export interface InputTableColumnProps {
  title?: string;
  className?: string;
  thRender?: () => JSX.Element;
  tdRender: tdRenderFunc;
}

interface InputTableScrollProps {
  /** 垂直滚动区域的最大高度 */
  y: number | string;
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
  addButtonProps?: Partial<Omit<ButtonProps, 'onClick'>>;

  maxLength?: number;
  minLength?: number;
  removable?: boolean;
  /** 表格CSS类名 */
  tableClassName?: string;
  /** 表格头CSS类名 */
  tableHeadClassName?: string;
  /** 表格内容区CSS类名 */
  tableBodyClassName?: string;
  /** 空状态文字 */
  placeholder?: React.ReactNode;
  /** 滚动设置 */
  scroll?: InputTableScrollProps;
  /** 底部工具栏 */
  footer?: () => React.ReactNode;
  onItemAdd?: (values: Record<string, any>) => void;
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
  addButtonProps,
  scaffold,
  minLength,
  maxLength,
  isRequired,
  rules,
  tableClassName,
  tableHeadClassName,
  tableBodyClassName,
  placeholder,
  scroll,
  footer,
  onItemAdd
}: InputTabbleProps) {
  const enableScroll = scroll?.y != null;
  const tBodyRef = React.useRef<HTMLTableElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const subForms = React.useRef<Record<any, UseFormReturn>>({});
  const subFormRef = React.useCallback(
    (subform: UseFormReturn | null, id: string) => {
      if (subform) {
        subForms.current[id] = subform;
      } else {
        delete subForms.current[id];
      }
    },
    [subForms]
  );
  const popOverContainer = React.useCallback(() => {
    return tBodyRef.current;
  }, [tBodyRef]);
  let finalRules: any = {...rules};

  if (isRequired) {
    finalRules.required = true;
  }

  if (minLength) {
    finalRules.minLength = minLength;
  }

  if (maxLength) {
    finalRules.maxLength = maxLength;
  }

  finalRules.validate = React.useCallback(
    async (items: Array<any>) => {
      const map = subForms.current;

      if (typeof rules?.validate === 'function') {
        const result = await rules.validate(items);
        if (result) {
          return result;
        }
      }

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
    rules: finalRules
  });

  if (!Array.isArray(columns)) {
    columns = [];
  }

  const {errors} = useFormState({
    control
  });

  const {trigger, setValue} = useFormContext();

  // useFieldArray 的 update 会更新行 id，导致重新渲染
  // 正在编辑中的元素失去焦点，所以自己写一个
  const lightUpdate = React.useCallback(
    (index: number, value: any) => {
      // const arr = control._getFieldArray(name);
      // arr[index] = {...value};
      // control._updateFieldArray(name, arr);
      // trigger(name);
      // control._subjects.watch.next({});
      setValue(`${name}.${index}`, value);
    },
    [control]
  );

  function renderBody() {
    const handleItemAdd = () => {
      const values = {...scaffold};
      append(values);

      /** 开启滚动后新增元素定位到底部 */
      if (enableScroll && tableRef) {
        requestAnimationFrame(() => {
          tableRef?.current?.scrollIntoView?.({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        });
      }

      onItemAdd?.(values);
    };

    return (
      <div className={cx(`Table`, `InputTable-UI`, className)}>
        <div
          className={cx(`Table-contentWrap`, {'is-fixed': enableScroll})}
          style={{maxHeight: enableScroll ? scroll.y : 'unset'}}
          ref={tBodyRef}
        >
          <div className={cx('Table-content')}>
            <table className={cx(`Table-table`, tableClassName)} ref={tableRef}>
              <thead className={cx(tableHeadClassName)}>
                <tr>
                  {columns.map((item, index) => (
                    <th key={index} className={item.className}>
                      {item.thRender ? item.thRender() : item.title}
                    </th>
                  ))}
                  <th key="operation">{__('Table.operation')}</th>
                </tr>
              </thead>
              <tbody className={cx(tableBodyClassName)}>
                {fields.length ? (
                  fields.map((field, index) => (
                    <tr key={field.id}>
                      <InputTableRow
                        key="columns"
                        control={control}
                        update={lightUpdate}
                        index={index}
                        value={field}
                        columns={columns}
                        translate={__}
                        classnames={cx}
                        formRef={subFormRef}
                        popOverContainer={popOverContainer}
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
                      {placeholder ?? __('placeholder.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {addable !== false && (!maxLength || fields.length < maxLength) ? (
          <div className={cx(`InputTable-toolbar`)}>
            <Button
              className={cx(addButtonClassName)}
              size="sm"
              {...addButtonProps}
              onClick={() => handleItemAdd()}
            >
              <Icon icon="plus" className="icon" />
              <span>{__(addButtonText || 'add')}</span>
            </Button>
            {footer?.()}
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
    tdRender: tdRenderFunc;
    className?: string;
  }>;
  update: (index: number, data: Record<string, any>) => void;
  index: number;
  translate: TranslateFn;
  classnames: ClassNamesFn;
  formRef: (form: UseFormReturn | null, id: string) => void;
  popOverContainer?: any;
}

export const InputTableRow = React.memo(function InputTableRow({
  value,
  columns,
  index,
  translate,
  update,
  formRef,
  classnames: cx,
  popOverContainer
}: InputTableRowProps) {
  const indexRef = React.useRef(index);
  React.useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const methods = useSubForm(value, translate, (data: any) =>
    update(indexRef.current!, data)
  );
  React.useEffect(() => {
    formRef?.(methods, value.id);
    return () => {
      formRef?.(null, value.id);
    };
  }, [methods, value.id]);

  return (
    <>
      {columns.map((item, colIndex) => (
        <td key={colIndex} className={item.className}>
          {item.tdRender(
            {
              ...methods,
              popOverContainer
            },
            colIndex,
            index
          )}
        </td>
      ))}
    </>
  );
});

export default themeable(localeable(InputTable));
