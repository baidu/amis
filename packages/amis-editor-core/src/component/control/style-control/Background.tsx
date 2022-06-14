/**
 * @file Background.ts
 * @description 背景设置
 */

import axios from 'axios';
import cx from 'classnames';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import React, {useState, useEffect} from 'react';

import {render as amisRender, FormItem} from 'amis';

import type {FormControlProps} from 'amis-core';
import type {PlainObject} from './types';
import {getSchemaTpl} from '../../schemaTpl';
interface BackgroundProps extends FormControlProps {
  receiver?: string;
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}

const Background: React.FC<BackgroundProps> = props => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const {noImage} = props;

  const tabList = noImage
    ? ['pure', 'gradient', 'noset']
    : ['pure', 'gradient', 'image', 'noset'];

  function onChange(key: string) {
    return (e: any) => {
      const eventValue =
        e !== null && typeof e === 'object'
          ? typeof e.target === 'object'
            ? e.target.value
            : e.value
          : e;
      const {value, onChange} = props;
      let result = {
        ...value,
        [key]: eventValue
      };
      // 透明度
      if (key === 'alpha') {
        result.backgroundColor = result.backgroundColor?.replace(
          /,\s(1|0){1}.?[0-9]*\)$/g,
          `, ${e / 100})`
        );
      }
      // 位置
      if (key === 'backgroundPosition') {
        result.backgroundPosition = e.target.getAttribute('data-pos');
      }
      // 背景大小级平铺模式
      if (key === 'backgroundSize') {
        let bsValue = eventValue ?? '';
        let bsArr = bsValue.split(' ');
        // 0位size 1位平铺方式
        if (bsArr.length > 1) {
          result.backgroundSize = bsArr[0];
          result.backgroundRepeat = bsArr[1];
        } else {
          result.backgroundSize = bsValue;
          result.backgroundRepeat = 'no-repeat';
        }
      }
      // 渐变色角度
      if (key === 'angle') {
        let backgroundImage = result.backgroundImage ?? '';
        let lineraGradient =
          backgroundImage.indexOf('linear-gradient') !== -1
            ? backgroundImage
            : 'linear-gradient(180deg, transparent, transparent)';
        result.backgroundImage = lineraGradient.replace(
          /linear-gradient\(\d{1,3}/g,
          `linear-gradient(${eventValue}`
        );
      }
      // 渐变色
      if (key === 'gradientPrev' || key === 'gradientNext') {
        let backgroundImage = result.backgroundImage ?? '';
        let lineraGradient =
          backgroundImage.indexOf('linear-gradient') !== -1
            ? backgroundImage
            : 'linear-gradient(180deg, transparent, transparent)';
        let tempArr = lineraGradient.split(', ');
        let len = tempArr.length;
        // 前景色
        if (key === 'gradientPrev') {
          if (len === 3) {
            tempArr[1] = eventValue;
          } else if (len === 5 || len === 6) {
            let startPos = 0;
            let endPos = 0;
            for (let i = 0; i < len; i++) {
              if (tempArr[i].indexOf('rgb') !== -1) {
                startPos = i;
              }
              if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                endPos = i;
              }
            }
            // 后景色是rgb或rgba
            if (endPos === len - 1) {
              tempArr.splice(1, 1, eventValue);
            } else {
              tempArr.splice(startPos, endPos + 1, eventValue);
            }
          } else if (len >= 7) {
            // 前景色和后景色都是rgb
            for (let i = 0; i < len; i++) {
              let pos = tempArr[i].indexOf(')');
              if (pos !== -1) {
                tempArr.splice(1, i, eventValue);
                break;
              }
            }
          }
        }
        // 后景色
        if (key === 'gradientNext') {
          if (len === 3) {
            tempArr[2] = eventValue + ')';
          } else if (len === 5 || len === 6) {
            let startPos = 0;
            let endPos = 0;
            for (let i = 0; i < len; i++) {
              if (tempArr[i].indexOf('rgb') !== -1) {
                startPos = i;
              }
              if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                endPos = i;
              }
            }
            // 后景色是rgb或rgba
            if (endPos === len - 1) {
              tempArr.splice(startPos, endPos + 1, eventValue + ')');
            } else {
              tempArr.splice(-1, 1, eventValue + ')');
            }
          } else if (len >= 7) {
            // 前景色和后景色都是rgb
            let flag = 0;
            for (let i = 0; i < len; i++) {
              let pos = tempArr[i].indexOf('rgb');
              if (pos !== -1) {
                flag++;
                if (flag === 2) {
                  tempArr.splice(i, len - i + 1, eventValue);
                  break;
                }
              }
            }
          }
        }
        result.backgroundImage = tempArr.join(', ');
        result = pick(result, 'backgroundImage');
      }
      // 删除无用属性
      if (key === 'alpha' || key === 'backgroundColor') {
        result = pick(result, 'backgroundColor');
      }
      if (
        key === 'backgroundImage' ||
        key === 'backgroundPosition' ||
        key === 'backgroundSize'
      ) {
        if (/linear-gradient/g.test(result?.backgroundImage)) {
          result = pick(
            result,
            'backgroundPosition',
            'backgroundSize',
            'backgroundRepeat'
          );
        } else {
          result = pick(
            result,
            'backgroundImage',
            'backgroundPosition',
            'backgroundSize',
            'backgroundRepeat'
          );
        }
      }
      onChange({
        ...omit(value, [
          'backgroundColor',
          'backgroundImage',
          'backgroundPosition',
          'backgroundSize',
          'backgroundRepeat',
          'angle',
          'gradientNext',
          'gradientPrev'
        ]),
        ...result
      });
    };
  }
  // 获取渐变颜色
  function getGradient(type: string) {
    const linearGradient = props.value?.backgroundImage;
    let prevColor = '';
    let nextColor = '';
    if (/linear-gradient/g.test(linearGradient)) {
      let tempArr = linearGradient.split(', ');
      let len = tempArr.length;
      if (len === 3) {
        // 非rgb颜色
        prevColor = tempArr[1];
        nextColor = tempArr[2].slice(0, -1);
      } else if (len === 5 || len === 6) {
        // rgb或rgba颜色
        let startPos = 0;
        let endPos = 0;
        for (let i = 0; i < len; i++) {
          if (tempArr[i].indexOf('rgb') !== -1) {
            startPos = i;
          }
          if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
            endPos = i;
            if (i !== len - 1) {
              prevColor = tempArr.slice(startPos, i + 1).join(', ');
              nextColor = tempArr
                .slice(i + 1)
                .join('')
                .slice(0, -1);
            } else {
              prevColor = tempArr.slice(1, startPos).join('');
              nextColor = tempArr.slice(startPos, len - 1).join(', ');
            }
          }
        }
      } else if (len >= 7) {
        // 前景色和后景色都是rgb或rgba
        let prevStartPos = 0;
        let prevEndPos = 0;
        let nextStartPos = 0;
        let nextEndPos = 0;
        for (let i = 0; i < len; i++) {
          if (tempArr[i].indexOf('rgb') !== -1) {
            if (prevStartPos === 0) {
              prevStartPos = i;
            } else if (nextStartPos === 0) {
              nextStartPos = i;
            }
          }
          if (tempArr[i].indexOf(')') !== -1) {
            if (prevEndPos === 0) {
              prevEndPos = i;
            } else if (nextEndPos === 0) {
              nextEndPos = i;
            }
          }
        }
        prevColor = tempArr.slice(prevStartPos, prevEndPos + 1).join(', ');
        nextColor = tempArr.slice(nextStartPos, nextEndPos).join(', ');
      }
      linearGradient.split('');
    }
    const returnColor = type === 'prev' ? prevColor : nextColor;
    if (returnColor === 'transparent') {
      return '';
    }
    return returnColor;
  }
  // 获取渐变角度
  function getGradientAngle() {
    const linearGradient = props.value?.backgroundImage;
    let angle = 180;
    let match = /linear-gradient\((\d{1,3})/.exec(String(linearGradient || ''));
    if (match) {
      angle = +match[1];
    }
    return +angle;
  }
  // 背景颜色透明度
  function getAlpha(rgba: any) {
    const val = rgba.match(/(\d(\.\d+)?)+/g);
    return val ? val[3] * 100 : '';
  }
  // 获取激活的tab
  function setActiveTab() {
    const {value} = props;
    if (value?.backgroundColor || value?.alpha) {
      // 背景色
      setTabIndex(0);
    } else if (value?.backgroundImage) {
      if (/linear-gradient/g.test(value.backgroundImage)) {
        // 渐变色
        setTabIndex(1);
      } else {
        // 图片
        setTabIndex(2);
      }
    } else if (value?.backgroundPosition || value?.backgroundSize) {
      // 图片
      setTabIndex(2);
    } else {
      // 无背景
      setTabIndex(tabList.length - 1);
    }
  }
  // 上传图片
  async function uploadImg(e: any) {
    const url = props?.receiver;
    if (!url) {
      console.warn('未配置图片上传地址');
      return;
    }
    const forms = new FormData();
    const configs = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const file = e.target.files[0];
    forms.append('file', file);
    const result = await axios.post(url, forms, configs);
    if (result.status === 200) {
      const imgUrl = result.data.data.url;
      onChange('backgroundImage')(imgUrl);
    } else {
      alert(result?.data?.message || '上传失败');
    }
  }
  // 背景图尺寸设置
  function getbsValue() {
    let backgroundSize = props.value?.backgroundSize;
    let backgroundRepeat = props.value?.backgroundRepeat;
    let returnVal = backgroundSize || '';
    if (backgroundSize === 'auto' && backgroundRepeat) {
      returnVal = backgroundSize + ' ' + backgroundRepeat;
    }
    return returnVal;
  }
  // 清空背景颜色、渐变色、背景图
  function clearValues() {
    const {value, onChange} = props;
    const result = {
      ...value,
      backgroundSize: '',
      backgroundPosition: '',
      backgroundColor: '',
      backgroundImage: ''
    };
    onChange(result);
  }

  function tabChange(index: number, item: string) {
    if (item === 'noset') {
      clearValues();
    }
    setTabIndex(index);
  }

  function handleChange(key: string, keyValue: string) {
    const {value, onChange} = props;
    const result = {
      ...value,
      [key]: keyValue
    };
    onChange(result);
  }

  const currentItem = tabList[tabIndex];
  useEffect(() => {
    setActiveTab();
  }, []);

  return (
    <div className="ae-Background">
      <div className="ae-Background_tabs">
        <ul className="ae-Background_tabs-nav">
          {tabList.map(
            (item: string, index: number) => {
              return (
                <li
                  key={index}
                  className={cx(item, {
                    active: tabIndex === index
                  })}
                  onClick={() => tabChange(index, item)}
                ></li>
              );
            }
          )}
        </ul>
        <div className="ae-Background_tabs-content">
          {/* 纯色 */}
          {currentItem === 'pure' && (
            <div className="ae-Background_setting">
              {amisRender(
                {
                  type: 'input-color',
                  label: '背景色',
                  format: 'rgba',
                  mode: 'normal',
                  value: props.value?.backgroundColor
                },
                {
                  onChange: (value: string) => handleChange('backgroundColor', value)
                }
              )}
            </div>
          )}
          {/* TODO: 渐变色需要单独设计一个渐变色Slider */}
          {/* 渐变色 */}
          {currentItem === 'gradient' && (
            <div className="ae-Background_setting">
              <div className="ae-Background_setting-item">
                <div className="ae-Background_setting-item_color">
                  {amisRender(
                    {
                      type: 'input-color',
                      label: '开始颜色',
                      clearable: false,
                      placeholder: '起始色',
                      inputClassName: 'ae-Background-colorpicker',
                      value: getGradient('prev')
                    },
                    {
                      onChange: onChange('gradientPrev')
                    }
                  )}
                </div>
                <div className="ae-Background_setting-item_pic"></div>
                <div className="ae-Background_setting-item_color">
                  {amisRender(
                    {
                      type: 'input-color',
                      label: '结束颜色',
                      clearable: false,
                      placeholder: '结束色',
                      inputClassName: 'ae-Background-colorpicker',
                      value: getGradient('next')
                    },
                    {
                      onChange: onChange('gradientNext')
                    }
                  )}
                </div>
              </div>
              <div className="ae-Background_setting-item">
                {amisRender(
                  {
                    type: 'input-number',
                    label: '渐变角度',
                    mode: 'row',
                    step: 10,
                    min: 0,
                    max: 360,
                    value: getGradientAngle(),
                    description: '* 角度范围0-360度，0度表示从下至上渐变'
                  },
                  {
                    onChange: (value: string) => handleChange('angle', value)
                  }
                )}
              </div>
            </div>
          )}
          {/* 图片 */}
          {currentItem === 'image' && (
            <div className="ae-Background_setting">
              {amisRender({
                type: 'group',
                mode: 'horizontal',
                body: [
                  getSchemaTpl('backgroundImageUrl', {
                    name: 'backgroundImage',
                    placeholder: '点击或拖拽图片上传',
                    fixedSize: true,
                    value: props.data?.style?.backgroundImage,
                    onChange: onChange('backgroundImage'),
                    fixedSizeClassName: 'ae-Background-upload',
                    accept: '.jpg,.png,.svg,.gif',
                    crop: true,
                    columnRatio: 6,
                    horizontal: {
                      left: 4,
                      right: 8
                    }
                  }),
                  {
                    type: '',
                    label: '图片位置',
                    name: 'backgroundPosition',
                    asFormItem: true,
                    columnRatio: 6,
                    horizontal: {
                      left: 4,
                      right: 8
                    },
                    children: () => (
                      <ul className="ae-Background_setting—pos">
                        {[
                          '0 0',
                          '50% 0',
                          '100% 0',
                          '0 50%',
                          '50% 50%',
                          '100% 50%',
                          '0 100%',
                          '50% 100%',
                          '100% 100%'
                        ].map((item: string) => {
                          return (
                            <li
                              key={item}
                              data-pos={item}
                              className={cx('ae-Background_setting—pos_item', {
                                active: item === props.value?.backgroundPosition
                              })}
                              onClick={onChange('backgroundPosition')}
                            />
                          );
                        })}
                      </ul>
                    )
                  }
                ]
              })}

              {amisRender(
                {
                  type: 'select',
                  label: '图片尺寸',
                  name: 'backgroundSize',
                  mode: 'horizontal',
                  placeholder: '图片尺寸',
                  value: getbsValue(),
                  options: [
                    {
                      label: '充满',
                      value: 'cover'
                    },
                    {
                      label: '合适',
                      value: 'contain'
                    },
                    {
                      label: '拉伸',
                      value: '100%'
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
                    },
                    {
                      label: '原始尺寸',
                      value: 'auto no-repeat'
                    }
                  ]
                },
                {
                  onChange: (value: string) => handleChange('backgroundSize', value)
                }
              )}
            </div>
          )}
          {/* 不设置背景 */}
          {currentItem === 'noset' && (
            <div className="ae-Background_setting noset"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Background;

@FormItem({type: 'style-background'})
export class BackgroundRenderer extends React.Component<FormControlProps> {
  render() {
    return <Background {...this.props} />;
  }
}
