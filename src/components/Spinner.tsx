/**
 * @file Spinner
 * @description
 * @author fex
 * @date 2017-11-07
 */

import React from 'react';
import {ClassNamesFn, themeable} from '../theme';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in'
};

interface SpinnerProps {
  overlay: boolean;
  spinnerClassName: string;
  mode: string;
  size: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  show: boolean;
}

export class Spinner extends React.Component<SpinnerProps, object> {
  static defaultProps = {
    overlay: false,
    spinnerClassName: '',
    mode: '',
    size: '',
    show: true
  };

  div: React.RefObject<HTMLDivElement> = React.createRef();
  overlay: React.RefObject<HTMLDivElement> = React.createRef();

  render() {
    const {
      show,
      classnames: cx,
      spinnerClassName,
      mode,
      size,
      overlay
    } = this.props;
    return (
      <Transition mountOnEnter unmountOnExit in={show} timeout={350}>
        {(status: string) => {
          if (status === ENTERING) {
            // force reflow
            // 由于从 mount 进来到加上 in 这个 class 估计是时间太短，上次的样式还没应用进去，所以这里强制reflow一把。
            // 否则看不到动画。
            // this.div.current!.offsetWidth;
            this.overlay.current && this.overlay.current.offsetWidth;
          }

          return (
            <>
              {overlay ? (
                <div
                  ref={this.overlay}
                  className={cx(`Spinner-overlay`, fadeStyles[status])}
                />
              ) : null}

              <div
                ref={this.div}
                className={cx(`Spinner`, spinnerClassName, fadeStyles[status], {
                  [`Spinner--${mode}`]: mode,
                  [`Spinner--overlay`]: overlay,
                  [`Spinner--${size}`]: size
                })}
              />
            </>
          );
        }}
      </Transition>
    );
  }
}

export default themeable(Spinner);
