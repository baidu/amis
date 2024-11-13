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
import {getDefaultValue} from '../util';

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
    editorValueToken
  } = props;

  let options = cloneDeep(borderRadiusOptions || data.borderRadiusOptions);

  if (typeof borderRadiusOptions === 'string') {
    options = resolveVariableAndFilter(borderRadiusOptions, data, '| raw');
  }
  const [radiusType, setRadiusType] = useState<string>('all');

  let radiusToken: any;

  if (editorValueToken) {
    radiusToken = {
      'top-right-border-radius': `${editorValueToken}-top-right-border-radius`,
      'top-left-border-radius': `${editorValueToken}-top-left-border-radius`,
      'bottom-right-border-radius': `${editorValueToken}-bottom-right-border-radius`,
      'bottom-left-border-radius': `${editorValueToken}-bottom-left-border-radius`
    };
  }
  if (typeof editorValueToken === 'object') {
    Object.keys(radiusToken).forEach(key => {
      // 短横线转驼峰
      const tokenKey = key.replace(/-([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
      });
      if (editorValueToken['*']) {
        radiusToken[key] = editorValueToken['*'];
      } else {
        radiusToken[key] = editorValueToken[tokenKey];
      }
    });
  }

  const editorDefaultValue = formatData(getDefaultValue(radiusToken, data));
  const borderData = formatData(value || {});

  function formatData(sourceData: any) {
    if (!sourceData) {
      return null;
    }

    const data = cloneDeep(sourceData);
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
      onChange(changeValue);
    };
  }

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
            value={borderData[getKey('all')]}
            onChange={changeItem('all')}
            extraUnit={['px']}
            disabled={radiusType === 'custom'}
            itemName={'all-border-radius'}
            state={state}
            placeholder={editorDefaultValue?.[getKey('all')] || '圆角'}
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
