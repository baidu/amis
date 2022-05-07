/**
 * @file 给组件用的，渲染器里面不要用这个
 */
import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {useForm, UseFormReturn} from 'react-hook-form';

export type FormRef = React.MutableRefObject<
  | {
      submit: () => void;
    }
  | undefined
>;

export interface FormProps extends ThemeProps {
  defaultValues: any;
  onSubmit: (value: any) => void;
  forwardRef?: FormRef;
  children?: (methods: UseFormReturn) => JSX.Element | null;
}

export function Form(props: FormProps) {
  const {classnames: cx} = props;
  const methods = useForm({defaultValues: props.defaultValues});

  React.useEffect(() => {
    if (props.forwardRef) {
      props.forwardRef.current = {
        submit: () =>
          new Promise<any>((resolve, reject) => {
            methods.handleSubmit(
              values => {
                resolve(values);
              },
              () => {
                resolve(false);
              }
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
      className={cx('Form')}
      onSubmit={methods.handleSubmit(props.onSubmit)}
      noValidate
    >
      {/* 实现回车自动提交 */}
      <input type="submit" style={{display: 'none'}} />
      {props.children?.(methods)}
    </form>
  );
}

const ThemedForm = themeable(Form);
type ThemedFormProps = Omit<FormProps, keyof ThemeProps>;

export default React.forwardRef((props: ThemedFormProps, ref: FormRef) => (
  <ThemedForm {...props} forwardRef={ref} />
));
