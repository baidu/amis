import * as React from 'react';
import Transition, {ENTERED, ENTERING, EXITING} from 'react-transition-group/Transition';
import {Renderer, RendererProps} from '../factory';
import {autobind, createObject} from '../utils/helper';
import {leftArrowIcon, rightArrowIcon} from '../components/icons';

const animationStyles: {
    [propName: string]: string;
} = {
    [ENTERING]: 'in',
    [ENTERED]: 'in',
    [EXITING]: 'out'
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
    controlsTheme: 'light' | 'dark';
    animation: 'fade' | 'slide';
}

export interface CarouselState {
    current: number;
    options: any[];
    showArrows: boolean;
    nextAnimation: string;
}

export class Carousel extends React.Component<CarouselProps, CarouselState> {
    wrapperRef: React.RefObject<HTMLDivElement>;
    intervalTimeout: number;
    durationTimeout: number;

    static defaultProps: Pick<
        CarouselProps,
        'auto' | 'interval' | 'duration' | 'controlsTheme' | 'animation' | 'controls' | 'placeholder'
    > = {
        auto: true,
        interval: 5000,
        duration: 500,
        controlsTheme: 'light',
        animation: 'fade',
        controls: ['dots', 'arrows'],
        placeholder: ''
    };

    constructor(props:CarouselProps) {
        super(props);

        this.state = {
            current: 0,
            options: this.props.value ? this.props.value : this.props.options ? this.props.options : [],
            showArrows: false,
            nextAnimation: ''
        };

        this.wrapperRef = React.createRef();
    }

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
                animation === 'slide' ? nextAnimation = 'slideRight' : nextAnimation = '';
                this.transitFramesTowards('right', nextAnimation);
                break;
            case 'next':
            default:
                nextAnimation = '';
                this.transitFramesTowards('left', nextAnimation);
                break;
        }

        this.durationTimeout = setTimeout(this.prepareAutoSlide, this.props.duration);
    }

    @autobind
    transitFramesTowards (direction:string, nextAnimation: string) {
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

    renderDots() {
        const {classnames: cx} = this.props;
        const {current, options} = this.state;
        return (
            <div
                className={cx('Carousel-dotsControl')}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {Array.from({length: options.length}).map((_, i) =>
                    <span key={i} className={cx('Carousel-dot', current === i ? 'is-active' : '')}></span>
                )}
            </div>
        )
    }

    renderArrows() {
        const {classnames: cx} = this.props;
        return (
            <div
                className={cx('Carousel-arrowsControl')}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div className={cx('Carousel-leftArrow')} onClick={this.prev}>{leftArrowIcon}</div>
                <div className={cx('Carousel-rightArrow')} onClick={this.next}>{rightArrowIcon}</div>
            </div>
        )
    }

    @autobind
    defaultSchema() {
        return {
            type: 'tpl',
            tpl:
            "<% if (data.image) { %> " +
                "<div style=\"background-image: url(<%= data.image %>)\" class=\"image <%= data.imageClassName %>\"></div>" +
                "<% if (data.title) { %> " +
                    "<div class=\"title <%= data.titleClassName %>\"><%= data.title %></div>" +
                "<% } if (data.description) { %> " +
                    "<div class=\"description <%= data.descriptionClassName %>\"><%= data.description %></div>" +
                "<% } %>" +
            "<% } else if (data.html) { %>" +
                "<%= data.html %>" +
            "<% } %>"
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
            controlsTheme,
            placeholder,
            data
        } = this.props;
        const {
            options,
            showArrows,
            current,
            nextAnimation
        } = this.state;

        let body:JSX.Element | null = null;
        let carouselStyles: {
            [propName: string]: string;
        } = {};
        width ? carouselStyles.width = width + 'px' : '';
        height ? carouselStyles.height = height + 'px' : '';
        const [dots, arrows] = [controls.indexOf('dots') > -1, controls.indexOf('arrows') > -1];
        const animationName = nextAnimation || animation;

        if (options && options.length) {
            body = (
                <div
                    ref={this.wrapperRef}
                    className={cx('Carousel-container')}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    style={carouselStyles}
                    >
                    {options.map((option:any, key:number) => (
                        <Transition
                            mountOnEnter
                            unmountOnExit
                            in={key === current}
                            timeout={500}
                            key={key}
                        >
                            {(status:string) => {
                                if (status === ENTERING) {
                                    this.wrapperRef.current && this.wrapperRef.current.childNodes.forEach((item:HTMLElement) => item.offsetHeight);
                                }

                                return (
                                    <div className={cx('Carousel-item', animationName, animationStyles[status])}>
                                        {render(`${current}/body`, itemSchema ? itemSchema : this.defaultSchema(), {
                                            data: createObject(data, option)
                                        })}
                                    </div>
                                );
                            }}
                        </Transition>
                    ))}
                    {dots ? this.renderDots() : null}
                    {arrows && showArrows ? this.renderArrows() : null}
                </div>
            );
        }

        return (
            <div className={cx(`Carousel Carousel--${controlsTheme}`, className)}>
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
