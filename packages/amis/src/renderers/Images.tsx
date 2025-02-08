import React from 'react';
import {
  Renderer,
  RendererProps,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {filter} from 'amis-core';
import {
  resolveVariable,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import Image, {ImageThumbProps, imagePlaceholder} from './Image';
import {autobind, getPropValue} from 'amis-core';
import {BaseSchema, SchemaClassName, SchemaUrlPath} from '../Schema';
import type {ImageToolbarAction} from './Image';
import Transition, {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED
} from 'react-transition-group/Transition';
/**
 * 图片集展示控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/images
 */
export interface ImagesSchema extends BaseSchema {
  /**
   * 指定为图片集渲染器
   */
  type: 'images' | 'static-images';

  /**
   * 默认图片地址
   */
  defaultImage?: SchemaUrlPath;

  /**
   * 列表为空时显示
   */
  placeholder?: string;

  /**
   * 配置值的连接符
   * @default ,
   */
  delimiter?: string;

  /**
   * 预览图模式
   */
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';

  /**
   * 预览图比率
   */
  thumbRatio?: '1:1' | '4:3' | '16:9';

  /**
   * 关联字段名，也可以直接配置 src
   */
  name?: string;

  value?: any; // todo 补充 description
  source?: string;

  // 静态配置，如果不相关联数据，而是直接固定列表展示，请配置。
  options?: Array<any>;

  /**
   * 图片地址，默认读取数据中的 image 属性，如果不是请配置 ,如  ${imageUrl}
   */
  src?: string;

  /**
   * 大图地址，不设置用 src 属性，如果不是请配置，如：${imageOriginUrl}
   */
  originalSrc?: string; // 原图

  /**
   * 是否启动放大功能。
   */
  enlargeAble?: boolean;

  /**
   * 放大时是否显示图片集
   */
  enlargetWithImages?: boolean;

  /**
   * 是否显示尺寸。
   */
  showDimensions?: boolean;

  /**
   * 外层 CSS 类名
   */
  className?: SchemaClassName;

  /**
   * 列表 CSS 类名
   */
  listClassName?: SchemaClassName;

  /**
   * 放大详情图 CSS 类名
   */
  imageGallaryClassName?: SchemaClassName;

  /**
   * 是否展示图片工具栏
   */
  showToolbar?: boolean;

  /**
   * 工具栏配置
   */
  toolbarActions?: ImageToolbarAction[];

  /**
   * 展示模式，支持缩略图模式（thumb）和大图模式（full）
   */
  displayMode?: 'thumb' | 'full';

  /**
   * 当前展示图片索引
   */
  currentIndex?: number;
}

export interface ImagesProps
  extends RendererProps,
    Omit<ImagesSchema, 'type' | 'className'> {
  delimiter: string;
  onEnlarge?: (
    info: ImageThumbProps & {
      list?: Array<
        Pick<
          ImageThumbProps,
          'src' | 'originalSrc' | 'title' | 'caption' | 'showToolbar'
        >
      >;
    }
  ) => void;
}

export interface ImagesState {
  currentIndex: number;
  nextAnimation: string;
}

export class ImagesField extends React.Component<ImagesProps, ImagesState> {
  static defaultProps = {
    className: '',
    delimiter: ',',
    defaultImage: imagePlaceholder,
    placehoder: '-',
    thumbMode: 'contain',
    thumbRatio: '1:1',
    displayMode: 'thumb'
  };

  state: ImagesState = {
    currentIndex: 0,
    nextAnimation: ''
  };

  private isSwiping: boolean = false;
  private startX: number = 0;
  list: Array<any> = [];

  wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

  // 根据当前索引和方向获取下一帧的索引
  @autobind
  getFrameId(pos?: string) {
    const {currentIndex} = this.state;
    const total = this.list.length;
    switch (pos) {
      case 'prev':
        return (currentIndex - 1 + total) % total;
      case 'next':
        return (currentIndex + 1) % total;
      default:
        return currentIndex;
    }
  }

  // 根据方向和动画类型切换到下一帧
  @autobind
  async transitFramesTowards(direction: string, nextAnimation: string) {
    let {currentIndex} = this.state;
    let prevIndex = currentIndex;

    switch (direction) {
      case 'left':
        currentIndex = this.getFrameId('next');
        nextAnimation = 'slideLeft';
        break;
      case 'right':
        currentIndex = this.getFrameId('prev');
        nextAnimation = 'slideRight';
        break;
      default:
        return;
    }

    this.setState({currentIndex, nextAnimation});
  }

  @autobind
  private handleSwipe(deltaX: number) {
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // 向右滑
        this.transitFramesTowards('right', 'slideRight');
      } else {
        // 向左滑
        this.transitFramesTowards('left', 'slideLeft');
      }
    }
  }

  @autobind
  handleTouchStart(e: React.TouchEvent) {
    if (this.props.displayMode !== 'full') return;

    this.isSwiping = true;
    this.startX = e.touches[0].clientX;
  }

  @autobind
  handleTouchEnd(e: React.TouchEvent) {
    if (!this.isSwiping) return;

    const deltaX = e.changedTouches[0].clientX - this.startX;
    this.handleSwipe(deltaX);
    this.isSwiping = false;
  }

  @autobind
  handleMouseDown(e: React.MouseEvent) {
    if (this.props.displayMode !== 'full') return;

    // 阻止图片默认的拖拽行为
    e.preventDefault();

    this.isSwiping = true;
    this.startX = e.clientX;

    document.addEventListener('mouseup', this.handleMouseUp);
  }

  @autobind
  handleMouseUp(e: MouseEvent) {
    if (!this.isSwiping) return;

    const deltaX = e.clientX - this.startX;
    this.handleSwipe(deltaX);
    this.isSwiping = false;
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  @autobind
  handleEnlarge(info: ImageThumbProps) {
    const {onImageEnlarge, src, originalSrc} = this.props;

    onImageEnlarge &&
      onImageEnlarge(
        {
          ...info,
          originalSrc: info.originalSrc || info.src,
          list: this.list.map(item => ({
            src: src
              ? filter(src, item, '| raw')
              : (item && item.image) || item,
            originalSrc: originalSrc
              ? filter(originalSrc, item, '| raw')
              : item?.src || filter(src, item, '| raw') || item?.image || item,
            title: item && (item.enlargeTitle || item.title),
            caption:
              item && (item.enlargeCaption || item.description || item.caption)
          }))
        },
        this.props
      );
  }

  getTransformStyle() {
    const {currentIndex} = this.state;
    // 考虑到克隆图片,实际索引需要+1
    return {
      transform: `translateX(-${(currentIndex + 1) * 100}%)`,
      transition: this.isSwiping ? 'none' : 'transform 0.3s ease-out',
      height: '100%',
      display: 'flex',
      // 因为首尾各增加一张克隆图片,所以宽度需要增加200%
      width: `${(this.list.length + 2) * 100}%`
    };
  }

  render() {
    const {
      className,
      style,
      defaultImage,
      thumbMode,
      thumbRatio,
      data,
      name,
      placeholder,
      classnames: cx,
      source,
      delimiter,
      enlargeAble,
      enlargeWithGallary,
      src,
      originalSrc,
      listClassName,
      options,
      showToolbar,
      toolbarActions,
      imageGallaryClassName,
      galleryControlClassName,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      imagesControlClassName,
      displayMode
    } = this.props;

    const {currentIndex} = this.state;

    let value: any;
    let list: any;

    if (typeof source === 'string' && isPureVariable(source)) {
      list = resolveVariableAndFilter(source, data, '| raw') || undefined;
    } else if (
      Array.isArray((value = getPropValue(this.props))) ||
      typeof value === 'string'
    ) {
      list = value;
    } else if (Array.isArray(options)) {
      list = options;
    }

    if (typeof list === 'string') {
      list = list.split(delimiter);
    } else if (list && !Array.isArray(list)) {
      list = [list];
    }

    this.list = list;

    return (
      <div
        ref={this.wrapperRef}
        className={cx(
          'ImagesField',
          className,
          displayMode === 'full' ? 'ImagesField--full' : '',
          setThemeClassName({
            ...this.props,
            name: 'imagesControlClassName',
            id,
            themeCss
          }),
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        style={{
          ...style,
          ...(displayMode === 'full'
            ? {
                height: 'auto'
              }
            : {})
        }}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onMouseDown={this.handleMouseDown}
      >
        {Array.isArray(list) ? (
          <div className={cx('Images', listClassName)}>
            {displayMode === 'full' ? (
              <div className={cx('Images-container')}>
                {list.map((item: any, index: number) => (
                  <Transition
                    key={index}
                    in={index === currentIndex}
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                  >
                    {(status: string) => {
                      if (status === ENTERING) {
                        this.wrapperRef.current?.childNodes.forEach(
                          (item: HTMLElement) => item.offsetHeight
                        );
                      }

                      const animationStyles: {
                        [propName: string]: React.CSSProperties;
                      } = {
                        [ENTERING]: {
                          opacity: 1,
                          transform: 'translateX(0)'
                        },
                        [ENTERED]: {
                          opacity: 1,
                          transform: 'translateX(0)'
                        },
                        [EXITING]: {
                          opacity: 0,
                          transform:
                            this.state.nextAnimation === 'slideRight'
                              ? 'translateX(100%)'
                              : 'translateX(-100%)'
                        },
                        [EXITED]: {
                          opacity: 0,
                          transform:
                            this.state.nextAnimation === 'slideRight'
                              ? 'translateX(-100%)'
                              : 'translateX(100%)'
                        }
                      };

                      console.log(animationStyles[status]);
                      console.log(this.state.nextAnimation);

                      return (
                        <div
                          className={cx('Images-item')}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            transition: 'all 300ms ease-in-out',
                            ...animationStyles[status]
                          }}
                        >
                          <div className={cx('Images-itemInner')}>
                            <img
                              className={cx('Image-image')}
                              src={
                                (src
                                  ? filter(src, item, '| raw')
                                  : item && item.image) || item
                              }
                              alt={item && item.title}
                              draggable={false}
                              onDragStart={e => e.preventDefault()}
                            />
                            <div className={cx('Images-itemIndex')}>
                              {index + 1}/{list.length}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </Transition>
                ))}
              </div>
            ) : (
              list.map((item: any, index: number) => (
                <Image
                  index={index}
                  className={cx('Images-item')}
                  key={index}
                  src={
                    (src ? filter(src, item, '| raw') : item && item.image) ||
                    item
                  }
                  originalSrc={
                    (originalSrc
                      ? filter(originalSrc, item, '| raw')
                      : item && item.src) || item
                  }
                  title={item && item.title}
                  caption={item && (item.description || item.caption)}
                  thumbMode={thumbMode}
                  thumbRatio={thumbRatio}
                  enlargeAble={enlargeAble!}
                  enlargeWithGallary={enlargeWithGallary}
                  onEnlarge={this.handleEnlarge}
                  showToolbar={showToolbar}
                  toolbarActions={toolbarActions}
                  imageGallaryClassName={imageGallaryClassName}
                />
              ))
            )}
          </div>
        ) : defaultImage ? (
          <div className={cx('Images', listClassName)}>
            <Image
              className={cx('Images-item')}
              src={defaultImage}
              thumbMode={thumbMode}
              thumbRatio={thumbRatio}
            />
          </div>
        ) : (
          placeholder
        )}
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'imagesControlClassName'
              },
              {
                key: 'galleryControlClassName'
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
  type: 'images'
})
export class ImagesFieldRenderer extends ImagesField {}
