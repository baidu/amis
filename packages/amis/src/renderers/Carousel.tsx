import React from 'react';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED
} from 'react-transition-group/Transition';
import {Renderer, RendererProps} from 'amis-core';
import {resolveVariableAndFilter} from 'amis-core';
import {
  autobind,
  createObject,
  isObject,
  isArrayChildrenModified,
  getPropValue
} from 'amis-core';
import {ActionObject} from 'amis-core';
import {Icon} from 'amis-ui';
import {BaseSchema, SchemaCollection, SchemaName} from '../Schema';
import {Html} from 'amis-ui';
import Image from '../renderers/Image';
import {ScopedContext, IScopedContext} from 'amis-core';

/**
 * Carousel 轮播图渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/carousel
 */
export interface CarouselSchema extends BaseSchema {
  /**
   * 指定为轮播图类型
   */
  type: 'carousel';

  /**
   * 是否自动播放
   */
  auto?: boolean;

  /**
   * 轮播间隔时间
   */
  interval?: number | string;

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

  controlsTheme?: 'light' | 'dark';

  /**
   * 占位
   */
  placeholder?: string;

  /**
   * 配置控件内容
   */
  controls?: Array<'dots' | 'arrows'>;

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

  /**
   * 是否一直显示箭头
   */
  alwaysShowArrow?: boolean;

  /**
   * 多图模式配置项
   */
  multiple?: {
    count: number;
  };

  /**
   * 自定义箭头图标
   */
  icons?: {
    prev?: SchemaCollection;
    next?: SchemaCollection;
  };
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
          <Html html={data.html} filterHtml={props.env.filterHtml} />
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
    | 'multiple'
    | 'alwaysShowArrow'
  > = {
    auto: true,
    interval: 5000,
    duration: 500,
    controlsTheme: 'light',
    animation: 'fade',
    controls: ['dots', 'arrows'],
    placeholder: '-',
    multiple: {count: 1},
    alwaysShowArrow: false
  };

  state = {
    current: 0,
    options: this.props.options || getPropValue(this.props) || [],
    nextAnimation: ''
  };

  loading: boolean = false;

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

  doAction(action: ActionObject, args: object, throwErrors: boolean): any {
    const actionType = action?.actionType as string;

    if (!!~['next', 'prev'].indexOf(actionType)) {
      this.autoSlide(actionType);
    } else if (actionType === 'goto-image') {
      this.changeSlide((args as any)?.activeIndex - 1);
    }
  }

