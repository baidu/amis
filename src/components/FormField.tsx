/**
 * @file 给组件用的，渲染器里面不要用这个
 */
import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {
  ControllerProps as ReactHookFormControllerProps,
  Controller as ReactHookFormController
} from 'react-hook-form';

export interface FormFieldProps extends ThemeProps {
  mode?: 'normal' | 'horizontal';
  horizontal?: {
    left?: number;
    right?: number;
    leftFixed?: boolean | number | 'xs' | 'sm' | 'md' | 'lg';
    justify?: boolean; // 两端对齐
  };
  label?: string;
  description?: string;
  isRequired?: boolean;
  hasError?: boolean;
  errors?: string | Array<string>;
  children?: JSX.Element;
}

function FormField(props: FormFieldProps) {
  const {
    mode,
    children,
    classnames: cx,
    className,
    hasError,
    isRequired,
    label,
    description
  } = props;

  const errors = Array.isArray(props.errors)
    ? props.errors
    : props.errors
    ? [props.errors]
    : [];

  if (mode === 'horizontal') {
  }

  return (
    <div
      data-role="form-item"
      className={cx(`Form-item Form-item--normal`, className, {
        'is-error': hasError,
        [`is-required`]: isRequired
      })}
    >
      {label ? (
        <label className={cx(`Form-label`)}>
          <span>
            {label}
            {isRequired && label ? (
              <span className={cx(`Form-star`)}>*</span>
            ) : null}
          </span>
        </label>
      ) : null}
      {children}

      {hasError && errors.length ? (
        <ul className={cx(`Form-feedback`)}>
          {errors.map((msg: string, key: number) => (
            <li key={key}>{msg}</li>
          ))}
        </ul>
      ) : null}

      {description ? (
        <div className={cx(`Form-description`)}>{description}</div>
      ) : null}
    </div>
  );
}

const ThemedFormField = themeable(FormField);

export default ThemedFormField;

export interface ControllerProps
  extends ReactHookFormControllerProps,
    Omit<FormFieldProps, keyof ThemeProps> {}
export function Controller(props: ControllerProps) {
  const {
    render,
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    ...rest
  } = props;

  return (
    <ReactHookFormController
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      control={control}
      render={methods => (
        <ThemedFormField {...rest}>{render(methods)}</ThemedFormField>
      )}
    />
  );
}
