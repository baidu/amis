import React from 'react';
import {ThemeProps, themeable} from 'amis-core';
import FieldValue from './condition-builder/Value';
import {FieldSimple} from './condition-builder/types';
import Select from './Select';

interface MixedInputProps extends ThemeProps {
  // 预留给渲染器的，如果后面要添加到渲染器里面
  renderInput?: (schema: any, props: any) => React.ReactNode;

  value?: any;
  onChange?: (value: any) => void;

  // 可以根据需要添加属性
  methods: Array<{
    label: string;
    value?: any;
    test?: (value: any, defaultMethod?: any) => boolean;
    convert?: (value: any, raw: any) => any;
    pipeIn?: (value: any) => any;
    pipeOut?: (value: any) => any;
    type?:
      | 'text'
      | 'number'
      | 'date'
      | 'time'
      | 'datetime'
      | 'select'
      | 'custom'
      | 'boolean'
      | string;
    inputSettings?: any;
  }>;

  disabled?: boolean;
  hasError?: boolean;

  popOverContainer?: any;
}

const MixedInput: React.FC<MixedInputProps> = ({
  value,
  onChange,
  methods,
  hasError,
  disabled,
  classnames: cx,
  className,
  style,
  popOverContainer
}) => {
  const [focused, setFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);
  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  const [defaultMethod, setDefaultMethod] = React.useState<any>(null);
  const method = React.useMemo(() => {
    if (!Array.isArray(methods) || !methods.length) {
      return null;
    }
    return (
      methods.find(m => m.test && m.test(value, defaultMethod)) ||
      defaultMethod ||
      methods[0]
    );
  }, [value, methods, defaultMethod]);
  const options = React.useMemo(() => {
    return methods.map(m => ({
      label: m.label,
      value: m.value ?? m.label
    }));
  }, [methods]);
  const methodChange = React.useCallback(
    (methodType: any) => {
      const newMethod = methods.find(m => (m.value ?? m.label) === methodType);
      if (!newMethod) {
        return;
      }
      if (newMethod.convert) {
        // 如果有转换方法，先转换一下
        value = newMethod.convert(
          method?.pipeIn ? method.pipeIn(value) : value,
          value
        );
      } else {
        value = method?.pipeIn ? method.pipeIn(value) : value; // 如果有转换方法，先转换一下
      }

      setDefaultMethod(newMethod);
      onChange?.(newMethod.pipeOut ? newMethod.pipeOut(value) : value);
    },
    [methods, method, value]
  );
  const inputValue = React.useMemo(() => {
    if (!method) {
      return value;
    }
    return method.pipeIn ? method.pipeIn(value) : value;
  }, [value, method]);
  const inputOnChange = React.useCallback(
    (newValue: any) => {
      if (method && method.pipeOut) {
        newValue = method.pipeOut(newValue);
      }
      onChange?.(newValue);
    },
    [method]
  );
  const field = React.useMemo((): FieldSimple => {
    if (!method) {
      return {
        type: 'text',
        label: 'whatever',
        name: 'whatever'
      };
    }
    return {
      ...method.inputSettings,
      name: 'whatever',
      type: (method.type || 'text') as 'text',
      label: method.label
    };
  }, [method]);

  return (
    <div
      style={style}
      className={cx(`InputGroup MixedInput`, className, {
        'is-focused': focused,
        'is-error': hasError,
        'is-disabled': disabled
      })}
    >
      <FieldValue
        className="MixedInput-input"
        disabled={disabled}
        field={field}
        value={inputValue}
        onChange={inputOnChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className={cx('MixedInput-select')}>
        <Select
          className={cx('MixedInput-select')}
          value={method ? method.value ?? method.label : ''}
          options={options}
          disabled={disabled}
          simpleValue
          onChange={methodChange}
          clearable={false}
          popOverContainer={popOverContainer}
        />
      </div>
    </div>
  );
};

export default themeable(MixedInput);
