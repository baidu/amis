/**
 * @file Toast
 * @description toast提示组件, 单例模式，App级别只需要一个ToastComponent，引入了多个会兼容，也只有第一个生效
 * @author fex
 */

import Transition, {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED
} from 'react-transition-group/Transition';
import React from 'react';
import cx from 'classnames';
import Html from './Html';
import {uuid, autobind, noop, isMobile} from '../utils/helper';
import {ClassNamesFn, themeable, classnames, ThemeProps} from '../theme';
import {Icon} from './icons';
import {LocaleProps, localeable, TranslateFn} from '../locale';
import groupBy from 'lodash/groupBy';

interface Config {
  closeButton?: boolean;
  timeout?: number;
}

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in',
  [EXITING]: 'out'
};

let toastRef: any = null;
const show = (content: string, conf: any = {}, method: string) => {
  if (!toastRef || !toastRef[method]) {
    return;
  }
  toastRef[method](content, {...conf});
};

interface ToastComponentProps extends ThemeProps, LocaleProps {
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  closeButton: boolean;
  showIcon?: boolean;
  timeout: number;
  errorTimeout: number;
  className?: string;
  items?: Array<Item>;
  useMobileUI?: boolean;
}

interface Item extends Config {
  title?: string | React.ReactNode;
  body: string | React.ReactNode;
  level: 'info' | 'success' | 'error' | 'warning';
  id: string;
  onDissmiss?: () => void;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  showIcon?: boolean;
  useMobileUI?: boolean;
}

interface ToastComponentState {
  items: Array<Item>;
  useMobileUI?: boolean;
}

export class ToastComponent extends React.Component<
  ToastComponentProps,
  ToastComponentState
> {
  static defaultProps: Pick<
    ToastComponentProps,
    'position' | 'closeButton' | 'timeout' | 'errorTimeout' | 'items'
  > = {
    position: 'top-center',
    closeButton: false,
    timeout: 4000,
    errorTimeout: 6000, // 错误的时候 time 调长
    items: []
  };
  static themeKey = 'toast';

  // 当前ToastComponent是否真正render了
  hasRendered = false;
  state: ToastComponentState = {
    items: []
  };

  componentDidMount() {
    this.hasRendered = true;
    toastRef = this;
  }

  componentWillUnmount() {
    if (this.hasRendered) {
      toastRef = null;
    }
  }

  notifiy(level: string, content: any, config?: any) {
    let items = this.state.items.concat();
    const useMobileUI = (config.useMobileUI || this.props.useMobileUI) && isMobile();
    if (useMobileUI) {
      // 移动端只能存在一个
      items = [];
    }
    items.push({
      body: content,
      level,
      ...config,
      id: uuid(),
      position: config.position || (useMobileUI ? 'center' : config.position),
      timeout: config.timeout || (useMobileUI ? 3000 : undefined),
    });
    this.setState({
      items,
      useMobileUI
    });
  }

  @autobind
  success(content: string, config?: any) {
    this.notifiy('success', content, config);
  }

  @autobind
  error(content: string, config?: any) {
    this.notifiy('error', content, config);
  }

  @autobind
  info(content: string, config?: any) {
    this.notifiy('info', content, config);
  }

  @autobind
  warning(content: string, config?: any) {
    this.notifiy('warning', content, config);
  }

  handleDismissed(index: number) {
    const items = this.state.items.concat();
    const [item] = items.splice(index, 1);

    item?.onDissmiss?.();
    this.setState({
      items: items
    });
  }

  render() {
    if (toastRef && !this.hasRendered) {
      return null;
    }

    const {
      classnames: cx,
      className,
      timeout,
      errorTimeout,
      position,
      showIcon,
      translate,
      closeButton,
      useMobileUI
    } = this.props;
    const items = this.state.items;
    const mobileUI = (useMobileUI || this.state.useMobileUI) && isMobile();
    const groupedItems = groupBy(items, item => item.position || position);

    return Object.keys(groupedItems).map(position => {
      const toasts = groupedItems[position];
      return (
        <div
          key={position}
          className={cx(
            `Toast-wrap Toast-wrap--${position.replace(/\-(\w)/g, (_, l) =>
              l.toUpperCase()
            )}`,
            {
              'Toast-mobile': mobileUI
            },
            className
          )}
        >
          {toasts.map((item, index) => {
            const level = item.level || 'info';
            const toastTimeout =
              item.timeout ?? (level === 'error' ? errorTimeout : timeout);
            return (
              <ToastMessage
                classnames={cx}
                key={item.id || index}
                title={item.title}
                body={item.body}
                level={level}
                timeout={toastTimeout}
                closeButton={!mobileUI && (item.closeButton ?? closeButton)}
                onDismiss={this.handleDismissed.bind(this, items.indexOf(item))}
                translate={translate}
                showIcon={item.showIcon ?? showIcon}
                useMobileUI={mobileUI}
              />
            );
          })}
        </div>
      );
    });
  }
}

