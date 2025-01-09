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
import type {SchemaNode, ThemeProps} from 'amis-core';
import isEqual from 'lodash/isEqual';

export interface CollapseGroupProps extends ThemeProps {
  defaultActiveKey?: Array<string | number | never> | string | number;
  accordion?: boolean;
  expandIcon?: SchemaNode;
  expandIconPosition?: 'left' | 'right';
  body?: Array<React.ReactElement>;
  className?: string;
  style?: any;
  children?: React.ReactNode | Array<React.ReactNode>;
  onCollapseChange?: (
    activeKeys: Array<string | number>,
    collapseId: string | number,
    collapsed: boolean
  ) => void;
}

export interface CollapseGroupState {
  activeKeys: Array<string | number | never>;
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
        activeKeys: curActiveKey.map((key: number | string) => String(key))
      };
    } else {
      this.setState({
        activeKeys: curActiveKey.map((key: number | string) => String(key))
      });
    }
  }

  collapseChange(collapseId: string, collapsed: boolean) {
    let activeKeys = this.state.activeKeys.concat();
    if (collapsed) {
      // 设置成折叠状态
      if (this.props.accordion) {
        activeKeys = [];
      } else {
        const activeKeyIndex = activeKeys.indexOf(collapseId);
        if (activeKeyIndex !== -1) {
          activeKeys.splice(activeKeyIndex, 1); // 剔除开启状态
        }
      }
    } else {
      // 展开折叠器
      if (this.props.accordion) {
        activeKeys = [collapseId as string];
      } else if (activeKeys.indexOf(collapseId) === -1) {
        activeKeys.push(collapseId as string);
      }
    }
    this.props.onCollapseChange?.(
      activeKeys,
      collapseId,
      activeKeys.indexOf(collapseId) === -1
    );
    this.setState({
      activeKeys
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
      const collapsed = this.state.activeKeys.indexOf(collapseId) === -1;

      return React.cloneElement(child as any, {
        ...props,
        key: collapseId,
        collapseId,
        collapsed,
        expandIcon: this.props.expandIcon,
        propsUpdate: true,
        onCollapse: (collapsed: boolean) =>
          this.collapseChange(collapseId, collapsed)
      });
    });
  };

  render() {
    const {
      classnames: cx,
      className,
      style,
      expandIconPosition,
      children,
      mobileUI
    } = this.props;

    return (
      <div
        className={cx(
          `CollapseGroup`,
          {
            'icon-position-right': expandIconPosition === 'right'
          },
          {
            'is-mobile': mobileUI
          },
          className
        )}
        style={style}
        data-role="container"
      >
        {this.getItems(children)}
      </div>
    );
  }
}

export default themeable(CollapseGroup);
