/**
 * @file 边框
 * @description 边框设置
 */

import cx from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormItem} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import cloneDeep from 'lodash/cloneDeep';
import {Select} from 'amis-ui';
import ColorPicker from './ColorPicker';
import ThemeSelect from './ThemeSelect';
import {i18n as _i18n} from 'i18n-runtime';
import {
  getValueByPath,
  getInheritValue,
  formatInheritData,
  setInheritData
} from '../util';

interface BorderProps {
  custom?: boolean;
  needColorCustom?: boolean;
}

interface Options {
  label: string;
  value: string;
  realValue?: any;
  parent?: boolean;
}

const defaultStyleOptions = [
  {
    label: '实线',
    value: 'solid',
    realValue: 'solid'
  },
  {
    label: '虚线',
    value: 'dashed',
    realValue: 'dashed'
  },
  {
    label: '点线',
    value: 'dotted',
    realValue: 'dotted'
  }
];

const defaultBorderWidthOptions = [
  {
    value: 'none',
    label: '无',
    realValue: 'none'
  },
  {
    value: '1px',
    label: '1px',
    realValue: '1px'
  },
  {
    value: '2px',
    label: '2px',
    realValue: '2px'
  },
  {
    value: '4px',
    label: '4px',
    realValue: '4px'
  }
];

const borderItems = [
  {
    item: 'top',
    tip: '上边框'
  },
  {
    item: 'all',
    tip: '全部'
  },
  {
    item: 'left',
    tip: '左边框'
  },
  {
    item: 'right',
    tip: '右边框'
  },
  {
    item: 'bottom',
    tip: '下边框'
  }
];

