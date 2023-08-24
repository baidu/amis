/**
 * @file Range
 * @description
 * @author fex
 */

import range from 'lodash/range';
import keys from 'lodash/keys';
import isString from 'lodash/isString';
import difference from 'lodash/difference';
import React from 'react';
import TooltipWrapper from './TooltipWrapper';
import {uncontrollable} from 'amis-core';

import {Overlay} from 'amis-core';
import type {ThemeProps} from 'amis-core';
import {themeable} from 'amis-core';
import {autobind, camel} from 'amis-core';
import {stripNumber} from 'amis-core';
import {safeAdd, safeSub} from 'amis-core';
import {findDOMNode} from 'react-dom';
import {Icon} from './icons';

type MarksType = {
  [index: number | string]: Record<
    number,
    React.ReactNode | {style?: React.CSSProperties; label?: string}
  >;
};

interface HandleItemState {
  isDrag: boolean;
  labelActive: boolean;
}

export interface MultipleValue {
  min: number;
  max: number;
}
export type Value = string | MultipleValue | number | [number, number];
export type FormatValue = MultipleValue | number;
export type TooltipPosType = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type InputRangeRendererEvent = 'change' | 'blur' | 'focus';
export type InputRangeRendererAction = 'clear';

interface HandleItemProps extends ThemeProps {
  disabled: boolean;
  value: number;
  min: number;
  max: number;
  type?: 'min' | 'max';
  onChange: (value: number, type: 'min' | 'max') => void;
  onAfterChange: () => void;
  tooltipVisible?: boolean;
  tipFormatter?: (value: Value) => boolean;
  unit?: string;
  tooltipPlacement?: string;
}

interface LabelProps extends ThemeProps {
  show: boolean;
  value: number;
  tooltipVisible?: boolean;
  tipFormatter?: (value: Value) => boolean;
  unit?: string;
  placement?: string;
  activePlacement?: string;
  positionLeft?: number;
  positionTop?: number;
}

// 小数或者整数
const MARKS_REG = /^[0-9]+(\.?[0-9]+)?%$/;

/**
 * 滑块值 -> position.left
 * @param value 滑块值
 * @param min 最小值
 * @param max 最大值
 * @returns position.left
 */
const valueToOffsetLeft = (value: any, min: number, max: number) =>
  // 最多保留两位小数，且尽量取整
  Math.floor(((value - min) * 10000) / (max - min)) / 100 + '%';

/**
 * 滑块handle
 * 双滑块涉及两个handle，单独抽一个组件
 */
class HandleItem extends React.Component<HandleItemProps, HandleItemState> {
  handleRef: React.RefObject<HTMLDivElement> = React.createRef();
  constructor(props: HandleItemProps) {
    super(props);

    this.state = {
      isDrag: false,
      labelActive: false
    };
  }

