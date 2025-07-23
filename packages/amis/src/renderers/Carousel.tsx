import React, {MouseEvent, TouchEvent} from 'react';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED
} from 'react-transition-group/Transition';
import {Renderer, RendererProps, setThemeClassName} from 'amis-core';
import {resolveVariableAndFilter} from 'amis-core';
import {
  autobind,
  createObject,
  isObject,
  isArrayChildrenModified,
  getPropValue,
  CustomStyle
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
   * 轮播图方向，默认为水平方向
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * 是否循环播放, 默认为 true。
   */
  loop?: boolean;

  /**
   * 是否支持鼠标事件
   * 默认为 true。
   */
  mouseEvent?: boolean;

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
  width?: number | string;

  /**
   * 设置高度
   */
  height?: number | string;

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
  animation?: 'fade' | 'slide' | 'marquee';

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
  mouseStartLocation: number | null;
  isPaused: boolean;
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
            title={data.hasOwnProperty('title') ? data.title : ''}
            href={data.hasOwnProperty('href') ? data.href : ''}
            blank={data.hasOwnProperty('blank') ? data.blank : false}
            htmlTarget={
              data.hasOwnProperty('htmlTarget') ? data.htmlTarget : ''
            }
            caption={data.hasOwnProperty('description') ? data.description : ''}
            thumbMode={
              data.hasOwnProperty('thumbMode')
                ? data.thumbMode
                : thumbMode ?? 'contain'
            }
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

const SCROLL_THRESHOLD = 20;

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
    nextAnimation: '',
    mouseStartLocation: null,
    isPaused: false
  };

  loading: boolean = false;
  marqueeRef = React.createRef<HTMLDivElement>();
  contentRef = React.createRef<HTMLDivElement>();
  marqueeRequestId: number;

  componentDidMount() {
    this.prepareAutoSlide();
    // 跑马灯效果
    if (this.props.animation === 'marquee') {
      this.marquee();
    }
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

    if (
      this.props.animation === 'marquee' &&
      prevProps.animation !== 'marquee'
    ) {
      this.marquee();
    }
  }

  componentWillUnmount() {
    this.clearAutoTimeout();
    cancelAnimationFrame(this.marqueeRequestId);
  }

  marquee() {
    if (!this.marqueeRef.current || !this.contentRef.current) {
      return;
    }

    let positionNum = 0;
    let lastTime = performance.now();

    const contentDom = this.contentRef.current;
    const animate = (time: number) => {
      const diffTime = time - lastTime;
      lastTime = time;
      const wrapWidth = this.marqueeRef.current?.offsetWidth ?? 0;

      if (!this.state.isPaused) {
        // 计算每帧移动距离
        const moveDistance = wrapWidth * (diffTime / this.props.duration!);
        positionNum += -moveDistance;

        // 检查是否需要重置位置
        const contentWidth = contentDom.scrollWidth / 2;
        if (Math.abs(positionNum) >= contentWidth) {
          positionNum = 0;
        }
        contentDom.style.transform = `translateX(${positionNum}px)`;
      }

      this.marqueeRequestId = requestAnimationFrame(animate);
    };

    this.marqueeRequestId = requestAnimationFrame(animate);
  }

  doAction(
    action: ActionObject,
    ctx: object,
    throwErrors: boolean,
    args: object
  ): any {
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

    // 如果这里是不循环状态，需要阻止切换到第一张或者最后一张图片
    if (
      this.props.loop === false &&
      ((current === 0 && direction === 'right') ||
        (current === this.state.options.length - 1 && direction === 'left'))
    ) {
      return;
    }

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

  /**
   * 获取事件发生的屏幕坐标，兼容鼠标事件和触摸事件。
   *
   * @param event 事件对象，可以是鼠标事件或触摸事件
   * @returns 返回包含屏幕横纵坐标的对象
   */
  getEventScreenXY(
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) {
    let screenX, screenY;
    if ((event as MouseEvent<HTMLDivElement>).screenX !== undefined) {
      screenX = (event as MouseEvent<HTMLDivElement>).screenX;
      screenY = (event as MouseEvent<HTMLDivElement>).screenY;
    } else if ((event as TouchEvent<HTMLDivElement>).touches?.length) {
      // touchStart 事件
      screenX = (event as TouchEvent<HTMLDivElement>).touches[0]?.screenX;
      screenY = (event as TouchEvent<HTMLDivElement>).touches[0]?.screenY;
    } else if ((event as TouchEvent<HTMLDivElement>).changedTouches?.length) {
      // touchEnd 事件
      screenX = (event as TouchEvent<HTMLDivElement>).changedTouches[0]
        ?.screenX;
      screenY = (event as TouchEvent<HTMLDivElement>).changedTouches[0]
        ?.screenY;
    }

    return {
      screenX,
      screenY
    };
  }

  /**
   * 添加鼠标按下事件监听器, 用于判断滑动方向
   * @param event 鼠标事件对象
   */
  @autobind
  addMouseDownListener(
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) {
    const {direction} = this.props;

    const {screenX, screenY} = this.getEventScreenXY(event);

    // 根据当前滑动方向确定是应该使用x坐标还是y坐标做mark
    const location = direction === 'vertical' ? screenY : screenX;

    location !== undefined &&
      this.setState({
        mouseStartLocation: location
      });
  }

  /**
   * 添加鼠标抬起事件监听器, 用于判断滑动方向
   * @param event 鼠标事件对象
   */
  @autobind
  addMouseUpListener(
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) {
    const {screenX, screenY} = this.getEventScreenXY(event);

    // 根据当前滑动方向确定是应该使用x坐标还是y坐标做mark
    const {direction} = this.props;
    const location = direction === 'vertical' ? screenY : screenX;

    if (this.state.mouseStartLocation !== null && location !== undefined) {
      if (location - this.state.mouseStartLocation > SCROLL_THRESHOLD) {
        this.autoSlide('prev');
      } else if (this.state.mouseStartLocation - location > SCROLL_THRESHOLD) {
        this.autoSlide();
      }
      this.setState({
        mouseStartLocation: null
      });
    }
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
      icons,
      id,
      wrapperCustomStyle,
      env,
      themeCss
    } = this.props;
    const {options, current, nextAnimation} = this.state;

    let body: JSX.Element | null = null;
    let carouselStyles: {
      [propName: string]: string;
    } = style ? {...style} : {};

    // 不允许传0，需要有最小高度
    if (width) {
      // 数字类型认为是px单位，否则传入字符串直接赋给style对象
      !isNaN(Number(width))
        ? (carouselStyles.width = width + 'px')
        : (carouselStyles.width = width as string);
    }

    if (height) {
      !isNaN(Number(height))
        ? (carouselStyles.height = height + 'px')
        : (carouselStyles.height = height as string);
    }

    const [dots, arrows] = [
      controls!.indexOf('dots') > -1 && animation !== 'marquee',
      controls!.indexOf('arrows') > -1 && animation !== 'marquee'
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
      const itemRender = (option: any) => {
        const {itemSchema: optionItemSchema, ...restOption} = option;
        return render(
          `${current}/body`,
          optionItemSchema || itemSchema
            ? optionItemSchema || itemSchema
            : (defaultSchema as any),
          {
            thumbMode: this.props.thumbMode,
            data: createObject(
              data,
              isObject(option) ? restOption : {item: option, [name!]: option}
            )
          }
        );
      };

      body =
        animation === 'marquee' ? (
          <div
            ref={this.marqueeRef}
            className={cx('Marquee-container')}
            onMouseEnter={() =>
              this.setState({
                isPaused: true
              })
            }
            onMouseLeave={() =>
              this.setState({
                isPaused: false
              })
            }
            style={{
              width: '100%',
              height
            }}
          >
            <div className={cx('Marquee-content')} ref={this.contentRef}>
              {options.concat(options).map((option, key) => (
                <div key={key} className={cx('Marquee-item')}>
                  {multipleCount === 1 ? itemRender(option) : null}
                  {multipleCount > 1
                    ? newOptions
                        .concat(newOptions)
                        [key].map((option: any, index: number) => (
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
              ))}
            </div>
          </div>
        ) : (
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
          className,
          setThemeClassName({
            ...this.props,
            name: 'baseControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          }),
          {'Carousel-vertical': this.props.direction === 'vertical'}
        )}
        onMouseDown={
          this.props.mouseEvent ? this.addMouseDownListener : undefined
        }
        onMouseUp={this.props.mouseEvent ? this.addMouseUpListener : undefined}
        onMouseLeave={
          this.props.mouseEvent ? this.addMouseUpListener : undefined
        }
        onTouchStart={
          this.props.mouseEvent ? this.addMouseDownListener : undefined
        }
        onTouchEnd={this.props.mouseEvent ? this.addMouseUpListener : undefined}
        style={carouselStyles}
      >
        {body ? body : placeholder}

        {dots ? this.renderDots() : null}
        {arrows ? (
          <div
            className={cx(
              'Carousel-leftArrow',
              setThemeClassName({
                ...this.props,
                name: 'galleryControlClassName',
                id,
                themeCss
              })
            )}
            onClick={this.prev}
          >
            {icons?.prev ? (
              <div className="ImageGallery-prevBtn">
                <Icon icon={icons.prev} />
              </div>
            ) : (
              <Icon
                icon="left-arrow"
                className="icon"
                iconContent="ImageGallery-prevBtn"
              />
            )}
          </div>
        ) : null}
        {arrows ? (
          <div
            className={cx(
              'Carousel-rightArrow',
              setThemeClassName({
                ...this.props,
                name: 'galleryControlClassName',
                id,
                themeCss
              })
            )}
            onClick={this.next}
          >
            {icons?.next ? (
              <div className="ImageGallery-prevBtn">
                <Icon icon={icons.next} />
              </div>
            ) : (
              <Icon
                icon="right-arrow"
                className="icon"
                iconContent="ImageGallery-nextBtn"
              />
            )}
          </div>
        ) : null}
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName'
              },
              {
                key: 'galleryControlClassName',
                weights: {
                  default: {
                    suf: ' svg',
                    important: true
                  }
                }
              }
            ]
          }}
          env={env}
        />
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
