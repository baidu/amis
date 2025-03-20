import React from 'react';
import {
  Renderer,
  RendererProps,
  CustomStyle,
  setThemeClassName,
  ActionObject,
  IScopedContext,
  ScopedContext,
  createObject,
  resolveVariableAndFilter,
  isPureVariable
} from 'amis-core';
import {filter} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
import {autobind, getPropValue} from 'amis-core';
import {Icon} from 'amis-ui';
import {LocaleProps, localeable} from 'amis-core';
import {BaseSchema, SchemaClassName, SchemaTpl, SchemaUrlPath} from '../Schema';
import {handleAction} from 'amis-core';
import type {
  ImageAction,
  ImageActionKey
} from 'amis-ui/lib/components/ImageGallery';

export interface ImageToolbarAction {
  key: keyof typeof ImageActionKey;
  label?: string;
  icon?: string;
  iconClassName?: string;
  disabled?: boolean;
}

/**
 * 图片展示控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/image
 */
export interface ImageSchema extends BaseSchema {
  /**
   * 指定为图片展示类型
   */
  type: 'image' | 'static-image';

  /**
   * 默认图片地址
   */
  defaultImage?: SchemaUrlPath;

  /**
   * 图片标题
   */
  title?: SchemaTpl;

  /**
   * 关联字段名，也可以直接配置 src
   */
  name?: string;

  /**
   * 图片描述信息
   */
  imageCaption?: SchemaTpl;

  /**
   * 图片地址，如果配置了 name，这个属性不用配置。
   */
  src?: SchemaUrlPath;

  /**
   * 大图地址，不设置用 src
   */
  originalSrc?: SchemaUrlPath;

  /**
   * 是否启动放大功能。
   */
  enlargeAble?: boolean;

  /**
   * 放大时是否显示图片集
   */
  enlargeWithGallary?: boolean;

  /**
   * 是否显示尺寸。
   */
  // showDimensions?: boolean;

  /**
   * 图片无法显示时的替换文本
   */
  alt?: string;

  /**
   * 高度
   */
  height?: number;

  /**
   * 宽度
   */
  width?: number;

  /**
   * 外层 css 类名
   */
  className?: SchemaClassName;

  /** 组件内层 css 类名 */
  innerClassName?: SchemaClassName;

  /**
   * 图片 css 类名
   */
  imageClassName?: SchemaClassName;

  /**
   * 图片缩略图外层 css 类名
   */
  thumbClassName?: SchemaClassName;

  /**
   * 放大详情图 CSS 类名
   */
  imageGallaryClassName?: SchemaClassName;

  /** 图片说明文字 */
  caption?: SchemaTpl;

  /**
   * 图片展示模式，默认为缩略图模式、可以配置成原图模式
   */
  imageMode?: 'thumb' | 'original';

  /**
   * 预览图模式
   */
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';

  /**
   * 预览图比率
   */
  thumbRatio?: '1:1' | '4:3' | '16:9';

  /**
   * 链接地址
   */
  href?: SchemaTpl;

  /**
   * 是否新窗口打开
   */
  blank?: boolean;

  /**
   * 链接的 target
   */
  htmlTarget?: string;

  /**
   * 是否展示图片工具栏
   */
  showToolbar?: boolean;

  /**
   * 工具栏配置
   */
  toolbarActions?: ImageToolbarAction[];
  /**
   * 鼠标悬浮时的展示状态（对应AIpage的文字6，9，10不存在）
   * */
  hoverMode?:
    | 'hover-slide'
    | 'pull-top'
    | 'scale-center'
    | 'scale-top'
    | 'text-style-1'
    | 'text-style-2'
    | 'text-style-3'
    | 'text-style-4'
    | 'text-style-5'
    | 'text-style-6'
    | 'text-style-7';
  /**
   * 图集组件传入的排序方式
   * */
  sortType?: string;
  /**
   * 描述文字样式
   * */
  fontStyle?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
  };
  /**
   * 蒙层颜色
   * */
  maskColor?: string;
}

