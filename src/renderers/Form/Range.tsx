import * as React from 'react';
import {
    FormItem,
    FormControlProps
} from './Item';
import * as cx from 'classnames';
import InputRange from '../../components/Range';
import { closeIcon } from '../../components/icons';

export interface RangeProps extends FormControlProps {
    max?: number;
    min?: number;
    step?: number;
    unit?: string;
    clearable?: boolean;
    name?: string;
    disabled?: boolean;
    showInput?: boolean;
    className?: string;
    onChange: (value: number) => void;
};

export interface DefaultProps {
    max: number;
    min: number;
    step: number;
    unit: string;
    clearable: boolean;
    disabled: boolean;
    showInput: boolean;
};

type PropsWithDefaults = RangeProps & DefaultProps;

export interface RangeState {
    value: any;
};

export default class RangeControl extends React.PureComponent<RangeProps, RangeState> {
    midLabel?: HTMLSpanElement;

    static defaultProps: DefaultProps = {
        max: 100,
        min: 0,
        step: 1,
        unit: '',
        clearable: true,
        disabled: false,
        showInput: false
    }

    constructor(props: RangeProps) {
        super(props);
        this.state = {
            value: parseFloat(props.value) || 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.rangeValue = this.rangeValue.bind(this);
        this.midLabelRef = this.midLabelRef.bind(this);
    }

    componentWillReceiveProps(nextProps: RangeProps) {
        const { value } = this.props;
        if (value !== nextProps.value) {
            this.setState({
                value: parseFloat(nextProps.value) || 0
            });
        }
    }

    componentDidMount() {
        this.updateStyle();
    }

    componentDidUpdate(prevProps: RangeProps) {
        if (prevProps.showInput !== this.props.showInput) {
            this.updateStyle();
        }
    }

    updateStyle() {
        const {
            showInput,
            classPrefix: ns
        } = this.props;

        let offsetWidth = (this.midLabel as HTMLSpanElement).offsetWidth;
        let left = `calc(50% - ${offsetWidth / 2}px)`;
        (document.querySelector(`.${ns}InputRange-label--value`) as HTMLSpanElement).style.left = left;
        if (showInput) {
            left = `calc(50% - ${offsetWidth / 2 + 60}px)`;
        }
        (this.midLabel as HTMLSpanElement).style.left = left;
    }

    midLabelRef(ref: any) {
        this.midLabel = ref;
    }

    handleChange(value: any) {
        this.setState({
            value: this.getValue(value)
        });
    }

    handleEnd(value: any) {
        const {
            onChange
        } = this.props;
        this.setState({
            value
        }, () => onChange(value));
    }

    getStepPrecision() {
        const {
            step
        } = this.props;

        return typeof step !== 'number' || step >= 1 || step < 0
            ? 0
            : step.toString().split(".")[1].length;
    }

    getValue(value: any) {
        const {
            max,
            min,
            step
        } = this.props as PropsWithDefaults;

        if (value === '' || value === '-' || new RegExp('^[-]?\\d+[.]{1}[0]{0,' + this.getStepPrecision() + '}$').test(value)) {
            return value;
        }

        // if (!value || value === '00') {
        //     return min;
        // }

        value = Math.round(parseFloat(value) / step) * step;
        value = (step < 1) ? parseFloat(value.toFixed(this.getStepPrecision())) : ~~value;

        return (value < min && min) || (value > max && max) || value;
    }

    handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: this.getValue(evt.target.value)
        });
    }

    rangeValue() {
        let { value } = this.state;
        // if (/^\d+[.]{1}$/.test(value)) {
        //     return this.props.min;
        // }
        return parseFloat(value);
    }

    render() {
        const {
            max,
            min,
            step,
            unit,
            clearable,
            name,
            disabled,
            className,
            onChange,
            showInput,
            classnames: cx,
            classPrefix: ns,
        } = this.props as PropsWithDefaults;

        return (
            <div className={cx("RangeControl", {
                'RangeControl--withInput': showInput,
                'RangeControl--clearable': clearable,
            }, className)}>
                <InputRange
                    classPrefix={ns}
                    value={this.rangeValue()}
                    disabled={disabled}
                    onChange={this.handleChange}
                    onChangeComplete={this.handleEnd}
                    max={max}
                    min={min}
                    step={step}
                    formatLabel={(value: any) => value + unit}
                />

                <span className={cx("InputRange-label InputRange-label--mid")} ref={this.midLabelRef}>
                    <span className={cx("InputRange-labelContainer")}>
                        {((max + min) / 2).toFixed(this.getStepPrecision()) + unit}
                    </span>
                </span>

                {showInput ? (
                    <div className={cx("InputRange-input")}>
                        <input
                            className={this.state.value !== min ? 'is-active' : ''}
                            type="text"
                            name={name}
                            value={this.state.value}
                            disabled={disabled}
                            onChange={this.handleInputChange}
                        />
                        {/* <span
                            className={cx("InputRange-unit", this.state.value !== min ? 'is-active' : '')}
                        >
                            {unit}
                        </span> */}
                    </div>
                ) : null}

                {/* {clearable && this.sliderValue() ? (
                    <span
                        className={cx('icon icon-clear', {
                            'active': (this.state.value !== min)
                        })}
                        onClick={() => this.handleChange(0)}
                    >
                        <i className="iconfont icon-x"></i>
                    </span>
                ) : null} */}

                {clearable && this.rangeValue() !== min && showInput ? (
                    <a onClick={() => this.handleChange(min)} className={cx("InputRange-clear", {
                        'is-active': (this.state.value !== min)
                    })}>{closeIcon}</a>
                ) : null}
            </div >
        );
    }
}

@FormItem({
    test: /(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?(slider|range)$/,
    name: 'range-control'
})
export class RangeControlRenderer extends RangeControl { };