export default themeable(localeable(ToastComponent));

interface ToastMessageProps {
  title?: string | React.ReactNode;
  body: string | React.ReactNode;
  level: 'info' | 'success' | 'error' | 'warning';
  timeout: number;
  closeButton?: boolean;
  showIcon?: boolean;
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  onDismiss?: () => void;
  classnames: ClassNamesFn;
  translate: TranslateFn;
  allowHtml: boolean;
  useMobileUI?: boolean;
}

interface ToastMessageState {
  visible: boolean;
}

export class ToastMessage extends React.Component<
  ToastMessageProps,
  ToastMessageState
> {
  static defaultProps = {
    timeout: 5000,
    classPrefix: '',
    position: 'top-center',
    allowHtml: true,
    level: 'info'
  };

  state = {
    visible: false
  };

  // content: React.RefObject<HTMLDivElement>;
  timer: ReturnType<typeof setTimeout>;
  mounted: boolean = false;

  componentDidMount() {
    this.mounted = true;
    this.setState({
      visible: true
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.mounted = false;
  }

  @autobind
  handleMouseEnter() {
    clearTimeout(this.timer);
  }

  @autobind
  handleMouseLeave() {
    this.handleEntered();
  }

  @autobind
  handleEntered() {
    const timeout = this.props.timeout;
    if (this.mounted && timeout) {
      this.timer = setTimeout(this.close, timeout);
    }
  }

  @autobind
  close() {
    clearTimeout(this.timer);
    this.setState({
      visible: false
    });
  }

  render() {
    const {
      onDismiss,
      classnames: cx,
      closeButton,
      title,
      body,
      allowHtml,
      level,
      showIcon,
      useMobileUI,
      translate: __
    } = this.props;
    const iconName = useMobileUI ? '' : 'status-';

    return (
      <Transition
        mountOnEnter
        unmountOnExit
        in={this.state.visible}
        timeout={750}
        onEntered={this.handleEntered}
        onExited={onDismiss}
      >
        {(status: string) => {
          return (
            <div
              className={cx(`Toast Toast--${level}`, fadeStyles[status],{
                'Toast-mobile--has-icon': useMobileUI && showIcon !== false
              })}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={closeButton ? noop : this.close}
            >
              {showIcon === false ? null : (
                <div className={cx('Toast-icon')}>
                  {level === 'success' ? (
                    <Icon icon={iconName + 'success'} className="icon" />
                  ) : level == 'error' ? (
                    <Icon icon={iconName + 'fail'} className="icon" />
                  ) : level == 'info' ? (
                    <Icon icon={iconName + 'info'} className="icon" />
                  ) : level == 'warning' ? (
                    <Icon icon={iconName + 'warning'} className="icon" />
                  ) : null}
                </div>
              )}

              <div className={cx('Toast-content')}>
                {typeof title === 'string' ? (
                  <span className={cx(`Toast-title`)}>{title}</span>
                ) : React.isValidElement(title) ? (
                  React.cloneElement(title, {
                    className: cx(`Toast-title`, title?.props?.className ?? '')
                  })
                ) : null}

                {typeof body === 'string' ? (
                  <div className={cx('Toast-body')}>
                    {allowHtml ? <Html html={body} /> : body}
                  </div>
                ) : React.isValidElement(body) ? (
                  React.cloneElement(body, {
                    className: cx(`Toast-body`, body?.props?.className ?? '')
                  })
                ) : null}
              </div>

              {closeButton ? (
                <a onClick={this.close} className={cx(`Toast-close`)}>
                  <Icon icon="status-close" className="icon" />
                </a>
              ) : null}
            </div>
          );
        }}
      </Transition>
    );
  }
}

export const toast = {
  container: toastRef,
  success: (content: string, conf?: any) => show(content, conf, 'success'),
  error: (content: string, conf?: any) => show(content, conf, 'error'),
  info: (content: string, conf?: any) => show(content, conf, 'info'),
  warning: (content: string, conf?: any) => show(content, conf, 'warning')
};
