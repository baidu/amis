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
  isExpression
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
        result = Array.isArray(origin)
          ? origin.map(item => item.value)
          : origin.value;
      }
      onChange?.(result);
    },
    ['onChange']
  );

  const FormulaCmpt = ({value}: {value: string}) => {
    return (
      <ResultBox
        className={cx(`FormulaPicker-input-variable`)}
        allowInput={false}
        value={pipInValue(value)}
        result={
          value == null
            ? void 0
            : FormulaEditor.highlightValue(value, variables!, evalMode)
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
  };

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

  if (
    isExpression(cmptValue) ||
    targetVariable ||
    (schemaType === 'number' &&
      cmptValue != null &&
      typeof cmptValue !== 'number') ||
    (['date', 'time', 'datetime'].includes(schemaType) &&
      !moment(cmptValue).isValid()) ||
    (schemaType === 'select' &&
      cmptValue != null &&
      !(inputSettings?.options ?? []).some(
        (item: any) => item?.value === cmptValue
      )) ||
    (schemaType === 'boolean' &&
      cmptValue != null &&
      typeof cmptValue !== 'boolean')
  ) {
    const varName =
      cmptValue && mixedMode
        ? cmptValue.replace(/^\$\{/, '').replace(/\}$/, '')
        : cmptValue;
    const resultValue = targetVariable?.value ?? varName;

    return (
      <ResultBox
        className={cx(`FormulaPicker-input-variable`)}
        allowInput={false}
        value={resultValue}
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