  @autobind
  prepareAutoSlide() {
    if (this.state.options.length < 2) {
      return;
    }

    this.clearAutoTimeout();
    if (this.props.auto) {
      const interval = this.props.interval;
      this.intervalTimeout = setTimeout(
        this.autoSlide,
        typeof interval === 'string'
          ? resolveVariableAndFilter(interval, this.props.data) || 5000
          : interval
      );
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
  async transitFramesTowards(direction: string, nextAnimation: string) {
    let {current} = this.state;
    let prevIndex = current;
    switch (direction) {
      case 'left':
        current = this.getFrameId('next');
        break;
      case 'right':
        current = this.getFrameId('prev');
        break;
    }

    const {dispatchEvent, data} = this.props;
    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        activeIndex: current + 1,
        prevIndex
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    this.setState({
      current,
      nextAnimation
    });
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
    const multiple = this.props.multiple;
    if (this.loading && multiple && multiple.count > 1) {
      return;
    }
    this.autoSlide('next');
  }

  @autobind
  prev() {
    const multiple = this.props.multiple;
    if (this.loading && multiple && multiple.count > 1) {
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
  async changeSlide(index: number) {
    const {current} = this.state;
    const {dispatchEvent, data, multiple} = this.props;

    if (this.loading && multiple && multiple.count > 1) {
      return;
    }

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        activeIndex: index,
        prevIndex: current
      })
    );
    if (rendererEvent?.prevented) {
      return;
    }

    this.setState({
      current: index
    });
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
        {Array.from({length: options.length}).map((_, i) => (
          <span
            key={i}
            onClick={() => this.changeSlide(i)}
            className={cx('Carousel-dot', current === i ? 'is-active' : '')}
          />
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
    const multiple = this.props.multiple;
    if (multiple && multiple.count > 1) {
      return;
    }
    this.clearAutoTimeout();
  }

  @autobind
  handleMouseLeave() {
    const multiple = this.props.multiple;
    if (multiple && multiple.count > 1) {
      return;
    }
    this.prepareAutoSlide();
  }

  // 处理options
  getNewOptions(options: any, count: number = 1) {
    let newOptions: Array<any> = options;
    if (Array.isArray(options) && options.length) {
      newOptions = new Array(options.length);
      for (let i = 0; i < options.length; i++) {
        newOptions[i] = new Array(count);
        for (let j = 0; j < count; j++) {
          newOptions[i][j] = options[(i + j) % options.length];
        }
      }
    }
    return newOptions;
  }

  render() {
    const {
      render,
      className,
      style,
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
      duration,
      multiple,
      alwaysShowArrow,
      icons
    } = this.props;
    const {options, current, nextAnimation} = this.state;

    let body: JSX.Element | null = null;
    let carouselStyles: {
      [propName: string]: string;
    } = style || {};
    width ? (carouselStyles.width = width + 'px') : '';
    height ? (carouselStyles.height = height + 'px') : '';
    const [dots, arrows] = [
      controls!.indexOf('dots') > -1,
      controls!.indexOf('arrows') > -1
    ];
    const animationName = nextAnimation || animation;

    if (Array.isArray(options) && options.length) {
      let multipleCount = 1;
      if (
        multiple &&
        typeof multiple.count === 'number' &&
        multiple.count >= 2
      ) {
        multipleCount =
          Math.floor(multiple.count) < options.length
            ? Math.floor(multiple.count)
            : options.length;
      }
      const newOptions = this.getNewOptions(options, multipleCount);
      const transitionDuration =
        multipleCount > 1 && typeof duration === 'number'
          ? `${duration}ms`
          : duration || '500ms';
      const timeout =
        multipleCount > 1 && typeof duration === 'number' ? duration : 500;

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
              timeout={timeout}
              key={key}
            >
              {(status: string) => {
                if (status === ENTERING) {
                  this.wrapperRef.current &&
                    this.wrapperRef.current.childNodes.forEach(
                      (item: HTMLElement) => item.offsetHeight
                    );
                }
                if (multipleCount > 1) {
                  if (
                    (status === ENTERING || status === EXITING) &&
                    !this.loading
                  ) {
                    this.loading = true;
                  } else if (
                    (status === ENTERED || status === EXITED) &&
                    this.loading
                  ) {
                    this.loading = false;
                  }
                }

                const transformStyles: {
                  [propName: string]: number;
                } = {
                  [ENTERING]: 0,
                  [ENTERED]: 0,
                  [EXITING]:
                    animationName === 'slideRight'
                      ? 100 / multipleCount
                      : -100 / multipleCount,
                  [EXITED]:
                    animationName === 'slideRight'
                      ? -100 / multipleCount
                      : 100 / multipleCount
                };
                const itemStyle =
                  multipleCount > 1
                    ? {
                        transitionTimingFunction: 'linear',
                        transitionDuration: transitionDuration,
                        ...(animation === 'slide'
                          ? {
                              transform: `translateX(${transformStyles[status]}%)`
                            }
                          : {})
                      }
                    : {};
                const itemRender = (option: any) =>
                  render(
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
                  );

                return (
                  <div
                    className={cx(
                      'Carousel-item',
                      animationName,
                      animationStyles[status]
                    )}
                    style={itemStyle}
                  >
                    {multipleCount === 1 ? itemRender(option) : null}
                    {multipleCount > 1
                      ? newOptions[key].map((option: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              width: 100 / multipleCount + '%',
                              height: '100%',
                              float: 'left'
                            }}
                          >
                            {itemRender(option)}
                          </div>
                        ))
                      : null}
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
        className={cx(
          `Carousel Carousel--${controlsTheme}`,
          {['Carousel-arrow--always']: !!alwaysShowArrow},
          className
        )}
        style={carouselStyles}
      >
        {body ? body : placeholder}

        {dots ? this.renderDots() : null}
        {arrows ? (
          <div className={cx('Carousel-leftArrow')} onClick={this.prev}>
            {icons && icons.prev ? (
              React.isValidElement(icons.prev) ? (
                icons.prev
              ) : (
                render('arrow-prev', icons.prev)
              )
            ) : (
              <Icon icon="left-arrow" className="icon" />
            )}
          </div>
        ) : null}
        {arrows ? (
          <div className={cx('Carousel-rightArrow')} onClick={this.next}>
            {icons && icons.next ? (
              React.isValidElement(icons.next) ? (
                icons.next
              ) : (
                render('arrow-next', icons.next)
              )
            ) : (
              <Icon icon="right-arrow" className="icon" />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

@Renderer({
  type: 'carousel'
})
export class CarouselRenderer extends Carousel {
  static contextType = ScopedContext;

  constructor(props: CarouselProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount?.();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
