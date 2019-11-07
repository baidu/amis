import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';

export interface LinkProps extends RendererProps {
  className?: string;
  imageClassName?: string;
  placeholder?: string;
  description?: string;
}

export class LinkField extends React.Component<LinkProps, object> {
  static defaultProps = {
    className: '',
    blank: false
  };

  render() {
    const {
      className,
      body,
      href,
      classnames: cx,
      blank,
      htmlTarget,
      data,
      render
    } = this.props;

    let value = this.props.value;
    const finnalHref = href ? filter(href, data) : '';

    return (
      <a
        href={finnalHref || value}
        target={htmlTarget || (blank ? '_blank' : '_self')}
        className={cx('Link', className)}
      >
        {body ? render('body', body) : finnalHref || value || '链接'}
      </a>
    );
  }
}

@Renderer({
  test: /(^|\/)link$/,
  name: 'link'
})
export class LinkFieldRenderer extends LinkField {}