function BoxBorder(props: BorderProps & FormControlProps) {
  const {
    onChange,
    value = {},
    data,
    custom,
    label,
    needColorCustom,
    state,
    editorThemePath
  } = props;
  const [borderWidthOptions, setBorderWidthOptions] = useState(
    cloneDeep(
      props.borderWidthOptions ||
        data.borderWidthOptions ||
        defaultBorderWidthOptions
    )
  );
  const [borderStyleOptions, setBorderStyleOptions] = useState(
    cloneDeep(
      props.borderStyleOptions || data.borderStyleOptions || defaultStyleOptions
    )
  );
  const [colorOptions, setColorOptions] = useState(
    cloneDeep(props.colorOptions || data.colorOptions)
  );
  const [borderType, setBorderType] = useState<string>('all');
  const editorDefaultValue = formatData(getValueByPath(editorThemePath, data));
  const editorInheritValue = getInheritValue(editorThemePath, data);
  const borderData = formatData(value || {});

  useEffect(() => {
    if (state && state !== 'default') {
      const type = borderType === 'all' ? 'top' : borderType;
      const styleOptions = cloneDeep(borderStyleOptions);
      if (styleOptions[0].parent) {
        styleOptions[0].value = editorThemePath
          ? 'inherit'
          : `var(${data.default.token}${type}-border-style)`;
        styleOptions[0].realValue = '继承常规';
      } else {
        styleOptions.unshift({
          label: '继承常规',
          value: editorThemePath
            ? 'inherit'
            : `var(${data?.default?.token}${type}-border-style)`,
          parent: true,
          realValue: '继承常规'
        });
      }
      setBorderStyleOptions(styleOptions);
    }
  }, [borderType]);

  function formatData(sourceData: any) {
    if (!sourceData) {
      return null;
    }

    const data = formatInheritData(cloneDeep(sourceData));

    const fn = (type: string) => {
      if (
        data[`top-border-${type}`] === data[`right-border-${type}`] &&
        data[`right-border-${type}`] === data[`bottom-border-${type}`] &&
        data[`bottom-border-${type}`] === data[`left-border-${type}`]
      ) {
        data[`all-border-${type}`] = data[`top-border-${type}`];
      } else {
        data[`all-border-${type}`] = 'custom';
      }
    };
    fn('width');
    fn('style');
    fn('color');
    return data;
  }

  function getLabel(value?: string, option?: any) {
    if (value === 'inherit') {
      return '继承常规';
    }
    const res = option?.find((item: any) => item.value === value);
    if (res) {
      return res.label;
    }
    return value;
  }

  function getKey(field: string) {
    return `${borderType}-border-${field}`;
  }

  function changeType(value: string) {
    setBorderType(value);
  }

  function changeItem(key: string) {
    return (val: string | undefined) => {
      let field = getKey(key);

      if (val === 'custom') {
        return;
      }

      let changeValue = {};

      if (borderType === 'all') {
        let newValue: Record<string, any> = {};

        // 过滤掉all
        let items = borderItems.filter(position => position?.item !== 'all');
        items.forEach(item => {
          let itemKey = `${item.item}-border-${key}`;
          newValue[itemKey] = val;
        });
        changeValue = {
          ...value,
          ...newValue
        };
      } else {
        changeValue = {
          ...value,
          [field]: val
        };
      }

      onChange(setInheritData(changeValue, editorInheritValue));
    };
  }

  return (
    <div className="Theme-Border">
      {label ? <div className="Theme-Border-label">{label}</div> : null}
      <div className="Theme-Border-content">
        {custom ? (
          <div className="Theme-Border-items">
            {borderItems.map(item => {
              let valueKey = `border-${item.item}`;
              return (
                <div
                  key={valueKey}
                  className={cx(
                    `Theme-Border-item Theme-Border-item--${item.item}`,
                    {
                      'Theme-Border-item--active': borderType === item.item
                    }
                  )}
                  onClick={() => changeType(item.item)}
                >
                  <span data-tooltip={item.tip} data-position="top"></span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="Theme-Border-all"></div>
        )}

        <div
          className={cx(
            'Theme-Border-settings',
            !custom && 'Theme-Border-settings--all'
          )}
        >
          <ThemeSelect
            {...props}
            options={borderWidthOptions}
            value={borderData[getKey('width')]}
            onChange={value => changeItem('width')(value)}
            itemName={`${
              borderType === 'all' ? 'top' : borderType
            }-border-width`}
            state={state}
            inheritValue={editorThemePath ? 'inherit' : ''}
            placeholder={editorDefaultValue?.[getKey('width')]}
          />
          <div className="Theme-Border-settings-style-color">
            <Select
              options={borderStyleOptions}
              value={borderData[getKey('style')]}
              placeholder={getLabel(
                editorDefaultValue?.[getKey('style')],
                borderStyleOptions
              )}
              onChange={(item: any) => changeItem('style')(item.value)}
              clearable={!!editorDefaultValue}
              renderMenu={(item: Options) => {
                return item.realValue === 'none' ? (
                  <span>无</span>
                ) : item.parent ? (
                  <span>{item.label}</span>
                ) : (
                  <div className="Theme-Border-style">
                    <div
                      className="Theme-Border-style-line"
                      style={{borderStyle: item.realValue}}
                    ></div>
                    <span>{_i18n(item.label)}</span>
                  </div>
                );
              }}
              renderValueLabel={(item: Options) => {
                return item.realValue === 'none' ? (
                  <span>无</span>
                ) : item.parent ? (
                  <span>{item.label}</span>
                ) : (
                  <div className="Theme-Border-style">
                    <div
                      className="Theme-Border-style-line"
                      style={{borderStyle: item.realValue}}
                    ></div>
                  </div>
                );
              }}
            />
            <ColorPicker
              {...props}
              value={borderData[getKey('color')]}
              options={colorOptions}
              onChange={changeItem('color')}
              needCustom={needColorCustom ?? false}
              needTheme
              itemName={`${
                borderType === 'all' ? 'top' : borderType
              }-border-color`}
              placeholder={editorDefaultValue?.[getKey('color')]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

@FormItem({
  type: 'amis-theme-border',
  strictMode: false,
  renderLabel: false
})
export class BorderRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxBorder {...this.props} custom={this.props.custom ?? true} />;
  }
}
