import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';

export interface MappingProps extends RendererProps {
  className?: string;
  placeholder?: string;
  map: PlainObject;
}

export class MappingField extends React.Component<MappingProps, object> {
  static defaultProps: Partial<MappingProps> = {
    placeholder: '-',
    map: {
      '*': '通配值'
    }
  };

  render() {
    const {
      className,
      value,
      placeholder,
      map,
      render,
      classnames: cx
    } = this.props;

    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );
    let key = value === true ? '1' : value;

    if (typeof value !== 'undefined' && map && (map[key] || map['*'])) {
      viewValue = render('tpl', map[key] || map['*']);
    }

    return <span className={cx('MappingField', className)}>{viewValue}</span>;
  }
}

@Renderer({
  test: /(^|\/)(?:map|mapping)$/,
  name: 'mapping'
})
export class MappingFieldRenderer extends MappingField {}
