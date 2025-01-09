import React, {useEffect, useRef} from 'react';
import {Icon} from './icons';
import {Select} from 'amis-ui';
import debounce from 'lodash/debounce';
import {Portal} from 'react-overlays';

export const dimensions = [
  {
    name: 'custom',
    width: 375,
    height: 667
  },
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
  container: HTMLElement | null;
  previewBody: HTMLElement | null;
  border?: number;
  onChangeScale?: (scale: number) => void;
}) {
  const [dimension, setDimension] = React.useState(
    () =>
      JSON.parse(
        localStorage.getItem('amis-mobile-dev-tool-dimension') || 'null'
      ) || dimensions[1]
  );
  const defaultScale = useRef<number>();
  const [scale, setScale] = React.useState(100);
  const [autoScale, setAutoScale] = React.useState(100);

  const {container, previewBody, onChangeScale} = props;

  const resizeObserver = new ResizeObserver(debounce(updateAutoScale, 300));

  useEffect(() => {
    defaultScale.current = parseInt(
      localStorage.getItem('amis-mobile-dev-tool-scale') || '0',
      10
    );
  }, []);

  useEffect(() => {
    if (container && previewBody) {
      updatePreviewSize({
        width: dimension.width,
        height: dimension.height
      });
      let scale = defaultScale.current || 100;
      if (!defaultScale.current) {
        scale = Math.min(updateAutoScale(), 100);
        defaultScale.current = scale;
      }
      setScale(scale);
      onChangeScale?.(scale);

      updatePreviewScale(scale);
      resizeObserver.observe(container);
    }
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      if (previewBody) {
        previewBody.style.width = '';
        previewBody.style.height = '';
        previewBody.style.transform = '';
      }
    };
  }, [container, previewBody]);

  function updateDimension(dimension: {
    width: number;
    height: number;
    name: string;
  }) {
    setDimension(dimension);
    localStorage.setItem(
      'amis-mobile-dev-tool-dimension',
      JSON.stringify(dimension)
    );
  }

  function updateScale(scale: number) {
    setScale(scale);
    onChangeScale?.(scale);
    localStorage.setItem('amis-mobile-dev-tool-scale', scale + '');
  }

  function updateAutoScale() {
    if (!container) {
      return 100;
    }
    const containerRect = container.getBoundingClientRect();
    const {width, height} = containerRect;
    const previewBodyWidth = previewBody?.clientWidth || 375;
    const previewBodyHeight = previewBody?.clientHeight || 667;
    let scale = Math.min(
      (width - 50) / previewBodyWidth,
      (height * 0.9) / previewBodyHeight
    );
    scale = Math.floor(scale * 100);
    setAutoScale(scale);
    return scale;
  }

  function handleRotateScreen() {
    updateDimension({
      name: dimension.name,
      width: dimension.height,
      height: dimension.width
    });
    updatePreviewSize({
      width: dimension.height,
      height: dimension.width
    });
    updateAutoScale();
  }

  function handleAutoScale() {
    updateScale(autoScale);
    updatePreviewScale(autoScale);
  }

  function handleDimensionChange(item: any) {
    if (item) {
      const value = dimensions.find(n => n.name === item.value)!;
      updateDimension(value);
      updatePreviewSize(value);
      updateScale(100);
      updatePreviewScale(100);
      updateAutoScale();
    }
  }

  function handleCustomInputDimensionChange(
    value: string,
    type: 'width' | 'height'
  ) {
    const number = parseInt(value || '0', 10);
    const newDimension = {
      name: 'custom',
      width: type === 'width' ? number : dimension.width,
      height: type === 'height' ? number : dimension.height
    };
    updateDimension(newDimension);
    updatePreviewSize(newDimension);
    updateAutoScale();
  }

  function updatePreviewSize(dimension: {width: number; height: number}) {
    if (previewBody) {
      const {border = 20} = props;
      // 预览区域宽高加上20px的padding
      previewBody.style.width = dimension.width + border + 'px';
      previewBody.style.height = dimension.height + border + 'px';
    }
  }

  function updatePreviewScale(scale: number) {
    if (previewBody) {
      previewBody.style.transform =
        'translateX(-50%) scale(' + scale / 100 + ')';
    }
  }

  return (
    <div className="ae-MobileDevTool">
      <div className="ae-MobileDevTool-dimensions">
        <label>尺寸:</label>
        <Select
          className="ae-MobileDevTool-select"
          value={dimension.name}
          onChange={handleDimensionChange}
          options={dimensions.map(n => ({
            label: n.name === 'custom' ? '自定义' : n.name,
            value: n.name
          }))}
          clearable={false}
        />
      </div>
      <div className="ae-MobileDevTool-dimension">
        {dimension.name === 'custom' ? (
          <input
            className="ae-MobileDevTool-dimension-input"
            value={dimension.width}
            onChange={event => {
              const value = event.currentTarget.value;

              handleCustomInputDimensionChange(value, 'width');
            }}
          />
        ) : (
          <span>{dimension.width}</span>
        )}
        <span>×</span>
        {dimension.name === 'custom' ? (
          <input
            className="ae-MobileDevTool-dimension-input"
            value={dimension.height}
            onChange={event => {
              const value = event.currentTarget.value;

              handleCustomInputDimensionChange(value, 'height');
            }}
          />
        ) : (
          <span>{dimension.height}</span>
        )}
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
              updateScale(item.value);
              updatePreviewScale(item.value);
            }}
          />
          {!scaleList.includes(scale) && (
            <div className="ae-MobileDevTool-right-scale-auto-value">
              {scale}%
            </div>
          )}
          <div
            className="ae-MobileDevTool-right-scale-auto"
            onClick={handleAutoScale}
          >
            自适应
          </div>
        </div>
        <div onClick={handleRotateScreen}>
          <Icon
            icon="rotate-screen"
            className="ae-MobileDevTool-right-rotate-screen"
          />
        </div>
      </div>
      {dimension.name === 'custom' && (
        <CustomSizeHandle
          previewBody={previewBody}
          onChange={(w, h) => {
            updateDimension({
              name: 'custom',
              width: w - 20,
              height: h - 20
            });
          }}
          onEnd={updateAutoScale}
          scale={scale}
        />
      )}
    </div>
  );
}

