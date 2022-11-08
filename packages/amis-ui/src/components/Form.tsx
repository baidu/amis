/**
 * @file 给组件用的，渲染器里面不要用这个
 */
import React from 'react';
import {noop, themeable, ThemeProps} from 'amis-core';
import {useForm, UseFormReturn} from 'react-hook-form';
import {useValidationResolver} from '../hooks/use-validation-resolver';
import {localeable, LocaleProps} from 'amis-core';
import debounce from 'lodash/debounce';

export type FormRef = React.MutableRefObject<
  | {
      submit: () => void;
    }
  | undefined
>;

export interface FormProps extends ThemeProps, LocaleProps {
  defaultValues?: any;
  autoSubmit?: boolean;
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
  const {classnames: cx, className, autoSubmit} = props;
  const methods = useForm({
    defaultValues: props.defaultValues,
    resolver: useValidationResolver(props.translate)
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
    if (props.forwardRef) {
      // 这个模式别的组件没见到过不知道后续会不会不允许
      props.forwardRef.current = {
        submit: () =>
          new Promise<any>(resolve => {
            methods.handleSubmit(
              values => {
                props.onSubmit?.(values);
                resolve(values);
              },
              () => resolve(false)
            )();
          })
      };
    }

    return () => {
      if (props.forwardRef) {
        props.forwardRef.current = undefined;
      }
    };
  });

  return (
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
