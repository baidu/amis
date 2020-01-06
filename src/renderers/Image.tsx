import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {ClassNamesFn, themeable} from '../theme';

export interface ImageProps {
  src: string;
  title?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  caption?: string;
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio?: '1:1' | '4:3' | '16:9';
  classnames: ClassNamesFn;
  classPrefix: string;
  onLoad?: React.EventHandler<any>;
}

export class Image extends React.Component<ImageProps> {
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
      onLoad
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
const ThemedImage = themeable(Image);
export default ThemedImage;

export interface ImageFieldProps extends RendererProps {
  className?: string;
  imageClassName?: string;
  placeholder: string;
  description?: string;
  thumbMode: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio: '1:1' | '4:3' | '16:9';
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
      placeholder
    } = this.props;

    const finnalSrc = src ? filter(src, data, '| raw') : '';
    let value = finnalSrc || this.props.value || defaultImage;

    return (
      <div className={cx('ImageField', className)}>
        {value ? (
          <ThemedImage
            imageClassName={imageClassName}
            src={value}
            title={filter(title, data)}
            caption={filter(imageCaption, data)}
            thumbMode={thumbMode}
            thumbRatio={thumbRatio}
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
