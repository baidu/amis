/**
 * @file Spinner
 * @description
 * @author fex
 * @date 2017-11-07
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {themeable, ThemeProps} from 'amis-core';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';
import {Icon, hasIcon} from './icons';
import {types} from 'mobx-state-tree';
import {observable, reaction} from 'mobx';

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERED]: 'in',
  [ENTERING]: 'in'
};

// Spinner Props
export interface SpinnerProps extends ThemeProps, SpinnerExtraProps {
  show?: boolean; // 控制Spinner显示与隐藏
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
  /** 是否处于禁用状态 */
  disabled?: boolean;
}

export interface SpinnerExtraProps {
  loadingConfig?: {
    root?: string;
    show?: boolean;
  };
}

const SpinnerSharedStore = types
  .model('SpinnerSharedStore', {})
  .volatile(self => {
    return {
      // 保存所有可以进入 loading 状态（props.show = true）的 Spinner 的父级容器
      spinningContainers: observable.set([] as HTMLElement[], {
        deep: false
      })
    };
  })
  .actions(self => {
    return {
      push: (spinnerContainer: HTMLElement) => {
        if (self.spinningContainers.has(spinnerContainer)) {
          return;
        }
        self.spinningContainers.add(spinnerContainer);
      },
      remove: (spinnerContainer: HTMLElement) => {
        if (self.spinningContainers.has(spinnerContainer)) {
          self.spinningContainers.delete(spinnerContainer);
        }
      },
      /**
       *  判断当前 Spinner 是否可以进入 loading 状态
       * @param spinnerContainerWillCheck 待检查的 Spinner 父容器
       * @returns {boolean} 是否可以进入 loading
       */
      checkLoading: (spinnerContainerWillCheck: HTMLElement | null) => {
        if (self.spinningContainers.has(spinnerContainerWillCheck)) {
          if (!self.spinningContainers.size) {
            return false;
          }

          let loading = true;

          // 检查缓存的容器中是否有当前容器的父级元素
          self.spinningContainers.forEach(container => {
            if (
              container.contains(spinnerContainerWillCheck) &&
              container !== spinnerContainerWillCheck
            ) {
              loading = false;
            }
          });

          return loading;
        }

        return false;
      }
    };
  });

const store = SpinnerSharedStore.create({});

export class Spinner extends React.Component<
  SpinnerProps,
  {spinning: boolean; showMarker: boolean}
> {
  static defaultProps = {
    show: true,
    className: '',
    spinnerClassName: '',
    size: '' as '',
    icon: '',
    tip: '',
    tipPlacement: 'bottom' as 'bottom',
    delay: 0,
    overlay: false,
    loadingConfig: {},
    disabled: false
  };

  state = {
    spinning: false,
    showMarker: true
  };

  parent: HTMLElement | null = null;

  /**
   * 解决同级（same parent node） spinner 的 show 不全为 true 时
   * 标记 loading 是由当前组件触发的
   */
  loadingTriggered: boolean = false;

  spinnerRef = (dom: HTMLElement) => {
    if (dom) {
      this.parent = dom.parentNode as HTMLElement;
    }
  };

  componentDidUpdate() {
    const showLoading =
      this.props.loadingConfig?.show === true ||
      typeof this.props.loadingConfig?.show === 'undefined';

    if (this.parent && showLoading) {
      if (this.props.show) {
        this.loadingTriggered = true;
        store.push(this.parent);
      } else if (this.state.spinning && this.loadingTriggered) {
        this.loadingTriggered = false;
        store.remove(this.parent);
      }
    }
  }

  componentDidMount() {
    if (this.parent && this.state.showMarker) {
      this.setState({showMarker: false});
    }
  }

  componentWillUnmount() {
    // 卸载 reaction
    this.loadingChecker();
    // 删除 当前 parent 元素
    store.remove(this.parent!);
  }

  /**
   * 监控着 spinningContainers 的变化
   */
  loadingChecker = reaction(
    () => store.spinningContainers.size,
    () => {
      if (this.parent) {
        this.setState({
          spinning: store.checkLoading(this.parent) && this.loadingTriggered
        });
      }
    }
  );

  renderBody() {
    const {
      classnames: cx,
      className,
      spinnerClassName,
      size = '',
      overlay,
      delay,
      icon: iconConfig,
      tip,
      tipPlacement = '',
      loadingConfig,
      disabled
    } = this.props;
    // 定义了挂载位置时只能使用默认icon
    const icon = loadingConfig?.root ? undefined : iconConfig;
    const isCustomIcon = icon && React.isValidElement(icon);
    const timeout = {enter: delay, exit: 0};

    const showOverlay = loadingConfig?.root || overlay;

    return (
      <>
        {this.state.showMarker && (
          <span className={cx('Spinner-mark')} ref={this.spinnerRef as any} />
        )}
        <Transition
          mountOnEnter
          unmountOnExit
          in={this.state.spinning}
          timeout={timeout}
        >
          {(status: string) => {
            return (
              <>
                {/* 遮罩层 */}
                {showOverlay ? (
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
                    {[`Spinner--overlay`]: showOverlay},
                    fadeStyles[status],
                    className
                  )}
                >
                  <div
                    className={cx(
                      `Spinner-icon`,
                      {
                        [`Spinner-icon--${size}`]: ['lg', 'sm'].includes(size),
                        'Spinner-icon--default': !icon,
                        'Spinner-icon--simple': !isCustomIcon && icon,
                        'Spinner-icon--custom': isCustomIcon,
                        'Spinner-icon--disabled': disabled
                      },
                      spinnerClassName
                    )}
                  >
                    {icon ? (
                      <Icon cx={cx} icon={icon} className="icon" />
                    ) : null}
                  </div>
                  {tip ? <span className={cx(`Spinner-tip`)}>{tip}</span> : ''}
                </div>
              </>
            );
          }}
        </Transition>
      </>
    );
  }

  render() {
    const {loadingConfig} = this.props;

    const spinnerBody = this.renderBody();
    const root = loadingConfig?.root;
    const dom = root ? document.querySelector(root) : null;

    if (dom) {
      // TODO: 找到准确的 元素
      return ReactDOM.createPortal(spinnerBody, dom);
    }

    return spinnerBody;
  }
}

export default themeable(Spinner);
