import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import cx from 'classnames';

export interface PlainProps extends RendererProps {
  className?: string;
  tpl?: string;
  html?: string;
  text?: string;
  raw?: string;
  wrapperComponent?: any;
  inline?: boolean;
}

export class Plain extends React.Component<PlainProps, object> {
  static defaultProps: Partial<PlainProps> = {
    wrapperComponent: '',
    inline: true,
    placeholder: '-'
  };

  render() {
    const {
      className,
      wrapperComponent,
      value,
      text,
      data,
      tpl,
      inline,
      placeholder,
      classnames: cx
    } = this.props;

    const Component = wrapperComponent || (inline ? 'span' : 'div');

    return (
      <Component className={cx('PlainField', className)}>
        {tpl || text ? (
          filter(tpl || (text as string), data)
        ) : typeof value === 'undefined' || value === '' || value === null ? (
          <span className="text-muted">{placeholder}</span>
        ) : (
          String(value)
        )}
      </Component>
    );
  }
}

@Renderer({
  test: /(^|\/)(?:plain|text)$/,
  name: 'plain'
})
export class PlainRenderer extends Plain {}
