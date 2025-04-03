/**
 * @file VerificationCode
 */
import React, {
  ClipboardEvent,
  useEffect,
  useMemo,
  ComponentState,
  PropsWithoutRef,
  useRef,
  useState
} from 'react';
import {themeable, ThemeProps} from 'amis-core';
import InputComponent from './Input';
import isEqualWith from 'lodash/isEqualWith';

const defaultLength = 6;

/**
 * VerificationCodeOptions
 *
 */
export interface VerificationCodeOptions {
  /**
   * 长度
   */
  length?: number;
  /**
   * value
   */
  value?: string;
  /**
   * onChange
   */
  onChange?: (value: string) => void;
  /**
   * onFinish
   */
  onFinish?: (value: string) => void;
  /**
   * input list
   */
  getInputRefList?: () => HTMLInputElement[];
}

/**
 *  VerificationCodeReturnType
 */
export type VerificationCodeReturnType = {
  filledValue: VerificationCodeOptions['value'][];
  value: VerificationCodeOptions['value'];
  setValue: (v: VerificationCodeOptions['value']) => void;
  getInputProps: (index: number) => {
    key: string | number;
    value: string;
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange: (v: string | React.ChangeEvent<HTMLInputElement>) => void;
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  };
};

export interface VerificationCodeProps extends ThemeProps {
  value?: string;
  length?: number;
  /**
   * 是否是密码模式
   */
  masked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /**
   * 分隔符
   */
  separator?: (data: {index: number; character: string}) => React.ReactNode;
  onChange?: (value: string) => void;
  /**
   * 输入框都被填充后触发的回调
   */
  onFinish?: (value: string) => void;
}

export function isExist(obj: any): boolean {
  return obj || obj === 0;
}

export const Backspace = {
  key: 'Backspace',
  code: 8
};

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function usePrevious<T>(value: PropsWithoutRef<T> | ComponentState) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useMergeValue<T>(
  defaultStateValue: T,
  props?: {
    value?: T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>, T] {
  const {value} = props || {};
  const firstRenderRef = useRef(true);
  const prevPropsValue = usePrevious(value);

  const [stateValue, setStateValue] = useState<T>(
    !isUndefined(value) ? value : defaultStateValue
  );

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (value === undefined && prevPropsValue !== value) {
      setStateValue(value);
    }
  }, [value]);

  const mergedValue = isUndefined(value) ? stateValue : value;

  return [mergedValue, setStateValue, stateValue];
}

export function useVerificationCode(
  props: VerificationCodeOptions
): VerificationCodeReturnType {
  const [value, setValue] = useMergeValue('', props);

  const length = props.length
    ? +props.length > 0
      ? +props.length
      : defaultLength
    : defaultLength;

  const filledValue: string[] = useMemo(() => {
    const newVal = value ? String(value).split('') : [];
    return new Array(length).fill('').map((_, index) => {
      return isExist(newVal[index]) ? String(newVal[index]) : '';
    }) as string[];
  }, [value, length]);

  const focusFirstEmptyInput = () => {
    const nodeList = props.getInputRefList?.() || [];

    // 焦点的元素
    if (nodeList?.indexOf(document.activeElement as any) === -1) {
      return;
    }

    const index = filledValue.findIndex(x => !x);

    if (index > -1) {
      const realIndex = Math.min(index, nodeList.length - 1);

      nodeList[realIndex]?.focus?.();
    }
  };

  useEffect(() => {
    focusFirstEmptyInput();
    if (filledValue.length === length && filledValue.every(item => !!item)) {
      const nodeList = props.getInputRefList?.() || [];
      nodeList[nodeList.length - 1]?.blur?.();
    }
  }, [JSON.stringify(filledValue)]);

  const tryUpdateValue = (newVal: string) => {
    if (!isEqualWith(newVal, value)) {
      setValue(newVal);

      props.onChange?.(newVal);

      if (newVal.length === length) {
        props.onFinish?.(newVal);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent, index: number) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData('text');
    if (text) {
      tryUpdateValue(
        filledValue.slice(0, index).concat(text.split('')).join('')
      );
    }
  };

  return {
    value,
    filledValue,
    setValue: tryUpdateValue,
    getInputProps: index => {
      const indexVal = String(filledValue[index]);
      return {
        key: index,
        value: indexVal,
        onClick: e => {
          e.preventDefault();
          if (!filledValue[index]) {
            focusFirstEmptyInput();
          }
        },
        onKeyDown: e => {
          const keyCode = e.key;
          if (keyCode === Backspace.key) {
            if (filledValue[index + 1]) {
              e.preventDefault();
              return;
            }
            let _index = index;
            if (!filledValue[index]) {
              _index -= 1;
            }
            const newVal = [...filledValue];
            newVal[_index] = '';
            tryUpdateValue(newVal.join(''));
          }
        },
        onChange: (v: string) => {
          const char = v?.trim() || '';
          const newVal = [...filledValue];
          newVal[index] = char.replace(indexVal, '').split('').pop() || '';

          tryUpdateValue(newVal.join(''));
        },
        onPaste: (e: ClipboardEvent) => {
          handlePaste(e, index);
        }
      };
    }
  };
}

export function VerificationCodeComponent(baseProps: VerificationCodeProps) {
  const props = {length: defaultLength, ...baseProps};

  const {
    separator,
    length,
    masked,
    disabled,
    readOnly,
    classnames: cx,
    onChange,
    onFinish,
    value: propsValue,
    style
  } = props;

  const focusEleRefList: {current: HTMLInputElement[]} = React.useRef([]);

  const {filledValue, getInputProps} = useVerificationCode({
    value: propsValue,
    length,
    getInputRefList: () => focusEleRefList.current,
    onChange,
    onFinish
  });

  return (
    <div className={cx('Verification-code')} style={style}>
      {filledValue.map((v, index) => {
        const {
          onChange: InputChange,
          onClick,
          onPaste,
          onKeyDown,
          ...restInputProps
        } = getInputProps(index);
        return (
          <React.Fragment key={index}>
            <InputComponent
              disabled={disabled}
              readOnly={readOnly}
              ref={(node: HTMLInputElement) =>
                (focusEleRefList.current[index] = node)
              }
              className={cx({
                'is-disabled': !!disabled
              })}
              {...restInputProps}
              onClick={!readOnly ? onClick : undefined}
              onPaste={!readOnly ? onPaste : undefined}
              onKeyDown={!readOnly ? onKeyDown : undefined}
              onChange={
                !readOnly
                  ? (e: React.ChangeEvent<HTMLInputElement>) => {
                      const inputValue = (e.target.value || '').trim();

                      InputChange(inputValue);
                    }
                  : undefined
              }
              type={masked ? 'password' : 'text'}
            />
            {separator?.({index, character: v!})}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default themeable(VerificationCodeComponent);
