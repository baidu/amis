import React from 'react';
import cx from 'classnames';
import omit from 'lodash/omit';
import {autobind} from '../../util';

export interface BackTopProps {
  visibilityHeight?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
  target: () => HTMLElement | Window | Document;
  children?: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export interface BackTopStates {
  visible: boolean;
}

function isWindow(obj: any) {
  return obj !== null && obj !== undefined && obj === obj.window;
}

function getScroll(
  target: HTMLElement | Window | Document | undefined,
  top: boolean
): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  const method = top ? 'scrollTop' : 'scrollLeft';
  let result = 0;
  const _isWindow = isWindow(target);
  if (_isWindow) {
    result = (target as Window)[top ? 'pageYOffset' : 'pageXOffset'];
  } else if (target instanceof Document) {
    result = target.documentElement[method];
  } else if (target) {
    result = (target as HTMLElement)[method];
  }
  if (target && !_isWindow && typeof result !== 'number') {
    result = ((target as HTMLElement).ownerDocument || (target as Document))
      .documentElement?.[method];
  }
  return result;
}

export default class BackTop extends React.Component<
  BackTopProps,
  BackTopStates
> {
  ref = React.createRef<HTMLDivElement>();
  scrollElem: any = null;

  constructor(props: any) {
    super(props);

    this.state = {
      visible: props.visible !== undefined ? props.visible : false
    };
  }

  componentDidMount() {
    this.bindScrollEvent();
  }

  componentWillUnmount() {
    if (this.scrollElem) {
      this.scrollElem.removeEventListener('scroll', this.handleScroll);
    }
  }

  @autobind
  getDefaultTarget() {
    return this.ref.current && this.ref.current.ownerDocument
      ? this.ref.current.ownerDocument
      : window;
  }

  @autobind
  handleScroll(e: React.UIEvent<HTMLElement> | {target: any}) {
    const visibilityHeight = this.props.visibilityHeight || 400;
    const scrollTop = getScroll(e.target, true);
    this.setState({
      visible: scrollTop > visibilityHeight!
    });
  }

  @autobind
  bindScrollEvent() {
    const {target} = this.props;
    this.scrollElem = target() || this.getDefaultTarget();

    if (!this.scrollElem) {
      return;
    }
    this.scrollElem.addEventListener('scroll', this.handleScroll);

    this.handleScroll({
      target: this.scrollElem
    });
  }

  @autobind
  scrollToTop(e: React.MouseEvent<HTMLDivElement>) {
    const {onClick} = this.props;

    if (!this.scrollElem) {
      return;
    }
    this.scrollElem.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (typeof onClick === 'function') {
      onClick(e);
    }
  }

  render() {
    const {children, className = ''} = this.props;
    const classString = cx(
      'editor-backTop',
      className,
      this.state.visible ? '' : 'hidden'
    );

    const divProps = omit(this.props, [
      'className',
      'children',
      'visibilityHeight',
      'target',
      'visible'
    ]);

    const defaultElement = (
      <div className="backTop-content">
        <div className="backTop-icon">UP</div>
      </div>
    );

    return (
      <div
        {...divProps}
        className={classString}
        onClick={this.scrollToTop}
        ref={this.ref}
      >
        {children || defaultElement}
      </div>
    );
  }
}
