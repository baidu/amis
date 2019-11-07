import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import moment from 'moment';

export interface ImageProps extends RendererProps {
  className?: string;
  imageClassName?: string;
  placeholder?: string;
  description?: string;
}

export class ImageField extends React.Component<ImageProps, object> {
  static defaultProps: Partial<ImageProps> = {
    className: 'thumb-lg',
    imageClassName: 'r',
    defaultImage:
      'https://fex.bdstatic.com/n/static/amis/renderers/crud/field/placeholder_cfad9b1.png'
  };

  render() {
    const {
      className,
      defaultImage,
      description,
      title,
      render,
      data,
      imageClassName,
      classnames: cx,
      src
    } = this.props;

    const finnalSrc = src ? filter(src, data, '| raw') : '';
    let value = this.props.value;

    return (
      <div className={cx('ImageField', className)}>
        <img
          className={imageClassName}
          src={finnalSrc || value || defaultImage}
        />
        {title || description ? (
          <div key="caption" className={cx('ImageField-caption')}>
            {title ? (
              <div className="text-md">{filter(title, data)}</div>
            ) : null}
            {render('description', description as string)}
          </div>
        ) : null}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)image$/,
  name: 'image'
})
export class ImageFieldRenderer extends ImageField {}

@Renderer({
  test: /(^|\/)images$/
})
export class ImagesFieldRenderer extends ImageField {
  static defaultProps: Partial<ImageProps> = {
    ...ImageField.defaultProps,
    multiple: true,
    delimiter: ','
  };

  render() {
    return <p>Todo</p>;
  }
}
