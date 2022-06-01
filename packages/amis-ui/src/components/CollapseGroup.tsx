/**
 * @file CollapseGroup
 * @description 折叠面板group
 * @author hongyang03
 */

import React from 'react';

// @todo 丰富这个
export interface CollapseItem {
  [propName: string]: any;
}

import {ClassNamesFn, themeable} from 'amis-core';
import type {SchemaNode} from 'amis-core';

export interface CollapseGroupProps {
  defaultActiveKey?: Array<string | number | never> | string | number;
  accordion?: boolean;
  expandIcon?: SchemaNode;
  expandIconPosition?: 'left' | 'right';
  body?: Array<React.ReactElement>;
  className?: string;
  classnames: ClassNamesFn;
  classPrefix: string;
}

export interface CollapseGroupState {
  activeKey: Array<string | number | never>;
}

class CollapseGroup extends React.Component<
  CollapseGroupProps,
  CollapseGroupState
> {
  static defaultProps: Partial<CollapseGroupProps> = {
    className: '',
    accordion: false,
    expandIconPosition: 'left'
  };

  constructor(props: CollapseGroupProps) {
    super(props);

    // 传入的activeKey会被自动转换为defaultActiveKey
    let activeKey = props.defaultActiveKey;
    if (!Array.isArray(activeKey)) {
      activeKey = activeKey ? [activeKey] : [];
    }
    if (props.accordion) {
      // 手风琴模式下只展开第一个元素
      activeKey = activeKey.length ? [activeKey[0]] : [];
    }

    this.state = {
      activeKey: activeKey.map((key: number | string) => String(key))
    };
  }

  collapseChange(item: CollapseItem, collapsed: boolean) {
    let activeKey = this.state.activeKey;
    if (collapsed) {
      if (this.props.accordion) {
        activeKey = [];
      } else {
        for (let i = 0; i < activeKey.length; i++) {
          if (activeKey[i] === item.id) {
            activeKey.splice(i, 1);
            break;
          }
        }
      }
    } else {
      if (this.props.accordion) {
        activeKey = [item.id as string];
      } else {
        activeKey.push(item.id as string);
      }
    }
    this.setState({
      activeKey
    });
  }

  getItems = (children: React.ReactNode) => {
    if (!Array.isArray(children)) {
      return children;
    }

    return children.map((child: React.ReactElement, index: number) => {
      let props = child.props;

      const id = props.propKey || String(index);
      const collapsed = this.state.activeKey.indexOf(id) === -1;

      return React.cloneElement(child as any, {
        ...props,
        key: id,
        id,
        collapsed,
        expandIcon: this.props.expandIcon,
        propsUpdate: true,
        onCollapse: (item: CollapseItem, collapsed: boolean) =>
          this.collapseChange(item, collapsed)
      });
    });
  };

  render() {
    const {
      classnames: cx,
      className,
      expandIconPosition,
      children
    } = this.props;

    return (
      <div
        className={cx(
          `CollapseGroup`,
          {
            'icon-position-right': expandIconPosition === 'right'
          },
          className
        )}
      >
        {this.getItems(children)}
      </div>
    );
  }
}

export default themeable(CollapseGroup);
