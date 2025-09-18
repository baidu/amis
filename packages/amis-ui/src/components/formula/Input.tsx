import React, {useEffect, useCallback} from 'react';
import moment from 'moment';
import pick from 'lodash/pick';
import {
  noop,
  themeable,
  ThemeProps,
  localeable,
  LocaleProps,
  uncontrollable,
  findTree,
  isExpression,
  isObject
} from 'amis-core';

import {FormulaEditor} from './Editor';
import ResultBox from '../ResultBox';
import {SelectWithRemoteOptions as Select} from '../Select';
import NumberInput from '../NumberInput';
import DatePicker from '../DatePicker';
import Tag from '../Tag';

import type {FormulaPickerInputSettings, FormulaPickerProps} from './Picker';
import CodeEditor, {FuncGroup, VariableItem} from './CodeEditor';
import InputBox from '../InputBox';
import omit from 'lodash/omit';

export interface FormulaInputProps
  extends Pick<
      FormulaPickerProps,
      | 'className'
      | 'disabled'
      | 'evalMode'
      | 'placeholder'
      | 'clearable'
      | 'borderMode'
      | 'variables'
      | 'inputSettings'
    >,
    ThemeProps,
    LocaleProps {
  /**
   * 输入值
   */
  value?: string;

  /**
   * 就是 evalMode 的反义词
   * 混合模式，意味着这个输入框既可以输入不同文本
   * 也可以输入公式。
   * 当输入公式时，值格式为 ${公式内容}
   * 其他内容当字符串。
   */
  mixedMode?: boolean;

  autoFocus?: boolean;

  variables?: VariableItem[];
  functions?: Array<FuncGroup>;

  popOverContainer?: any;

  /**
   * Change事件回调
   */
  onChange?: (value: string | any[]) => void;

  /**
   * 其他类型渲染器
   */
  customInputRender?: (props: {
    value: any;
    onChange: (value: any) => void;
    className?: string;
    inputSettings: FormulaPickerInputSettings;
  }) => JSX.Element;
}

