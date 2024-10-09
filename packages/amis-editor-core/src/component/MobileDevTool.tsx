import React from 'react';
import {Icon} from '../icons';
import {Select} from 'amis-ui';

export const dimensions = [
  {
    name: 'iPhone SE',
    width: 375,
    height: 667
  },
  {
    name: 'iPhone XR',
    width: 414,
    height: 896
  },
  {
    name: 'iPhone 12 Pro',
    width: 390,
    height: 844
  },
  {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932
  },
  {
    name: 'Pixel 7',
    width: 412,
    height: 915
  },
  {
    name: 'Samsung Galaxy S8+',
    width: 360,
    height: 740
  },
  {
    name: 'Samsung Galaxy S20 Ultra',
    width: 412,
    height: 915
  },
  {
    name: 'iPad Mini',
    width: 768,
    height: 1024
  },
  {
    name: 'iPad Air',
    width: 820,
    height: 1180
  },
  {
    name: 'iPad Pro',
    width: 1024,
    height: 1366
  },
  {
    name: 'Surface Pro 7',
    width: 912,
    height: 1368
  },
  {
    name: 'Surface Duo',
    width: 540,
    height: 720
  },
  {
    name: 'Galaxy Z Fold 5',
    width: 344,
    height: 882
  },
  {
    name: 'Asus Zenfone Fold',
    width: 853,
    height: 1280
  },
  {
    name: 'Samsung Galaxy A51/71',
    width: 412,
    height: 914
  },
  {
    name: 'Nest Hub',
    width: 1024,
    height: 600
  },
  {
    name: 'Next Hub Max',
    width: 1280,
    height: 800
  }
];

const sizeList = [50, 75, 100, 125, 150, 200];

export default function MobileDevTool(props: {
  onChange: (dimension: {width: number; height: number}) => void;
  onSizeChange?: (size: number) => void;
}) {
  const [dimension, setDimension] = React.useState(dimensions[0]);
  const [size, setSize] = React.useState(100);
  const {onChange, onSizeChange} = props;

  function rotateScreen() {
    setDimension({
      name: dimension.name,
      width: dimension.height,
      height: dimension.width
    });
    onChange?.({
      width: dimension.height,
      height: dimension.width
    });
  }

  return (
    <div className="ae-MobileDevTool">
      <div className="ae-MobileDevTool-dimensions">
        <label>尺寸:</label>
        <Select
          className="ae-MobileDevTool-select"
          value={dimension.name}
          onChange={(item: any) => {
            if (item) {
              const value = dimensions.find(n => n.name === item.value)!;
              setDimension(value);
              onChange?.({
                width: value.width,
                height: value.height
              });
            }
          }}
          options={dimensions.map(n => ({
            label: n.name,
            value: n.name
          }))}
          clearable={false}
        />
      </div>
      <div className="ae-MobileDevTool-dimension">
        <span>{dimension.width}</span>
        <span>×</span>
        <span>{dimension.height}</span>
      </div>
      <div className="ae-MobileDevTool-right">
        {/* <div className="ae-MobileDevTool-right-size">
          <Select
            className="ae-MobileDevTool-select"
            clearable={false}
            value={size}
            options={sizeList.map(n => ({
              label: `${n}%`,
              value: n
            }))}
            onChange={(item: any) => {
              setSize(item.value);
              onSizeChange?.(item.value);
            }}
          />
        </div> */}
        <div onClick={rotateScreen}>
          <Icon
            icon="rotate-screen"
            className="ae-MobileDevTool-right-rotate-screen"
          />
        </div>
      </div>
    </div>
  );
}
