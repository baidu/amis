import * as React from 'react';
import {
  ClassNamesFn,
  themeable,
  ThemeProps,
  generateIcon,
  IconCheckedSchema
} from 'amis-core';

/**
 * Avatar 属性
 */
interface AvatarCmptProps extends ThemeProps {
  style?: {
    [prop: string]: any;
  };
  className?: string;
  classnames: ClassNamesFn;

  /**
   * 图片地址
   */
  src?: string | React.ReactNode;

  /**
   * 图标
   */
  icon?: string | React.ReactNode | IconCheckedSchema;

  /**
   * 图片相对于容器的缩放方式
   */
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

  /**
   * 形状
   */
  shape?: 'circle' | 'square' | 'rounded';

  /**
   * 大小
   */
  size?: number | 'small' | 'default' | 'large';

  /**
   * 文本
   */
  text?: string;

  /**
   * 字符类型距离左右两侧边界单位像素
   */
  gap?: number;

  /**
   * 图片无法显示时的替换文字地址
   */
  alt?: string;

  /**
   * 图片是否允许拖动
   */
  draggable?: boolean;

  /**
   * 图片CORS属性
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';

  /**
   * 图片加载失败的事件，返回 false 会关闭组件默认的
   */
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => boolean;

  /**
   *
   */
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

const prefix = 'Avatar--';
const childPrefix = prefix + 'text';

export interface AvatarState {
  scale: number;
  hasImg: boolean;
}

export class Avatar extends React.Component<AvatarCmptProps, AvatarState> {
  static defaultProps: Partial<AvatarCmptProps> = {
    shape: 'circle',
    size: 'default',
    fit: 'cover',
    gap: 4
  };

  state: AvatarState = {
    scale: 1,
    hasImg: true
  };

  avatarChildrenRef: React.RefObject<HTMLElement>;
  avatarRef: React.RefObject<HTMLElement>;

  constructor(props: AvatarCmptProps) {
    super(props);

    this.avatarChildrenRef = React.createRef();
    this.avatarRef = React.createRef();

    this.handleImageLoadError = this.handleImageLoadError.bind(this);
  }

  componentDidMount() {
    this.setScaleByGap();
  }

  componentDidUpdate(prevProps: AvatarCmptProps, prevState: AvatarState) {
    const {src, gap, text, children} = this.props;
    const {hasImg} = this.state;
    if (prevProps.src !== src) {
      this.setState({
        hasImg: !!src
      });
    }
    if (
      (prevState.hasImg && !hasImg) ||
      prevProps.text !== text ||
      prevProps.children !== children ||
      prevProps.gap !== gap
    ) {
      this.setScaleByGap();
    }
  }

  handleImageLoadError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
    const {onError} = this.props;
    this.setState({
      hasImg: onError ? !onError(event) : false
    });
  }

  setScaleByGap() {
    const {gap = 4} = this.props;
    if (!this.avatarChildrenRef.current || !this.avatarRef.current) {
      return;
    }
    const childrenWidth = this.avatarChildrenRef.current.offsetWidth;
    const nodeWidth = this.avatarRef.current.offsetWidth;
    if (childrenWidth && nodeWidth) {
      if (gap * 2 < nodeWidth) {
        const diff = nodeWidth - gap * 2;
        this.setState({
          scale: diff < childrenWidth ? diff / childrenWidth : 1
        });
      }
    }
  }

  render() {
    let {
      style = {},
      className,
      shape,
      size,
      src,
      icon,
      alt,
      draggable,
      crossOrigin,
      fit,
      text,
      children,
      classnames: cx
    } = this.props;

    const {scale, hasImg} = this.state;

    const isImgRender = React.isValidElement(src);
    const isIconRender = React.isValidElement(icon);

    let childrenRender;

    let sizeStyle = {};
    let sizeClass = '';

    if (typeof size === 'number') {
      sizeStyle = {
        height: size,
        width: size,
        lineHeight: size + 'px'
      };
    } else if (typeof size === 'string') {
      sizeClass =
        size === 'large'
          ? `${prefix}lg`
          : size === 'small'
          ? `${prefix}sm`
          : '';
    }

    const scaleX = `scale(${scale}) translateX(-50%)`;
    const scaleStyle = {
      msTransform: scaleX,
      WebkitTransform: scaleX,
      transform: scaleX
    };

    if (typeof src === 'string' && hasImg) {
      const imgStyle = fit ? {objectFit: fit} : {};
      childrenRender = (
        <img
          style={imgStyle}
          src={src}
          alt={alt}
          draggable={draggable}
          onError={this.handleImageLoadError}
          crossOrigin={crossOrigin}
        />
      );
    } else if (isImgRender) {
      childrenRender = src;
    } else if (typeof text === 'string' || typeof text === 'number') {
      childrenRender = (
        <span
          className={cx(childPrefix)}
          ref={this.avatarChildrenRef}
          style={scaleStyle}
        >
          {text}
        </span>
      );
    } else if (['string', 'object'].includes(typeof icon)) {
      childrenRender = generateIcon(cx, icon as any);
    } else if (isIconRender) {
      childrenRender = icon;
    } else {
      childrenRender = (
        <span
          className={cx(childPrefix)}
          ref={this.avatarChildrenRef}
          style={scaleStyle}
        >
          {children}
        </span>
      );
    }

    return (
      <span
        className={cx(`Avatar`, className, prefix + shape, sizeClass)}
        style={{...sizeStyle, ...style}}
        ref={this.avatarRef}
      >
        {childrenRender}
      </span>
    );
  }
}

export default themeable(Avatar);
