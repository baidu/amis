/**
 * @file Range
 * @description
 * @author fex
 */

import React from 'react';
import InputRange from 'react-input-range';
import {uncontrollable} from 'uncontrollable';
import {RendererProps} from '../factory';
import {ClassNamesFn, themeable} from '../theme';

interface RangeProps extends RendererProps {
  id?: string;
  className?: string;
  min: number;
  max: number;
  value:
    | {
        min: number;
        max: number;
      }
    | number;
  classPrefix: string;
  classnames: ClassNamesFn;
  onChange: (value: any) => void;
}

export class Range extends React.Component<RangeProps, any> {
  static defaultProps: Partial<RangeProps> = {
    min: 1,
    max: 100
  };

  render() {
    const {min, max, value, className, classPrefix: ns, multiple} = this.props;

    const classNames = {
      activeTrack: multiple
        ? `${ns}InputRange-track is-active`
        : `${ns}InputRange-track`,
      disabledInputRange: `${ns}InputRange is-disabled`,
      inputRange: `${ns}InputRange`,
      labelContainer: `${ns}InputRange-labelContainer`,
      maxLabel: `${ns}InputRange-label ${ns}InputRange-label--max`,
      minLabel: `${ns}InputRange-label ${ns}InputRange-label--min`,
      slider: `${ns}InputRange-slider`,
      sliderContainer: `${ns}InputRange-sliderContainer`,
      track: `${ns}InputRange-track ${ns}InputRange-track--background`,
      valueLabel: `${ns}InputRange-label ${ns}InputRange-label--value`
    };

    return (
      <InputRange
        {...this.props}
        classNames={classNames}
        minValue={min}
        maxValue={max}
        value={value}
      />
    );
  }
}

export default themeable(
  uncontrollable(Range, {
    value: 'onChange'
  })
);
