/**
 * @file 边框圆角
 * @description 边框 & 圆角设置
 */

import cx from 'classnames';
import React, {useEffect, useState} from 'react';
import camelCase from 'lodash/camelCase';
import {observer} from 'mobx-react';
import {FormItem, Select, NumberInput} from 'amis';

import type {PlainObject} from './types';
import type {FormControlProps, RendererProps, SchemaNode} from 'amis-core';

const borderItems = [
  {
    item: 'left',
    tip: '左边框',
    content: '┣'
  },
  {
    item: 'top',
    tip: '上边框',
    content: '┳'
  },
  {
    item: 'right',
    tip: '右边框',
    content: '┫'
  },
  {
    item: 'bottom',
    tip: '下边框',
    content: '┻'
  },
  {
    item: 'all',
    tip: '全部',
    content: '╋'
  }
];

const radiusItems = [
  {
    item: 'top-left',
    tip: '左上角',
    content: '┏'
  },
  {
    item: 'top-right',
    tip: '右上角',
    content: '┓'
  },
  {
    item: 'bottom-left',
    tip: '左下角',
    content: '┗'
  },
  {
    item: 'bottom-right',
    tip: '右下角',
    content: '┛'
  },
  {
    item: 'all',
    tip: '全部',
    content: '╋'
  }
];

function BoxBorder({
  disableBorder = false,
  disableRadius = false,
  onChange,
  value = {},
  render
}: {
  disableBorder?: boolean;
  disableRadius?: boolean;
  onChange: (value: PlainObject) => void;
  value?: PlainObject;
} & RendererProps) {
  const [borderItem, setBorderItem] = useState<string>('all');
  const [radiusItem, setRadiusItem] = useState<string>('all');

  function getKey(type: string, field: string) {
    let activeItem = field === 'radius' ? radiusItem : borderItem;

    // TODO: 获取全部的时候应该判断是否所有值都相等，不相等的话返回空或者返回组合提示？
    if (activeItem === 'all') {
      return field === 'radius'
        ? camelCase(`${type}-top-left-${field}`)
        : camelCase(`${type}-left-${field}`);
    }

    return camelCase(`${type}-${activeItem}-${field}`);
  }

  function changeItem(type: string, key: string) {
    return (e: any) => {
      let val = e?.value || e;
      let field = getKey(type, key);
      let isRadius = key === 'radius';
      let activeItem = isRadius ? radiusItem : borderItem;

      if (activeItem === 'all') {
        let newValue: Record<string, any> = {};

        // 过滤掉all
        let items = (isRadius ? radiusItems : borderItems).filter(
          position => position?.item !== 'all'
        );
        items.forEach(item => {
          let itemKey = camelCase(`${type}-${item.item}-${key}`);
          newValue[itemKey] = val;
        });

        onChange({
          ...value,
          ...newValue
        });
      } else {
        onChange({
          ...value,
          [field]: val
        });
      }
    };
  }

  function renderRadius() {
    return (
      <div className="ae-border-wrap ae-border-radius flex items-center">
        <div className="ae-border-items">
          {radiusItems.map(item => {
            let valueKey = camelCase(`border-${item.item}`);
            return (
              <div
                key={valueKey}
                className={cx(`ae-border-item ${item.item}`, {
                  active: radiusItem === item.item
                })}
                onClick={() => setRadiusItem(item.item)}
              >
                <span data-tooltip={item.tip} data-position="top">
                  {item.content}
                </span>
              </div>
            );
          })}
        </div>

        <div className="ae-border-settings">
          <div className="flex items-center">
            <label>圆角</label>
            <NumberInput
              placeholder="圆角尺寸"
              value={value[getKey('border', 'radius')]}
              step={1}
              min={0}
              onChange={changeItem('border', 'radius')}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderBorder() {
    return (
      <div className="ae-border-wrap flex flex-top mb-2">
        <div className="ae-border-items">
          {borderItems.map(item => {
            let valueKey = camelCase(`border-${item.item}`);
            return (
              <div
                key={valueKey}
                className={cx(`ae-border-item ${item.item}`, {
                  active: borderItem === item.item
                })}
                onClick={() => setBorderItem(item.item)}
              >
                <span data-tooltip={item.tip} data-position="top">
                  {item.content}
                </span>
              </div>
            );
          })}
        </div>

        <div className="ae-border-settings">
          <div className="flex items-center">
            <label>线形</label>
            <Select
              className="ae-border-input"
              placeholder="边框线型"
              onChange={changeItem('border', 'style')}
              value={value[getKey('border', 'style')]}
              options={[
                {
                  label: '无',
                  value: 'none'
                },
                {
                  label: '实线',
                  value: 'solid'
                },
                {
                  label: '点线',
                  value: 'dotted'
                },
                {
                  label: '虚线',
                  value: 'dashed'
                }
              ]}
            />
          </div>

          <div className="flex items-center">
            <label>线宽</label>
            <NumberInput
              placeholder="边框宽度"
              value={value[getKey('border', 'width')]}
              step={1}
              min={0}
              onChange={changeItem('border', 'width')}
            />
          </div>

          <div className="flex items-center">
            <label>颜色</label>
            {render(
              'color',
              {
                type: 'input-color',
                placeholder: '边框颜色',
                clearable: true,
                value: value[getKey('border', 'color')],
                inputClassName: 'ae-border-colorpicker',
                label: false
              },
              {
                onChange: changeItem('border', 'color')
              }
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 ae-border">
      {!disableBorder && renderBorder()}
      {!disableRadius && renderRadius()}
    </div>
  );
}

export default observer(BoxBorder);

@FormItem({type: 'style-border', renderLabel: false})
export class BorderRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxBorder {...this.props} />;
  }
}
