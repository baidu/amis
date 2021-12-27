/**
 * @file PopUp
 * @description
 * @author fex
 */

import React from 'react';
import {ClassNamesFn, themeable} from '../theme';
import Transition, {
  ENTERED,
  EXITING,
  EXITED,
  ENTERING
} from 'react-transition-group/Transition';
import Portal from 'react-overlays/Portal';
import { Icon } from './icons';


export interface PopUpPorps {
  className?: string;
  style?: {
    [styleName: string]: string;
  };
  overlay?: boolean;
  onHide?: () => void;
  classPrefix: string;
  classnames: ClassNamesFn;
  [propName: string]: any;
  isShow?: boolean;
  container?: any;
  hideClose?: boolean;
  placement?: 'left' | 'center' | 'right';
  header?: JSX.Element;
}

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERED]: '',
  [EXITING]: 'out',
  [EXITED]: '',
  [ENTERING]: 'in'
};
export class PopUp extends React.PureComponent<PopUpPorps> {
  static defaultProps = {
    className: '',
    overlay: true,
    isShow: false,
    container: document.body,
    hideClose: false,
  };

  componentDidMount() {

  }
  handleClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  render() {
    const {
      style,
      children,
      overlay,
      onHide,
      classPrefix: ns,
      classnames: cx,
      className,
      isShow,
      container,
      hideClose,
      placement='center',
      header,
      ...rest
    } = this.props;

    const outerStyle: any = {
      ...style,
    };
    delete outerStyle.top;
    return (
      <Portal container={container}>
        <Transition
          mountOnEnter
          unmountOnExit
          in={isShow}
          timeout={500}
          appear
        >
          {(status: string) => {
              return (
                <div
                  className={cx(
                    `${ns}PopUp`,
                    className,
                    fadeStyles[status]
                  )}
                  style={outerStyle}
                  {...rest}
                  onClick={this.handleClick}
                >
                  {overlay && (
                    <div className={`${ns}PopUp-overlay`} onClick={onHide}/>
                  )}
                  <div className={cx(
                    `${ns}PopUp-inner`
                  )}
                  >
                    {
                      !hideClose && (
                        <div className={cx(`${ns}PopUp-closeWrap`)}>
                          {header}
                          <Icon
                            icon="close"
                            className={cx('icon', `${ns}PopUp-close`)}
                            onClick={onHide}
                          />
                        </div>
                      )
                    }
                    <div
                      className={cx(`${ns}PopUp-content`, `justify-${placement}`)}
                    >
                      {children}
                    </div>
                  </div>
                </div>
              )
          }}
        </Transition>
      </Portal>
    )
  }
}

export default themeable(PopUp);
