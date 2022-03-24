import React from 'react';
import cx from 'classnames';
import {Circle} from 'rc-progress';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {SchemaClassName} from '../Schema';
interface ColorProps {
  value: number;
  color: string;
}

export type ColorMapType = Array<string> | Array<ColorProps> | string;

interface ProgressProps extends ThemeProps {
  type: 'line' | 'circle' | 'dashboard';
  showLabel: boolean;
  value: number;
  stripe?: boolean;
  animate?: boolean;
  map?: ColorMapType;
  placeholder?: string;
  format?: (value?: number) => JSX.Element;
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  strokeWidth?: number;
  progressClassName?: SchemaClassName;
  classnames: ClassNamesFn;
}
export class Progress extends React.Component<ProgressProps, Object> {
  static defaultProps: Partial<ProgressProps> = {
    type: 'line',
    placeholder: '-',
    progressClassName: '',
    map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
    showLabel: true
  };

  getCurrentColor() {
    const color = this.props.map;
    if (!color || !color.length) {
      return 'bg-primary';
    }
    if (typeof color === 'string') {
      return color;
    } else {
      return this.getLevelColor(color);
    }
  }

  getLevelColor(color: Array<string> | Array<ColorProps>) {
    const value = this.props.value;
    const colorArray = this.getColorArray(color).sort(
      (a: {value: number}, b: {value: number}) => a.value - b.value
    );
    for (let i = 0; i < colorArray.length; i++) {
      if (colorArray[i].value > value) {
        return colorArray[i].color;
      }
    }
    return colorArray[colorArray.length - 1].color;
  }

  getColorArray(color: Array<string> | Array<ColorProps>) {
    const span = 100 / color.length;
    return color.map((item, index) => {
      if (typeof item === 'string') {
        return {
          color: item,
          value: (index + 1) * span
        };
      }
      return item;
    });
  }

  getLabel(prefixCls: string) {
    const {value, format, showLabel, classnames: cx} = this.props;
    if (!showLabel) {
      return null;
    }
    const textFormatter = format || (value => `${value}%`);
    const content = textFormatter(value);
    return (
      <span className={cx(`${prefixCls}-text`)} key="value">
        {content}
      </span>
    );
  }

  render() {
    const {
      className,
      progressClassName,
      type,
      value,
      placeholder,
      stripe,
      animate,
      gapDegree,
      gapPosition,
      strokeWidth,
      classnames: cx
    } = this.props;

    const isLineType = type === 'line';
    const prefixCls = isLineType ? 'Progress-line' : 'Progress-circle';
    const bgColor = this.getCurrentColor();
    const isColorClass = /bg-/.test(bgColor);

    let viewValue: React.ReactNode;
    if (typeof value !== 'number') {
      viewValue = <span className="text-muted">{placeholder}</span>;
    } else if (type === 'line') {
      const style: any = {};
      const barStyle: any = {
        width: `${value}%`
      };
      strokeWidth && (style.height = strokeWidth);
      !isColorClass && (barStyle.backgroundColor = bgColor);

      viewValue = [
        <div key="progress" className={cx(prefixCls, progressClassName)}>
          <div className={cx(`${prefixCls}-inter`)} style={style}>
            <div
              className={cx(
                `${prefixCls}-bar`,
                {[bgColor]: isColorClass},
                {[`${prefixCls}-bar--stripe`]: stripe},
                {[`${prefixCls}-bar--animate`]: animate && !stripe},
                {[`${prefixCls}-bar--stripe-animate`]: animate && stripe}
              )}
              title={`${value}%`}
              style={barStyle}
            />
          </div>
        </div>,
        this.getLabel(prefixCls)
      ];
    } else if (type === 'circle' || type === 'dashboard') {
      const circleWidth = strokeWidth || 6;
      const gapPos = gapPosition || (type === 'dashboard' && 'bottom') || 'top';
      const getGapDegree = () => {
        if (gapDegree || gapDegree === 0) {
          return gapDegree;
        }
        if (type === 'dashboard') {
          return 75;
        }
        return undefined;
      };

      viewValue = [
        <div className={cx(prefixCls, progressClassName)} key="circle">
          <Circle
            percent={value}
            strokeColor={!isColorClass ? bgColor : ''}
            strokeWidth={circleWidth}
            trailWidth={circleWidth}
            prefixCls={isColorClass ? bgColor : ''}
            gapDegree={getGapDegree()}
            gapPosition={gapPos}
          />
          {this.getLabel(prefixCls)}
        </div>
      ];
    }

    return <div className={cx('Progress', className)}>{viewValue}</div>;
  }
}

export default themeable(Progress);
