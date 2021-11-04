/**
 * @file Collapse
 * @description
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from '../theme';
import Transition, {
  EXITED,
  ENTERING,
  EXITING
} from 'react-transition-group/Transition';
import {autobind} from '../utils/helper';

const collapseStyles: {
  [propName: string]: string;
} = {
  [EXITED]: 'out',
  [EXITING]: 'out',
  [ENTERING]: 'in'
};

export interface CollapseProps {
  show?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
}

export class Collapse extends React.Component<CollapseProps, any> {
  static defaultProps: Pick<
    CollapseProps,
    'show' | 'mountOnEnter' | 'unmountOnExit'
  > = {
    show: false,
    mountOnEnter: false,
    unmountOnExit: false
  };

  contentDom: any;
  contentRef = (ref: any) => (this.contentDom = ref);

  @autobind
  handleEnter(elem: HTMLElement) {
    elem.style['height'] = '';
  }

  @autobind
  handleEntering(elem: HTMLElement) {
    elem.style['height'] = `${elem['scrollHeight']}px`;
  }

  @autobind
  handleEntered(elem: HTMLElement) {
    elem.style['height'] = '';
  }

  @autobind
  handleExit(elem: HTMLElement) {
    let offsetHeight = elem['offsetHeight'];
    const height =
      offsetHeight +
      parseInt(getComputedStyle(elem).getPropertyValue('margin-top'), 10) +
      parseInt(getComputedStyle(elem).getPropertyValue('margin-bottom'), 10);
    elem.style['height'] = `${height}px`;
    // trigger browser reflow
    elem.offsetHeight;
  }

  @autobind
  handleExiting(elem: HTMLElement) {
    elem.style['height'] = '';
  }

  render() {
    const {
      show,
      children,
      classnames: cx,
      mountOnEnter,
      unmountOnExit
    } = this.props;

    return (
      <Transition
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        in={show}
        timeout={300}
        onEnter={this.handleEnter}
        onEntering={this.handleEntering}
        onEntered={this.handleEntered}
        onExit={this.handleExit}
        onExiting={this.handleExiting}
      >
        {(status: string) => {
          if (status === ENTERING) {
            this.contentDom.offsetWidth;
          }
          return (
            <div
              className={cx('Collapse-contentWrapper', collapseStyles[status])}
              ref={this.contentRef}
            >
              {React.cloneElement(children as any, {
                ...(children as React.ReactElement).props,
                className: cx(
                  'Collapse-content',
                  (children as React.ReactElement).props.className
                )
              })}
            </div>
          );
        }}
      </Transition>
    );
  }
}

export default themeable(Collapse);
