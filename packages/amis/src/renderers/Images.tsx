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

  /**
   * 画廊高度，仅在大图模式下生效
   */
  galleryHeight?: number | string;
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
  isSwiping: boolean;
  startX: number;
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
    isSwiping: false,
    startX: 0
  };

  list: Array<any> = [];
  containerRef = React.createRef<HTMLDivElement>();

  @autobind
  handleTouchStart(e: React.TouchEvent) {
    if (this.props.displayMode !== 'full') return;

    this.setState({
      isSwiping: true,
      startX: e.touches[0].clientX
    });
  }

  @autobind
  handleTouchEnd(e: React.TouchEvent) {
    if (!this.state.isSwiping) return;

    const {currentIndex} = this.state;
    const deltaX = e.changedTouches[0].clientX - this.state.startX;
    const threshold = 50; // 滑动阈值

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentIndex > 0) {
        // 向右滑，显示上一张
        this.setState({currentIndex: currentIndex - 1});
      } else if (deltaX < 0 && currentIndex < this.list.length - 1) {
        // 向左滑，显示下一张
        this.setState({currentIndex: currentIndex + 1});
      }
    }

    this.setState({isSwiping: false});
  }

  componentDidMount() {}
  componentWillUnmount() {}

  @autobind
  handleMouseDown(e: React.MouseEvent) {
    if (this.props.displayMode !== 'full') return;

    // 阻止图片默认的拖拽行为
    e.preventDefault();

    this.setState({
      isSwiping: true,
      startX: e.clientX
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  @autobind
  handleMouseMove(e: MouseEvent) {
    if (!this.state.isSwiping) return;
    e.preventDefault();
  }

  @autobind
  handleMouseUp(e: MouseEvent) {
    if (!this.state.isSwiping) return;

    const {currentIndex} = this.state;
    const deltaX = e.clientX - this.state.startX;
    const threshold = 50; // 滑动阈值

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentIndex > 0) {
        // 向右滑，显示上一张
        this.setState({currentIndex: currentIndex - 1});
      } else if (deltaX < 0 && currentIndex < this.list.length - 1) {
        // 向左滑，显示下一张
        this.setState({currentIndex: currentIndex + 1});
      }
    }

    this.setState({isSwiping: false});

    document.removeEventListener('mousemove', this.handleMouseMove);
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

  renderImageIndex() {
    const {currentIndex} = this.state;
    return (
      <div className="Images-index">
        {currentIndex + 1}/{this.list.length}
      </div>
    );
  }

  getTransformStyle() {
    const {currentIndex} = this.state;
    return {
      transform: `translateX(-${currentIndex * 100}%)`,
      transition: this.state.isSwiping ? 'none' : 'transform 0.3s ease-out'
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
      displayMode,
      galleryHeight
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
        ref={this.containerRef}
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
          ...(displayMode === 'full' && galleryHeight
            ? {
                '--gallery-height': /^\d+$/.test(String(galleryHeight))
                  ? `${galleryHeight}px`
                  : galleryHeight
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
              <>
                <div
                  className={cx('Images-container')}
                  style={this.getTransformStyle()}
                >
                  {list.map((item: any, index: number) => (
                    <div key={index} className={cx('Images-item')}>
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
                    </div>
                  ))}
                </div>
                {this.renderImageIndex()}
              </>
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
