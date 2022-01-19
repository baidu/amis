import React from 'react';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import {Renderer, RendererProps} from '../factory';
import {
  autobind,
  createObject,
  isObject,
  isArrayChildrenModified,
  getPropValue
} from '../utils/helper';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaCollection, SchemaName, SchemaTpl} from '../Schema';
import Html from '../components/Html';
import Image from '../renderers/Image';

/**
 * Carousel 轮播图渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/carousel
 */
export interface CarouselSchema extends BaseSchema {
  /**
   * 指定为轮播图类型
   */
  type: 'carousel';
  /**
   * 指示点位置
   */
  dotPosition?: 'bottom' | 'top' | 'left' | 'right';

  /**
   * 是否自动播放
   */
  auto?: boolean;

  /**
   * 是否无限轮播
   */
  infinite?: boolean;

  /**
   * 轮播间隔时间
   */
  interval?: number;

  /**
   * 动画时长
   */
  duration?: number;

  /**
   * 设置宽度
   */
  width?: number;

  /**
   * 设置高度
   */
  height?: number;

  controlsTheme?: 'light' | 'dark' | 'blue';

  /**
   * 占位
   */
  placeholder?: string;

  /**
   * 配置控件内容
   */
  controls?: Array<'dots' | 'bar' | 'digital' | 'arrows'>;

  /**
   * 动画类型
   */
  animation?: 'fade' | 'slide';

  /**
   * 配置单条呈现模板
   */
  itemSchema?: SchemaCollection;

  name?: SchemaName;

  /**
   * 预览图模式
   */
  thumbMode?: 'contain' | 'cover';

  /**
   * 配置固定值
   */
  options?: Array<any>;
}

const animationStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in',
  [EXITING]: 'out'
};

export interface CarouselProps
  extends RendererProps,
    Omit<CarouselSchema, 'className'> {
  value?: any;
}

export interface CarouselState {
  current: number;
  options: any[];
  nextAnimation: string;
}

const defaultSchema = {
  component: (props: any) => {
    const data = props.data || {};
    const thumbMode = props.thumbMode;
    const cx = props.classnames;

    return (
      <>
        {data.hasOwnProperty('image') ? (
          <Image
            src={data.image}
            title={data.title}
            href={data.href}
            blank={data.blank}
            htmlTarget={data.htmlTarget}
            imageCaption={data.description}
            thumbMode={data.thumbMode ?? thumbMode ?? 'contain'}
            imageMode="original"
            className={cx('Carousel-image')}
          />
        ) : data.hasOwnProperty('html') ? (
          <Html html={data.html} />
        ) : data.hasOwnProperty('item') ? (
          <span>{data.item}</span>
        ) : (
          <p></p>
        )}
      </>
    );
  }
};

export class Carousel extends React.Component<CarouselProps, CarouselState> {
  wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();
  intervalTimeout: NodeJS.Timer | number;
  durationTimeout: NodeJS.Timer | number;

  static defaultProps: Pick<
    CarouselProps,
    | 'auto'
    | 'interval'
    | 'duration'
    | 'controlsTheme'
    | 'animation'
    | 'controls'
    | 'placeholder'
    | 'infinite'
    | 'dotPosition'
  > = {
    auto: true,
    interval: 5000,
    duration: 500,
    controlsTheme: 'light',
    animation: 'fade',
    controls: ['dots', 'arrows'],
    placeholder: '-',
    infinite: true,
    dotPosition: 'bottom'
  };

  state = {
    current: 0,
    options: this.props.options || getPropValue(this.props) || [],
    nextAnimation: ''
  };

  componentDidMount() {
    this.prepareAutoSlide();
  }

  componentDidUpdate(prevProps: CarouselProps) {
    const props = this.props;

    const nextOptions = props.options || getPropValue(props) || [];
    const prevOptions = prevProps.options || getPropValue(prevProps) || [];

    if (isArrayChildrenModified(prevOptions, nextOptions)) {
      this.setState({
        options: nextOptions
      });
    }
  }

  componentWillUnmount() {
    this.clearAutoTimeout();
  }

  @autobind
  prepareAutoSlide() {
    if (this.state.options.length < 2) {
      return;
    }

    this.clearAutoTimeout();
    if (this.props.auto) {
      this.intervalTimeout = setTimeout(this.autoSlide, this.props.interval);
    }
  }

  @autobind
  autoSlide(rel?: string) {
    this.clearAutoTimeout();
    const {animation} = this.props;
    let {nextAnimation} = this.state;

    switch (rel) {
      case 'prev':
        animation === 'slide'
          ? (nextAnimation = 'slideRight')
          : (nextAnimation = '');
        this.transitFramesTowards('right', nextAnimation);
        break;
      case 'next':
      default:
        nextAnimation = '';
        this.transitFramesTowards('left', nextAnimation);
        break;
    }

    this.durationTimeout = setTimeout(
      this.prepareAutoSlide,
      this.props.duration
    );
  }

