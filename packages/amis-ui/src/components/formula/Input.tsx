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

import {FormulaEditor, VariableItem} from './Editor';
import ResultBox from '../ResultBox';
import Select from '../Select';
import NumberInput from '../NumberInput';
import DatePicker from '../DatePicker';
import Tag from '../Tag';

import type {FormulaPickerProps} from './Picker';

export interface FormulaInputProps
  extends Pick<
      FormulaPickerProps,
      | 'className'
      | 'disabled'
      | 'evalMode'
      | 'allowInput'
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

  mixedMode?: boolean;

  variables?: VariableItem[];

  popOverContainer?: any;

  /**
   * Change事件回调
   */
  onChange?: (value: string | any[]) => void;

  /**
   * 子元素渲染
   */
  itemRender?: (value: any) => JSX.Element | string;
}

const FormulaInput: React.FC<FormulaInputProps> = props => {
  const {
    translate: __,
    className,
    classnames: cx,
    allowInput,
    placeholder,
    borderMode,
    evalMode,
    mixedMode,
    value,
    variables,
    inputSettings = {type: 'text'},
    popOverContainer,
    onChange,
    itemRender
  } = props;
  const schemaType = inputSettings.type;
  /** 自上层共享的属性 */
  const sharedProps = pick(props, ['disabled', 'clearable']);
  const pipInValue = useCallback(
    (value?: any) => {
      return value;
    },
    ['value']
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
          joinValues,
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
    ['onChange']
  );

  let cmptValue = pipInValue(value ?? inputSettings.defaultValue);

  /** 数据来源可能是从 query中下发的（CRUD查询表头），导致数字或者布尔值被转为 string 格式，这里预处理一下 */
  if (schemaType === 'number') {
    cmptValue = isNaN(+cmptValue) ? cmptValue : +cmptValue;
  } else if (schemaType === 'boolean') {
    cmptValue =
      cmptValue === 'true' ? true : cmptValue === 'false' ? false : cmptValue;
  }

  const targetVariable =
    variables && cmptValue != null && typeof cmptValue === 'string'
      ? findTree(variables, item => {
          return mixedMode
            ? cmptValue.replace(/^\$\{/, '').replace(/\}$/, '') === item?.value
            : cmptValue === item?.value;
        })
      : null;
  let useVariable = !!(isExpression(cmptValue) || targetVariable);

  /** 判断value是否为变量，如果是变量，使用ResultBox渲染 */
  if (!useVariable) {
    if (schemaType === 'number') {
      useVariable = cmptValue != null && typeof cmptValue !== 'number';
    } else if (['date', 'time', 'datetime'].includes(schemaType)) {
      useVariable = !moment(cmptValue).isValid();
    } else if (schemaType === 'select') {
      const {
        options,
        joinValues,
        extractValue,
        delimiter,
        multiple,
        valueField = 'value'
      } = inputSettings;
      let selctedValue: any[] = [];

      if (multiple) {
        if (joinValues) {
          selctedValue =
            typeof cmptValue === 'string' ? cmptValue.split(delimiter) : [];
        } else {
          selctedValue = Array.isArray(cmptValue)
            ? extractValue
              ? cmptValue
              : cmptValue.map(i => i?.[valueField])
            : [];
        }
      } else {
        if (joinValues) {
          selctedValue = typeof cmptValue === 'string' ? [cmptValue] : [];
        } else {
          selctedValue = isObject(cmptValue) ? [cmptValue?.[valueField]] : [];
        }
      }

      /** 选项类型清空后是空字符串， */
      useVariable =
        cmptValue &&
        !(options ?? []).some((item: any) =>
          selctedValue.includes(item?.value)
        );
    } else if (schemaType === 'boolean') {
      useVariable = cmptValue != null && typeof cmptValue !== 'boolean';
    }
  }

  if (useVariable) {
    const varName =
      typeof cmptValue === 'string' && cmptValue && mixedMode
        ? cmptValue.replace(/^\$\{/, '').replace(/\}$/, '')
        : cmptValue;
    const resultValue = targetVariable?.value ?? varName;

    return (
      <ResultBox
        className={cx(`FormulaPicker-input-variable`)}
        allowInput={allowInput}
        // value={resultValue}
        result={
          resultValue == null
            ? void 0
            : FormulaEditor.highlightValue(resultValue, variables!, evalMode)
        }
        itemRender={(item: any) => {
          return (
            <div
              className={cx('FormulaPicker-ResultBox')}
              dangerouslySetInnerHTML={{__html: item.html}}
            />
          );
        }}
        onResultChange={noop}
        onChange={pipOutValue}
        onClear={() => pipOutValue(undefined)}
        clearable={true}
      />
    );
  }

  if (schemaType === 'number') {
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
  } else if (schemaType === 'date') {
    const cmptValue = pipInValue(value ?? inputSettings.defaultValue);

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
  } else if (schemaType === 'time') {
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
        value={pipInValue(value ?? inputSettings.defaultValue)}
        onChange={pipOutValue}
      />
    );
  } else if (schemaType === 'datetime') {
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
        value={pipInValue(value ?? inputSettings.defaultValue)}
        onChange={pipOutValue}
      />
    );
  } else if (schemaType === 'select' || schemaType === 'boolean') {
    return (
      <Select
        {...sharedProps}
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
  } else {
    return (
      <ResultBox
        {...sharedProps}
        className={cx(className)}
        allowInput={allowInput}
        borderMode={borderMode}
        placeholder={placeholder}
        value={pipInValue(value)}
        result={
          allowInput || !value
            ? void 0
            : FormulaEditor.highlightValue(value, variables!, evalMode)
        }
        itemRender={itemRender}
        onResultChange={noop}
        onChange={pipOutValue}
      />
    );
  }
};

export default themeable(
  localeable(
    uncontrollable(FormulaInput, {
      value: 'onChange'
    })
  )
);
