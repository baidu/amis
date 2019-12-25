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
  description?: string;
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio?: '1-1' | '4-3' | '16-9';
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
      description,
      onLoad
    } = this.props;

    return (
      <div className={cx('Image', className)}>
        <div
          className={cx(
            'Image-thumb',
            thumbMode ? `Image-thumb--${thumbMode}` : '',
            thumbRatio ? `Image-thumb--${thumbRatio}` : ''
          )}
        >
          <img
            onLoad={onLoad}
            className={cx(imageClassName)}
            src={src}
            alt={alt}
          />
        </div>
        {title || description ? (
          <div key="caption" className={cx('Image-caption')}>
            {title ? <div className={cx('Image-title')}>{title}</div> : null}
            {description ? (
              <div className={cx('Image-description')}>{description}</div>
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
  thumbRatio: '1-1' | '4-3' | '16-9';
}

export class ImageField extends React.Component<ImageFieldProps, object> {
  static defaultProps: Pick<
    ImageFieldProps,
    'defaultImage' | 'thumbMode' | 'thumbRatio' | 'placeholder'
  > = {
    defaultImage:
      'https://fex.bdstatic.com/n/static/amis/renderers/crud/field/placeholder_cfad9b1.png',
    thumbMode: 'contain',
    thumbRatio: '1-1',
    placeholder: '-'
  };

  render() {
    const {
      className,
      defaultImage,
      description,
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
            description={filter(description, data)}
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