  @autobind
  transitFramesTowards(direction: string, nextAnimation: string) {
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
    }, () => {
      const {controls, dotPosition, duration} = this.props;
      if (controls?.includes('bar')) {
        const domControl = document.querySelector(`.control-${dotPosition}`);
        const controls = domControl?.querySelectorAll('.carousel-inner-bar') as NodeListOf<HTMLElement>;
        Array.from(controls).forEach(item => {
          item.style.transitionDuration = '0s';
        })
        const activeDom = domControl?.querySelector('.is-active') as HTMLElement;
        activeDom && (activeDom.style.transitionDuration = `${duration as number / 1000}s`);
      }
    });
  }

  @autobind
  setCurrent(current: number) {
    this.setState({
      current
    })
  }

  @autobind
  getFrameId(pos?: string) {
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
  next() {
    const {options, current} = this.state;
    const {infinite} = this.props;
    if (!infinite && current === options.length - 1) {
      return;
    }
    const total = options.length;
    this.autoSlide('next');
  }

  @autobind
  prev() {
    const {options, current} = this.state;
    const {infinite} = this.props;
    if (!infinite && current === 0) {
      return;
    }
    this.autoSlide('prev');
  }

  @autobind
  clearAutoTimeout() {
    clearTimeout(this.intervalTimeout as number);
    clearTimeout(this.durationTimeout as number);
  }

  @autobind
  changeSlide(index: number) {
    this.setState({
      current: index
    });
  }

  renderDots() {
    const {classnames: cx, dotPosition} = this.props;
    const {current, options} = this.state;
    return (
      <div
        className={cx('Carousel-dotsControl', `control-${dotPosition}`)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {Array.from({length: options.length}).map((_, i) => (
          <span
            onClick={() => this.setCurrent(i)}
            key={i}
            onClick={() => this.changeSlide(i)}
            className={cx('Carousel-dot', current === i ? 'is-active' : '')}
          />
        ))}
      </div>
    );
  }

  renderDigital() {
    const {classnames: cx, dotPosition} = this.props;
    const {current, options} = this.state;
    return (
      <div
        className={cx('Carousel-digitalControl', `digitalControl-${dotPosition}`)}
      >
        <span className={cx('Carousel-digital-current')}>{current + 1}</span>/
        <span className={cx('Carousel-digital-total')}>{options.length}</span>
      </div>
    );
  }

  renderBar() {
    const {classnames: cx, dotPosition} = this.props;
    const {current, options} = this.state;
    return (
      <div
        className={cx('Carousel-barControl', `control-${dotPosition}`)}
      >
        {Array.from({length: options.length}).map((_, i) => (
          <span
            onClick={() => this.setCurrent(i)}
            key={i}
            className={cx('Carousel-bar')}
          >
            <span className={cx(`Carousel-inner-bar-${dotPosition}`, 'carousel-inner-bar', current === i ? 'is-active' : '')} />
          </span>
        ))}
      </div>
    );
  }

  renderArrows() {
    const {classnames: cx} = this.props;
    return (
      <div
        className={cx('Carousel-arrowsControl')}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={cx('Carousel-leftArrow')} onClick={this.prev}>
          <Icon icon="left-arrow" className="icon" />
        </div>
        <div className={cx('Carousel-rightArrow')} onClick={this.next}>
          <Icon icon="right-arrow" className="icon" />
        </div>
      </div>
    );
  }

  @autobind
  handleMouseEnter() {
    this.clearAutoTimeout();
  }

  @autobind
  handleMouseLeave() {
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
      data,
      name,
      infinite,
      dotPosition
    } = this.props;
    const {options, current, nextAnimation} = this.state;

    let body: JSX.Element | null = null;
    let carouselStyles: {
      [propName: string]: string;
    } = {};
    width ? (carouselStyles.width = width + 'px') : '';
    height ? (carouselStyles.height = height + 'px') : '';
    const [dots, bar, digital, arrows] = [
      controls!.indexOf('dots') > -1,
      controls!.indexOf('bar') > -1,
      controls!.indexOf('digital') > -1,
      controls!.indexOf('arrows') > -1,
    ];
    const animationName = nextAnimation || animation;
    const isHorizontal = (dotPosition === 'bottom' || dotPosition === 'top');
    const transPosition = isHorizontal ? 'transX' : 'transY';

    if (Array.isArray(options) && options.length) {
      body = (
        <div
          ref={this.wrapperRef}
          className={cx('Carousel-container')}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          {options.map((option: any, key: number) => (
            <Transition
              mountOnEnter
              unmountOnExit
              in={key === current}
              timeout={500}
              key={key}
            >
              {(status: string) => {
                if (status === ENTERING) {
                  this.wrapperRef.current &&
                    this.wrapperRef.current.childNodes.forEach(
                      (item: HTMLElement) => item.offsetHeight
                    );
                }

                return (
                  <div
                    className={cx(
                      'Carousel-item',
                      animationName,
                      animationStyles[status],
                      transPosition
                    )}
                  >
                    {render(
                      `${current}/body`,
                      itemSchema ? itemSchema : (defaultSchema as any),
                      {
                        thumbMode: this.props.thumbMode,
                        data: createObject(
                          data,
                          isObject(option)
                            ? option
                            : {item: option, [name!]: option}
                        )
                      }
                    )}
                  </div>
                );
              }}
            </Transition>
          ))}
        </div>
      );
    }

    return (
      <div
        className={cx(`Carousel Carousel--${controlsTheme}`, className)}
        style={carouselStyles}
      >
        {body ? body : placeholder}

        {dots ? this.renderDots() : null}
        {digital ? this.renderDigital() : null}
        {bar ? this.renderBar() : null}
        {arrows ? (
          <div className={cx(`Carousel-${isHorizontal ? 'left' : 'top'}Arrow`, (current === 0 && !infinite) ? 'is-disabled' : '')} onClick={this.prev}>
            <Icon icon="left-arrow" className="icon" />
          </div>
        ) : null}
        {arrows ? (
          <div className={cx(`Carousel-${isHorizontal ? 'right' : 'bottom'}Arrow`, (current === options.length - 1 && !infinite) ? 'is-disabled' : '')} onClick={this.next}>
            <Icon icon="right-arrow" className="icon" />
          </div>
        ) : null}
      </div>
    );
  }
}

@Renderer({
  type: 'carousel'
})
export class CarouselRenderer extends Carousel {}
