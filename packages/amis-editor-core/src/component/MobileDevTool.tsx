import React, {useEffect} from 'react';
import {Icon} from '../icons';
import {Select} from 'amis-ui';
import {debounce} from 'lodash';

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
  const [autoSize, setAutoSize] = React.useState(100);
  // 记录初始时100%的尺寸
  const initialSize = React.useRef({
    width: 0,
    height: 0
  });

  const {onChange, onSizeChange} = props;

  const resizeObserver = new ResizeObserver(debounce(updateAutoSize, 300));

  useEffect(() => {
    getPreviewInitialSize();
    updateAutoSize();
    const aeMain = document.getElementById('ae-Main');
    if (aeMain) {
      resizeObserver.observe(aeMain);
    }
    onChange?.({
      width: dimension.width,
      height: dimension.height
    });
    return () => {
      if (aeMain) {
        resizeObserver.unobserve(aeMain);
      }
    };
  }, []);

  function getPreviewInitialSize() {
    const previewBody = document.getElementById('editor-preview-body');
    if (previewBody) {
      const previewBodyRect = previewBody.getBoundingClientRect();
      const {width, height} = previewBodyRect;
      initialSize.current = {
        width,
        height
      };
    }
  }

  function updateAutoSize() {
    const aeMain = document.getElementById('ae-Main');
    if (!aeMain) {
      return;
    }
    const aeMainRect = aeMain.getBoundingClientRect();
    const {width, height} = aeMainRect;
    const {width: previewBodyWidth, height: previewBodyHeight} =
      initialSize.current;
    const scale = Math.min(
      (width - 50) / previewBodyWidth,
      (height - 50) / previewBodyHeight
    );
    setAutoSize(Math.floor(scale * 100));
  }

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

  function handleAutoSize() {
    setSize(autoSize);
    onSizeChange?.(autoSize);
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
              setSize(100);
              onSizeChange?.(100);
              setTimeout(() => {
                getPreviewInitialSize();
                updateAutoSize();
              }, 500);
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
        <div className="ae-MobileDevTool-right-size">
          <Select
            className="ae-MobileDevTool-select"
            clearable={false}
            value={size}
            options={[
              ...sizeList.map(n => ({
                label: `${n}%`,
                value: n
              }))
            ]}
            onChange={(item: any) => {
              setSize(item.value);
              onSizeChange?.(item.value);
            }}
          />
          {!sizeList.includes(size) && (
            <div className="ae-MobileDevTool-right-size-auto-value">
              {size}%
            </div>
          )}
          <div
            className="ae-MobileDevTool-right-size-auto"
            onClick={handleAutoSize}
          >
            自适应
          </div>
        </div>
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
