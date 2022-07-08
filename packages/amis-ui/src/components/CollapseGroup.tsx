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

import {ClassNamesFn, themeable, autobind} from 'amis-core';
import type {SchemaNode} from 'amis-core';
import isEqual from 'lodash/isEqual';

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
    this.updateActiveKey(props.defaultActiveKey, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps: CollapseGroupProps) {
    const props = this.props;

    if (!isEqual(props.defaultActiveKey, nextProps.defaultActiveKey)) {
      this.updateActiveKey(nextProps.defaultActiveKey);
    }
  }

  @autobind
  updateActiveKey(propsActiveKey: any, isInit?: boolean) {
    const props = this.props;
    let curActiveKey = propsActiveKey;

    if (!Array.isArray(curActiveKey)) {
      curActiveKey = curActiveKey ? [curActiveKey] : [];
    }
    if (props.accordion) {
      // 手风琴模式下只展开第一个元素
      curActiveKey = curActiveKey.length ? [curActiveKey[0]] : [];
    }

    if (isInit) {
      this.state = {
        activeKey: curActiveKey.map((key: number | string) => String(key))
      };
    } else {
      this.setState({
        activeKey: curActiveKey.map((key: number | string) => String(key))
      });
    }
  }

  collapseChange(collapseId: string, collapsed: boolean) {
    let activeKey = this.state.activeKey.concat();
    if (!collapsed) {
      // 开启状态
      if (this.props.accordion) {
        activeKey = [];
      } else {
        for (let i = 0; i < activeKey.length; i++) {
          if (activeKey[i] === collapseId) {
            activeKey.splice(i, 1); // 剔除开启状态
            break;
          }
        }
      }
    } else {
      if (this.props.accordion) {
        activeKey = [collapseId as string];
      } else {
        activeKey.push(collapseId as string);
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

      const collapseId = props.propKey || String(index);
      // 判断是否折叠
      const collapsed = this.state.activeKey.indexOf(collapseId) === -1;

      return React.cloneElement(child as any, {
        ...props,
        key: collapseId,
        collapseId,
        collapsed: collapsed.toString(),
        expandIcon: this.props.expandIcon,
        propsUpdate: true,
        onCollapse: () => this.collapseChange(collapseId, collapsed)
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