  /**
   * mouseDown事件
   * 防止拖动过快，全局监听 mousemove、mouseup
   */
  @autobind
  onMouseDown() {
    this.setState({
      isDrag: true,
      labelActive: true
    });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  /**
   * mouseMove事件
   * 触发公共onchange事件
   */
  @autobind
  onMouseMove(e: MouseEvent) {
    const {isDrag} = this.state;
    const {type = 'min'} = this.props;
    if (!isDrag) {
      return;
    }
    this.props.onChange(e.pageX, type);
  }

  /**
   * mouseUp事件
   * 移除全局 mousemove、mouseup
   */
  @autobind
  onMouseUp() {
    this.setState({
      isDrag: false
    });
    const {onAfterChange} = this.props;
    onAfterChange && onAfterChange();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  /**
   * mouseEnter事件
   * 鼠标移入 -> 展示label
   */
  @autobind
  onMouseEnter() {
    this.setState({
      labelActive: true
    });
  }

  /**
   * mouseLeave事件
   * 鼠标移出 & !isDrag -> 隐藏label
   */
  @autobind
  onMouseLeave() {
    const {isDrag} = this.state;
    if (isDrag) {
      return;
    }
    this.setState({
      labelActive: false
    });
  }

  @autobind
  onTouchStart() {
    this.setState({
      isDrag: true,
      labelActive: true
    });
  }

  @autobind
  onTouchMove(e: any) {
    const {isDrag} = this.state;
    const {type = 'min'} = this.props;
    if (!isDrag) {
      return;
    }
    this.props.onChange(e.touches[0].clientX, type);
  }

  @autobind
  onTouchEnd() {
    this.setState({
      labelActive: false
    });
  }

  render() {
    const {
      classnames: cx,
      disabled,
      value,
      min,
      max,
      tooltipVisible,
      tipFormatter,
      unit,
      tooltipPlacement = 'auto',
      mobileUI
    } = this.props;
    const {isDrag, labelActive} = this.state;
    const style = {
      left: valueToOffsetLeft(value, min, max),
      zIndex: isDrag ? 2 : 1
    };

    return disabled ? (
      <div className={cx('InputRange-handle')} style={style}>
        <div className={cx('InputRange-handle-icon')}>
          <Icon icon="slider-handle" className="icon" />
        </div>
      </div>
    ) : (
      <div
        className={cx('InputRange-handle', {
          'is-mobile': mobileUI
        })}
        style={style}
        ref={this.handleRef}
      >
        <div
          className={cx(
            isDrag ? 'InputRange-handle-drage' : 'InputRange-handle-icon'
          )}
          onMouseDown={this.onMouseDown}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
        >
          <Icon icon="slider-handle" className="icon" />
        </div>

        <Overlay
          placement={tooltipPlacement}
          target={() => findDOMNode(this)}
          container={() => findDOMNode(this) as HTMLElement}
          rootClose={false}
          show={true}
        >
          <Label
            show={labelActive}
            classPrefix={this.props.classPrefix}
            classnames={cx}
            value={value}
            tooltipVisible={tooltipVisible}
            tipFormatter={tipFormatter}
            unit={unit}
            placement={tooltipPlacement}
          />
        </Overlay>
      </div>
    );
  }
}

/**
 * 滑块标签
 */
class Label extends React.Component<LabelProps, any> {
  render() {
    const {
      classnames: cx,
      value,
      show,
      tooltipVisible,
      tipFormatter,
      unit = '',
      positionLeft = 0,
      positionTop = 0
    } = this.props;

    let {placement} = this.props;
    if (placement === 'auto') {
      positionLeft >= 0 && positionTop >= 0 && (placement = 'top');
      positionLeft >= 0 && positionTop < 0 && (placement = 'bottom');
      positionLeft < 0 && positionTop >= 0 && (placement = 'left');
      positionLeft < 0 && positionTop < 0 && (placement = 'right');
    }

    // tooltipVisible 优先级 比show高
    // tooltipVisible 为 true时，tipFormatter才生效
    const isShow =
      tooltipVisible !== undefined
        ? tooltipVisible && tipFormatter
          ? tipFormatter(value)
          : tooltipVisible
        : show;
    return (
      <div
        className={cx('InputRange-label', `pos-${camel(placement)}`, {
          'InputRange-label-visible': isShow
        })}
      >
        <span>{value + unit}</span>
      </div>
    );
  }
}

// @todo 丰富这个
export interface RangeItemProps extends ThemeProps {
  [propName: string]: any;
}

export class Range extends React.Component<RangeItemProps, any> {
  multipleValue: MultipleValue = {
    min: (this.props.value as MultipleValue).min,
    max: (this.props.value as MultipleValue).max
  };
  trackRef: React.RefObject<HTMLDivElement> = React.createRef();

  /**
   * 接收组件value变换
   * value变换 -> Range.updateValue
   * @param value
   */
  @autobind
  updateValue(value: FormatValue) {
    const {onChange} = this.props;
    onChange && onChange(value);
  }

  /**
   * 获取 坐标、宽高
   */
  @autobind
  getBoundingClient(dom: Element) {
    const {x, y, width, height} = dom?.getBoundingClientRect();
    return {x, y, width, height};
  }

  /**
   * 坐标 -> 滑块值
   * @param pageX target.target 坐标
   * @returns 滑块值
   */
  pageXToValue(pageX: number) {
    const {x, width} = this.getBoundingClient(this.trackRef.current as Element);
    const {max, min} = this.props;
    return ((pageX - x) * (max - min)) / width + min;
  }

  /**
   * 滑块改变事件
   * @param pageX target.pageX 坐标
   * @param type min max
   * @returns void
   */
  @autobind
  onChange(pageX: number, type: string = 'min') {
    const {max, min, step, multiple, value: originValue} = this.props;
    const value = this.pageXToValue(pageX);
    if (value > max || value < min) {
      return;
    }
    const result = stripNumber(this.getStepValue(value, step));
    // 值相同 不更新
    if (result === originValue) {
      return;
    }
    if (multiple) {
      this.updateValue({...(originValue as MultipleValue), [type]: result});
    } else {
      this.updateValue(result);
    }
  }

  /**
   * 获取step为单位的value
   * @param value 拖拽后计算的value
   * @param step 步长
   * @returns step为单位的value
   */
  getStepValue(value: number, step: number) {
    const surplus = value % step;
    let result = 0;
    // 余数 >= 步长一半 -> 向上取
    // 余数 <  步长一半 -> 向下取
    const _value = surplus >= step / 2 ? value : safeSub(value, step);
    while (result <= _value) {
      result = safeAdd(result, step);
    }
    return result;
  }

  /**
   * 点击滑轨 -> 触发onchange 改变value
   * @param e event
   * @returns void
   */
  @autobind
  onClickTrack(e: any) {
    if (!!this.props.disabled) {
      return;
    }
    const {value} = this.props;
    const _value = this.pageXToValue(e.pageX);
    const type =
      Math.abs(_value - (value as MultipleValue).min) >
      Math.abs(_value - (value as MultipleValue).max)
        ? 'max'
        : 'min';
    this.onChange(e.pageX, type);
  }

  /**
   * 设置步长
   * @returns ReactNode
   */
  @autobind
  renderSteps() {
    const {max, min, step, showSteps, classnames: cx, parts} = this.props;
    let isShowSteps = showSteps;
    // 只要设置了 parts 就展示分隔
    if (parts > 1 || Array.isArray(parts)) {
      isShowSteps = true;
    }
    // 总区间
    const section = max - min;
    // 总区间被平均分为多少块
    const steps = parts > 1 ? parts : Math.floor(section / step);
    // 平均分 每块的长度
    const partLength = section / steps;
    // parts为数组时，以0为起点(传入的值 - min)
    const partLengthList = Array.isArray(parts)
      ? parts.map(item => item - min)
      : range(steps - 1).map(item => (item + 1) * partLength);
    return (
      isShowSteps && (
        <div>
          {partLengthList.map(item => (
            <span
              key={item}
              className={cx('InputRange-track-dot')}
              style={{left: (item * 100) / (max - min) + '%'}}
            ></span>
          ))}
        </div>
      )
    );
  }

  /**
   * 双滑块改变最大值、最小值
   * @param pageX 拖拽后的pageX
   * @param type 'min' | 'max'
   */
  @autobind
  onGetChangeValue(pageX: number, type: keyof MultipleValue) {
    const {max, min} = this.props;
    const value = this.pageXToValue(pageX);
    if (value > max || value < min) {
      return;
    }
    this.multipleValue[type] = stripNumber(
      this.getStepValue(value, this.props.step)
    );
    const _min = Math.min(this.multipleValue.min, this.multipleValue.max);
    const _max = Math.max(this.multipleValue.min, this.multipleValue.max);
    this.updateValue({max: _max, min: _min});
  }

  /**
   * 计算每个标记 position.left
   * @param value 滑块值
   * @returns
   */
  @autobind
  getOffsetLeft(value: number | string, getNumber?: boolean) {
    const {max, min} = this.props;
    if (isString(value) && MARKS_REG.test(value)) {
      return getNumber ? parseFloat(value) : value;
    }
    value = Math.min(Math.max(+value, min), max);
    return getNumber
      ? ((value - min) * 100) / (max - min)
      : ((value - min) * 100) / (max - min) + '%';
  }

  /**
   * 计算每个刻度标记mark 的最大宽度 max-width
   * 通过给父元素div的width赋值，从而继承
   * @param value 刻度标记key
   * @param marks 整个刻度标记对象
   * @returns 刻度标记的最大宽度 string
   */
  @autobind
  getMarkMaxWidth(value: keyof MarksType, marks: MarksType) {
    const {max, min, mobileUI} = this.props;
    const curNum = isString(value) ? parseInt(value, 10) : value;
    // 给最大宽度赋初始值 默认最大
    let maxWidth = Math.abs(max - min);
    // 遍历刻度标记masks 寻找距离当前节点最近的刻度标记 并记录差值
    keys(marks).forEach((mKey: keyof MarksType) => {
      const mNum = isString(mKey) ? parseInt(mKey, 10) : mKey;
      if (mKey !== value) {
        maxWidth = Math.min(Math.abs(curNum - mNum), maxWidth);
      }
    });
    // 差值的1/2 即为此刻度标记的最大宽度
    return mobileUI
      ? Math.floor(maxWidth) + '%'
      : Math.floor(maxWidth / 2) + '%';
  }

  render() {
    const {
      classnames: cx,
      marks,
      multiple,
      value,
      max,
      min,
      disabled,
      tooltipVisible,
      unit,
      tooltipPlacement,
      tipFormatter,
      onAfterChange,
      mobileUI
    } = this.props;

    // trace
    const traceActiveStyle = {
      width: valueToOffsetLeft(
        multiple
          ? (value as MultipleValue).max - (value as MultipleValue).min + min
          : value,
        min,
        max
      ),
      left: valueToOffsetLeft(
        multiple ? (value as MultipleValue).min : min,
        min,
        max
      )
    };

    // handle 双滑块
    const diff = difference(
      Object.values(value as MultipleValue),
      Object.values(this.multipleValue)
    );
    if (diff && !!diff.length) {
      this.multipleValue = {
        min: (value as MultipleValue).min,
        max: (value as MultipleValue).max
      };
    }

    const sortMaks = marks
      ? keys(marks).sort(
          (a: keyof MarksType, b: keyof MarksType) =>
            (this.getOffsetLeft(a, true) as number) -
            (this.getOffsetLeft(b, true) as number)
        )
      : [];

    return (
      <div className={cx('InputRange-wrap')}>
        <div
          ref={this.trackRef}
          className={cx('InputRange-track', 'InputRange-track--background')}
          onClick={this.onClickTrack}
        >
          <div
            className={cx('InputRange-track-active')}
            style={traceActiveStyle}
          />

          {/* 显示步长 */}
          {this.renderSteps()}

          {/* 滑块handle */}
          {multiple ? (
            ['min', 'max'].map((type: 'min' | 'max') => (
              <HandleItem
                key={type}
                value={this.multipleValue[type]}
                type={type}
                min={min}
                max={max}
                classPrefix={this.props.classPrefix}
                classnames={cx}
                disabled={disabled}
                tooltipVisible={tooltipVisible}
                tipFormatter={tipFormatter}
                unit={unit}
                mobileUI={mobileUI}
                tooltipPlacement={tooltipPlacement}
                onAfterChange={onAfterChange}
                onChange={this.onGetChangeValue.bind(this)}
              />
            ))
          ) : (
            <HandleItem
              value={+value}
              min={min}
              max={max}
              classPrefix={this.props.classPrefix}
              classnames={cx}
              disabled={disabled}
              tooltipVisible={tooltipVisible}
              tipFormatter={tipFormatter}
              unit={unit}
              mobileUI={mobileUI}
              tooltipPlacement={tooltipPlacement}
              onAfterChange={onAfterChange}
              onChange={this.onChange.bind(this)}
            />
          )}

          {/* 刻度标记 */}
          {marks && (
            <div className={cx('InputRange-marks')}>
              {sortMaks.map((key: keyof MarksType) => {
                const offsetLeft = this.getOffsetLeft(key) as string;
                const markMaxWidth = this.getMarkMaxWidth(key, marks);

                if (MARKS_REG.test(offsetLeft)) {
                  return (
                    <div
                      key={key}
                      style={{left: offsetLeft, width: markMaxWidth}}
                    >
                      <TooltipWrapper
                        placement={'bottom'}
                        tooltip={(marks[key] as any)?.label || marks[key]}
                        trigger={['hover', 'focus']}
                        rootClose={false}
                      >
                        <span style={(marks[key] as any)?.style}>
                          {(marks[key] as any)?.label || marks[key]}
                        </span>
                      </TooltipWrapper>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default themeable(
  uncontrollable(Range, {
    value: 'onChange'
  })
);
