import React from 'react';
import {Renderer, RendererProps, autobind, resolveEventData} from 'amis-core';
import {BaseSchema, SchemaCollection, SchemaObject} from '../Schema';
import {CollapseGroup} from 'amis-ui';

/**
 * CollapseGroup 折叠渲染器，格式说明。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/collapse
 */
export interface CollapseGroupSchema extends BaseSchema {
  /**
   * 指定为折叠器类型
   */
  type: 'collapse-group';

  /**
   * 激活面板
   */
  activeKey?: Array<string | number | never> | string | number;

  /**
   * 手风琴模式
   */
  accordion?: boolean;

  /**
   * 自定义切换图标
   */
  expandIcon?: SchemaObject;

  /**
   * 设置图标位置
   */
  expandIconPosition?: 'left' | 'right';

  /**
   * 内容区域
   */
  body?: SchemaCollection;
}
export interface CollapseGroupProps
  extends RendererProps,
    Omit<CollapseGroupSchema, 'type' | 'className'> {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export type CollapseGroupRenderEvent = 'collapseChange';
export class CollapseGroupRender extends React.Component<
  CollapseGroupProps,
  {}
> {
  constructor(props: CollapseGroupProps) {
    super(props);
  }

  @autobind
  async handleCollapseChange(
    activeKeys: Array<string | number>,
    collapseId: string | number,
    collapsed: boolean
  ) {
    const {dispatchEvent, onCollapse} = this.props;
    const renderEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        activeKeys,
        collapseId,
        collapsed
      })
    );
    if (renderEvent?.prevented) {
      return;
    }
    onCollapse?.(activeKeys, collapseId, collapsed);
  }

  render() {
    const {
      defaultActiveKey,
      accordion,
      expandIcon,
      expandIconPosition,
      body,
      className,
      style,
      render,
      useMobileUI
    } = this.props;
    return (
      <CollapseGroup
        defaultActiveKey={defaultActiveKey}
        accordion={accordion}
        expandIcon={expandIcon}
        expandIconPosition={expandIconPosition}
        className={className}
        style={style}
        useMobileUI={useMobileUI}
        onCollapseChange={this.handleCollapseChange}
      >
        {render('body', body || '')}
      </CollapseGroup>
    );
  }
}

@Renderer({
  type: 'collapse-group'
})
export class CollapseGroupRenderer extends CollapseGroupRender {}
