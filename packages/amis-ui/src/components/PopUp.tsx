/**
 * @file PopUp
 * @description
 * @author fex
 */

import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {localeable, LocaleProps} from 'amis-core';
import Transition, {
  ENTERED,
  EXITING,
  EXITED,
  ENTERING
} from 'react-transition-group/Transition';
import Portal from 'react-overlays/Portal';
import {Icon} from './icons';
import Button from './Button';

export interface PopUpPorps extends ThemeProps, LocaleProps {
  title?: string;
  className?: string;
  style?: {
    [styleName: string]: string;
  };
  overlay?: boolean;
  onHide?: () => void;
  isShow?: boolean;
  container?: any;
  showConfirm?: boolean;
  onConfirm?: (value: any) => void;
  showClose?: boolean;
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
  scrollTop: number = 0;
  static defaultProps = {
    className: '',
    overlay: true,
    isShow: false,
    container: document.body,
    showClose: true,
    onConfirm: () => {}
  };
  componentDidUpdate() {
    if (this.props.isShow) {
      this.scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.body.scrollTop = this.scrollTop;
    }
  }
  componentWillUnmount() {
    document.body.style.overflow = 'auto';
    document.body.scrollTop = this.scrollTop;
  }
  handleClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  render() {
    const {
      style,
      title,
      children,
      overlay,
      onHide,
      onConfirm,
      classPrefix: ns,
      classnames: cx,
      className,
      isShow,
      container,
      showConfirm,
      translate: __,
      showClose,
      header,
      placement = 'center',
      ...rest
    } = this.props;

    const outerStyle: any = {
      ...style
    };
    delete outerStyle.top;
    return (
      <Portal container={container}>
        <Transition mountOnEnter unmountOnExit in={isShow} timeout={500} appear>
          {(status: string) => {
            return (
              <div
                className={cx(`${ns}PopUp`, className, fadeStyles[status])}
                style={outerStyle}
                {...rest}
                onClick={this.handleClick}
              >
                {overlay && (
                  <div className={`${ns}PopUp-overlay`} onClick={onHide} />
                )}
                <div className={cx(`${ns}PopUp-inner`)}>
                  {!showConfirm && showClose ? (
                    <div className={cx(`${ns}PopUp-closeWrap`)}>
                      {header}
                      <span className={cx(`PopUp-closeBox`)} onClick={onHide}>
                        <Icon
                          icon="close"
                          className={cx('icon', `${ns}PopUp-close`)}
                        />
                      </span>
                    </div>
                  ) : null}
                  {showConfirm && (
                    <div className={cx(`${ns}PopUp-toolbar`)}>
                      <Button
                        className={cx(`${ns}PopUp-cancel`)}
                        level="text"
                        onClick={onHide}
                      >
                        {__('cancel')}
                      </Button>
                      {title && (
                        <span className={cx(`${ns}PopUp-title`)}>{title}</span>
                      )}
                      <Button
                        className={cx(`${ns}PopUp-confirm`)}
                        level="text"
                        onClick={onConfirm}
                      >
                        {__('confirm')}
                      </Button>
                    </div>
                  )}
                  <div
                    className={cx(`${ns}PopUp-content`, `justify-${placement}`)}
                  >
                    {isShow ? children : null}
                  </div>
                  <div className={cx(`PopUp-safearea`)}></div>
                </div>
              </div>
            );
          }}
        </Transition>
      </Portal>
    );
  }
}

export default themeable(localeable(PopUp));
