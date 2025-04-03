/**
 * @file 颜色选择器
 * @description 设置颜色
 */

import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import {
  findTree,
  FormItem,
  resolveVariableAndFilter,
  classnames as amisCx,
  render,
  eachTree
} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import cx from 'classnames';
import {SketchPicker} from 'react-color';
import {
  Icon,
  NumberInput,
  Overlay,
  PopOver,
  SearchBox,
  Select,
  TooltipWrapper
} from 'amis-ui';
import type {GlobalData} from '../helper/getGlobalData';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import {i18n as _i18n} from 'i18n-runtime';
import {getDefaultValue} from '../util';
import {Icon as ThemeIcon} from '../icons/index';

interface ColorPickerProps {
  imageType?: 'image-manager' | 'input-image'; // 图片管理器，默认input-image
  receiver?: string; // 图片上传服务
  labelMode?: 'default' | 'input'; // 色块 | 带输入框
  needGradient?: boolean; // 渐变
  needImage?: boolean; // 图片
  needTheme?: boolean; // 主题色
  needCustom?: boolean; // 自定义颜色
  value?: string;
  options?: any;
  data?: any;
  onChange?: any;
  itemName?: string;
  state?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

interface ColorPickerControlProps extends FormControlProps {
  labelMode?: 'default' | 'input'; // 色块 | 带输入框
  needGradient?: boolean; // 渐变
  needImage?: boolean; // 图片
  needTheme?: boolean; // 主题色
  needCustom?: boolean; // 自定义颜色
  editorValueToken?: string;
}

interface ColorSelectProps {
  show: boolean;
  container: any;
  target: any;
  themeList: GlobalData['colorOptions'];
  onChange: any;
  close: any;
  value: string;
  needGradient?: boolean;
  needImage?: boolean;
  needTheme?: boolean; // 主题色
  needCustom?: boolean; // 自定义颜色
  state?: string; // 当前状态
}

interface ThemeColorProps {
  themeList: GlobalData['colorOptions'];
  value: string;
  onChange: any;
  [key: string]: any;
}

const POSITION_MAP = [
  'left top',
  'center top',
  'right top',
  'left center',
  'center center',
  'right center',
  'left bottom',
  'center bottom',
  'right bottom'
];

function findColor(value: string | undefined, tree: any) {
  let res: {label: string | undefined; value: string | undefined} = {
    label: value,
    value: value
  };
  if (typeof value === 'string' && value?.indexOf('var') === 0) {
    const r = findTree(tree, item => item.value === value);
    if (r) {
      res = {label: `${r.label}-${r.realValue}`, value: r.realValue};
    } else if (!value.includes('--colors-')) {
      res = {label: '继承常规', value: value};
    }
  }
  if (value === 'transparent' || value?.includes('none')) {
    res = {label: '透明', value: 'transparent'};
  }
  if (value === 'custom') {
    res = {label: '分别配置', value: 'transparent'};
  }
  return res;
}

function ThemeColorList(props: ThemeColorProps) {
  const {themeList, onChange, value, data, itemName, state} = props;

  const [colorList, setColorList] = useState(cloneDeep(themeList || []));
  const [showFlag, setShowFlag] = useState(true);

  function setColor(value: string | undefined) {
    onChange(value);
  }

  function searchColor(value: string) {
    const list = cloneDeep(themeList || []);
    let showFlag = false;
    if (value) {
      eachTree(list as any, (item, key, level, paths) => {
        if (item.children) {
          item.show =
            item.label?.includes(value) || item.value?.includes(value);
        }
        if (paths && paths[level - 2]?.show) {
          item.show = true;
        } else {
          item.show =
            item.value?.includes(value) ||
            item.realValue?.includes(value) ||
            item.label?.includes(value);
        }
        if (item.show) {
          showFlag = true;
        }
      });
    } else {
      showFlag = true;
    }
    setShowFlag(showFlag);
    setColorList(list);
  }

  return (
    <div className="ThemeColorList">
      <div className="ThemeColorList-content ThemeColorList-content--top">
        <div className="ThemeColorList-content-title">通用</div>
        <div className="ThemeColorList-content-labels">
          <TooltipWrapper
            trigger="hover"
            placement="top"
            tooltip={{
              children: () => <div>透明-transparent</div>
            }}
          >
            <div
              className={cx(
                'ThemeColorList-content-label',
                value === 'transparent' &&
                  'ThemeColorList-content-label--active'
              )}
              onClick={() => setColor('transparent')}
            >
              <div
                className={cx(
                  'ThemeColorList-content-label-inner',
                  'ThemeColor--transparent'
                )}
              ></div>
            </div>
          </TooltipWrapper>
          <TooltipWrapper
            trigger="hover"
            placement="top"
            tooltip={{
              children: () => <div>无</div>
            }}
          >
            <div
              className={cx('ThemeColorList-content-label')}
              onClick={() => setColor(undefined)}
            >
              <div className="ThemeColorList-content-label-inner">
                <div className="ThemeColor--delete"></div>
              </div>
            </div>
          </TooltipWrapper>
        </div>
        <div className="ThemeColorList-content--search">
          <SearchBox placeholder="输入色值或名称搜索" onChange={searchColor} />
        </div>
      </div>
      {showFlag ? (
        colorList?.map((item, i) => {
          let show = item.show;
          item.children?.forEach(n => {
            n.children?.forEach(m => {
              if (m.show !== false) {
                show = true;
              }
            });
          });
          return show ? (
            <div key={i}>
              <div className="ThemeColorList-title">{_i18n(item.label)}</div>
              {item.children?.map((colors, i) => {
                let show = colors.show;
                colors.children?.forEach(n => {
                  if (n.show !== false) {
                    show = true;
                  }
                });
                return show ? (
                  <div className="ThemeColorList-content" key={i}>
                    <div className="ThemeColorList-content-title">
                      {_i18n(colors.label)}
                    </div>
                    <div className="ThemeColorList-content-labels">
                      {colors.children?.map((color, i) =>
                        color.show !== false ? (
                          <TooltipWrapper
                            key={i}
                            trigger="hover"
                            placement="top"
                            tooltip={{
                              children: () => (
                                <div>{`${_i18n(color.label)}-${
                                  color.realValue
                                }`}</div>
                              )
                            }}
                          >
                            <div
                              className={cx(
                                'ThemeColorList-content-label',
                                value === color.value &&
                                  'ThemeColorList-content-label--active'
                              )}
                              onClick={() => setColor(color.value)}
                            >
                              <div
                                className={cx(
                                  'ThemeColorList-content-label-inner',
                                  color.realValue === '#ffffff' &&
                                    'ThemeColorList-content-label--border'
                                )}
                                style={{background: color.value}}
                              ></div>
                            </div>
                          </TooltipWrapper>
                        ) : null
                      )}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : null;
        })
      ) : (
        <span className="ThemeColorList-content-title">未匹配到颜色</span>
      )}
    </div>
  );
}

function CustomColor(props: ThemeColorProps) {
  let {value, onChange, themeList} = props;
  if (value?.indexOf('var') === 0) {
    const {value: res} = findColor(value, themeList);
    value = res!;
  }
  return (
    <div className="Theme-CustomColor">
      <SketchPicker
        width="216px"
        color={value}
        presetColors={[]}
        onChangeComplete={(value: any) => {
          if (value.rgb.a === 1) {
            onChange(value.hex);
          } else {
            const rag = value.rgb;
            onChange(`rgba(${rag.r}, ${rag.g}, ${rag.b}, ${rag.a})`);
          }
        }}
      />
    </div>
  );
}

function GradientColor(props: ThemeColorProps) {
  const slider = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const rangeRefPanel = useRef<HTMLDivElement>(null);
  const {value, onChange, themeList} = props;
  const [colors, setColors] = useState<{color: string; position: number}[]>([]);
  const [index, setIndex] = useState(0);
  const [range, setRange] = useState(0);
  const [rangeShow, setRangeShow] = useState(false);

  const [move, setMove] = useState(false);

  let currentIndex = index;

  // 格式化渐变
  function formatGradient(value: string) {
    let str: any = /linear-gradient\((.*)\)/.exec(value);
    if (!str) return {colors: [], range: 0};

    str = str[1];
    let bracketStart = false;
    let length = str.length;
    let rangeAndColor = [];
    let j = 0;
    rangeAndColor[j] = '';
    for (let i = 0; i < length; i++) {
      const w = str[i];
      if (w === '(') {
        bracketStart = true;
      }
      if (w === ')') {
        bracketStart = false;
      }

      if (w === ',' && !bracketStart) {
        j++;
        rangeAndColor[j] = '';
      } else {
        rangeAndColor[j] += w;
      }
    }
    let range = parseFloat(rangeAndColor.shift()!);
    let len = rangeAndColor.length;
    const res: any[] = [];
    rangeAndColor.forEach((item, i) => {
      const colorAndPosition = /(.*) (.*)/.exec(item)!;
      const color = {
        color: findColor(colorAndPosition[1], themeList).value,
        position: ((i + 1) / len) * 100
      };
      if (colorAndPosition[2]) {
        color.position = parseFloat(colorAndPosition[2]);
      }
      res.push(color);
    });

    return {colors: res, range};
  }

  useEffect(() => {
    if (value?.indexOf('linear-gradient') === 0) {
      const {colors, range} = formatGradient(value);
      setColors(colors);
      setRange(range);
    } else {
      let color = value;
      if (value?.indexOf('url') === 0) {
        color = '#fff';
      }
      setColors([
        {color: color || '#fff', position: 0},
        {color: color || '#fff', position: 100}
      ]);
    }
  }, [value]);

  function gradientChange(
    range: number,
    colors: {color: string; position: number}[]
  ) {
    onChange(
      `linear-gradient(${range}deg,${colors
        .map(item => `${item.color} ${item.position}%`)
        .join(',')})`
    );
  }

  // 渐变角度改变
  function rangeChange(value: number) {
    setRange(value);
    gradientChange(value, colors);
  }
  // 添加渐变点
  function handleClickSlider(e: React.MouseEvent) {
    if (move) {
      return;
    }
    const target = e.currentTarget.getBoundingClientRect();
    const itemPosition = Math.round(
      ((e.clientX - target.x) / target.width) * 100
    );
    const tempColors = cloneDeep(colors);
    const len = tempColors.length;
    let index = 0;
    if (tempColors[0].position > itemPosition) {
      tempColors.unshift({
        color: tempColors[0].color,
        position: itemPosition
      });
    } else if (tempColors[len - 1].position < itemPosition) {
      tempColors.push({
        color: tempColors[len - 1].color,
        position: itemPosition
      });
      index = len;
    } else {
      for (let i = 0; i < len; i++) {
        if (
          tempColors[i].position < itemPosition &&
          tempColors[i + 1].position > itemPosition
        ) {
          index = i + 1;
          tempColors.splice(index, 0, {
            color: tempColors[i].color,
            position: itemPosition
          });
          break;
        }
      }
    }
    setColors(tempColors);
    setIndex(index);
    gradientChange(range, tempColors);
  }

  // 按住渐变点
  function handleDownSliderItem(e: React.MouseEvent, i: number) {
    setIndex(i);
    setMove(true);
    currentIndex = i;
    window.addEventListener('mousemove', handleMoveSliderItem);
    window.addEventListener('mouseup', handleUpSliderItem);
    document.body.classList.add('gradientColor-move');
  }

  // 移动渐变点
  function handleMoveSliderItem(e: MouseEvent) {
    const target = slider.current!.getBoundingClientRect();
    const itemPosition = Math.round(((e.x - target.x) / target.width) * 100);
    const tempColors = cloneDeep(colors);

    // 渐变点个数大于2，当y轴移动大于30，删除渐变点
    if (Math.abs(e.y - target.y) > 30 && tempColors.length > 2) {
      tempColors.splice(currentIndex, 1);
      setIndex(0);
      setColors(tempColors);
    }
    // 限制不能超过最大、最小值
    else if (itemPosition >= 0 && itemPosition <= 100) {
      tempColors[currentIndex].position = itemPosition;
      // 向前交换渐变点
      if (
        tempColors[currentIndex - 1] &&
        itemPosition < tempColors[currentIndex - 1].position
      ) {
        const temp = cloneDeep(tempColors[currentIndex - 1]);
        tempColors[currentIndex - 1] = cloneDeep(tempColors[currentIndex]);
        tempColors[currentIndex] = temp;
        setIndex(currentIndex - 1);
      }
      // 向后交换渐变点
      else if (
        tempColors[currentIndex + 1] &&
        itemPosition > tempColors[currentIndex + 1].position
      ) {
        const temp = cloneDeep(tempColors[currentIndex + 1]);
        tempColors[currentIndex + 1] = cloneDeep(tempColors[currentIndex]);
        tempColors[currentIndex] = temp;
        setIndex(currentIndex + 1);
      }
      setColors(tempColors);
    }
  }

  // 放开渐变点
  function handleUpSliderItem() {
    window.removeEventListener('mousemove', handleMoveSliderItem);
    window.removeEventListener('mouseup', handleUpSliderItem);
    document.body.classList.remove('gradientColor-move');
    setTimeout(() => {
      setMove(false);
    }, 0);

    setColors(colors => {
      gradientChange(range, colors);
      return colors;
    });
  }

  // 通过角度计算位置
  function computedRange(angle: number = 0) {
    const radian = (Math.PI / 180) * angle;
    let left = 21 + Math.sin(radian) * 25;
    let top = 21 - Math.cos(radian) * 25;
    return {
      left,
      top
    };
  }

  // 按下渐变角度句柄
  function handleDownRange() {
    document.body.classList.add('gradientColor-move');
    window.addEventListener('mousemove', handleMoveRange);
    window.addEventListener('mouseup', handleUpRange);
  }

  // 移动渐变角度句柄
  function handleMoveRange(e: MouseEvent) {
    const panel = rangeRefPanel.current!.getBoundingClientRect();
    const panelX = panel.x + 25;
    const panelY = panel.y + 25;
    const x = Math.abs(e.x - panelX);
    const y = Math.abs(e.y - panelY);
    let angle = Math.round((Math.atan(x / y) * 180) / Math.PI);
    // 二象限
    if (e.y > panelY && e.x > panelX) {
      angle = 180 - angle;
    }
    // 三象限
    if (e.x <= panelX && e.y > panelY) {
      angle = 180 + angle;
    }
    // 四象限
    if (e.x < panelX && e.y < panelY) {
      angle = 360 - angle;
    }
    setRange(angle);
  }

  // 抬起渐变角度句柄
  function handleUpRange() {
    document.body.classList.remove('gradientColor-move');
    window.removeEventListener('mousemove', handleMoveRange);
    window.removeEventListener('mouseup', handleUpRange);
    setRange(range => {
      gradientChange(range, colors);
      return range;
    });
  }

  function handelSetRange() {
    setRangeShow(false);
    window.removeEventListener('click', handelSetRange);
  }

  return (
    <div className="Theme-GradientColor">
      <div className="Theme-GradientColor-slider">
        <div
          ref={slider}
          className="Theme-GradientColor-slider-inner"
          style={{
            backgroundImage: `linear-gradient(to right,${colors
              .map(item => `${item.color} ${item.position}%`)
              .join(',')})`
          }}
          onClick={handleClickSlider}
        >
          {colors.map((item, i) => {
            return (
              <div
                key={i}
                className={cx(
                  'Theme-GradientColor-slider-inner-item',
                  i === index && 'Theme-GradientColor-slider-inner-item--active'
                )}
                onMouseDown={e => {
                  handleDownSliderItem(e, i);
                }}
                onClick={e => {
                  e.stopPropagation();
                }}
                style={{
                  left: `calc(${item.position}% - 7px)`,
                  background: item.color
                }}
              ></div>
            );
          })}
        </div>
        <div className="Theme-GradientColor-range" ref={rangeRef}>
          <NumberInput
            formatter={(value: string | number) => value + '°'}
            max={360}
            min={0}
            value={range}
            onChange={rangeChange}
            onFocus={() => {
              setRangeShow(true);
              window.addEventListener('click', handelSetRange);
            }}
          />
          <Overlay
            // @ts-ignore
            container={document.body}
            // @ts-ignore
            target={rangeRef.current}
            show={rangeShow}
            placement="center-bottom-center-top"
            rootClose={false}
            offset={[0, 4]}
          >
            <PopOver>
              <div className="Theme-GradientColor-range-panel">
                <div className="Theme-GradientColor-range-panel-title">
                  渐变角度
                </div>
                <div
                  className="Theme-GradientColor-range-panel-content"
                  ref={rangeRefPanel}
                >
                  <div
                    className="Theme-GradientColor-range-panel-content-handler"
                    onMouseDown={handleDownRange}
                    style={{
                      left: computedRange(range).left + 'px',
                      top: computedRange(range).top + 'px'
                    }}
                  ></div>
                </div>
              </div>
            </PopOver>
          </Overlay>
        </div>
      </div>

      <SketchPicker
        width="216px"
        color={colors[index]?.color}
        presetColors={[]}
        onChangeComplete={(value: any) => {
          let color = value.hex;
          if (value.rgb.a !== 1) {
            const rag = value.rgb;
            color = `rgba(${rag.r}, ${rag.g}, ${rag.b}, ${rag.a})`;
          }
          const colorsTemp = cloneDeep(colors);
          colorsTemp[index].color = color;
          setColors(colorsTemp);
          gradientChange(range, colorsTemp);
        }}
      />
    </div>
  );
}

function ImageInput(props: ThemeColorProps) {
  const {onChange, value, imageType, receiver, env} = props;
  const [image, setImage] = useState('');
  const [mode, setMode] = useState('auto');
  const [position, setPosition] = useState(4);
  const [color, setColor] = useState('');

  function formatData() {
    let list = value.split(' ');
    let imgRes = /url\((.*)\)/.exec(list[0]);
    if (imgRes) {
      let img = imgRes[1];
      setImage(img);
      let res = value;
      !res.endsWith(' ') && (res += ' ');
      res = value.replace(imgRes[0] + ' ', '');
      let list = res.split(' ');
      // 解析position
      let position = list[0] + ' ' + list[1];
      const index = POSITION_MAP.findIndex(n => n === position);
      setPosition(index);
      !res.endsWith(' ') && (res += ' ');
      res = res.replace(position + ' / ', '');
      list = res.split(' ');
      // 解析mode
      let mode = list[0];
      if (~list[1]?.indexOf('repeat')) {
        mode += ' ' + list[1];
      }
      if (~list[1]?.indexOf('100%')) {
        mode = '100% 100% no-repeat';
      }
      setMode(mode);
      !res.endsWith(' ') && (res += ' ');
      // 解析color
      const color = res.replace(mode + ' ', '');
      setColor(color);
    }
  }
  useEffect(() => {
    formatData();
  }, [value]);
  return (
    <div className="Theme-ImageInput">
      {render(
        {
          type: imageType || 'input-image',
          receiver,
          name: 'image',
          onChange: (url: any) => {
            if (url) {
              onChange(
                `url(${url}) ${POSITION_MAP[position]} / ${mode} ${color}`
              );
            }
          }
        },
        {
          data: {image}
        },
        {...env}
      )}
      <div className="Theme-ImageInput-func">
        <Select
          className=":Theme-ImageInput-fill"
          value={mode}
          clearable={false}
          options={[
            {
              label: '原始尺寸',
              value: 'auto no-repeat'
            },
            {
              label: '充满',
              value: 'cover no-repeat'
            },
            {
              label: '合适',
              value: 'contain no-repeat'
            },
            {
              label: '拉伸',
              value: '100% 100% no-repeat'
            },
            {
              label: '平铺',
              value: 'auto repeat'
            },
            {
              label: '横向平铺',
              value: 'auto repeat-x'
            },
            {
              label: '纵向平铺',
              value: 'auto repeat-y'
            }
          ]}
          onChange={(res: {label: string; value: string}) => {
            if (res?.value) {
              onChange(
                `url(${image}) ${POSITION_MAP[position]} / ${res.value} ${color}`
              );
            }
          }}
        />
        <ImagePosition
          value={position}
          onChange={(value: number) => {
            onChange(`url(${image}) ${POSITION_MAP[value]} / ${mode} ${color}`);
          }}
        />
        <ImageColor
          {...props}
          value={color}
          onChange={(value: string) => {
            onChange(
              `url(${image}) ${POSITION_MAP[position]} / ${mode} ${value || ''}`
            );
          }}
        />
      </div>
    </div>
  );
}

function ImagePosition({value, onChange}: {value: number; onChange: Function}) {
  const positionMap = Array.from(Array(9).keys());
  const [show, setShow] = useState(false);
  const target = useRef<any>(null);
  function close() {
    setShow(false);
  }
  function positionChange(value: number) {
    onChange(value);
  }
  return (
    <>
      <div
        className="Theme-ImageInput-position"
        ref={target}
        onClick={() => {
          setShow(true);
        }}
      >
        {positionMap.map(position => (
          <div
            key={position}
            className={cx(
              'Theme-ImageInput-position-item',
              value === position && 'Theme-ImageInput-position-item--active'
            )}
          ></div>
        ))}
      </div>
      <Overlay
        // @ts-ignore
        container={document.body}
        target={target.current}
        show={show}
        offset={[0, 4]}
      >
        <PopOver overlay onHide={close}>
          <div className="Theme-ImageInput-position-container">
            <div className="Theme-ImageInput-position-title">图片位置</div>
            <div className="Theme-ImageInput-position-content">
              {positionMap.map(position => (
                <div
                  key={position}
                  className={cx(
                    'Theme-ImageInput-position-content-item',
                    value === position &&
                      'Theme-ImageInput-position-content-item--active'
                  )}
                  onClick={() => {
                    positionChange(position);
                  }}
                ></div>
              ))}
            </div>
          </div>
        </PopOver>
      </Overlay>
    </>
  );
}

function ImageColor(props: any) {
  const {value, onChange, themeList, subTabList} = props;
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState(0);
  const target = useRef<any>(null);
  function close() {
    setShow(false);
  }
  function handleTab(value: number) {
    setTab(value);
  }

  useEffect(() => {
    if (~value.indexOf('var')) {
      setTab(0);
    } else {
      setTab(1);
    }
  }, [value]);
  return (
    <>
      <div
        ref={target}
        className="Theme-ImageInput-color"
        style={{background: value}}
        onClick={() => {
          setShow(true);
        }}
      ></div>
      <Overlay
        // @ts-ignore
        container={document.body}
        target={target.current}
        show={show}
        offset={[0, 4]}
      >
        <PopOver overlay onHide={close}>
          <div className="Theme-ImageInput-color-container">
            <div className="Theme-ImageInput-color-content">
              <div className="Theme-ImageInput-color-content-tab">
                {subTabList.map((item: any) => (
                  <div
                    className={cx(
                      'Theme-ImageInput-color-content-tab-item',
                      tab === item.id &&
                        'Theme-ImageInput-color-content-tab-item--active'
                    )}
                    onClick={() => {
                      handleTab(item.id);
                    }}
                    key={item.id}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              {tab === 0 ? (
                <ThemeColorList
                  {...props}
                  themeList={themeList}
                  onChange={(value: string) => {
                    onChange(value);
                    close();
                  }}
                  value={value}
                />
              ) : null}
              {tab === 1 ? (
                <CustomColor
                  onChange={onChange}
                  value={value}
                  themeList={themeList}
                />
              ) : null}
            </div>
          </div>
        </PopOver>
      </Overlay>
    </>
  );
}

/**
 * 最近颜色列表
 */
function PresetColors(props: {
  themeList: GlobalData['colorOptions'];
  onChange: (color: string) => void;
  onRef: any;
  needGradient?: boolean;
  needImage?: boolean;
  needTheme?: boolean; // 主题色
  needCustom?: boolean; // 自定义颜色
}) {
  interface Color {
    title?: string;
    color: string;
  }
  interface PresetColors {
    colors: Color[];
    linearGradient: Color[];
    img: Color[];
  }
  const {
    themeList,
    onChange,
    onRef,
    needGradient,
    needImage,
    needTheme,
    needCustom
  } = props;
  const [colors, setColors] = useState<PresetColors>({
    colors: [],
    linearGradient: [],
    img: []
  });
  const [edit, setEdit] = useState(false);

  function setPresetColor(value: string) {
    if (!value) {
      return;
    }
    const presetColors = cloneDeep(colors);
    if (!!~value.indexOf('linear-gradient')) {
      if (
        presetColors.linearGradient.length < 8 &&
        !colors.linearGradient.find(n => n.color === value)
      ) {
        presetColors.linearGradient.unshift({
          color: value,
          title: value
        });
      }
    } else if (!!~value.indexOf('url')) {
      // 图片不加入最近颜色列表
      return;
      // if (
      //   presetColors.img.length < 8 &&
      //   !colors.img.find(n => n.color === value)
      // ) {
      //   presetColors.img.unshift({
      //     color: value,
      //     title: value
      //   });
      // }
    } else if (
      presetColors.colors.length < 8 &&
      !colors.colors.find(n => n.color === value)
    ) {
      let title;
      if (value.indexOf('var(') === 0) {
        title = findColor(value, themeList).label;
      }
      presetColors.colors.unshift({
        color: value,
        title
      });
    }
    localStorage.setItem('presetColors', JSON.stringify(presetColors));
    setColors(presetColors);
  }

  useImperativeHandle(onRef, () => ({
    setPresetColor: debounce(setPresetColor, 500)
  }));

  useEffect(() => {
    let presetColors;
    try {
      presetColors = JSON.parse(localStorage.getItem('presetColors') || '');
    } catch (e) {
      presetColors = {
        colors: [],
        linearGradient: [],
        img: []
      };
    }

    setColors(presetColors);
  }, []);

  function getColorsLen(colors: PresetColors) {
    return (
      colors.colors.length + colors.linearGradient.length + colors.img.length
    );
  }

  function colorClick(color: string, index: number, type: keyof typeof colors) {
    if (edit) {
      const newColors = cloneDeep(colors);
      newColors[type].splice(index, 1);
      setColors(newColors);
      localStorage.setItem('presetColors', JSON.stringify(newColors));
      if (getColorsLen(newColors) === 0) {
        setEdit(false);
      }
    } else {
      onChange(color);
    }
  }

  return (
    <div className="Theme-ColorSelect-PresetColors">
      <div className="Theme-ColorSelect-PresetColors-header">
        <span className="Theme-ColorSelect-PresetColors-title">常用颜色</span>
        {getColorsLen(colors) > 0 ? (
          <span
            className={cx(
              'Theme-ColorSelect-PresetColors-edit',
              edit && 'Theme-ColorSelect-PresetColors-editing'
            )}
            onClick={() => {
              setEdit(!edit);
            }}
          >
            {edit ? '完成' : '编辑'}
          </span>
        ) : null}
      </div>
      <div>
        {getColorsLen(colors) > 0 ? (
          Object.keys(colors).map((key: keyof typeof colors) => {
            if (!needGradient && key === 'linearGradient') {
              return null;
            }
            if (!needImage && key === 'img') {
              return null;
            }
            if (!needTheme && !needCustom && key === 'colors') {
              return null;
            }
            return colors[key].length > 0 ? (
              <div
                key={key}
                className={cx(
                  'Theme-ColorSelect-PresetColors-content',
                  edit && 'Theme-ColorSelect-PresetColors-content-editing'
                )}
              >
                {colors[key].map((color, index) => {
                  return (
                    <TooltipWrapper
                      trigger="hover"
                      placement="left"
                      tooltip={{
                        children: () => <div>{color.title || color.color}</div>
                      }}
                      key={color.color}
                      container={document.body}
                    >
                      <div
                        className="ThemeColor--transparent Theme-ColorPicker-label-out"
                        onClick={() => {
                          colorClick(color.color, index, key);
                        }}
                      >
                        <div
                          style={{background: color.color}}
                          className="Theme-ColorSelect-PresetColors-content-item"
                        ></div>
                      </div>
                    </TooltipWrapper>
                  );
                })}
              </div>
            ) : null;
          })
        ) : (
          <span className="Theme-ColorSelect-PresetColors-content-placeholder">
            点击上方颜色添加
          </span>
        )}
      </div>
    </div>
  );
}

function ColorSelect(props: ColorSelectProps) {
  const {
    show,
    target,
    themeList,
    onChange,
    close,
    value,
    needGradient,
    needImage,
    needTheme,
    needCustom
  } = props;
  const [tab, setTab] = useState('color');
  const presetColorRef = useRef<any>();

  const tabMap: any = {
    color: {name: 'color', label: '主题颜色'}
  };
  if (needCustom) {
    tabMap['custom'] = {name: 'custom', label: '自定义颜色'};
  }
  if (needGradient) {
    tabMap['gradient'] = {name: 'gradient', label: '渐变'};
  }
  if (needImage) {
    tabMap['img'] = {name: 'img', label: '图片'};
  }

  const subTabList: any[] = [
    needTheme &&
      themeList &&
      themeList.length > 0 && {name: '主题颜色', parent: 'color', id: 0},
    needCustom && {name: '自定义颜色', parent: 'color', id: 1}
  ].filter(n => n);

  useEffect(() => {
    if (
      needTheme &&
      (value?.indexOf('var') === 0 || value === 'transparent' || !value)
    ) {
      setTab('color');
    } else if (
      needCustom &&
      (value?.startsWith('rgb') || value?.startsWith('#'))
    ) {
      setTab('custom');
    } else if (needGradient && value?.indexOf('linear-gradient') === 0) {
      setTab('gradient');
    } else if (needImage && value?.indexOf('url') === 0) {
      setTab('img');
    }
  }, [show]);

  function colorOnChange(value: string) {
    onChange(value);
    presetColorRef.current?.setPresetColor(value);
  }

  return (
    <Overlay
      // @ts-ignore
      container={document.body}
      target={target.current}
      show={show}
      placement="left"
    >
      <PopOver overlay onHide={close}>
        <div className="Theme-ColorSelect">
          {Object.keys(tabMap).length > 1 ? (
            <div className="Theme-ColorSelect-tab">
              {Object.keys(tabMap).map(key => (
                <div
                  key={key}
                  className={cx(
                    'Theme-ColorSelect-tab-' + key,
                    tab === key && 'Theme-ColorSelect-tab--active'
                  )}
                  onClick={() => {
                    setTab(key);
                  }}
                >
                  {tabMap[key].label}
                </div>
              ))}
            </div>
          ) : null}
          <div className="Theme-ColorSelect-content">
            {tab === 'color' ? (
              <ThemeColorList
                {...props}
                themeList={themeList}
                onChange={colorOnChange}
                value={value}
              />
            ) : null}
            {tab === 'custom' ? (
              <CustomColor
                onChange={colorOnChange}
                value={value}
                themeList={themeList}
              />
            ) : null}
            {tab === 'gradient' ? (
              <GradientColor
                value={value}
                onChange={colorOnChange}
                themeList={themeList}
              />
            ) : null}
            {tab === 'img' ? (
              <ImageInput
                {...props}
                value={value}
                onChange={colorOnChange}
                subTabList={subTabList}
              />
            ) : null}
            <PresetColors
              onRef={presetColorRef}
              onChange={colorOnChange}
              themeList={themeList}
              needGradient={needGradient}
              needImage={needImage}
              needTheme={needTheme}
              needCustom={needCustom}
            />
          </div>
        </div>
      </PopOver>
    </Overlay>
  );
}

function ColorPicker(props: ColorPickerProps) {
  const {
    value,
    options,
    data,
    onChange,
    labelMode,
    needGradient,
    needImage,
    needTheme,
    needCustom,
    placeholder,
    disabled,
    readOnly
  } = props;
  let themeList = options;
  if (typeof options === 'string') {
    themeList = resolveVariableAndFilter(options, data, '| raw');
  }

  const container = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);

  const [color, setColor] = useState(value);
  const [show, setShow] = useState(false);

  function colorSelectHandler() {
    !disabled && setShow(!show);
  }

  function handleClean(event: any) {
    setColor(undefined);
    onChange(undefined);
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    setColor(value);
  }, [value]);

  return (
    <div
      className={cx(
        'Theme-ColorPicker',
        disabled && 'is-disabled',
        readOnly && 'is-readOnly'
      )}
      ref={container}
    >
      <div
        className={cx(
          'Theme-ColorPicker',
          labelMode === 'input' && 'Theme-ColorPicker--input'
        )}
        onClick={colorSelectHandler}
        ref={target}
      >
        <div className="ThemeColor--transparent Theme-ColorPicker-label-out">
          {findColor(color || placeholder, themeList).value ? (
            <TooltipWrapper
              trigger="hover"
              placement="left"
              disabled={labelMode === 'input'}
              tooltip={{
                children: () => (
                  <div>{findColor(color || placeholder, themeList).label}</div>
                )
              }}
            >
              <div
                className={cx('Theme-ColorPicker-label')}
                style={{
                  background: findColor(color || placeholder, themeList).value
                }}
              ></div>
            </TooltipWrapper>
          ) : (
            <div className="ThemeColor--delete"></div>
          )}
        </div>
        {labelMode === 'input' ? (
          <>
            <div className={cx('Theme-ColorPicker-input')}>
              {color ? (
                <div>{findColor(color, themeList).label}</div>
              ) : (
                <div className={cx('Theme-ColorPicker-input--placeholder')}>
                  {findColor(placeholder, themeList)?.label || placeholder}
                </div>
              )}
            </div>
            {value && !disabled && !readOnly ? (
              <span className={amisCx('Select-clear')} onClick={handleClean}>
                <Icon icon="input-clear" className="icon" />
              </span>
            ) : null}

            <span
              className={cx(
                'Theme-ColorPicker-arrow',
                show && 'Theme-ColorPicker-arrow--active'
              )}
            >
              <Icon icon="right-arrow-bold" className="icon" />
            </span>
          </>
        ) : null}
      </div>
      <ColorSelect
        {...props}
        needGradient={needGradient ?? false}
        needImage={needImage ?? false}
        needTheme={needTheme ?? true}
        needCustom={needCustom ?? false}
        value={value || placeholder || ''}
        show={show}
        close={() => {
          setShow(false);
        }}
        container={container}
        target={target}
        themeList={themeList}
        onChange={onChange}
      />
    </div>
  );
}

function ColorPickerControl(props: ColorPickerControlProps) {
  let editorDefaultValue = getDefaultValue(props.editorValueToken, props.data);

  const value = props.value || editorDefaultValue;

  return (
    <>
      <ColorPicker
        {...props}
        placeholder={value}
        options={props.options || props.data.colorOptions}
        labelMode={props.labelMode ?? 'default'}
        needGradient={props.needGradient}
        needImage={props.needImage}
        needTheme={props.needTheme}
        needCustom={props.needCustom}
      />
    </>
  );
}

export default ColorPicker;

@FormItem({
  type: 'amis-theme-color-picker',
  strictMode: false,
  renderLabel: true
})
export class ColorPickerRenderer extends React.Component<FormControlProps> {
  render() {
    return (
      <ColorPickerControl
        {...this.props}
        labelMode={this.props.labelMode ?? 'default'}
        needGradient={this.props.needGradient}
        needImage={this.props.needImage}
        needTheme={this.props.needTheme}
        needCustom={this.props.needCustom}
      />
    );
  }
}
