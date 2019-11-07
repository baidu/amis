import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {filter} from '../utils/tpl';
import cx from 'classnames';

export interface DividerProps extends RendererProps {
  lineStyle: 'dashed' | 'solid';
}

export default class Divider extends React.Component<DividerProps, object> {
  static defaultProps: Pick<DividerProps, 'className' | 'lineStyle'> = {
    className: '',
    lineStyle: 'dashed'
  };

  render() {
    const {classnames: cx, className, lineStyle} = this.props;
    return (
      <div
        className={cx(
          'Divider',
          lineStyle ? `Divider--${lineStyle}` : '',
          className
        )}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)(?:divider|hr)$/,
  name: 'divider'
})
export class DividerRenderer extends Divider {}
