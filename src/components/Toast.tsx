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
import {uuid, autobind} from '../utils/helper';
import {ClassNamesFn, themeable} from '../theme';

const fadeStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in',
  [EXITING]: 'out'
};

let toastRef: any = null;
let config: {
  closeButton?: boolean;
  timeOut?: number;
  extendedTimeOut?: number;
} = {};

const show = (
  content: string,
  title: string = '',
  conf: any = {},
  method: string
) => {
  if (!toastRef || !toastRef[method]) {
    return;
  }
  toastRef[method](content, title || '', {...config, ...conf});
};

interface ToastComponentProps {
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
  closeButton: boolean;
  timeOut: number;
  extendedTimeOut: number;
  classPrefix: string;
  classnames: ClassNamesFn;
  className?: string;
}

interface Item {
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
    'position' | 'closeButton' | 'timeOut' | 'extendedTimeOut'
  > = {
    position: 'top-right',
    closeButton: false,
    timeOut: 5000,
    extendedTimeOut: 3000
  };

  // 当前ToastComponent是否真正render了
  hasRendered = false;
  state: ToastComponentState = {
    items: []
  };

  componentWillMount() {
    const {closeButton, timeOut, extendedTimeOut} = this.props;
    config = {
      closeButton,
      timeOut,
      extendedTimeOut
    };
  }

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

    const {classPrefix: ns, className, timeOut, position} = this.props;
    const items = this.state.items;

    return (
      <div
        className={cx(
          `${ns}Toast-wrap ${ns}Toast-wrap--${position.replace(
            /\-(\w)/g,
            (_, l) => l.toUpperCase()
          )}`,
          className
        )}
      >
        {items.map((item, index) => (
          <ToastMessage
            key={item.id}
            classPrefix={ns}
            title={item.title}
            body={item.body}
            level={item.level || 'info'}
            timeOut={timeOut}
            onDismiss={this.handleDismissed.bind(this, index)}
          />
        ))}
      </div>
    );
  }
}

export default themeable(ToastComponent);

interface ToastMessageProps {
  title?: string;
  body: string;
  level: 'info' | 'success' | 'error' | 'warning';
  timeOut: number;
  position:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
  onDismiss?: () => void;
  classPrefix: string;
  allowHtml: boolean;
}

interface ToastMessageState {
  visible: boolean;
}

export class ToastMessage extends React.Component<ToastMessageProps> {
  static defaultProps = {
    timeOut: 5000,
    classPrefix: '',
    position: 'top-right',
    allowHtml: true,
    level: 'info'
  };

  state = {
    visible: false
  };

  // content: React.RefObject<HTMLDivElement>;
  timer: NodeJS.Timeout;
  mounted: boolean = false;
  constructor(props: ToastMessageProps) {
    super(props);

    // this.content = React.createRef();
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleEntered = this.handleEntered.bind(this);
    this.close = this.close.bind(this);
  }

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

  handleMouseEnter() {
    clearTimeout(this.timer);
  }

  handleMouseLeave() {
    this.handleEntered();
  }

  handleEntered() {
    const timeOut = this.props.timeOut;
    if (this.mounted) {
      this.timer = setTimeout(this.close, timeOut);
    }
  }

  close() {
    clearTimeout(this.timer);
    this.setState({
      visible: false
    });
  }

  render() {
    const {
      onDismiss,
      classPrefix: ns,
      position,
      title,
      body,
      allowHtml,
      level
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
          // if (status === ENTERING) {
          //     // force reflow
          //     // 由于从 mount 进来到加上 in 这个 class 估计是时间太短，上次的样式还没应用进去，所以这里强制reflow一把。
          //     // 否则看不到动画。
          //     this.content.current && this.content.current.offsetWidth;
          // }

          return (
            <div
              // ref={this.content}
              className={cx(
                `${ns}Toast ${ns}Toast--${level}`,
                fadeStyles[status]
              )}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.close}
            >
              {title ? <div className={`${ns}Toast-title`}>{title}</div> : null}
              <div className={`${ns}Toast-body`}>
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
