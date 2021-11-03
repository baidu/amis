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
    | 'bottom-right';
  closeButton: boolean;
  showIcon?: boolean;
  timeout: number;
  className?: string;
}

interface Item extends Config {
  body: string;
  level: 'info' | 'success' | 'error' | 'warning';
  id: string;
  onDissmiss?: () => void;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
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
    position: 'top-center',
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

  notifiy(level: string, content: string, config?: any) {
    const items = this.state.items.concat();
    items.push({
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
      position,
      showIcon,
      translate,
      closeButton
    } = this.props;
    const items = this.state.items;

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
            className
          )}
        >
          {toasts.map(item => (
            <ToastMessage
              classnames={cx}
              key={item.id}
              body={item.body}
              level={item.level || 'info'}
              timeout={item.timeout ?? timeout}
              closeButton={item.closeButton ?? closeButton}
              onDismiss={this.handleDismissed.bind(this, items.indexOf(item))}
              translate={translate}
              showIcon={showIcon}
            />
          ))}
        </div>
      );
    });
  }
}

export default themeable(localeable(ToastComponent));

interface ToastMessageProps {
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
              {showIcon === false ? null : (
                <div className={cx('Toast-icon')}>
                  {level === 'success' ? (
                    <Icon icon="status-success" className="icon" />
                  ) : level == 'error' ? (
                    <Icon icon="status-fail" className="icon" />
                  ) : level == 'info' ? (
                    <Icon icon="status-info" className="icon" />
                  ) : level == 'warning' ? (
                    <Icon icon="status-warning" className="icon" />
                  ) : null}
                </div>
              )}
              <div className={cx('Toast-body')}>
                {allowHtml ? <Html html={body} /> : body}
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
