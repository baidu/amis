/**
 * @file 给组件用的，渲染器里面不要用这个
 */
import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {useForm, UseFormReturn} from 'react-hook-form';
import {useValidationResolver} from '../hooks/use-validation-resolver';
import {localeable, LocaleProps} from 'amis-core';

export type FormRef = React.MutableRefObject<
  | {
      submit: () => void;
    }
  | undefined
>;

export interface FormProps extends ThemeProps, LocaleProps {
  defaultValues: any;
  onSubmit: (value: any) => void;
  forwardRef?: FormRef;
  children?: (methods: UseFormReturn) => JSX.Element | null;
  className?: string;
}

export function Form(props: FormProps) {
  const {classnames: cx, className} = props;
  const methods = useForm({
    defaultValues: props.defaultValues,
    resolver: useValidationResolver(props.translate)
  });

  React.useEffect(() => {
    if (props.forwardRef) {
      // 这个模式别的组件没见到过不知道后续会不会不允许
      props.forwardRef.current = {
        submit: () =>
          new Promise<any>((resolve, reject) => {
            methods.handleSubmit(
              values => resolve(values),
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
      onSubmit={methods.handleSubmit(props.onSubmit)}
      noValidate
    >
      {/* 实现回车自动提交 */}
      <input type="submit" style={{display: 'none'}} />
      {props.children?.(methods)}
    </form>
  );
}

const ThemedForm = themeable(localeable(Form));
type ThemedFormProps = Omit<FormProps, keyof ThemeProps | keyof LocaleProps>;

export default React.forwardRef((props: ThemedFormProps, ref: FormRef) => (
  <ThemedForm {...props} forwardRef={ref} />
));
