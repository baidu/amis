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

const scaleList = [50, 75, 100, 125, 150, 200];

export default function MobileDevTool(props: {
  onChange: (dimension: {width: number; height: number}) => void;
  onScaleChange?: (scale: number) => void;
}) {
  const [dimension, setDimension] = React.useState(dimensions[0]);
  const [scale, setScale] = React.useState(100);
  const [autoScale, setAutoScale] = React.useState(100);
  // 记录初始时100%的尺寸
  const initialSize = React.useRef({
    width: 0,
    height: 0
  });

  const {onChange, onScaleChange} = props;

  const resizeObserver = new ResizeObserver(debounce(updateAutoSizeFn, 300));

  useEffect(() => {
    onChange?.({
      width: dimension.width,
      height: dimension.height
    });
    onScaleChange?.(100);
    // 初始化时获取预览区域的尺寸
    getPreviewInitialSize();

    const aeMain = document.getElementById('ae-Main');
    if (aeMain) {
      resizeObserver.observe(aeMain);
    }
    return () => {
      if (aeMain) {
        resizeObserver.unobserve(aeMain);
      }
    };
  }, []);

  function updateAutoSizeFn() {
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
    setAutoScale(Math.floor(scale * 100));
  }

  function getPreviewInitialSize() {
    setTimeout(() => {
      const previewBody = document.getElementById('editor-preview-body');
      if (previewBody) {
        const previewBodyRect = previewBody.getBoundingClientRect();
        const {width, height} = previewBodyRect;
        initialSize.current = {
          width,
          height
        };
      }
      updateAutoSizeFn();
    }, 500);
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
    getPreviewInitialSize();
  }

  function handleAutoSize() {
    setScale(autoScale);
    onScaleChange?.(autoScale);
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
              setScale(100);
              onScaleChange?.(100);
              getPreviewInitialSize();
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
        <div className="ae-MobileDevTool-right-scale">
          <Select
            className="ae-MobileDevTool-select"
            clearable={false}
            value={scale}
            options={[
              ...scaleList.map(n => ({
                label: `${n}%`,
                value: n
              }))
            ]}
            onChange={(item: any) => {
              setScale(item.value);
              onScaleChange?.(item.value);
            }}
          />
          {!scaleList.includes(scale) && (
            <div className="ae-MobileDevTool-right-scale-auto-value">
              {scale}%
            </div>
          )}
          <div
            className="ae-MobileDevTool-right-scale-auto"
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
