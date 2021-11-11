import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {CollapsePanelProps, CollapsePanelSchema} from './CollapsePanel';
import {BaseSchema, SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';
import remove from 'lodash/remove';

/**
 * Collapse2 折叠渲染器，格式说明。
 * 文档：https://baidu.gitee.io/amis/docs/components/collapse
 */
export interface Collapse2Schema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse2';

  /**
   * 激活面板
   */
  activeKey?: Array<string | number | never> | string | number;

  /**
   * 初始化展开
   */
  defaultActiveKey?: Array<string | number | never> | string | number;

  /**
   * 手风琴模式
   */
  accordion?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaNode;

  /**
   * 设置图标位置
   */
  expandIconPosition?: 'left' | 'right';

  /**
   * 内容区域
   */
  body?: SchemaCollection;
}

export interface Collapse2Props
  extends RendererProps,
    Omit<Collapse2Schema, 'type' | 'className'> {
  wrapperComponent?: any;
}

export interface Collapse2State {
  activeKey: Array<string | number | never>;
}

export default class Collapse extends React.Component<
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

@Renderer({
  type: 'collapse2'
})
export class Collapse2Renderer extends Collapse {}
