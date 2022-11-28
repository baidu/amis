/**
 * 纯组件版本的 combo 实现
 *
 * 只能用在 <Form> 里面。
 *
 * 示例:
 *
 * <Form
 *   defaultValues={{a: 1, b: 2, arr: [{a: 1, b: 2}]}}
 *   onSubmit={values => console.log(values)}
 * >
 *   {({control, getValues, setValue, handleSubmit}) => (
 *     <>
 *       <Combo
 *         name="arr"
 *         control={control}
 *         label="Combo"
 *         mode="horizontal"
 *         itemRender={({
 *           control,
 *           getValues,
 *           setValue,
 *           handleSubmit
 *         }) => (
 *           <>
 *             <Controller
 *               name="a"
 *               label="A"
 *               mode="horizontal"
 *               horizontal={{justify: true}}
 *               control={control}
 *               rules={{maxLength: 20}}
 *               render={({field, fieldState}) => (
 *                 <InputBox
 *                   {...field}
 *                   hasError={fieldState.error}
 *                   disabled={false}
 *                 />
 *               )}
 *             />
 *
 *             <Controller
 *               name="b"
 *               control={control}
 *               rules={{maxLength: 20}}
 *               render={({field, fieldState}) => (
 *                 <InputBox
 *                   {...field}
 *                   hasError={fieldState.error}
 *                   disabled={false}
 *                 />
 *               )}
 *             />
 *           </>
 *         )}
 *       />
 *     </>
 *   )}
 * </Form>
 */

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
  RegisterOptions,
  useFieldArray,
  UseFieldArrayProps,
  UseFormReturn
} from 'react-hook-form';
import useSubForm from '../hooks/use-sub-form';
import Button from './Button';
import FormField, {FormFieldProps} from './FormField';
import {Icon} from './icons';

export interface ComboProps<T = any>
  extends ThemeProps,
    LocaleProps,
    Omit<FormFieldProps, 'children' | 'errors' | 'hasError' | 'className'>,
    UseFieldArrayProps {
  itemRender: (methods: UseFormReturn, index: number) => JSX.Element | null;
  control: Control<any>;
  fieldClassName?: string;

  rules?: Omit<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  > & {
    [propName: string]: any;
  };

  /**
   * 要不要包裹 label 之类的
   */
  wrap?: boolean;

  /**
   * 是否多行模式
   */
  multiLine?: boolean;

  itemsWrapperClassName?: string;
  itemClassName?: string;

  scaffold?: Record<string, any>;
  addButtonClassName?: string;
  addButtonText?: string;
  addable?: boolean;
  // draggable?: boolean;
  // draggableTip?: string;
  maxLength?: number;
  minLength?: number;
  removable?: boolean;
}

export function Combo({
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
  multiLine,
  itemsWrapperClassName,
  itemClassName,
  addButtonClassName,
  itemRender,
  translate: __,
  classnames: cx,
  addable,
  scaffold,
  addButtonText,
  removable,
  rules,
  isRequired,
  minLength,
  maxLength
}: ComboProps) {
  // 看文档是支持的，但是传入报错，后面看看
  // let rules2: any = {...rules};

  // if (isRequired) {
  //   rules2.required = true;
  // }
  const {fields, append, update, remove} = useFieldArray({
    control,
    name: name,
    shouldUnregister: true
    // rules: rules2
  });

  function renderBody() {
    return (
      <div
        className={cx(
          `Combo Combo--multi`,
          className,
          multiLine ? `Combo--ver` : `Combo--hor`
        )}
      >
        <div className={cx(`Combo-items`, itemsWrapperClassName)}>
          {fields.map((field, index) => (
            <div key={field.id} className={cx(`Combo-item`, itemClassName)}>
              <ComboItem
                control={control}
                update={update}
                index={index}
                value={field}
                itemRender={itemRender}
                translate={__}
                classnames={cx}
              />
              <a
                onClick={() => remove(index)}
                key="delete"
                className={cx(
                  `Combo-delBtn ${
                    removable === false ||
                    (minLength && fields.length <= minLength)
                      ? 'is-disabled'
                      : ''
                  }`
                )}
                data-tooltip={__('delete')}
                data-position="bottom"
              >
                <Icon icon="status-close" className="icon" />
              </a>
            </div>
          ))}
        </div>
        {addable !== false && (!maxLength || fields.length < maxLength) ? (
          <div className={cx(`Combo-toolbar`)}>
            <Button
              className={cx(`Combo-addBtn`, addButtonClassName)}
              onClick={() => append({...scaffold})}
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
      isRequired={isRequired}
      hasError={false /*目前看来不支持，后续研究一下 */}
      errors={undefined /*目前看来不支持，后续研究一下 */}
    >
      {renderBody()}
    </FormField>
  );
}

export interface ComboItemProps {
  value: any;
  control: Control<any>;
  itemRender: (methods: UseFormReturn, index: number) => JSX.Element | null;
  update: (index: number, data: Record<string, any>) => void;
  index: number;
  translate: TranslateFn;
  classnames: ClassNamesFn;
}

export function ComboItem({
  value,
  itemRender,
  index,
  translate,
  update,
  classnames: cx
}: ComboItemProps) {
  const methods = useSubForm(value, translate, data => update(index, data));

  let child: any = itemRender(methods, index);
  if (child?.type === React.Fragment) {
    child = child.props.children;
  }
  if (Array.isArray(child)) {
    child = (
      <div className={cx('Form-row')}>
        {child.map((child, index) => (
          <div className={cx('Form-col')} key={child.key || index}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  return <div className={cx('Combo-itemInner')}>{child}</div>;
}

export default themeable(localeable(Combo));
