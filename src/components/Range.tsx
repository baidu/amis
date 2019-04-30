/**
 * @file Input Range
 * @author fex
 */
import * as React from 'react';
import * as InputRange from 'react-input-range';
import uncontrollable = require('uncontrollable');
import * as cx from 'classnames';
import { RendererProps } from '../factory';
import { ClassNamesFn, themeable } from '../theme';

interface RangeProps extends RendererProps {
    id?: string;
    className?: string;
    min: number;
    max: number;
    value?: number;
    classPrefix: string;
    classnames: ClassNamesFn;
}

export class Range extends React.Component<RangeProps, any> {
    static defaultProps: Partial<RangeProps> = {
        min: 1,
        max: 100
    };

    render() {
        const {
            min,
            max,
            value,
            className,
            classPrefix: ns
        } = this.props;

        const classNames = {
            activeTrack: `${ns}InputRange-track is-active`,
            disabledInputRange: `${ns}InputRange is-disabled`,
            inputRange: `${ns}InputRange`,
            labelContainer: `${ns}InputRange-labelContainer`,
            maxLabel: `${ns}InputRange-label ${ns}InputRange-label--max`,
            minLabel: `${ns}InputRange-label ${ns}InputRange-label--min`,
            slider: `${ns}InputRange-slider`,
            sliderContainer: `${ns}InputRange-sliderContainer`,
            track: `${ns}InputRange-track ${ns}InputRange-track--background`,
            valueLabel: `${ns}InputRange-label ${ns}InputRange-label--value`,
        }

        return (
            <InputRange {...this.props} className={className} classNames={classNames} minValue={min} maxValue={max} value={typeof value === 'number' ? value : min}  />
        )
    }
}

export default themeable(uncontrollable(Range, {
    value: 'onChange'
}));
