import * as React from 'react';
import Transition, {ENTERED, ENTERING, EXITED, EXITING} from 'react-transition-group/Transition';
import {Renderer, RendererProps} from '../factory';
import {autobind} from '../utils/helper';
import {dotIcon, leftArrowIcon, rightArrowIcon} from '../components/icons';

const animationStyles: {
    [propName: string]: string;
} = {
    [ENTERING]: 'in',
    [ENTERED]: 'in',
    [EXITING]: 'out',
    // [EXITED]: 'out'
};
export interface CarouselProps extends RendererProps {
    className?: string;
    auto?: boolean;
    value?: any;
    placeholder?: any;
    width?: number;
    height?: number;
    controls: string[];
    interval: number;
    duration: number;
    controlTheme: 'light' | 'dark';
    animation: 'fade' | 'slideLeft' | 'slideRight';
}

export interface CarouselState {
    current: number;
    options: any[];
    showArrows: boolean;
    nextAnimation?: 'slideLeft' | 'slideRight' | '';
}

export class Carousel extends React.Component<CarouselProps, CarouselState> {
    wrapperRef: HTMLDivElement;
    intervalTimeout: any;
    durationTimeout: any;

    static defaultProps: Pick<
        CarouselProps,
        'auto' | 'interval' | 'duration' | 'controlTheme' | 'animation' | 'controls' | 'placeholder'
    > = {
        auto: true,
        interval: 2000,
        duration: 500,
        controlTheme: 'light',
        animation: 'fade',
        controls: ['dots', 'arrows'],
        placeholder: ''
    };

    state:CarouselState = {
        current: 0,
        options: this.props.value ? this.props.value : this.props.options ? this.props.options : [],
        showArrows: false,
        nextAnimation: ''
    };

    componentDidMount() {
        this.prepareAutoSlide();
    }

    componentWillUnmount() {
        this.clearAutoTimeout()
    }

    @autobind
    prepareAutoSlide () {
        if (this.state.options.length < 2) {
            return;
        }

        this.clearAutoTimeout();
        if (this.props.auto) {
            this.intervalTimeout = setTimeout(this.autoSlide, this.props.interval);
        }
    }

    @autobind
    autoSlide (rel?:string) {
        this.clearAutoTimeout();
        const {animation} = this.props;
        let {nextAnimation} = this.state;

        switch (rel) {
            case 'prev':
                animation.includes('slide') ? nextAnimation = 'slideLeft' : nextAnimation = '';
                this.transitFramesTowards('right', nextAnimation);
                break;
            case 'next':
                animation.includes('slide') ? nextAnimation = 'slideRight' : nextAnimation = '';
                this.transitFramesTowards('left', nextAnimation);
                break;
            default:
                nextAnimation = '';
                this.transitFramesTowards('left', nextAnimation);
                break;
        }

        this.durationTimeout = setTimeout(this.prepareAutoSlide, this.props.duration);
    }

    @autobind
    transitFramesTowards (direction:string, nextAnimation: 'slideLeft' | 'slideRight' | '') {
        let {current} = this.state;

        switch (direction) {
            case 'left':
                current = this.getFrameId('next');
                break;
            case 'right':
                current = this.getFrameId('prev');
                break;
        }

        this.setState({
            current,
            nextAnimation
        });
    }

    @autobind
    getFrameId (pos?:string) {
        const {options, current} = this.state;
        const total = options.length;
        switch (pos) {
            case 'prev':
                return (current - 1 + total) % total;
            case 'next':
                return (current + 1) % total;
            default:
                return current;
        }
    }

    @autobind
    next () {
        this.autoSlide('next');
    }

    @autobind
    prev () {
        this.autoSlide('prev');
    }

    @autobind
    clearAutoTimeout () {
        clearTimeout(this.intervalTimeout);
        clearTimeout(this.durationTimeout);
    }

    setWrapperRef = (wrapper:HTMLDivElement) => {
        this.wrapperRef = wrapper;
    }

    renderDots() {
        const {classnames: cx, controlTheme} = this.props;
        const {current, options} = this.state;
        return (
            <div
                className={cx('Carousel-control-dots')}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {Array.from({length: options.length}).map((_, i) =>
                    <span key={i} className={cx('Carousel-dot', controlTheme, current === i ? 'is-active' : 'is-default')}></span>
                )}
            </div>
        )
    }

    renderButtons() {
        const {classnames: cx, controlTheme} = this.props;
        return (
            <div
                className={cx('Carousel-control-arrows')}
                onMouseEnter={this.handleMouseEnter}
                onMouseMove={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div className={cx('Carousel-leftArrow', controlTheme)} onClick={this.prev}>{leftArrowIcon}</div>
                <div className={cx('Carousel-rightArrow', controlTheme)} onClick={this.next}>{rightArrowIcon}</div>
            </div>
        )
    }

    @autobind
    defaultSchema() {
        return {
            type: 'tpl',
            tpl: "<% if (data.image) { %> <img src=\"<%= data.image %>\" /> <% } else if (data.label) { %> <div> <%= data.label %> </div> <% } else if (data.html) { %> <%= data.html %> <% } %>"
        }
    }

    @autobind
    handleMouseEnter() {
        this.setState({
            showArrows: true
        });
        this.clearAutoTimeout();
    }

    @autobind
    handleMouseLeave() {
        this.setState({
            showArrows: false
        });
        this.prepareAutoSlide();
    }

    render() {
        const {
            render,
            className,
            classnames: cx,
            itemSchema,
            animation,
            width,
            height,
            controls,
            placeholder
        } = this.props;
        const {
            options,
            showArrows,
            current,
            nextAnimation
        } = this.state;

        let body:JSX.Element | null = null;
        const [dots, arrows] = [controls.indexOf('dots') > -1, controls.indexOf('arrows') > -1];
        const animationName = nextAnimation || animation;
        const style = {
            width: width + 'px',
            height: height + 'px'
        };

        if (options && options.length) {
            body = (
                <div
                    ref={this.setWrapperRef}
                    className={cx('Carousel-container')}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseMove={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    style={style}
                    >
                    {options.map((option:any, key:number) => (
                        <Transition
                            mountOnEnter={false}
                            unmountOnExit={false}
                            in={key === current}
                            timeout={500}
                            key={key}
                        >
                            {(status:string) => {
                                if (status === ENTERING) {
                                    this.wrapperRef.childNodes.forEach((item:HTMLElement) => item.offsetHeight);
                                }

                                return (
                                    <div className={cx('Carousel-item', animationName, animationStyles[status])}>
                                        {render(`${current}/body`, itemSchema ? itemSchema : this.defaultSchema(), {
                                            data: option
                                        })}
                                    </div>
                                );
                            }}
                        </Transition>
                    ))}
                    {dots ? this.renderDots() : null}
                    {arrows && showArrows ? this.renderButtons() : null}
                </div>
            );
        }

        return (
            <div className={cx('Carousel', className)}>
                {body ? body : placeholder}
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)carousel/,
    name: 'carousel',
})
export class CarouselRenderer extends Carousel {}
