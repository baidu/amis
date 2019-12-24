import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {resolveVariable, isPureVariable} from '../utils/tpl-builtin';
import Image from './Image';

export interface ImagesProps extends RendererProps {
  className: string;
  defaultImage: string;
  placeholder: string;
  delimiter: string;
  thumbMode: 'w-full' | 'h-full' | 'contain' | 'cover';
  thumbRatio: '1-1' | '4-3' | '16-9';

  name?: string;
  value?: any;
  source?: string;
}

export class ImagesField extends React.Component<ImagesProps> {
  static defaultProps: Pick<
    ImagesProps,
    | 'className'
    | 'delimiter'
    | 'defaultImage'
    | 'placehoder'
    | 'thumbMode'
    | 'thumbRatio'
  > = {
    className: '',
    delimiter: ',',
    defaultImage:
      'https://fex.bdstatic.com/n/static/amis/renderers/crud/field/placeholder_cfad9b1.png',
    placehoder: '-',
    thumbMode: 'contain',
    thumbRatio: '1-1'
  };

  render() {
    const {
      className,
      defaultImage,
      thumbMode,
      thumbRatio,
      data,
      name,
      value,
      placeholder,
      classnames: cx,
      source,
      delimiter
    } = this.props;

    let list: any;

    if (typeof source === 'string' && isPureVariable(source)) {
      list = resolveVariable(source, data) || undefined;
    } else if (Array.isArray(value)) {
      list = value;
    } else if (name && data[name]) {
      list = data[name];
    }

    if (typeof list === 'string') {
      list = list.split(delimiter);
    } else if (list && !Array.isArray(list)) {
      list = [list];
    }

    return (
      <div className={cx('ImagesField', className)}>
        {Array.isArray(list) ? (
          <div className={cx('Images')}>
            {list.map((item: any, index: number) => (
              <Image
                className={cx('Images-item')}
                key={index}
                src={(item && item.image) || item}
                title={item && item.title}
                description={item && item.description}
                thumbMode={thumbMode}
                thumbRatio={thumbRatio}
              />
            ))}
          </div>
        ) : defaultImage ? (
          <Image
            className={cx('Images-item')}
            src={defaultImage}
            thumbMode={thumbMode}
            thumbRatio={thumbRatio}
          />
        ) : (
          placeholder
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)images$/
})
export class ImagesFieldRenderer extends ImagesField {}
