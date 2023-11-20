/**
 * @file 圆角
 * @description 圆角设置
 */

import cx from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormItem, RendererProps, resolveVariableAndFilter} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import cloneDeep from 'lodash/cloneDeep';
import ThemeSelect from './ThemeSelect';
import {
  getValueByPath,
  getInheritValue,
  formatInheritData,
  setInheritData
} from '../util';

interface RadiusProps {
  custom: boolean;
}

const radiusItems = [
  {
    item: 'top-left',
    tip: '左上角'
  },
  {
    item: 'top-right',
    tip: '右上角'
  },
  {
    item: 'bottom-left',
    tip: '左下角'
  },
  {
    item: 'bottom-right',
    tip: '右下角'
  }
];

function BoxRadius(props: RadiusProps & RendererProps) {
  const {
    onChange,
    value = {},
    data,
    custom,
    label,
    borderRadiusOptions,
    state,
    editorThemePath
  } = props;

  let options = cloneDeep(borderRadiusOptions || data.borderRadiusOptions);

  if (typeof borderRadiusOptions === 'string') {
    options = resolveVariableAndFilter(borderRadiusOptions, data, '| raw');
  }
  const [radiusType, setRadiusType] = useState<string>('all');
  const [isInherit, setIsInherit] = useState<boolean>(false);

  const editorDefaultValue = formatData(getValueByPath(editorThemePath, data));
  const editorInheritValue = getInheritValue(editorThemePath, data);
  const borderData = formatData(value || {});

  function formatData(sourceData: any) {
    if (!sourceData) {
      return null;
    }

    const data = formatInheritData(cloneDeep(sourceData));
    if (
      data[`top-right-border-radius`] === data[`top-left-border-radius`] &&
      data[`top-left-border-radius`] === data[`bottom-right-border-radius`] &&
      data[`bottom-right-border-radius`] === data[`bottom-left-border-radius`]
    ) {
      data[`all-border-radius`] = data[`top-right-border-radius`];
    } else {
      data[`all-border-radius`] = 'custom';
    }
    return data;
  }

  function getKey(type: string) {
    return `${type}-border-radius`;
  }

  function changeItem(type: string) {
    return (val: string) => {
      let field = getKey(type);

      if (val === 'custom') {
        return;
      }

      let changeValue = {};
      if (type === 'all') {
        let newValue: Record<string, any> = {};
        const items = radiusItems;
        items.forEach(item => {
          let itemKey = `${item.item}-border-radius`;
          if (
            state &&
            state !== 'default' &&
            val?.includes('all-border-radius')
          ) {
            const defaultToken = (key: string) =>
              `var(${data.default.token}${key})`;
            newValue[itemKey] = defaultToken(itemKey);
          } else {
            newValue[itemKey] = val;
          }
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
      setIsInherit(false);
    };
  }

  useEffect(() => {
    if (state && state !== 'default') {
      if (
        value['top-left-border-radius']?.includes(
          'default-top-left-border-radius'
        ) &&
        value['top-right-border-radius']?.includes(
          'default-top-right-border-radius'
        ) &&
        value['bottom-left-border-radius']?.includes(
          'default-bottom-left-border-radius'
        ) &&
        value['bottom-right-border-radius']?.includes(
          'default-bottom-right-border-radius'
        )
      ) {
        setIsInherit(true);
      }
    }
  }, [value]);

  useEffect(() => {
    if (borderData['all-border-radius'] === 'custom') {
      setRadiusType('custom');
    }
  }, []);

  return (
    <div className="Theme-Radius">
      {label ? <div className="Theme-Radius-label">{label}</div> : null}
      <div className="Theme-Radius-inner">
        <div
          className={cx(
            'Theme-Radius-item',
            custom && 'Theme-Radius-item--custom'
          )}
        >
          <div
            className={cx(
              'Theme-Radius-item-all',
              radiusType === 'all' && 'Theme-Radius-item-all--active'
            )}
            onClick={() => setRadiusType('all')}
          ></div>
          {custom ? (
            <div
              className={cx(
                'Theme-Radius-item-custom',
                radiusType === 'custom' && 'Theme-Radius-item-custom--active'
              )}
              onClick={() => setRadiusType('custom')}
            ></div>
          ) : null}
        </div>

        <div className="Theme-Radius-settings">
          <ThemeSelect
            {...props}
            options={options}
            value={
              isInherit
                ? `var(${data.default.token}all-border-radius)`
                : borderData[getKey('all')]
            }
            onChange={changeItem('all')}
            extraUnit={['px']}
            disabled={radiusType === 'custom'}
            itemName={'all-border-radius'}
            state={state}
            inheritValue={editorThemePath ? 'inherit' : ''}
            placeholder={editorDefaultValue?.[getKey('all')]}
          />
        </div>
      </div>
      <div className="Theme-Radius-settings-custom">
        {radiusType === 'custom'
          ? radiusItems.map(item => {
              const position = item.item;
              return (
                <div
                  className="Theme-Radius-settings-custom-item"
                  key={item.item}
                >
                  <ThemeSelect
                    {...props}
                    options={options}
                    value={borderData[getKey(position)]}
                    onChange={changeItem(position)}
                    extraUnit={['px']}
                    itemName={position + '-border-radius'}
                    state={state}
                    inheritValue={editorThemePath ? 'inherit' : ''}
                    placeholder={editorDefaultValue?.[getKey(position)]}
                    menuTpl="realValue"
                  />
                  <div
                    className={cx(
                      'Theme-Radius-settings-custom-item-label',
                      'Theme-Radius-settings-custom-item-' + position
                    )}
                  ></div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

@FormItem({
  type: 'amis-theme-radius',
  strictMode: false,
  renderLabel: false
})
export class RadiusRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxRadius {...this.props} custom={this.props.custom ?? true} />;
  }
}
