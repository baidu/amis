import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {autobind} from '../utils/helper';
import {Icon} from '../components/icons';
import {LocaleProps, localeable} from '../locale';

export interface ImageThumbProps extends LocaleProps, ThemeProps {
  src: string;
  originalSrc?: string; // 原图
  enlargeAble?: boolean;
  onEnlarge?: (info: ImageThumbProps) => void;
  showDimensions?: boolean;
  title?: string;
  alt?: string;
  index?: number;
  className?: string;
  imageClassName?: string;
  caption?: string;
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio?: '1:1' | '4:3' | '16:9';
  onLoad?: React.EventHandler<any>;
}

export class ImageThumb extends React.Component<ImageThumbProps> {
  @autobind
  handleEnlarge() {
    const {onEnlarge, ...rest} = this.props;
    onEnlarge && onEnlarge(rest);
  }

  render() {
    const {
      classnames: cx,
      className,
      imageClassName,
      thumbMode,
      thumbRatio,
      src,
      alt,
      title,
      caption,
      onLoad,
      enlargeAble,
      translate: __
    } = this.props;

    return (
      <div className={cx('Image', className)}>
        <div
          className={cx(
            'Image-thumb',
            thumbMode ? `Image-thumb--${thumbMode}` : '',
            thumbRatio ? `Image-thumb--${thumbRatio.replace(/:/g, '-')}` : ''
          )}
        >
          <img
            onLoad={onLoad}
            className={cx(imageClassName)}
            src={src}
            alt={alt}
          />

          {enlargeAble ? (
            <div key="overlay" className={cx('Image-overlay')}>
              <a
                data-tooltip={__('查看大图')}
                data-position="bottom"
                target="_blank"
                onClick={this.handleEnlarge}
              >
                <Icon icon="view" className="icon" />
              </a>
            </div>
          ) : null}
        </div>
        {title || caption ? (
          <div key="caption" className={cx('Image-info')}>
            {title ? <div className={cx('Image-title')}>{title}</div> : null}
            {caption ? (
              <div className={cx('Image-caption')}>{caption}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}
const ThemedImageThumb = themeable(localeable(ImageThumb));
export default ThemedImageThumb;

export interface ImageFieldProps extends RendererProps {
  className?: string;
  imageClassName?: string;
  placeholder: string;
  description?: string;
  enlargeTitle?: string;
  enlargeCaption?: string;
  thumbMode: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio: '1:1' | '4:3' | '16:9';
  originalSrc?: string; // 原图
  enlargeAble?: boolean;
  onImageEnlarge?: (
    info: {
      src: string;
      originalSrc: string;
      title?: string;
      caption?: string;
      thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';
      thumbRatio?: '1:1' | '4:3' | '16:9';
    },
    target: any
  ) => void;
  showDimensions?: boolean;
}

export class ImageField extends React.Component<ImageFieldProps, object> {
  static defaultProps: Pick<
    ImageFieldProps,
    'defaultImage' | 'thumbMode' | 'thumbRatio' | 'placeholder'
  > = {
    defaultImage:
      'https://fex.bdstatic.com/n/static/amis/renderers/crud/field/placeholder_cfad9b1.png',
    thumbMode: 'contain',
    thumbRatio: '1:1',
    placeholder: '-'
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
    const {onImageEnlarge, enlargeTitle, enlargeCaption} = this.props;

    onImageEnlarge &&
      onImageEnlarge(
        {
          src,
          originalSrc: originalSrc || src,
          title: enlargeTitle || title,
          caption: enlargeCaption || caption,
          thumbMode,
          thumbRatio
        },
        this.props
      );
  }

  render() {
    const {
      className,
      defaultImage,
      imageCaption,
      title,
      data,
      imageClassName,
      classnames: cx,
      src,
      thumbMode,
      thumbRatio,
      placeholder,
      originalSrc,
      enlargeAble,
      showDimensions
    } = this.props;

    const finnalSrc = src ? filter(src, data, '| raw') : '';
    let value = finnalSrc || this.props.value || defaultImage;

    return (
      <div className={cx('ImageField', className)}>
        {value ? (
          <ThemedImageThumb
            imageClassName={imageClassName}
            src={value}
            title={filter(title, data)}
            caption={filter(imageCaption, data)}
            thumbMode={thumbMode}
            thumbRatio={thumbRatio}
            originalSrc={filter(originalSrc, data, '| raw')}
            enlargeAble={enlargeAble && value !== defaultImage}
            onEnlarge={this.handleEnlarge}
            showDimensions={showDimensions}
          />
        ) : (
          <span className="text-muted">{placeholder}</span>
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)image$/,
  name: 'image'
})
export class ImageFieldRenderer extends ImageField {}
