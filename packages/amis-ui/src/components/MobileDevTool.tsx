import React, {useEffect} from 'react';
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
}) {
  const [dimension, setDimension] = React.useState(dimensions[1]);
  const [scale, setScale] = React.useState(100);
  const [autoScale, setAutoScale] = React.useState(100);
  // 记录初始时100%的尺寸
  const initialSize = React.useRef({
    width: 0,
    height: 0
  });

  const {container, previewBody} = props;

  const resizeObserver = new ResizeObserver(debounce(updateAutoScale, 300));

  useEffect(() => {
    updatePreviewSize({
      width: dimension.width,
      height: dimension.height
    });
    updatePreviewScale(100);
    // 初始化时获取预览区域的尺寸
    getPreviewInitialSize();

    if (container) {
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

  function updateAutoScale() {
    if (!container) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const {width, height} = containerRect;
    const {width: previewBodyWidth, height: previewBodyHeight} =
      initialSize.current;
    const scale = Math.min(
      (width - 50) / previewBodyWidth,
      (height - 50) / previewBodyHeight
    );
    setAutoScale(Math.floor(scale * 100));
  }

  function getPreviewInitialSize() {
    // 延迟一会，等待previewBody 100%比例渲染完成后才能获取到正确的尺寸
    setTimeout(() => {
      if (previewBody) {
        const previewBodyRect = previewBody.getBoundingClientRect();
        const {width, height} = previewBodyRect;
        initialSize.current = {
          width,
          height
        };
      }
      updateAutoScale();
    }, 500);
  }

  function handleRotateScreen() {
    setDimension({
      name: dimension.name,
      width: dimension.height,
      height: dimension.width
    });
    updatePreviewSize({
      width: dimension.height,
      height: dimension.width
    });
    initialSize.current = {
      width: initialSize.current.height,
      height: initialSize.current.width
    };
    updateAutoScale();
  }

  function handleAutoScale() {
    setScale(autoScale);
    updatePreviewScale(autoScale);
  }

  function handleDimensionChange(item: any) {
    if (item) {
      const value = dimensions.find(n => n.name === item.value)!;
      setDimension(value);
      updatePreviewSize(value);
      setScale(100);
      updatePreviewScale(100);
      getPreviewInitialSize();
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
    setDimension(newDimension);
    updatePreviewSize(newDimension);
  }

  function updatePreviewSize(dimension: {width: number; height: number}) {
    if (previewBody) {
      // 预览区域宽高加上20px的padding
      previewBody.style.width = dimension.width + 20 + 'px';
      previewBody.style.height = dimension.height + 20 + 'px';
    }
  }

  function updatePreviewScale(scale: number) {
    if (previewBody) {
      previewBody.style.transform =
        'translate(-50%, -50%) scale(' + scale / 100 + ')';
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
              setScale(item.value);
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
            setDimension({
              name: 'custom',
              width: w - 20,
              height: h - 20
            });
          }}
        />
      )}
    </div>
  );
}

function CustomSizeHandle(props: {
  previewBody: HTMLElement | null;
  onChange?: (w: number, h: number) => void;
}) {
  const {previewBody, onChange} = props;

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
      w = Math.max(20, w);
      previewBody.style.width = w + 'px';
      onChange?.(w, previewBody.clientHeight);
    }
  }

  function handleRightDragEnd() {
    document.body.classList.remove('width-move');
    document.removeEventListener('mousemove', handleRightDragMove);
    document.removeEventListener('mouseup', handleRightDragEnd);
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
      h = Math.max(20, h);
      previewBody.style.height = h + 'px';
      onChange?.(previewBody.clientWidth, h);
    }
  }

  function handleBottomDragEnd() {
    document.body.classList.remove('height-move');
    document.removeEventListener('mousemove', handleBottomDragMove);
    document.removeEventListener('mouseup', handleBottomDragEnd);
  }

  return (
    <Portal container={() => previewBody}>
      <>
        <div
          className="ae-MobileDevTool-rightHandle"
          onMouseDown={handleRightDown}
        ></div>
        <div
          className="ae-MobileDevTool-bottomHandle"
          onMouseDown={handleBottomDown}
        ></div>
      </>
    </Portal>
  );
}
