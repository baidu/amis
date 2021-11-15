/**
 * @file Collapse2
 * @description 折叠面板2
 * @author hongyang03
 */

import React from 'react';
import {RendererProps} from '../factory';
import {CollapsePanelProps} from './CollapsePanel';
import {CollapsePanelSchema} from '../renderers/CollapsePanel';
import {SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';
import remove from 'lodash/remove';

export interface Collapse2Props extends RendererProps {
  activeKey?: Array<string | number | never> | string | number;
  defaultActiveKey?: Array<string | number | never> | string | number;
  accordion?: boolean;
  expandIcon?: SchemaNode;
  expandIconPosition?: 'left' | 'right';
  body?: SchemaCollection;
  className?: string;
  wrapperComponent?: any;
}

export interface Collapse2State {
  activeKey: Array<string | number | never>;
}

class Collapse2 extends React.Component<
  Collapse2Props,
  Collapse2State
> {
  static propsList: Array<string> = [
    'wrapperComponent',
    'className',
    'accordion',
    'expandIconPosition',
    'defaultActiveKey',
    'activeKey'
  ];

  static defaultProps: Partial<Collapse2Props> = {
    wrapperComponent: 'div',
    className: '',
    accordion: false,
    expandIconPosition: 'left'
  };

  constructor(props: Collapse2Props) {
    super(props);

    let activeKey = props.$schema.defaultActiveKey || props.$schema.activeKey;
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

  collapseChange(item: CollapsePanelProps, collapsed: boolean) {
    let activeKey = this.state.activeKey;
    if (collapsed) {
      if (this.props.accordion) {
        activeKey = [];
      }
      else {
        remove(activeKey, item.id);
      }
    }
    else {
      if (this.props.accordion) {
        activeKey = [item.id];
      }
      else {
        activeKey.push(item.id);
      }
    }
    this.setState({
      activeKey: activeKey
    });
  }

  getItems = (children: SchemaCollection | undefined) => {
    children = children || [];

    if (!Array.isArray(children)) {
      return this.props.render('body', children);
    }
    return children.map((child: CollapsePanelSchema, index: number) => {
      const id = child.key || String(index);
      const collapsed = this.state.activeKey.indexOf(id) === -1;
      Object.assign(child, {
        id,
        collapsed,
        expandIcon: this.props.expandIcon,
        onChange: (item: CollapsePanelProps, collapsed: boolean) => this.collapseChange(item, collapsed)
      });

      return this.props.render('panel-' + id, child, {
        key: id,
        collapsed
      });
    });
  };

  render() {
    const {
      classnames: cx,
      wrapperComponent: WrapperComponent,
      className,
      expandIconPosition,
      body,
      translate: __,
    } = this.props;

    return (
      <WrapperComponent
        className={cx(
          `Collapse2`,
          {
            'icon-position-right': expandIconPosition === 'right',
          },
          className
        )}
      >
        {this.getItems(body)}
      </WrapperComponent>
    );
  }
}

export default Collapse2;
