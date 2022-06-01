/**
 * @file Spinner
 * @description
 * @author fex
 * @date 2017-11-07
 */

import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import Transition, {ENTERED} from 'react-transition-group/Transition';
import {Icon, hasIcon} from './icons';
import {generateIcon} from 'amis-core';

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERED]: 'in'
};

// Spinner Props
export interface SpinnerProps extends ThemeProps {
  show: boolean; // 控制Spinner显示与隐藏
  className?: string; // 自定义最外层元素class
  spinnerClassName?: string; // spin图标位置包裹元素的自定义class
  /**
   * @deprecated 已废弃，没有作用
   */
  mode?: string;
  size?: 'sm' | 'lg' | ''; // spinner Icon 大小
  icon?: string | React.ReactNode; // 自定义icon
  tip?: string; // spinner文案
  tipPlacement?: 'top' | 'right' | 'bottom' | 'left'; // spinner文案位置
  delay?: number; // 延迟显示
  overlay?: boolean; // 是否显示遮罩层，有children属性才生效
}

export class Spinner extends React.Component<SpinnerProps> {
  static defaultProps = {
    show: true,
    className: '',
    spinnerClassName: '',
    size: '' as '',
    icon: '',
    tip: '',
    tipPlacement: 'bottom' as 'bottom',
    delay: 0,
    overlay: false
  };

  render() {
    const {
      classnames: cx,
      show,
      className,
      spinnerClassName,
      size = '',
      overlay,
      delay,
      icon,
      tip,
      tipPlacement = ''
    } = this.props;
    const isCustomIcon = icon && React.isValidElement(icon);
    const timeout = {enter: delay, exit: 0};

    return (
      <Transition mountOnEnter unmountOnExit in={show} timeout={timeout}>
        {(status: string) => {
          return (
            <>
              {/* 遮罩层 */}
              {overlay ? (
                <div className={cx(`Spinner-overlay`, fadeStyles[status])} />
              ) : null}

              {/* spinner图标和文案 */}
              <div
                data-testid="spinner"
                className={cx(
                  `Spinner`,
                  tip && {
                    [`Spinner-tip--${tipPlacement}`]: [
                      'top',
                      'right',
                      'bottom',
                      'left'
                    ].includes(tipPlacement)
                  },
                  {[`Spinner--overlay`]: overlay},
                  fadeStyles[status],
                  className
                )}
              >
                <div
                  className={cx(
                    `Spinner-icon`,
                    {
                      [`Spinner-icon--${size}`]: ['lg', 'sm'].includes(size),
                      [`Spinner-icon--default`]: !icon,
                      [`Spinner-icon--simple`]: !isCustomIcon && icon,
                      [`Spinner-icon--custom`]: isCustomIcon
                    },
                    spinnerClassName
                  )}
                >
                  {icon ? (
                    isCustomIcon ? (
                      icon
                    ) : hasIcon(icon as string) ? (
                      <Icon icon={icon} className="icon" />
                    ) : (
                      generateIcon(cx, icon as string, 'icon')
                    )
                  ) : null}
                </div>
                {tip ? <span className={cx(`Spinner-tip`)}>{tip}</span> : ''}
              </div>
            </>
          );
        }}
      </Transition>
    );
  }
}

export default themeable(Spinner);
