/**
 * @file flex 快捷分栏布局设置
 */

import React from 'react';
import {InputBox, TooltipWrapper} from 'amis-ui';
import {FormControlProps, FormItem} from 'amis-core';
import cx from 'classnames';

function LayoutItem({
  value,
  onSelect,
  active,
  tip
}: {
  value: string;
  onSelect: () => void;
  active?: boolean;
  tip?: string;
}) {
  const items = String(value).split(':');
  return (
    <TooltipWrapper key="TooltipWrapper" tooltip={tip}>
      <div
        className={cx('ae-FlexLayout-item', {
          active
        })}
        style={{flex: value}}
        onClick={onSelect}
      >
        {items.map(val => (
          <div className="ae-FlexLayout-itemColumn" style={{flex: val}}></div>
        ))}
      </div>
    </TooltipWrapper>
  );
}

function FlexLayouts({
  onChange,
  value
}: {
  onChange: (value: string) => void;
  value?: string;
}) {
  const presetLayouts = [
    '1',
    '1:1',
    '1:2',
    '2:1',
    '1:3',
    '1:1:1',
    '1:2:1',
    '1:1:1:1'
  ];
  let currentLayout = value;
  if (value) {
    // 转换成1:x格式
    let items = String(value).split(':');
    const min = Math.min.apply(null, items);
    if (items.every(item => +item % min === 0)) {
      items = items.map(item => String(+item / min));
      currentLayout = items.join(':');
    }
  }

  return (
    <div className="ae-FlexLayout">
      <div className="ae-FlexLayout-wrap">
        {presetLayouts.map(item => (
          <LayoutItem
            key={item}
            value={item}
            tip={`排列${item}`}
            onSelect={() => onChange(item)}
            active={item === currentLayout}
          />
        ))}
      </div>

      <div className="flex items-center">
        <span className="mr-2 text-gray-500">自定义分隔比例</span>
        <InputBox
          className="ae-FlexLayout-input"
          clearable={false}
          value={value}
          placeholder="例如 1:3:2"
          onChange={val => (currentLayout = val)}
          onBlur={() => currentLayout && onChange(currentLayout)}
        />
      </div>
    </div>
  );
}

@FormItem({type: 'flex-layout'})
export class FlexLayoutRenderer extends React.Component<FormControlProps> {
  render() {
    return <FlexLayouts {...this.props} />;
  }
}
