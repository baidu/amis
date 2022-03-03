import React from 'react';
import cx from 'classnames';
import {Circle} from 'rc-progress';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {SchemaClassName} from '../Schema';
interface ProgressProps extends ThemeProps {
  type: 'line' | 'circle' | 'dashboard';
  showLabel: boolean;
  value: number;
  stripe?: boolean;
  animate?: boolean;
  map?: Array<string>;
  placeholder?: string;
  format?: (value?: number) => JSX.Element;
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  strokeWidth?: number;
  classNames?: string;
  progressClassName?: SchemaClassName;
  progressBarClassName?: SchemaClassName;
  classnames: ClassNamesFn;
}
export class Progress extends React.Component<ProgressProps, Object> {
  static defaultProps: Partial<ProgressProps> = {
    type: 'line',
    placeholder: '-',
    progressClassName: '',
    progressBarClassName: '',
    map: ['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success'],
    showLabel: true
  };

  autoClassName(value: number) {
    const map = this.props.map;
    if (!map || !map.length) {
      return '';
    }
    let index = Math.floor((value * map.length) / 100);
    index = Math.max(0, Math.min(map.length - 1, index));
    return map[index];
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
      classNames,
      progressClassName,
      progressBarClassName,
      type,
      value,
      placeholder,
      stripe,
      animate,
      showLabel,
      gapDegree,
      gapPosition,
      strokeWidth,
      classnames: cx
    } = this.props;

    const isLineType = type === 'line';
    const prefixCls = isLineType ? 'Progress-line' : 'Progress-circle';

    let viewValue: React.ReactNode;
    if (typeof value !== 'number') {
      viewValue = <span className="text-muted">{placeholder}</span>;
    } else if (type === 'line') {
      const style: any = {};
      strokeWidth && (style.height = strokeWidth);
      viewValue = [
        <div key="progress" className={cx(prefixCls, progressClassName)}>
          <div className={cx(`${prefixCls}-inter`)} style={style}>
            <div
              className={cx(
                `${prefixCls}-bar`,
                progressBarClassName || this.autoClassName(value),
                {[`${prefixCls}-bar--stripe`]: stripe},
                {[`${prefixCls}-bar--animate`]: animate && !stripe},
                {[`${prefixCls}-bar--stripe-animate`]: animate && stripe}
              )}
              title={`${value}%`}
              style={{
                width: `${value}%`
              }}
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
        <div className={cx(prefixCls)} key="circle">
          <Circle
            percent={value}
            strokeColor=""
            strokeWidth={circleWidth}
            trailWidth={circleWidth}
            prefixCls={this.autoClassName(value)}
            gapDegree={getGapDegree()}
            gapPosition={gapPos}
          />
          {this.getLabel(prefixCls)}
        </div>
      ];
    }

    return <div className={cx('Progress', classNames)}>{viewValue}</div>;
  }
}

export default themeable(Progress);
