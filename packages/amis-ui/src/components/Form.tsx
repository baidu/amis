/**
 * @file 给组件用的，渲染器里面不要用这个
 */
import React from 'react';
import {noop, themeable, ThemeProps} from 'amis-core';
import {useForm, UseFormReturn, FormProvider} from 'react-hook-form';
import {useValidationResolver} from '../hooks/use-validation-resolver';
import {localeable, LocaleProps} from 'amis-core';
import debounce from 'lodash/debounce';
import {isObjectShallowModified} from 'amis-core';

export type FormRef = React.MutableRefObject<
  | {
      submit: () => void;
    }
  | undefined
>;

export interface FormProps extends ThemeProps, LocaleProps {
  defaultValue?: any;
  value?: any;
  autoSubmit?: boolean;
  onValidate?: (errors: any, values: any) => Promise<void>;
  onChange?: (value: any) => void;
  onSubmit?: (value: any) => void;
  forwardRef?: FormRef;
  children?: (
    methods: UseFormReturn & {
      onSubmit: (value: any) => void;
    }
  ) => JSX.Element | null;
  className?: string;
}

export function Form(props: FormProps) {
  const {classnames: cx, className, autoSubmit, value, onChange} = props;
  const defaultValues = props.value ?? props.defaultValue;
  const methods = useForm({
    defaultValues: defaultValues,
    resolver: useValidationResolver(props.translate, props.onValidate)
  });
  let onSubmit = React.useRef<(data: any) => void>(
    methods.handleSubmit(props.onSubmit || noop)
  );
  if (autoSubmit) {
    onSubmit = React.useRef(
      debounce(methods.handleSubmit(props.onSubmit || noop), 250, {
        leading: false,
        trailing: true
      })
    );

    React.useEffect(() => {
      const subscriber = methods.watch(onSubmit.current);
      return () => {
        subscriber.unsubscribe();
        // debounce 后需要销毁
        (onSubmit.current as any)?.cancel?.();
      };
    }, []);
  }
  React.useEffect(() => {
    if (value && isObjectShallowModified(value, methods.getValues(), false)) {
      Object.keys(value).forEach(key => {
        methods.setValue(key, value[key]);
      });
    }
  }, [value]);
  if (onChange) {
    React.useEffect(() => {
      const subscriber = methods.watch((value, info) => {
        onChange({...defaultValues, ...value});
      });
      return () => subscriber.unsubscribe();
    }, [onChange]);
  }

  React.useImperativeHandle(
    props.forwardRef,
    () => {
      return {
        submit: () =>
          new Promise<any>(resolve => {
            methods.handleSubmit(
              values => {
                props.onSubmit?.(values);
                resolve(values);
              },
              e => resolve(e.customValidate?.message || false)
            )();
          }),
        validate: () =>
          new Promise<any>(resolve => {
            methods.handleSubmit(
              () => {
                resolve('');
              },
              e =>
                resolve(
                  e.customValidate?.message ||
                    props.translate('Form.validateFailed')
                )
            )();
          })
      };
    },
    []
  );

  return (
    <FormProvider {...methods}>
      <form
        className={cx('Form', className)}
        onSubmit={onSubmit.current}
        noValidate
      >
        {/* 实现回车自动提交 */}
        <input type="submit" style={{display: 'none'}} />
        {props.children?.({
          ...methods,
          onSubmit: onSubmit.current
        })}
      </form>
    </FormProvider>
  );
}

const ThemedForm = themeable(localeable(Form));
type ThemedFormProps = Omit<
  JSX.LibraryManagedAttributes<
    typeof ThemedForm,
    React.ComponentProps<typeof ThemedForm>
  >,
  'children'
> &
  Pick<FormProps, 'children'>;

export default React.forwardRef((props: ThemedFormProps, ref: FormRef) => (
  <ThemedForm {...props} forwardRef={ref} />
));
