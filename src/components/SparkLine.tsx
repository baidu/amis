import React from 'react';
import {localeable, LocaleProps} from '../locale';
import {themeable, ThemeProps} from '../theme';
import {PlainObject} from '../types';

export interface SparkLineProps extends ThemeProps, LocaleProps {
  className?: string;
  width: number;
  height: number;
  value?: Array<
    | number
    | {
        value: number;
        label?: string;
      }
  >;
  placeholder?: string;
  onClick?: (e: React.MouseEvent, value?: PlainObject) => void;
}

export class SparkLine extends React.Component<SparkLineProps> {
  static defaultProps = {
    width: 100,
    height: 50
  };

  normalizeValue(item: any): number {
    if (typeof item === 'number') {
      return item;
    } else if (item && typeof item.value === 'number') {
      return item.value;
    } else {
      return Number(item) || 0;
    }
  }

  renderLines() {
    const {width, height, value, classnames: cx} = this.props;

    const values = value!.map(item => this.normalizeValue(item));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const duration = max - min || 1;

    const gap = width / (values.length - 1);
    const points: Array<{
      x: number;
      y: number;
    }> = [];

    values.forEach((value, index) => {
      points.push({
        x: index * gap,
        y: height - ((value - min) * height) / duration
      });
    });

    const lineD = points
      .map((value, index) => `${index === 0 ? 'M' : 'L'} ${value.x} ${value.y}`)
      .join(' ');
    const areaD = `${lineD} V ${height} L 0 ${height} Z`;

    // todo 支持鼠标 hover 显示对应数据。

    return (
      <g>
        <path className={cx(`Sparkline-area`)} d={areaD} stroke="none" />
        <path className={cx(`Sparkline-line`)} d={lineD} fill="none" />
      </g>
    );
  }

  render() {
    const {
      classnames: cx,
      className,
      value,
      width,
      height,
      placeholder,
      translate: __,
      onClick
    } = this.props;

    return (
      <div
        className={cx(
          'Sparkline',
          className,
          onClick ? 'Sparkline--clickable' : ''
        )}
        onClick={onClick}
      >
        {Array.isArray(value) && value.length > 1 ? (
          <svg
            className={cx('Sparkline-svg')}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
          >
            {this.renderLines()}
          </svg>
        ) : (
          placeholder ?? __('placeholder.empty')
        )}
      </div>
    );
  }
}

export default themeable(localeable(SparkLine));