const FormulaInput = (props: FormulaInputProps, ref: any) => {
  const {
    translate: __,
    className,
    classnames: cx,
    placeholder,
    borderMode,
    evalMode,
    mixedMode,
    value,
    variables,
    functions,
    inputSettings = {type: 'text'},
    popOverContainer,
    onChange,
    customInputRender
  } = props;
  const schemaType = inputSettings.type;
  /** 自上层共享的属性 */
  const sharedProps = pick(props, ['disabled', 'clearable', 'data']);
  const pipInValue = useCallback(
    (value?: any) => {
      /** 数据来源可能是从 query中下发的（CRUD查询表头），导致数字或者布尔值被转为 string 格式，这里预处理一下 */
      if (schemaType === 'number') {
        value = isNaN(+value) ? value : +value;
      } else if (schemaType === 'boolean') {
        value = value === 'true' ? true : value === 'false' ? false : value;
      }

      return value;
    },
    [schemaType]
  );
  const pipOutValue = useCallback(
    (origin: any) => {
      let result = origin;

      if (origin === undefined) {
        onChange?.(result);
        return;
      }

      if (schemaType === 'boolean') {
        result = origin.value;
      } else if (schemaType === 'select') {
        const {
          joinValues = true,
          extractValue,
          delimiter,
          multiple,
          valueField = 'value'
        } = inputSettings;

        if (joinValues) {
          if (multiple) {
            result = Array.isArray(origin)
              ? (origin.map(item => item[valueField]).join(delimiter) as string)
              : origin
              ? origin[valueField]
              : '';
          } else {
            result = origin ? origin[valueField] : '';
          }
        } else if (extractValue) {
          if (multiple) {
            result = Array.isArray(origin)
              ? origin.map(item => item[valueField])
              : origin
              ? [origin[valueField || 'value']]
              : [];
          } else {
            result = origin ? origin[valueField] : '';
          }
        }
      }
      onChange?.(result);
    },
    [schemaType, onChange, inputSettings]
  );

  let cmptValue = pipInValue(value ?? inputSettings.defaultValue);
  const isExpr = isExpression(cmptValue);

  if (!isExpr && schemaType === 'number') {
    return (
      <NumberInput
        {...sharedProps}
        className={cx(className, 'FormulaPicker-input-number')}
        borderMode="none"
        placeholder={__(placeholder ?? 'NumberInput.placeholder')}
        step={inputSettings.step}
        min={inputSettings.minimum}
        max={inputSettings.maximum}
        precision={inputSettings.precision}
        value={cmptValue}
        onChange={pipOutValue}
      />
    );
  } else if (!isExpr && schemaType === 'date') {
    return (
      <DatePicker
        {...sharedProps}
        className={cx(className, 'FormulaPicker-input-date')}
        borderMode="none"
        closeOnSelect={true}
        placeholder={__(placeholder ?? 'Date.placeholder')}
        format={inputSettings.format || 'YYYY-MM-DD'}
        inputFormat={inputSettings.inputFormat || 'YYYY-MM-DD'}
        timeFormat=""
        popOverContainer={popOverContainer}
        value={cmptValue}
        onChange={pipOutValue}
      />
    );
  } else if (!isExpr && schemaType === 'time') {
    return (
      <DatePicker
        {...sharedProps}
        className={cx(className, 'FormulaPicker-input-time')}
        viewMode="time"
        borderMode="none"
        closeOnSelect={true}
        placeholder={__(placeholder ?? 'Time.placeholder')}
        format={inputSettings.format || 'HH:mm'}
        inputFormat={inputSettings.inputFormat || 'HH:mm'}
        dateFormat=""
        timeFormat={inputSettings.format || 'HH:mm'}
        popOverContainer={popOverContainer}
        value={cmptValue}
        onChange={pipOutValue}
      />
    );
  } else if (!isExpr && schemaType === 'datetime') {
    return (
      <DatePicker
        {...sharedProps}
        className={cx(className, 'FormulaPicker-input-datetime')}
        borderMode="none"
        closeOnSelect={true}
        placeholder={__(placeholder ?? 'Time.placeholder')}
        format={inputSettings.format || ''}
        inputFormat={inputSettings.inputFormat || 'YYYY-MM-DD HH:mm'}
        timeFormat={inputSettings.timeFormat || 'HH:mm'}
        popOverContainer={popOverContainer}
        value={cmptValue}
        onChange={pipOutValue}
      />
    );
  } else if (!isExpr && (schemaType === 'select' || schemaType === 'boolean')) {
    return (
      <Select
        {...(sharedProps as any)}
        className={cx(className, `FormulaPicker-input-${schemaType}`)}
        borderMode="none"
        multiple={schemaType === 'boolean' ? false : inputSettings.multiple}
        options={
          schemaType === 'boolean'
            ? [
                {
                  label: __(inputSettings?.trueLabel ?? 'FormulaInput.True'),
                  value: true
                },
                {
                  label: __(inputSettings?.falseLabel ?? 'FormulaInput.False'),
                  value: false
                }
              ]
            : inputSettings.options ?? []
        }
        source={inputSettings.source}
        value={pipInValue(value)}
        renderValueLabel={option => {
          const label = option.label?.toString() ?? '';

          return schemaType === 'boolean' || !inputSettings.multiple ? (
            <Tag label={label} className={cx('rounded')} />
          ) : (
            <>{label}</>
          );
        }}
        onChange={pipOutValue}
      />
    );
  } else if (!isExpr && schemaType === 'custom' && customInputRender) {
    return customInputRender({
      value: cmptValue,
      onChange: pipOutValue,
      inputSettings,
      className: `FormulaPicker-input-custom`
    });
  } else if (
    !isExpr &&
    schemaType &&
    schemaType != 'text' &&
    customInputRender
  ) {
    return customInputRender({
      value: cmptValue,
      onChange: pipOutValue,
      inputSettings: {
        value: omit(inputSettings, [
          'label',
          'operators',
          'defaultOp',
          'defaultValue'
        ])
      } as any,
      className: `FormulaPicker-input-custom`
    });
  } else {
    return (
      <InputBox
        className={cx('FormulaPicker-input')}
        inputRender={({value, onChange, onFocus, onBlur, placeholder}: any) => (
          <CodeEditor
            singleLine
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            functions={functions}
            variables={variables}
            evalMode={evalMode}
            placeholder={placeholder}
          />
        )}
        borderMode={borderMode}
        value={cmptValue}
        onChange={pipOutValue}
        placeholder={__(placeholder ?? 'placeholder.enter')}
      />
    );
  }
};

export default themeable(
  localeable(
    uncontrollable(React.forwardRef(FormulaInput), {
      value: 'onChange'
    })
  )
);