export interface ImageThumbProps
  extends LocaleProps,
    ThemeProps,
    Omit<ImageSchema, 'type' | 'className' | 'innerClassName'> {
  onEnlarge?: (info: ImageThumbProps) => void;
  index?: number;
  onLoad?: React.EventHandler<any>;
  overlays?: JSX.Element;
  imageControlClassName?: string;
  imageContentClassName?: string;
  titleControlClassName?: string;
  desControlClassName?: string;
  iconControlClassName?: string;
}

interface ImageThumbState {
  imageLoading: boolean; // 切换图片后，图片是否在加载
}

export class ImageThumb extends React.Component<
  ImageThumbProps,
  ImageThumbState
> {
  constructor(props: ImageThumbProps) {
    super(props);

    this.state = {
      imageLoading: false
    };
  }

  componentDidUpdate(preProps: ImageThumbProps) {
    if (preProps.src !== this.props.src) {
      this.setState({
        imageLoading: true
      });
    }
  }

  @autobind
  handleImgLoaded(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    this.setState({
      imageLoading: false
    });

    this.props?.onLoad?.(e);
  }

  @autobind
  handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    this.setState({
      imageLoading: false
    });
  }

  @autobind
  handleEnlarge() {
    const {onEnlarge, ...rest} = this.props;
    onEnlarge && onEnlarge(rest);
  }

  render() {
    const {
      classnames: cx,
      className,
      style,
      imageClassName,
      thumbClassName,
      thumbMode,
      thumbRatio,
      height,
      width,
      src,
      alt,
      title,
      caption,
      href,
      blank = true,
      htmlTarget,
      onLoad,
      enlargeAble,
      translate: __,
      overlays,
      imageMode,
      titleControlClassName,
      iconControlClassName,
      imageControlClassName,
      imageContentClassName,
      desControlClassName
    } = this.props;

    const {imageLoading} = this.state;

    const imageContent = (
      <>
        {imageLoading ? (
          <img
            className={cx('Image-image', imageClassName)}
            src={imagePlaceholder}
            alt={alt}
          />
        ) : null}
        <div className="mask" style={{background: this.props.maskColor}}>
          <span>{title}</span>
        </div>
        <img
          onLoad={this.handleImgLoaded}
          onError={this.handleImgError}
          className={cx('Image-image', imageClassName, {
            'Image-image--loading': imageLoading
          })}
          src={src}
          alt={alt}
        />
      </>
    );

    const enlarge =
      enlargeAble || overlays ? (
        <div key="overlay" className={cx('Image-overlay')}>
          {enlargeAble ? (
            <a
              data-tooltip={__('Image.zoomIn')}
              data-position="bottom"
              target="_blank"
              onClick={this.handleEnlarge}
              className={cx('Image-overlay-view-icon', iconControlClassName)}
            >
              <Icon
                icon="view"
                className="icon"
                iconContent="Image-view-icon"
              />
            </a>
          ) : null}
          {overlays}
        </div>
      ) : null;

    let image = (
      <div
        className={cx(
          'Image',
          imageMode === 'original' ? 'Image--original' : 'Image--thumb',
          className,
          imageControlClassName
        )}
        style={href ? undefined : style} // 避免重复设置style
      >
        {imageMode === 'original' ? (
          <div
            className={`
            ${cx(
              'Image-origin',
              thumbMode ? `Image-origin--${thumbMode}` : '',
              imageContentClassName
            )} ${this.props.hoverMode} Img-container`}
            style={{height: height, width: width}}
          >
            {imageContent}
            {enlarge}
          </div>
        ) : (
          <div className={cx('Image-thumbWrap')}>
            <div
              className={cx(
                'Image-thumb',
                thumbClassName,
                thumbMode ? `Image-thumb--${thumbMode}` : '',
                thumbRatio
                  ? `Image-thumb--${thumbRatio.replace(/:/g, '-')}`
                  : '',
                imageContentClassName,
                'Img-container',
                this.props.hoverMode
              )}
              style={{height: height, width: width}}
            >
              {imageContent}
            </div>
            {enlarge}
          </div>
        )}

        {(title || caption) && !this.props.hoverMode && !this.props.sortType ? (
          <div key="caption" className={cx('Image-info')}>
            {title ? (
              <div
                className={cx('Image-title', titleControlClassName)}
                title={title}
              >
                {title}
              </div>
            ) : null}
            {caption ? (
              <div
                className={cx('Image-caption', desControlClassName)}
                title={caption}
              >
                {caption}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );

    if (href) {
      image = (
        <a
          href={href}
          target={htmlTarget || (blank ? '_blank' : '_self')}
          className={cx('Link', className)}
          style={style}
          title={title}
        >
          {image}
        </a>
      );
    }

    return image;
  }
}

const ThemedImageThumb = themeable(localeable(ImageThumb));
export default ThemedImageThumb;

export const imagePlaceholder = `data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E`;

export interface ImageFieldProps extends RendererProps {
  className?: string;
  innerClassName?: string;
  imageClassName?: string;
  thumbClassName?: string;
  placeholder: string;
  description?: string;
  enlargeTitle?: string;
  enlargeCaption?: string;
  imageMode?: 'thumb' | 'original';
  thumbMode: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio: '1:1' | '4:3' | '16:9';
  originalSrc?: string; // 原图
  enlargeAble?: boolean;
  enlargeWithGallary?: boolean;
  showToolbar?: boolean;
  toolbarActions?: ImageAction[];
  maxScale?: number;
  minScale?: number;
  onImageEnlarge?: (
    info: {
      src: string;
      originalSrc: string;
      title?: string;
      caption?: string;
      thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';
      thumbRatio?: '1:1' | '4:3' | '16:9';
      showToolbar?: boolean;
      imageGallaryClassName?: string;
      toolbarActions?: ImageAction[];
      enlargeWithGallary?: boolean;
    },
    target: any
  ) => void;
  imageGallaryClassName?: string;
  onClick?:
    | ((e: React.MouseEvent<any>, props: any) => void)
    | string
    | Function
    | null;
}

interface ImageFieldState {
  scale: number; // 放大倍率
}

export class ImageField extends React.Component<
  ImageFieldProps,
  ImageFieldState
> {
  static defaultProps: Pick<
    ImageFieldProps,
    'defaultImage' | 'thumbMode' | 'thumbRatio'
  > = {
    defaultImage: imagePlaceholder,
    thumbMode: 'contain',
    thumbRatio: '1:1'
  };

  state: ImageFieldState = {
    scale: 1
  };

  @autobind
  handleEnlarge({
    src,
    originalSrc,
    title,
    caption,
    thumbMode,
    thumbRatio
  }: ImageThumbProps) {
    const {
      onImageEnlarge,
      enlargeTitle,
      enlargeCaption,
      showToolbar,
      toolbarActions,
      imageGallaryClassName,
      id,
      themeCss,
      enlargeWithGallary
    } = this.props;

    onImageEnlarge &&
      onImageEnlarge(
        {
          src: src!,
          originalSrc: originalSrc || src!,
          title: enlargeTitle || title,
          caption: enlargeCaption || caption,
          thumbMode,
          thumbRatio,
          showToolbar,
          toolbarActions,
          enlargeWithGallary,
          imageGallaryClassName: `${imageGallaryClassName} ${setThemeClassName({
            ...this.props,
            name: 'imageGallaryClassName',
            id,
            themeCss
          })} ${setThemeClassName({
            ...this.props,
            name: 'galleryControlClassName',
            id,
            themeCss
          })}`
        },
        this.props
      );
  }

  @autobind
  async handleClick(e: React.MouseEvent<HTMLElement>) {
    const {dispatchEvent, data} = this.props;
    const clickAction = this.props.clickAction;
    const rendererEvent = await dispatchEvent(
      e,
      createObject(data, {
        nativeEvent: e
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }
    if (clickAction) {
      handleAction(e, clickAction, this.props);
    }
  }

  @autobind
  handleMouseEnter(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  @autobind
  handleMouseLeave(e: React.MouseEvent<any>) {
    const {dispatchEvent, data} = this.props;
    dispatchEvent(e, data);
  }

  handleSelfAction(actionType: string, action: ActionObject) {
    let {data, maxScale = 200, minScale = 50} = this.props;
    let {scale = 50} = action.args;
    if (actionType === 'zoom') {
      if (isPureVariable(maxScale)) {
        maxScale = isNaN(
          resolveVariableAndFilter(maxScale, createObject(action.data, data))
        )
          ? 200
          : resolveVariableAndFilter(maxScale, createObject(action.data, data));
      }
      if (isPureVariable(minScale)) {
        minScale = isNaN(
          resolveVariableAndFilter(minScale, createObject(action.data, data))
        )
          ? 50
          : resolveVariableAndFilter(minScale, createObject(action.data, data));
      }

      if (scale >= 0) {
        this.setState({
          scale:
            this.state.scale + scale / 100 < maxScale / 100
              ? this.state.scale + scale / 100
              : maxScale / 100
        });
      } else {
        this.setState({
          scale:
            this.state.scale + scale / 100 > minScale / 100
              ? this.state.scale + scale / 100
              : minScale / 100
        });
      }
    }
  }

  render() {
    const {
      className,
      style,
      innerClassName,
      defaultImage,
      imageCaption,
      title,
      data,
      imageClassName,
      thumbClassName,
      height,
      width,
      classnames: cx,
      src,
      href,
      thumbMode,
      thumbRatio,
      placeholder,
      originalSrc,
      enlargeAble,
      enlargeWithGallary,
      imageMode,
      wrapperCustomStyle,
      id,
      themeCss,
      env
    } = this.props;

    const finnalSrc = src ? filter(src, data, '| raw') : '';
    let value = finnalSrc || getPropValue(this.props);
    const finnalHref = href ? filter(href, data, '| raw') : '';
    const defaultValue =
      defaultImage && !value
        ? filter(defaultImage, data, '| raw')
        : imagePlaceholder;

    return (
      <div
        className={cx(
          'ImageField',
          imageMode === 'original'
            ? 'ImageField--original'
            : 'ImageField--thumb',
          className,
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle
          })
        )}
        style={{transform: `scale(${this.state.scale})`, ...style}}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {value || (!value && !placeholder) ? (
          <ThemedImageThumb
            className={innerClassName}
            imageClassName={imageClassName}
            thumbClassName={thumbClassName}
            height={height}
            width={width}
            src={value ? value : defaultValue}
            href={finnalHref}
            title={filter(title, data)}
            caption={filter(imageCaption, data)}
            thumbMode={thumbMode}
            thumbRatio={thumbRatio}
            originalSrc={filter(originalSrc, data, '| raw') ?? value}
            enlargeAble={enlargeAble && value && value !== defaultValue}
            enlargeWithGallary={enlargeWithGallary}
            onEnlarge={this.handleEnlarge}
            imageMode={imageMode}
            imageControlClassName={setThemeClassName({
              ...this.props,
              name: 'imageControlClassName',
              id,
              themeCss
            })}
            imageContentClassName={setThemeClassName({
              ...this.props,
              name: 'imageContentClassName',
              id,
              themeCss
            })}
            titleControlClassName={setThemeClassName({
              ...this.props,
              name: 'titleControlClassName',
              id,
              themeCss
            })}
            desControlClassName={setThemeClassName({
              ...this.props,
              name: 'desControlClassName',
              id,
              themeCss
            })}
            iconControlClassName={setThemeClassName({
              ...this.props,
              name: 'iconControlClassName',
              id,
              themeCss
            })}
          />
        ) : (
          <span style={this.props.fontStyle} className="text-muted">
            {placeholder}
          </span>
        )}
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'imageControlClassName'
              },
              {
                key: 'imageContentClassName'
              },
              {
                key: 'titleControlClassName'
              },
              {
                key: 'desControlClassName'
              },
              {
                key: 'iconControlClassName'
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
  type: 'image'
})
export class ImageFieldRenderer extends ImageField {
  static contextType = ScopedContext;

  constructor(props: ImageFieldProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  doAction(action: ActionObject) {
    const actionType = action?.actionType as string;
    if (actionType === 'preview') {
      this.handleEnlarge(this.props as ImageThumbProps);
    } else {
      this.handleSelfAction(actionType, action);
    }
  }
}
