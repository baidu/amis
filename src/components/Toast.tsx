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
import {uuid, autobind, noop} from '../utils/helper';
import {ClassNamesFn, themeable, classnames, ThemeProps} from '../theme';
import {Icon} from './icons';
import {LocaleProps, localeable, TranslateFn} from '../locale';

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
const show = (
  content: string,
  title: string = '',
  conf: any = {},
  method: string
) => {
  if (!toastRef || !toastRef[method]) {
    return;
  }
  toastRef[method](content, title || '', {...conf});
};

interface ToastComponentProps extends ThemeProps, LocaleProps {
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
  closeButton: boolean;
  showIcon?: boolean;
  timeout: number;
  className?: string;
}

interface Item extends Config {
  title?: string;
  body: string;
  level: 'info' | 'success' | 'error' | 'warning';
  id: string;
}

interface ToastComponentState {
  items: Array<Item>;
}

export class ToastComponent extends React.Component<
  ToastComponentProps,
  ToastComponentState
> {
  static defaultProps: Pick<
    ToastComponentProps,
    'position' | 'closeButton' | 'timeout'
  > = {
    position: 'top-right',
    closeButton: false,
    timeout: 5000
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

  notifiy(level: string, content: string, title?: string, config?: any) {
    const items = this.state.items.concat();
    items.push({
      title: title,
      body: content,
      level,
      ...config,
      id: uuid()
    });
    this.setState({
      items
    });
  }

  @autobind
  success(content: string, title?: string, config?: any) {
    this.notifiy('success', content, title, config);
  }

  @autobind
  error(content: string, title?: string, config?: any) {
    this.notifiy('error', content, title, config);
  }

  @autobind
  info(content: string, title?: string, config?: any) {
    this.notifiy('info', content, title, config);
  }

  @autobind
  warning(content: string, title?: string, config?: any) {
    this.notifiy('warning', content, title, config);
  }

  handleDismissed(index: number) {
    const items = this.state.items.concat();
    items.splice(index, 1);
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
      position,
      showIcon,
      translate,
      closeButton
    } = this.props;
    const items = this.state.items;

    return (
      <div
        className={cx(
          `Toast-wrap Toast-wrap--${position.replace(/\-(\w)/g, (_, l) =>
            l.toUpperCase()
          )}`,
          className
        )}
      >
        {items.map((item, index) => (
          <ToastMessage
            classnames={cx}
            key={item.id}
            title={item.title}
            body={item.body}
            level={item.level || 'info'}
            timeout={item.timeout ?? timeout}
            closeButton={item.closeButton ?? closeButton}
            onDismiss={this.handleDismissed.bind(this, index)}
            translate={translate}
            showIcon={showIcon}
          />
        ))}
      </div>
    );
  }
}

export default themeable(localeable(ToastComponent));

interface ToastMessageProps {
  title?: string;
  body: string;
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
    | 'bottom-right';
  onDismiss?: () => void;
  classnames: ClassNamesFn;
  translate: TranslateFn;
  allowHtml: boolean;
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
    position: 'top-right',
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
      translate: __
    } = this.props;

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
              className={cx(`Toast Toast--${level}`, fadeStyles[status])}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={closeButton ? noop : this.close}
            >
              {closeButton ? (
                <a onClick={this.close} className={cx(`Toast-close`)}>
                  <Icon icon="close" className="icon" />
                </a>
              ) : null}

              {showIcon === false ? null : (
                <div className={cx('Toast-icon')}>
                  {level === 'success' ? (
                    <Icon icon="success" className="icon" />
                  ) : level == 'error' ? (
                    <Icon icon="fail" className="icon" />
                  ) : level == 'info' ? (
                    <Icon icon="info-circle" className="icon" />
                  ) : level == 'warning' ? (
                    <Icon icon="warning" className="icon" />
                  ) : null}
                </div>
              )}

              {title ? (
                <div className={cx('Toast-title')}>{__(title)}</div>
              ) : null}
              <div className={cx('Toast-body')}>
                {allowHtml ? <Html html={body} /> : body}
              </div>
            </div>
          );
        }}
      </Transition>
    );
  }
}

export const toast = {
  container: toastRef,
  success: (content: string, title?: string, conf?: any) =>
    show(content, title, conf, 'success'),
  error: (content: string, title?: string, conf?: any) =>
    show(content, title, conf, 'error'),
  info: (content: string, title?: string, conf?: any) =>
    show(content, title, conf, 'info'),
  warning: (content: string, title?: string, conf?: any) =>
    show(content, title, conf, 'warning')
};
