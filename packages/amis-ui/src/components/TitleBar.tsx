/**
 * @file TitleBar。
 * @description
 * @author fex
 * @param 参数说明：
 * title 标题内容
 * titleClassName 标题类名，默认为 bg-light lter b-b
 * right 可以传入右侧节点, 当有右侧时自动采用 hbox 来左右布局。
 */

import React from 'react';
import {ClassNamesFn, themeable} from 'amis-core';

interface TitleBarProps {
  className?: string;
  title: React.ReactNode;
  titleClassName?: string;
  right?: boolean;
  classPrefix: string;
  classnames: ClassNamesFn;
}

export class TitleBar extends React.PureComponent<TitleBarProps, any> {
  static defaultProps = {
    className: 'bg-light lter b-b',
    title: '标题',
    titleClassName: 'm-n font-thin h3',
    right: false
  };

  render(): JSX.Element {
    const {
      className,
      title,
      titleClassName,
      right,
      classnames: cx
    } = this.props;

    let left = title ? <div className={titleClassName}>{title}</div> : null;

    let body = left;

    if (right) {
      body = (
        <div className="hbox hbox-auto-xs h-auto">
          <div className="col bg-light b-b wrapper">{left}</div>
          <div className="col v-middle padder-md text-right bg-light b-b wrapper-sm">
            {right}
          </div>
        </div>
      );
    } else {
      body = <div className="wrapper">{left}</div>;
    }

    return <div className={cx(className, 'TitleBar')}>{body}</div>;
  }
}

export default themeable(TitleBar);
