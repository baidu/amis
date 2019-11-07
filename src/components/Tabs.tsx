/**
 * @file Tabs
 * @description 选项卡
 * @author fex
 */

import React from 'react';
import {Schema} from '../types';
import Transition, {ENTERED, ENTERING} from 'react-transition-group/Transition';
import {ClassNamesFn, themeable} from '../theme';

const transitionStyles: {
  [propName: string]: string;
} = {
  [ENTERING]: 'in',
  [ENTERED]: 'in'
};

export interface TabProps {
  title?: string; // 标题
  icon?: string;
  disabled?: boolean | string;
  eventKey: string | number;
  tab?: Schema;
  className?: string;
  classnames?: ClassNamesFn;
  activeKey?: string | number;
  reload?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  toolbar?: React.ReactNode;
}

export interface TabsProps {
  mode?: '' | 'line' | 'card' | 'radio' | 'vertical';
  tabsMode?: '' | 'line' | 'card' | 'radio' | 'vertical';
  additionBtns?: React.ReactNode;
  onSelect?: (key: string | number) => void;
  classPrefix: string;
  classnames: ClassNamesFn;
  activeKey: string | number;
  contentClassName: string;
  className?: string;
  tabs?: Array<TabProps>;
  tabRender?: (tab: TabProps, props?: TabsProps) => JSX.Element;
}

export class Tabs extends React.Component<TabsProps> {
  static defaultProps: Pick<TabsProps, 'mode' | 'contentClassName'> = {
    mode: '',
    contentClassName: ''
  };

  handleSelect(key: string | number) {
    const {onSelect} = this.props;
    onSelect && onSelect(key);
  }

  renderNav(child: any, index: number) {
    if (!child) {
      return;
    }

    const {classnames: cx, activeKey} = this.props;
    const {eventKey, disabled, icon, title, toolbar} = child.props;

    return (
      <li
        className={cx(
          'Tabs-link',
          activeKey === eventKey ? 'is-active' : '',
          disabled ? 'is-disabled' : ''
        )}
        key={index}
        onClick={() => (disabled ? '' : this.handleSelect(eventKey))}
      >
        <a>
          {icon ? <i className={icon} /> : null} {title}
        </a>
        {React.isValidElement(toolbar) ? toolbar : null}
      </li>
    );
  }

  renderTab(child: any, index: number) {
    if (!child) {
      return;
    }

    const {activeKey, classnames} = this.props;

    return React.cloneElement(child, {
      ...child.props,
      key: index,
      classnames: classnames,
      activeKey: activeKey
    });
  }

  render() {
    const {
      classnames: cx,
      contentClassName,
      className,
      mode: dMode,
      tabsMode,
      children,
      additionBtns
    } = this.props;

    if (!Array.isArray(children)) {
      return null;
    }

    const mode = tabsMode || dMode;

    return (
      <div
        className={cx(
          `Tabs`,
          {
            [`Tabs--${mode}`]: mode
          },
          className
        )}
      >
        <ul className={cx('Tabs-links')} role="tablist">
          {children.map((tab, index) => this.renderNav(tab, index))}
          {additionBtns}
        </ul>

        <div className={cx('Tabs-content', contentClassName)}>
          {children.map((child, index) => {
            return this.renderTab(child, index);
          })}
        </div>
      </div>
    );
  }
}

export class Tab extends React.PureComponent<TabProps> {
  contentDom: any;
  contentRef = (ref: any) => (this.contentDom = ref);

  render() {
    const {
      classnames: cx,
      mountOnEnter,
      reload,
      unmountOnExit,
      eventKey,
      activeKey,
      children,
      className
    } = this.props;

    return (
      <Transition
        in={activeKey === eventKey}
        mountOnEnter={mountOnEnter}
        unmountOnExit={typeof reload === 'boolean' ? reload : unmountOnExit}
        timeout={500}
      >
        {(status: string) => {
          if (status === ENTERING) {
            this.contentDom.offsetWidth;
          }
          return (
            <div
              ref={this.contentRef}
              className={
                cx &&
                cx(
                  transitionStyles[status],
                  activeKey === eventKey ? 'is-active' : '',
                  'Tabs-pane',
                  className
                )
              }
            >
              {children}
            </div>
          );
        }}
      </Transition>
    );
  }
}

export default themeable(Tabs);
