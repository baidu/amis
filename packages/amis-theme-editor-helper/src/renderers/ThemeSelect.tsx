/**
 * @file ThemeSelect.tsx
 * @description 可选择、可联想的输入框
 */

import React, {useEffect, useRef, useState} from 'react';
import {Icon, Overlay, PopOver, TooltipWrapper} from 'amis-ui';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import {FormItem, resolveVariableAndFilter, highlight} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import cx from 'classnames';
import {getDefaultValue} from '../util';

interface Option {
  label: any;
  value: string;
  realValue?: string;
  html?: any;
}

interface ThemeSelectProps {
  options?: Option[];
  value?: string;
  extraUnit?: Array<string>;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  data?: any;
  state?: string;
  itemName?: string;
  menuTpl?: string;
  menuLabelRender?: (option: Option) => JSX.Element;
  placeholder?: string;
  editorValueToken?: string | {[key: string]: string};
}

interface ThemeSelectContentProps extends ThemeSelectProps {
  target: any;
  value: string;
  extraUnit: Array<string>;
}

// 根字体大小
const remFactor =
  parseFloat(getComputedStyle(window.document.documentElement).fontSize) || 16;

function ThemeSelectContent(props: ThemeSelectContentProps) {
  const {
    options: originalOptions,
    onChange,
    extraUnit,
    target,
    disabled,
    menuTpl,
    placeholder,
    editorValueToken,
    data,
    menuLabelRender
  } = props;
  // 期望value是string类型
  const value = props.value + '';
  const input = useRef<HTMLInputElement>(null);
  const [currentItem, setCurrentItem] = useState<Option | undefined>(undefined);
  const [options, setOptions] = useState<Option[] | undefined>(originalOptions);
  const [showOptions, setShowOptions] = useState(false);

  const editorDefaultValue = getDefaultValue(editorValueToken, data);

  useEffect(() => {
    const res = originalOptions?.find(item => item.value === value);
    setCurrentItem(res);
    if (!res) {
      formatOptions(value);
      input.current && (input.current.value = value);
    }
  }, [value]);

  function getRealValue(value?: string) {
    const res = originalOptions?.find(item => item.value === value);
    if (res) {
      return res.label;
    }
    return value === 'custom' ? '分别配置' : value;
  }

  function clearThemeValue() {
    onChange(undefined);
    setTimeout(() => {
      input.current?.focus();
    }, 10);
  }

  function formatOptions(value: string) {
    const tempList = cloneDeep(originalOptions) || [];
    const items = tempList.filter(item => item.realValue?.includes(value));
    const list = [];
    if (!value || Number.isNaN(parseFloat(value))) {
      list.push(...tempList);
      setOptions(list);
      return;
    } else if (items.length > 0) {
      list.push(...items);
    }
    const number = parseFloat(value);
    let unit = cloneDeep(extraUnit);

    if (!/^\d*$/.test(value)) {
      unit = unit.filter(item => (number + item).includes(value));
    }

    const extraUnitList =
      unit.map(unit => {
        let label = number + unit;
        if (unit === 'rem') {
          label += `(${number * remFactor}px)`;
        }
        return {
          value: number + unit,
          label,
          realValue: number + unit
        };
      }) || [];
    list.unshift(...extraUnitList);
    if (extraUnit.includes('rem') && unit.includes('px')) {
      list.unshift({
        value: number / remFactor + 'rem',
        label: `${number}px->${number / remFactor}rem`,
        realValue: number / remFactor + 'rem'
      });
    }
    setOptions(
      list.map(item => ({
        ...item,
        html: highlight(item.label, value)
      }))
    );
  }

  function valueOnChange(value: string) {
    return debounce(() => {
      if (value) {
        onChange(value);
      } else {
        onChange(undefined);
      }
    })();
  }

  function onInputChange(res: any) {
    const value = res.currentTarget.value;
    formatOptions(value);
    valueOnChange(value);
  }

  function onSelectValue(item: Option) {
    onChange(item.value);
    setShowOptions(false);
    input.current && (input.current.value = item.value);
  }

  function openOptions() {
    if (!disabled) {
      setShowOptions(true);
    }
  }

  const tooltipLabel = currentItem?.label || '分别配置';

  return (
    <>
      {currentItem || value === 'custom' || value?.includes('var') ? (
        <div
          onClick={openOptions}
          className={cx(
            'theme-select',
            disabled && 'theme-select--disabled',
            showOptions,
            showOptions && 'theme-select--active'
          )}
        >
          <TooltipWrapper
            trigger="hover"
            placement="top"
            tooltip={{
              children: () => <div>{tooltipLabel}</div>
            }}
            disabled={!!menuTpl}
          >
            <div className="ThemeSelectContent-theme">
              {menuTpl ? (
                <div>
                  {(currentItem && (currentItem as any)[menuTpl]) || '分别配置'}
                </div>
              ) : (
                <div>{tooltipLabel}</div>
              )}
              {!disabled ? (
                <Icon icon="close" className="icon" onClick={clearThemeValue} />
              ) : null}
            </div>
          </TooltipWrapper>
        </div>
      ) : (
        <div
          className={cx(
            'theme-select',
            disabled && 'theme-select--disabled',
            showOptions && 'theme-select--active'
          )}
        >
          <input
            className="ThemeSelectContent-input"
            type="text"
            onChange={onInputChange}
            onFocus={openOptions}
            ref={input}
            disabled={disabled}
            placeholder={getRealValue(placeholder || editorDefaultValue)}
          />
        </div>
      )}
      <Overlay
        container={document.body as any}
        target={target}
        show={showOptions && !!options?.length}
        rootClose
      >
        <PopOver overlay onHide={() => setShowOptions(false)}>
          <div
            className="ThemeSelectContent-input-select"
            style={{
              minWidth: target?.clientWidth + 'px'
            }}
          >
            {options?.map(item => {
              return (
                <div
                  key={item.label}
                  onClick={() => onSelectValue(item)}
                  className={cx(
                    currentItem?.value === item.value &&
                      'ThemeSelectContent-input-select-item--active'
                  )}
                >
                  {menuLabelRender
                    ? menuLabelRender(item)
                    : item.html || item.label}
                </div>
              );
            })}
          </div>
        </PopOver>
      </Overlay>
    </>
  );
}

function ThemeSelect(props: ThemeSelectProps) {
  const {
    data,
    value: originValue,
    options: originOptions,
    extraUnit = ['px', 'rem', '%'],
    disabled
  } = props;
  const themeSelect = useRef<HTMLDivElement>(null);
  const [options, setOptions] = React.useState<Option[]>(getOptions());
  function getOptions() {
    const list = cloneDeep(
      typeof originOptions === 'string'
        ? resolveVariableAndFilter(originOptions, data, '| raw')
        : !originOptions
        ? data?.sizesOptions || []
        : originOptions || []
    );
    return list;
  }
  useEffect(() => {
    setOptions(getOptions());
  }, [originOptions]);

  return (
    <div ref={themeSelect}>
      <ThemeSelectContent
        {...props}
        value={originValue || ''}
        options={options}
        extraUnit={extraUnit}
        target={themeSelect.current}
        disabled={disabled}
      />
    </div>
  );
}

export default ThemeSelect;

@FormItem({
  type: 'amis-theme-select',
  strictMode: false,
  renderLabel: true
})
export class ThemeSelectRenderer extends React.Component<FormControlProps> {
  render() {
    return <ThemeSelect {...this.props} />;
  }
}
