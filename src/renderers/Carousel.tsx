import React from 'react';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import {Renderer, RendererProps} from '../factory';
import {resolveVariable} from '../utils/tpl-builtin';
import {
  autobind,
  createObject,
  isObject,
  isArrayChildrenModified
} from '../utils/helper';
import {Icon} from '../components/icons';
import {BaseSchema, SchemaCollection, SchemaName, SchemaTpl} from '../Schema';

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
   * 是否自动播放
   */
  auto?: boolean;

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
  showArrows: boolean;
  nextAnimation: string;
}

const defaultSchema = {
  type: 'tpl',
  tpl: `
    <% if (data.hasOwnProperty('image')) { %>
        <div style="background-image: url('<%= data.image %>'); background-size: contain; background-repeat: no-repeat; background-position: center center;" class="image <%= data.imageClassName %>"></div>
        <% if (data.hasOwnProperty('title')) { %>
            <div class="title <%= data.titleClassName %>"><%= data.title %></div>
        <% } if (data.hasOwnProperty('description')) { %> 
            <div class="description <%= data.descriptionClassName %>"><%= data.description %></div> 
        <% } %>
    <% } else if (data.hasOwnProperty('html')) { %>
        <%= data.html %>"
    <% } else if (data.hasOwnProperty('image')) { %>
        <div style="background-image: url('<%= data.image %>')" class="image <%= data.imageClassName %>"></div>
        <% if (data.title) { %>
            <div class="title <%= data.titleClassName %>"><%= data.title %></div>
        <% } if (data.description) { %> 
            <div class="description <%= data.descriptionClassName %>"><%= data.description %></div> 
        <% } %>
    <% } else if (data.hasOwnProperty('html')) { %>
        <%= data.html %>
    <% } else if (data.hasOwnProperty('item')) { %>
        <%= data.item %>
    <% } else { %>
        <%= '未找到渲染数据' %>
    <% } %>
    `
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
  > = {
    auto: true,
    interval: 5000,
    duration: 500,
    controlsTheme: 'light',
    animation: 'fade',
    controls: ['dots', 'arrows'],
    placeholder: '-'
  };

  state = {
    current: 0,
    options:
      this.props.value ||
      this.props.options ||
      resolveVariable(this.props.name, this.props.data) ||
      [],
    showArrows: false,
    nextAnimation: ''
  };

  componentWillReceiveProps(nextProps: CarouselProps) {
    const currentOptions = this.state.options;
    const nextOptions =
      nextProps.value ||
      nextProps.options ||
      resolveVariable(nextProps.name, nextProps.data) ||
      [];
    if (isArrayChildrenModified(currentOptions, nextOptions)) {
      this.setState({
        options: nextOptions
      });
    }
  }

  componentDidMount() {
    this.prepareAutoSlide();
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
    this.autoSlide('next');
  }

  @autobind
  prev() {
    this.autoSlide('prev');
  }

  @autobind
  clearAutoTimeout() {
    clearTimeout(this.intervalTimeout as number);
    clearTimeout(this.durationTimeout as number);
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
      data,
      name
    } = this.props;
    const {options, showArrows, current, nextAnimation} = this.state;

    let body: JSX.Element | null = null;
    let carouselStyles: {
      [propName: string]: string;
    } = {};
    width ? (carouselStyles.width = width + 'px') : '';
    height ? (carouselStyles.height = height + 'px') : '';
    const [dots, arrows] = [
      controls!.indexOf('dots') > -1,
      controls!.indexOf('arrows') > -1
    ];
    const animationName = nextAnimation || animation;

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
                      animationStyles[status]
                    )}
                  >
                    {render(
                      `${current}/body`,
                      itemSchema ? itemSchema : defaultSchema,
                      {
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
          {dots ? this.renderDots() : null}
          {arrows && showArrows ? this.renderArrows() : null}
        </div>
      );
    }

    return (
      <div
        className={cx(`Carousel Carousel--${controlsTheme}`, className)}
        style={carouselStyles}
      >
        {body ? body : placeholder}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)carousel/,
  name: 'carousel'
})
export class CarouselRenderer extends Carousel {}
