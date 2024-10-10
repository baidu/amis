/**
 * @file flex 快捷分栏布局设置
 */

import React, {useEffect, useState} from 'react';
import {InputBox, TooltipWrapper} from 'amis-ui';
import {FormControlProps, FormItem} from 'amis-core';
import cx from 'classnames';

function LayoutItem({
  value,
  onSelect,
  active,
  tip,
  flexDirection
}: {
  value: string;
  onSelect: () => void;
  active?: boolean;
  tip?: string;
  flexDirection?: React.CSSProperties['flexDirection'];
}) {
  const items = String(value).split(':');
  return (
    <TooltipWrapper key="TooltipWrapper" tooltip={tip}>
      <div
        className={cx('ae-FlexLayout-item', {
          active
        })}
        style={{
          flex: value,
          flexDirection: flexDirection || 'row'
        }}
        onClick={onSelect}
      >
        {items.map((val, index) => (
          <div
            key={index}
            className="ae-FlexLayout-itemColumn"
            style={{flex: val}}
          />
        ))}
      </div>
    </TooltipWrapper>
  );
}

function FlexLayouts({
  onChange,
  value,
  data
}: {
  onChange: (value: string) => void;
  value?: string;
  data: any;
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
  const [currentLayout, setCurrentLayout] = useState<string>('');
  useEffect(() => {
    if (value) {
      // 转换成1:x格式
      let items = String(value).split(':');
      const min = Math.min.apply(null, items);
      if (items.every(item => +item % min === 0)) {
        items = items.map(item => String(+item / min));
        let layout = items.join(':');
        if (layout !== currentLayout) {
          setCurrentLayout(items.join(':'));
        }
      } else if (value !== currentLayout) {
        setCurrentLayout(value);
      }
    }
  }, []);

  const flexDirection = data.style?.flexDirection || 'row';

  function onChangeLayout() {
    if (/\d[\d:]+\d$/.test(currentLayout)) {
      onChange(currentLayout);
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
            flexDirection={flexDirection}
            onSelect={() => {
              setCurrentLayout(item);
              onChange(item);
            }}
            active={item === currentLayout}
          />
        ))}
      </div>

      <div className="flex items-center">
        <span className="mr-2 text-gray-500">自定义分隔比例</span>
        <InputBox
          className="ae-FlexLayout-input"
          clearable={false}
          value={currentLayout}
          placeholder="例如 1:3:2"
          onChange={val => setCurrentLayout(val)}
          onBlur={() => currentLayout && onChangeLayout()}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onChangeLayout();
            }
          }}
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