function CustomSizeHandle(props: {
  previewBody: HTMLElement | null;
  scale: number;
  onChange: (w: number, h: number) => void;
  onEnd: () => void;
}) {
  const {previewBody, scale = 1, onChange, onEnd} = props;

  function handleRightDown(e: any) {
    e.stopPropagation();
    e.preventDefault();
    document.body.classList.add('width-move');
    document.addEventListener('mousemove', handleRightDragMove);
    document.addEventListener('mouseup', handleRightDragEnd);
  }

  function handleRightDragMove(e: any) {
    e.stopPropagation();
    if (previewBody) {
      let w = previewBody.clientWidth;
      w += e.movementX;
      w = Math.max(70, w);
      previewBody.style.width = w + 'px';
      onChange?.(w, previewBody.clientHeight);
    }
  }

  function handleRightDragEnd() {
    document.body.classList.remove('width-move');
    document.removeEventListener('mousemove', handleRightDragMove);
    document.removeEventListener('mouseup', handleRightDragEnd);
    onEnd();
  }

  function handleBottomDown(e: any) {
    e.stopPropagation();
    e.preventDefault();
    document.body.classList.add('height-move');
    document.addEventListener('mousemove', handleBottomDragMove);
    document.addEventListener('mouseup', handleBottomDragEnd);
  }

  function handleBottomDragMove(e: any) {
    e.stopPropagation();
    if (previewBody) {
      let h = previewBody.clientHeight;
      h += e.movementY;
      h = Math.max(70, h);
      previewBody.style.height = h + 'px';
      onChange(previewBody.clientWidth, h);
    }
  }

  function handleBottomDragEnd() {
    document.body.classList.remove('height-move');
    document.removeEventListener('mousemove', handleBottomDragMove);
    document.removeEventListener('mouseup', handleBottomDragEnd);
    onEnd();
  }

  return (
    <Portal container={() => previewBody}>
      <>
        <div
          className="ae-MobileDevTool-rightHandle"
          onMouseDown={handleRightDown}
          style={{transform: `scale(${1 / (scale / 100)})`}}
        ></div>
        <div
          className="ae-MobileDevTool-bottomHandle"
          onMouseDown={handleBottomDown}
          style={{transform: `scale(${1 / (scale / 100)})`}}
        ></div>
      </>
    </Portal>
  );
}
