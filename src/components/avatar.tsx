import * as React from 'react';
import {ClassNamesFn, themeable} from '../theme';

/**
 * Avatar 属性
 */
interface AvatarCmptProps {
  style?: {
    [prop: string]: any
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
  icon?: string | React.ReactNode;

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
  onError?: () => boolean;
}

function fillRef<T>(ref: React.Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    (ref as any).current = node;
  }
}

function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  return (node: T) => {
    refs.forEach(ref => {
      fillRef(ref, node);
    });
  };
}

const prefix = 'Avatar--';
const childPrefix = prefix + 'text';

const InternalAvatar: React.ForwardRefRenderFunction<unknown, AvatarCmptProps> = (props, ref) => {
  const [scale, setScale] = React.useState(1);
  const [hasImg, setHasImge] = React.useState(true);

  let {
    style = {},
    className,
    shape = 'circle',
    size = 'default',
    src,
    icon,
    alt,
    draggable,
    crossOrigin,
    fit,
    gap = 4,
    text,
    onError,
    children,
    classnames: cx
  } = props;

  const isImgRender = React.isValidElement(src);
  const isIconRender = React.isValidElement(icon);

  const avatarRef = React.useRef<HTMLElement>();
  const avatarChildrenRef = React.useRef<HTMLElement>(null);
  const avatarNodeMergeRef = composeRef(ref, avatarRef);
  const setScaleByGap = () => {
    if (!avatarChildrenRef.current || !avatarRef.current) {
      return;
    }
    const childrenWidth = avatarChildrenRef.current.offsetWidth;
    const nodeWidth = avatarRef.current.offsetWidth;
    if (childrenWidth && nodeWidth) {
      if (gap * 2 < nodeWidth) {
        const diff = nodeWidth - gap * 2;
        setScale(diff < childrenWidth ? diff / childrenWidth : 1);
      }
    }
  };

  const handleImageLoadError = () => {
    if (onError) {
      const bool = !!onError();
      bool && setHasImge(false);
    }
  }

  let childrenRender;

  let sizeStyle = {};
  let sizeClass = '';

  if (typeof size === 'number') {
    sizeStyle = {
      height: size,
      width: size,
      lineHeight: size + 'px'
    };
  }
  else if (typeof size === 'string') {
    sizeClass = size === 'large'
      ? `${prefix}lg` 
      : size === 'small' ? `${prefix}sm` : '';
  }

  React.useEffect(() => {
    setHasImge(true);
    setScale(1);
  }, [props.src]);

  React.useEffect(() => {
    setScaleByGap();
  }, [props.gap]);

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
        onError={handleImageLoadError}
        {...crossOrigin === undefined ? {} : {crossOrigin}}
      />
    );
  }
  else if (isImgRender) {
    childrenRender = src;
  }
  else if (typeof text === 'string' || typeof text === 'number') {
    childrenRender = (
      <span
        className={cx(childPrefix)}
        ref={avatarChildrenRef}
        style={scaleStyle}>{text}
      </span>
    );
  }
  else if (typeof icon === 'string') {
    childrenRender = (<i className={icon} />);
  }
  else if (isIconRender) {
    childrenRender = icon;
  }
  else {
    childrenRender = (
      <span
        className={cx(childPrefix)}
        ref={avatarChildrenRef}
        style={scaleStyle}>{children}
      </span>
    );
  }

  return (
    <span
      className={cx(`Avatar`, className, prefix + shape, sizeClass)}
      style={{...sizeStyle, ...style}}
      ref={avatarNodeMergeRef as any}>
      {childrenRender}
    </span>
  );
}

const Avatar = React.forwardRef<unknown, AvatarCmptProps>(InternalAvatar);

export default themeable(Avatar);
